'use client'

import { useState } from 'react'
import { Client, ClientInsert } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { X, Loader2, AlertCircle, Upload } from 'lucide-react'

interface AdminClientFormProps {
  client: Client | null
  onClose: () => void
  onSaved: () => void
}

export default function AdminClientForm({ client, onClose, onSaved }: AdminClientFormProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(client?.name ?? '')
  const [description, setDescription] = useState(client?.description ?? '')
  const [website, setWebsite] = useState(client?.website ?? '')
  const [logoUrl, setLogoUrl] = useState(client?.logo ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleSave = async () => {
    if (!name.trim()) { setError('กรุณากรอกชื่อลูกค้า'); return }
    setSaving(true)
    setError('')

    try {
      let finalLogo = logoUrl || null

      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const path = `logos/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('project-images').upload(path, logoFile)
        if (!upErr) {
          const { data } = supabase.storage.from('project-images').getPublicUrl(path)
          finalLogo = data.publicUrl
        }
      }

      const payload: ClientInsert = {
        name: name.trim(),
        description: description.trim() || null,
        website: website.trim() || null,
        logo: finalLogo,
      }

      if (client) {
        const { error: dbErr } = await supabase.from('clients').update(payload).eq('id', client.id)
        if (dbErr) throw dbErr
      } else {
        const { error: dbErr } = await supabase.from('clients').insert(payload)
        if (dbErr) throw dbErr
      }

      onSaved()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {client ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ชื่อลูกค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อองค์กร / บริษัท"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">รายละเอียด</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="รายละเอียดองค์กร..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">เว็บไซต์</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">โลโก้</label>
            <div className="flex gap-3 items-start">
              {(logoFile ? URL.createObjectURL(logoFile) : logoUrl) && (
                <img
                  src={logoFile ? URL.createObjectURL(logoFile) : logoUrl}
                  alt="logo preview"
                  className="w-14 h-14 rounded-xl border border-gray-200 object-contain bg-gray-50"
                />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="URL โลโก้ หรืออัปโหลดไฟล์"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-600 hover:text-blue-800">
                  <Upload size={13} />
                  <span>อัปโหลดไฟล์โลโก้</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) { setLogoFile(file); setLogoUrl('') }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> กำลังบันทึก...</> : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}
