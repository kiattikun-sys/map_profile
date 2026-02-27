'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { OverlayBounds } from '@/types/database'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type Corner = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
const CORNER_ORDER: Corner[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft']
const CORNER_LABELS: Record<Corner, string> = {
  topLeft: 'บนซ้าย',
  topRight: 'บนขวา',
  bottomRight: 'ล่างขวา',
  bottomLeft: 'ล่างซ้าย',
}
const CORNER_COLORS: Record<Corner, string> = {
  topLeft: '#ef4444',
  topRight: '#f97316',
  bottomRight: '#22c55e',
  bottomLeft: '#3b82f6',
}

interface OverlayEditorMapProps {
  latitude: number
  longitude: number
  overlayUrl: string | null
  initialBounds: OverlayBounds | null
  onBoundsChange: (bounds: OverlayBounds) => void
}

export default function OverlayEditorMap({
  latitude,
  longitude,
  overlayUrl,
  initialBounds,
  onBoundsChange,
}: OverlayEditorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Partial<Record<Corner, mapboxgl.Marker>>>({})
  const [clickIndex, setClickIndex] = useState(0)
  const [corners, setCorners] = useState<Partial<Record<Corner, [number, number]>>>(
    initialBounds
      ? {
          topLeft: initialBounds.topLeft,
          topRight: initialBounds.topRight,
          bottomRight: initialBounds.bottomRight,
          bottomLeft: initialBounds.bottomLeft,
        }
      : {}
  )

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [longitude, latitude],
      zoom: 13,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      if (initialBounds && overlayUrl) {
        map.addSource('overlay-preview', {
          type: 'image',
          url: overlayUrl,
          coordinates: [
            initialBounds.topLeft,
            initialBounds.topRight,
            initialBounds.bottomRight,
            initialBounds.bottomLeft,
          ],
        })
        map.addLayer({
          id: 'overlay-preview-layer',
          type: 'raster',
          source: 'overlay-preview',
          paint: { 'raster-opacity': 0.7 },
        })
      }

      if (initialBounds) {
        CORNER_ORDER.forEach((corner) => {
          const coord = initialBounds[corner]
          addMarker(map, corner, coord)
        })
      }
    })

    map.on('click', (e) => {
      const corner = CORNER_ORDER[clickIndex % CORNER_ORDER.length]
      const coord: [number, number] = [e.lngLat.lng, e.lngLat.lat]

      addMarker(map, corner, coord)
      setCorners((prev) => {
        const next = { ...prev, [corner]: coord }
        if (Object.keys(next).length === 4) {
          const bounds: OverlayBounds = {
            topLeft: next.topLeft!,
            topRight: next.topRight!,
            bottomRight: next.bottomRight!,
            bottomLeft: next.bottomLeft!,
          }
          updateOverlay(map, overlayUrl, bounds)
          onBoundsChange(bounds)
        }
        return next
      })
      setClickIndex((i) => i + 1)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  const addMarker = (map: mapboxgl.Map, corner: Corner, coord: [number, number]) => {
    markersRef.current[corner]?.remove()
    const el = document.createElement('div')
    el.style.cssText = `
      width:24px;height:24px;border-radius:50%;
      background:${CORNER_COLORS[corner]};
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      cursor:move;
    `
    el.title = CORNER_LABELS[corner]
    const marker = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat(coord)
      .addTo(map)

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      const newCoord: [number, number] = [lngLat.lng, lngLat.lat]
      setCorners((prev) => {
        const next = { ...prev, [corner]: newCoord }
        if (
          next.topLeft && next.topRight && next.bottomRight && next.bottomLeft
        ) {
          const bounds: OverlayBounds = {
            topLeft: next.topLeft,
            topRight: next.topRight,
            bottomRight: next.bottomRight,
            bottomLeft: next.bottomLeft,
          }
          updateOverlay(map, overlayUrl, bounds)
          onBoundsChange(bounds)
        }
        return next
      })
    })
    markersRef.current[corner] = marker
  }

  const updateOverlay = (map: mapboxgl.Map, url: string | null, bounds: OverlayBounds) => {
    if (!url || !map.isStyleLoaded()) return
    if (map.getLayer('overlay-preview-layer')) map.removeLayer('overlay-preview-layer')
    if (map.getSource('overlay-preview')) map.removeSource('overlay-preview')
    map.addSource('overlay-preview', {
      type: 'image',
      url,
      coordinates: [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft],
    })
    map.addLayer({
      id: 'overlay-preview-layer',
      type: 'raster',
      source: 'overlay-preview',
      paint: { 'raster-opacity': 0.7 },
    })
  }

  const reset = () => {
    Object.values(markersRef.current).forEach((m) => m?.remove())
    markersRef.current = {}
    setCorners({})
    setClickIndex(0)
    const map = mapRef.current
    if (map?.isStyleLoaded()) {
      if (map.getLayer('overlay-preview-layer')) map.removeLayer('overlay-preview-layer')
      if (map.getSource('overlay-preview')) map.removeSource('overlay-preview')
    }
  }

  const nextCorner = CORNER_ORDER[clickIndex % CORNER_ORDER.length]
  const doneCount = Object.keys(corners).length

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 z-10 bg-white/95 rounded-xl shadow p-2 text-xs space-y-1 max-w-[160px]">
        <p className="font-semibold text-gray-700 mb-1">คลิกบนแผนที่:</p>
        {CORNER_ORDER.map((corner, i) => (
          <div key={corner} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: CORNER_COLORS[corner] }}
            />
            <span className={corners[corner] ? 'text-gray-400 line-through' : i === clickIndex % 4 ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
              {CORNER_LABELS[corner]}
            </span>
            {corners[corner] && <span className="text-green-600 ml-auto">✓</span>}
          </div>
        ))}
        {doneCount > 0 && (
          <button onClick={reset} className="mt-1 text-red-500 hover:text-red-700 text-xs underline">
            เริ่มใหม่
          </button>
        )}
      </div>
    </div>
  )
}
