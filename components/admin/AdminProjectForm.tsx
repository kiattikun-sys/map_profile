'use client'

import { useState, useRef } from 'react'
import { Project, Client, ProjectInsert, OverlayBounds } from '@/types/database'
import { supabase } from '@/lib/supabase'
import {
  X, MapPin, Upload, Loader2, Image as ImageIcon,
  FileText, Layers, Trash2, AlertCircle
} from 'lucide-react'
import dynamic from 'next/dynamic'

const PinPickerMap = dynamic(() => import('./PinPickerMap'), { ssr: false })
const OverlayEditorMap = dynamic(() => import('./OverlayEditorMap'), { ssr: false })

const PROJECT_TYPES = [
  'โยธา', 'สาธารณูปโภค', 'ถนน', 'อาคาร', 'ไฟฟ้า',
  'ชลประทาน', 'ท่าเรือ', 'ระบบระบายน้ำ', 'ภูมิสถาปัตย์', 'อื่นๆ',
]

const PROVINCES = [
  'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
  'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร',
  'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม',
  'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี',
  'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง',
  'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต',
  'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด',
  'ระนอง', 'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย',
  'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม',
  'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
  'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง',
  'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
]

interface AdminProjectFormProps {
  project: Project | null
  clients: Client[]
  onClose: () => void
  onSaved: () => void
}

type Step = 'info' | 'location' | 'media' | 'overlay'

