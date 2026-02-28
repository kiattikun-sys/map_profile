'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Loader2, AlertCircle, RefreshCw, RotateCcw, X, Smartphone } from 'lucide-react'
import type { Group } from 'three'

interface ProjectModel {
  project_id: string
  model_path: string
  anchor_lng: number
  anchor_lat: number
  altitude_m: number
  rotation_z_deg: number
  scale: number
}

interface Props {
  map: mapboxgl.Map
  model: ProjectModel
  onExit: () => void
}

const LAYER_ID = 'tripira-3d-model-layer'

// Low memory detection (navigator.deviceMemory is non-standard but widely supported)
function isLowMemoryDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4
}

export default function ThreeDModelLayer({ map, model, onExit }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [userRotation, setUserRotation] = useState(0) // extra Y-axis rotation by user drag
  const [showLowMemWarning, setShowLowMemWarning] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const dragStartXRef = useRef<number | null>(null)
  const baseRotationRef = useRef(0)
  const retryCountRef = useRef(0)

  const buildLayer = useCallback(async (extraRotY = 0) => {
    setStatus('loading')
    setProgress(10)

    if (isLowMemoryDevice()) {
      setShowLowMemWarning(true)
    }

    try {
      // Lazy-load Three.js + GLTFLoader
      setProgress(20)
      const [
        THREE,
        { GLTFLoader },
      ] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
      ])
      setProgress(40)

      // Resolve model URL from Supabase storage
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const modelUrl = model.model_path.startsWith('http')
        ? model.model_path
        : `${supabaseUrl}/storage/v1/object/public/project-models/${model.model_path}`

      // Build Three.js scene
      const scene = new THREE.Scene()
      const camera = new THREE.Camera()
      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: map.painter.context.gl as WebGLRenderingContext,
        antialias: true,
      })
      renderer.autoClear = false

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
      scene.add(ambientLight)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.8)
      dirLight.position.set(1, 2, 1).normalize()
      scene.add(dirLight)

      // Anchor to Mercator
      const mc = mapboxgl.MercatorCoordinate.fromLngLat(
        { lng: model.anchor_lng, lat: model.anchor_lat },
        model.altitude_m
      )
      const meterScale = mc.meterInMercatorCoordinateUnits()

      // Load GLB
      setProgress(60)
      const gltf = await new Promise<{ scene: Group }>((resolve, reject) => {
        const loader = new GLTFLoader()
        loader.load(
          modelUrl,
          (g) => resolve(g),
          (xhr) => {
            if (xhr.total > 0) {
              setProgress(60 + Math.round((xhr.loaded / xhr.total) * 30))
            }
          },
          (err) => reject(err)
        )
      })
      setProgress(95)

      const modelObj = gltf.scene
      modelObj.scale.set(
        model.scale * meterScale,
        model.scale * meterScale,
        model.scale * meterScale
      )
      // Rotate: Mapbox is Y-up; GLB is Z-up — apply 90deg X flip
      modelObj.rotation.x = Math.PI / 2
      // Apply configured Z rotation (North offset) + user drag rotation
      const configRad = (model.rotation_z_deg * Math.PI) / 180
      const extraRad  = (extraRotY * Math.PI) / 180
      modelObj.rotation.z = configRad + extraRad

      scene.add(modelObj)

      // Transform matrix aligning Three.js scene to Mercator world
      const transform = {
        translateX: mc.x,
        translateY: mc.y,
        translateZ: mc.z ?? 0,
        rotateX: Math.PI / 2,
        rotateY: 0,
        rotateZ: 0,
        scale: meterScale,
      }

      const customLayer: mapboxgl.CustomLayerInterface = {
        id: LAYER_ID,
        type: 'custom',
        renderingMode: '3d',
        onAdd(_m, gl) {
          renderer.setPixelRatio(window.devicePixelRatio)
          void gl // satisfy lint — context already set
        },
        render(_gl, matrix) {
          const m = new THREE.Matrix4().fromArray(matrix as number[])
          const l = new THREE.Matrix4()
            .makeTranslation(transform.translateX, transform.translateY, transform.translateZ)
            .scale(new THREE.Vector3(transform.scale, -transform.scale, transform.scale))

          camera.projectionMatrix = m.multiply(l)
          renderer.resetState()
          renderer.render(scene, camera)
          map.triggerRepaint()
        },
        onRemove() {
          renderer.dispose()
          scene.clear()
        },
      }

      // Remove existing layer if any
      if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
      map.addLayer(customLayer)

      cleanupRef.current = () => {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
        renderer.dispose()
        scene.clear()
      }

      setProgress(100)
      setStatus('ready')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMsg(msg)
      setStatus('error')
    }
  }, [map, model])

  // Initial load
  useEffect(() => {
    buildLayer(0)
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [buildLayer])

  // Drag-to-rotate model (disable map drag while dragging over overlay)
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartXRef.current = e.clientX
    baseRotationRef.current = userRotation
    map.dragPan.disable()
    map.scrollZoom.disable()
  }
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragStartXRef.current === null) return
    const delta = e.clientX - dragStartXRef.current
    const newRot = baseRotationRef.current + delta * 0.5
    setUserRotation(newRot)
    // Rebuild layer with updated rotation
    if (status === 'ready') {
      cleanupRef.current?.()
      buildLayer(newRot)
    }
  }, [buildLayer, status, userRotation])

  const handleMouseUp = useCallback(() => {
    dragStartXRef.current = null
    map.dragPan.enable()
    map.scrollZoom.enable()
  }, [map])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleResetRotation = () => {
    setUserRotation(0)
    cleanupRef.current?.()
    buildLayer(0)
  }

  const handleRetry = () => {
    retryCountRef.current += 1
    setErrorMsg('')
    buildLayer(userRotation)
  }

  const handleExit = () => {
    cleanupRef.current?.()
    map.dragPan.enable()
    map.scrollZoom.enable()
    onExit()
  }

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      onMouseDown={handleMouseDown}
    >
      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-7 flex flex-col items-center gap-4 min-w-[220px]">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <div className="w-full">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>กำลังโหลด 3D Model...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-7 flex flex-col items-center gap-4 max-w-xs text-center">
            <AlertCircle size={36} className="text-red-500" />
            <div>
              <p className="font-bold text-slate-800 mb-1">โหลดโมเดลไม่สำเร็จ</p>
              <p className="text-xs text-slate-500 break-all">{errorMsg}</p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <RefreshCw size={14} /> ลองใหม่
              </button>
              <button
                onClick={handleExit}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls bar — visible when ready */}
      {status === 'ready' && (
        <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-2 text-white text-xs">
          <span className="text-white/70">ลากซ้าย-ขวาเพื่อหมุนโมเดล</span>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={handleResetRotation}
            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
            title="Reset rotation"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={handleExit}
            className="flex items-center gap-1 hover:text-red-300 transition-colors"
          >
            <X size={13} /> ออกจากโหมด 3D
          </button>
        </div>
      )}

      {/* Low memory warning */}
      {showLowMemWarning && (
        <div className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-amber-500 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg">
          <Smartphone size={14} />
          <span>อุปกรณ์มี RAM ต่ำ — โมเดลอาจโหลดช้า แนะนำใช้โหมด Overlay แทน</span>
          <button onClick={() => setShowLowMemWarning(false)}><X size={12} /></button>
        </div>
      )}
    </div>
  )
}
