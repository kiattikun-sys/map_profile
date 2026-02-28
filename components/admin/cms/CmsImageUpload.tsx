'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getSiteAssetUrl } from '@/lib/site-content'

interface Props {
  currentPath: string | null
  storagePath: string
  onUploaded: (path: string) => void
  onCleared: () => void
  label?: string
}

export default function CmsImageUpload({ currentPath, storagePath, onUploaded, onCleared, label = 'รูปภาพ' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = getSiteAssetUrl(currentPath)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('ไฟล์ต้องไม่เกิน 5 MB')
      return
    }
    setError(null)
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${storagePath}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('site-assets')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      onUploaded(path)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setError(msg)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="text-[12.5px] font-semibold text-slate-600 mb-2">{label}</p>
      {previewUrl ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="preview"
            className="h-28 w-auto rounded-xl object-cover border border-slate-200"
          />
          <button
            type="button"
            onClick={onCleared}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-[13px] hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          {uploading
            ? <><span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />กำลังอัปโหลด...</>
            : <><Upload size={14} strokeWidth={2} /><ImageIcon size={14} strokeWidth={1.5} />เลือกรูป (JPG/PNG ≤5MB)</>
          }
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
      {currentPath && (
        <p className="text-[11px] text-slate-400 mt-1 font-mono truncate max-w-xs">{currentPath}</p>
      )}
    </div>
  )
}