export default function AdminProjectForm({ project, clients, onClose, onSaved }: AdminProjectFormProps) {
  const [step, setStep] = useState<Step>('info')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [projectType, setProjectType] = useState(project?.project_type ?? '')
  const [province, setProvince] = useState(project?.province ?? '')
  const [year, setYear] = useState(String(project?.year ?? new Date().getFullYear()))
  const [clientId, setClientId] = useState(project?.client_id ?? '')
  const [status, setStatus] = useState(project?.status ?? 'active')
  const [tags, setTags] = useState((project?.tags ?? []).join(', '))

  const [latitude, setLatitude] = useState(project?.latitude ?? 13.7563)
  const [longitude, setLongitude] = useState(project?.longitude ?? 100.5018)

  const [existingImages, setExistingImages] = useState<string[]>(project?.images ?? [])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [existingDocs, setExistingDocs] = useState<string[]>(project?.documents ?? [])
  const [newDocFiles, setNewDocFiles] = useState<File[]>([])

  const [overlayImagePath, setOverlayImagePath] = useState<string | null>(project?.overlay_image ?? null)
  const [overlayBounds, setOverlayBounds] = useState<OverlayBounds | null>(
    (project?.overlay_bounds as unknown as OverlayBounds) ?? null
  )
  const [overlayFile, setOverlayFile] = useState<File | null>(null)
  const [overlayPreviewUrl, setOverlayPreviewUrl] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const overlayInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = async (files: File[], bucket: string): Promise<string[]> => {
    const paths: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file)
      if (!error) paths.push(path)
    }
    return paths
  }

  const handleSave = async () => {
    if (!name.trim()) { setError('กรุณากรอกชื่อโครงการ'); return }
    setSaving(true)
    setError('')

    try {
      const uploadedImages = await uploadFiles(newImageFiles, 'project-images')
      const uploadedDocs = await uploadFiles(newDocFiles, 'project-documents')

      let finalOverlayPath = overlayImagePath
      if (overlayFile) {
        const ext = overlayFile.name.split('.').pop()
        const path = `${Date.now()}-overlay.${ext}`
        const { error: upErr } = await supabase.storage.from('overlay-images').upload(path, overlayFile)
        if (!upErr) finalOverlayPath = path
      }

      const payload: ProjectInsert = {
        name: name.trim(),
        description: description.trim() || null,
        project_type: projectType || null,
        province: province || null,
        year: year ? Number(year) : null,
        client_id: clientId || null,
        latitude,
        longitude,
        images: [...existingImages, ...uploadedImages],
        documents: [...existingDocs, ...uploadedDocs],
        overlay_image: finalOverlayPath,
        overlay_bounds: overlayBounds as unknown as import('@/types/database').Json,
        status,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      }

      if (project) {
        const { error: dbErr } = await supabase.from('projects').update(payload).eq('id', project.id)
        if (dbErr) throw dbErr
      } else {
        const { error: dbErr } = await supabase.from('projects').insert(payload)
        if (dbErr) throw dbErr
      }

      onSaved()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: 'ข้อมูลทั่วไป', icon: <FileText size={15} /> },
    { key: 'location', label: 'ตำแหน่ง', icon: <MapPin size={15} /> },
    { key: 'media', label: 'รูป/เอกสาร', icon: <ImageIcon size={15} /> },
    { key: 'overlay', label: 'Layout Plan', icon: <Layers size={15} /> },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {project ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                step === s.key
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Step: Info */}
          {step === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ชื่อโครงการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อโครงการ..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">รายละเอียด</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="รายละเอียดโครงการ..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ประเภทงาน</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- เลือก --</option>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">จังหวัด</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- เลือก --</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ปี</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={2000}
                    max={2100}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ลูกค้า</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- ไม่ระบุ --</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">สถานะ</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">เผยแพร่</option>
                    <option value="hidden">ซ่อน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">แท็ก (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="เช่น bridge, concrete, 2023"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Location */}
          {step === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 bg-blue-50 p-3 rounded-xl">
                <MapPin size={13} className="text-blue-600 flex-shrink-0" />
                คลิกบนแผนที่เพื่อปักหมุดตำแหน่งโครงการ
              </p>
              <div className="h-80 rounded-2xl overflow-hidden border border-gray-200">
                <PinPickerMap
                  latitude={latitude}
                  longitude={longitude}
                  onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng) }}
                />
              </div>
            </div>
          )}

          {/* Step: Media */}
          {step === 'media' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">รูปภาพโครงการ</label>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Upload size={13} /> เพิ่มรูป
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setNewImageFiles([...newImageFiles, ...Array.from(e.target.files ?? [])])}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${img}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {newImageFiles.map((file, i) => (
                    <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setNewImageFiles(newImageFiles.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-center text-[10px] py-0.5">ใหม่</div>
                    </div>
                  ))}
                  {existingImages.length + newImageFiles.length === 0 && (
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    >
                      <ImageIcon size={20} />
                      <span className="text-[10px] mt-1">เพิ่ม</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">เอกสาร</label>
                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Upload size={13} /> แนบเอกสาร
                  </button>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    multiple
                    className="hidden"
                    onChange={(e) => setNewDocFiles([...newDocFiles, ...Array.from(e.target.files ?? [])])}
                  />
                </div>
                <div className="space-y-2">
                  {existingDocs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FileText size={14} className="text-blue-500" />
                        <span className="truncate max-w-[200px]">{doc.split('/').pop()}</span>
                      </div>
                      <button
                        onClick={() => setExistingDocs(existingDocs.filter((_, j) => j !== i))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {newDocFiles.map((file, i) => (
                    <div key={`new-${i}`} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <FileText size={14} />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full">ใหม่</span>
                      </div>
                      <button
                        onClick={() => setNewDocFiles(newDocFiles.filter((_, j) => j !== i))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {existingDocs.length + newDocFiles.length === 0 && (
                    <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText size={24} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">ยังไม่มีเอกสาร</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step: Overlay */}
          {step === 'overlay' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
                <p className="font-semibold mb-1 flex items-center gap-2"><Layers size={14} /> Layout Plan Overlay</p>
                <p className="text-xs text-purple-700">
                  อัปโหลดไฟล์แปลนผัง แล้วคลิก 4 มุม (บนซ้าย → บนขวา → ล่างขวา → ล่างซ้าย) บนแผนที่เพื่อกำหนดตำแหน่ง
                </p>
              </div>

              <div>
                <button
                  onClick={() => overlayInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors w-full justify-center"
                >
                  <Upload size={16} />
                  {overlayFile ? overlayFile.name : overlayImagePath ? 'เปลี่ยนไฟล์แปลน' : 'อัปโหลดไฟล์แปลน (PNG/JPG)'}
                </button>
                <input
                  ref={overlayInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setOverlayFile(file)
                      setOverlayPreviewUrl(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>

              {(overlayPreviewUrl || overlayImagePath) && (
                <>
                  <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    คลิก 4 มุมของแปลนบนแผนที่ตามลำดับ: บนซ้าย → บนขวา → ล่างขวา → ล่างซ้าย
                    {overlayBounds && <span className="ml-2 text-green-700 font-medium">✓ กำหนดครบ 4 มุมแล้ว</span>}
                  </p>
                  <div className="h-72 rounded-2xl overflow-hidden border border-gray-200">
                    <OverlayEditorMap
                      latitude={latitude}
                      longitude={longitude}
                      overlayUrl={overlayPreviewUrl ?? (
                        overlayImagePath
                          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/overlay-images/${overlayImagePath}`
                          : null
                      )}
                      initialBounds={overlayBounds}
                      onBoundsChange={setOverlayBounds}
                    />
                  </div>
                  {overlayBounds && (
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 space-y-1">
                      <p className="font-medium text-gray-700">พิกัด Overlay:</p>
                      <p>↖ บนซ้าย: {overlayBounds.topLeft[1].toFixed(5)}, {overlayBounds.topLeft[0].toFixed(5)}</p>
                      <p>↗ บนขวา: {overlayBounds.topRight[1].toFixed(5)}, {overlayBounds.topRight[0].toFixed(5)}</p>
                      <p>↘ ล่างขวา: {overlayBounds.bottomRight[1].toFixed(5)}, {overlayBounds.bottomRight[0].toFixed(5)}</p>
                      <p>↙ ล่างซ้าย: {overlayBounds.bottomLeft[1].toFixed(5)}, {overlayBounds.bottomLeft[0].toFixed(5)}</p>
                    </div>
                  )}
                </>
              )}

              {overlayImagePath && !overlayFile && (
                <button
                  onClick={() => { setOverlayImagePath(null); setOverlayBounds(null) }}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} /> ลบ Overlay ออก
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2">
            {steps.map((s) => (
              <button
                key={s.key}
                onClick={() => setStep(s.key)}
                className={`w-2 h-2 rounded-full transition-all ${step === s.key ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <><Loader2 size={15} className="animate-spin" /> กำลังบันทึก...</> : 'บันทึก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
