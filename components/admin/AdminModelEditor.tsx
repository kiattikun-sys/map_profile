'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/types/database'
import {
  Box, Upload, Save, ExternalLink, RotateCcw,
  ChevronDown, Loader2, CheckCircle2, AlertCircle, X,
} from 'lucide-react'

interface ProjectModel {
  project_id: string
  model_path: string
  anchor_lng: number
  anchor_lat: number
  altitude_m: number
  rotation_z_deg: number
  scale: number
  updated_at: string
}

interface Props {
  projects: Project[]
}

export default function AdminModelEditor({ projects }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [model, setModel] = useState<ProjectModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // form fields
  const [modelPath, setModelPath] = useState('')
  const [anchorLng, setAnchorLng] = useState('')
  const [anchorLat, setAnchorLat] = useState('')
  const [altitudeM, setAltitudeM] = useState('0')
  const [rotationZ, setRotationZ] = useState('0')
  const [scale, setScale] = useState('1')

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    if (!selectedProjectId) {
      setModel(null)
      return
    }
    setLoading(true)
    supabase
      .from('project_models')
      .select('*')
      .eq('project_id', selectedProjectId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setModel(data as ProjectModel)
          setModelPath(data.model_path)
          setAnchorLng(String(data.anchor_lng))
          setAnchorLat(String(data.anchor_lat))
          setAltitudeM(String(data.altitude_m))
          setRotationZ(String(data.rotation_z_deg))
          setScale(String(data.scale))
        } else {
          setModel(null)
          setModelPath('')
          setAltitudeM('0')
          setRotationZ('0')
          setScale('1')
          // pre-fill anchor from project coords
          if (selectedProject) {
            setAnchorLng(String(selectedProject.longitude))
            setAnchorLat(String(selectedProject.latitude))
          }
        }
        setLoading(false)
      })
  }, [selectedProjectId])

  const handleUseProjectPin = () => {
    if (!selectedProject) return
    setAnchorLng(String(selectedProject.longitude))
    setAnchorLat(String(selectedProject.latitude))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProjectId) return
    if (!file.name.endsWith('.glb')) {
      showToast('error', 'รองรับเฉพาะไฟล์ .glb เท่านั้น')
      return
    }
    setUploading(true)
    setUploadProgress(0)

    const path = `${selectedProjectId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('project-models')
      .upload(path, file, { upsert: true, contentType: 'model/gltf-binary' })

    if (error) {
      showToast('error', `Upload ล้มเหลว: ${error.message}`)
    } else {
      setModelPath(path)
      setUploadProgress(100)
      showToast('success', 'Upload สำเร็จ')
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!selectedProjectId || !modelPath) {
      showToast('error', 'กรุณาเลือกโครงการและ upload โมเดลก่อน')
      return
    }
    const lng = parseFloat(anchorLng)
    const lat = parseFloat(anchorLat)
    if (isNaN(lng) || isNaN(lat)) {
      showToast('error', 'Anchor lng/lat ไม่ถูกต้อง')
      return
    }
    setSaving(true)
    const payload = {
      project_id: selectedProjectId,
      model_path: modelPath,
      anchor_lng: lng,
      anchor_lat: lat,
      altitude_m: parseFloat(altitudeM) || 0,
      rotation_z_deg: parseFloat(rotationZ) || 0,
      scale: parseFloat(scale) || 1,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase
      .from('project_models')
      .upsert(payload, { onConflict: 'project_id' })

    if (error) {
      showToast('error', `บันทึกล้มเหลว: ${error.message}`)
    } else {
      showToast('success', 'บันทึกโมเดลเรียบร้อย')
      setModel(payload as ProjectModel)
    }
    setSaving(false)
  }

  const previewUrl = selectedProjectId
    ? `/?model_preview=${selectedProjectId}&lat=${anchorLat}&lng=${anchorLng}&zoom=16`
    : null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">3D Model Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Upload และ calibrate GLB model สำหรับแต่ละโครงการ</p>
      </div>

      {/* Project selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-[0.08em] mb-2">
          เลือกโครงการ
        </label>
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">— เลือกโครงการ —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {model && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <CheckCircle2 size={13} />
            มีโมเดลอยู่แล้ว — อัปเดตได้เลย
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={28} />
        </div>
      )}

      {selectedProjectId && !loading && (
        <>
          {/* Upload GLB */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-[0.08em] mb-3">
              GLB File
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".glb"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? `กำลัง upload...` : 'เลือกไฟล์ .glb'}
            </button>
            {modelPath && (
              <p className="mt-2 text-xs text-slate-500 break-all font-mono bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                {modelPath}
              </p>
            )}
          </div>

          {/* Calibration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4 space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-[0.08em]">ตำแหน่งและมิติ</h2>

            {/* Anchor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anchor Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={anchorLng}
                  onChange={(e) => setAnchorLng(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Anchor Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={anchorLat}
                  onChange={(e) => setAnchorLat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
            <button
              onClick={handleUseProjectPin}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
            >
              ใช้ตำแหน่งหมุดโครงการ ({selectedProject?.latitude?.toFixed(6)}, {selectedProject?.longitude?.toFixed(6)})
            </button>

            {/* Altitude */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Altitude (m) — <span className="font-mono">{altitudeM}</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={altitudeM}
                onChange={(e) => setAltitudeM(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Rotation Z */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Rotation Z (deg) — <span className="font-mono">{rotationZ}°</span>
              </label>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotationZ}
                onChange={(e) => setRotationZ(e.target.value)}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-180°</span><span>0°</span><span>180°</span>
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Scale — <span className="font-mono">{scale}×</span>
              </label>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.05}
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.1×</span><span>1×</span><span>10×</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !modelPath}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
              >
                <ExternalLink size={15} />
                Preview on Map
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            <strong>Preview on Map</strong> จะเปิดหน้าแผนที่และ fly ไปยังตำแหน่ง anchor ที่กรอกไว้ ให้กด "View 3D Model" ใน side panel เพื่อดูโมเดล
          </p>
        </>
      )}
    </div>
  )
}
