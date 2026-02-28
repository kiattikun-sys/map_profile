'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft, Plus, Upload, FileText, Download,
  Clock, CheckCircle2, AlertCircle, Loader2, ChevronDown
} from 'lucide-react'
import type { Profile, ProjectUpdateRow, ProjectFileRow } from '@/types/database'
import {
  getProjectUpdates, getProjectFiles,
  addProjectUpdate, uploadProjectFile, getSignedUrl
} from '@/lib/client-actions'

interface Project {
  id: string
  name: string
  project_type: string | null
  province: string | null
  year: number | null
  status: string | null
  images: string[] | null
  description: string | null
  client_org_id: string | null
}

interface Props {
  project: Project
  profile: Profile
  onBack: () => void
}

const STATUS_OPTIONS = ['กำลังดำเนินการ', 'รอการอนุมัติ', 'แก้ไข', 'เสร็จสิ้น', 'หยุดชั่วคราว']

const canEdit = (role: string) => ['super', 'admin', 'client'].includes(role)

export default function ClientProjectDetail({ project, profile, onBack }: Props) {
  const [updates, setUpdates] = useState<ProjectUpdateRow[]>([])
  const [files, setFiles] = useState<ProjectFileRow[]>([])
  const [loading, setLoading] = useState(true)

  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateNote, setUpdateNote] = useState('')
  const [updateProgress, setUpdateProgress] = useState<number>(0)
  const [updateStatus, setUpdateStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updateError, setUpdateError] = useState('')

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [u, f] = await Promise.all([
        getProjectUpdates(project.id),
        getProjectFiles(project.id),
      ])
      setUpdates(u)
      setFiles(f)
      setLoading(false)
    }
    load()
  }, [project.id])

  async function handleAddUpdate() {
    if (!updateNote.trim() && updateProgress === 0 && !updateStatus) {
      setUpdateError('กรุณากรอกอย่างน้อย 1 รายการ')
      return
    }
    setSubmitting(true)
    setUpdateError('')
    const res = await addProjectUpdate(project.id, {
      progress: updateProgress || undefined,
      status: updateStatus || undefined,
      note: updateNote.trim() || undefined,
    })
    if (res.error) {
      setUpdateError(res.error)
    } else {
      const refreshed = await getProjectUpdates(project.id)
      setUpdates(refreshed)
      setUpdateNote('')
      setUpdateProgress(0)
      setUpdateStatus('')
      setShowUpdateForm(false)
    }
    setSubmitting(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !project.client_org_id) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('label', file.name)
    const res = await uploadProjectFile(project.id, project.client_org_id, fd)
    if (res.error) {
      setUploadError(res.error)
    } else {
      const refreshed = await getProjectFiles(project.id)
      setFiles(refreshed)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDownload(storagePath: string, label: string | null) {
    const url = await getSignedUrl(storagePath)
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = label ?? 'file'
    a.target = '_blank'
    a.click()
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatBytes(b: number | null) {
    if (!b) return ''
    if (b < 1024) return `${b} B`
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1048576).toFixed(1)} MB`
  }

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-lg transition-all"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <ArrowLeft size={13} /> กลับ
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight leading-tight" style={{ color: 'var(--foreground)' }}>
            {project.name}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {[project.project_type, project.province, project.year].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Updates column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--muted)' }}>
              บันทึกความคืบหน้า
            </h3>
            {canEdit(profile.role) && (
              <button
                onClick={() => setShowUpdateForm(v => !v)}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium text-white transition-all"
                style={{ background: 'var(--gold)', boxShadow: '0 2px 6px rgba(179,155,124,0.30)' }}
              >
                <Plus size={12} strokeWidth={2.5} /> เพิ่ม Update
                <ChevronDown size={12} className={`transition-transform ${showUpdateForm ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Update form */}
          {showUpdateForm && canEdit(profile.role) && (
            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--gold-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    ความคืบหน้า (%)
                  </label>
                  <div className="space-y-1">
                    <input
                      type="range" min={0} max={100} step={5}
                      value={updateProgress}
                      onChange={e => setUpdateProgress(Number(e.target.value))}
                      className="w-full" style={{ accentColor: 'var(--gold)' }}
                    />
                    <span className="text-[12px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{updateProgress}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    สถานะ
                  </label>
                  <select
                    value={updateStatus}
                    onChange={e => setUpdateStatus(e.target.value)}
                    className="w-full text-[13px] px-3 py-2 rounded-lg outline-none"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="">— เลือกสถานะ —</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                  หมายเหตุ / บันทึก
                </label>
                <textarea
                  rows={3}
                  value={updateNote}
                  onChange={e => setUpdateNote(e.target.value)}
                  placeholder="รายละเอียดความคืบหน้า ปัญหาที่พบ หรือข้อเสนอแนะ..."
                  className="w-full text-[13px] px-3 py-2 rounded-lg outline-none resize-none"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              {updateError && (
                <p className="text-[12px] flex items-center gap-1.5" style={{ color: '#c0392b' }}>
                  <AlertCircle size={12} /> {updateError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowUpdateForm(false); setUpdateError('') }}
                  className="text-[12px] px-3 py-1.5 rounded-lg"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                >ยกเลิก</button>
                <button
                  onClick={handleAddUpdate}
                  disabled={submitting}
                  className="flex items-center gap-1.5 text-[12px] px-4 py-1.5 rounded-lg font-medium text-white"
                  style={{ background: 'var(--gold)' }}
                >
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                  บันทึก
                </button>
              </div>
            </div>
          )}

          {/* Updates list */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={22} className="animate-spin" style={{ color: 'var(--gold)' }} />
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-10 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Clock size={28} strokeWidth={1.5} style={{ color: 'var(--gold)', margin: '0 auto' }} />
              <p className="text-[13px] mt-2" style={{ color: 'var(--muted)' }}>ยังไม่มีการอัปเดต</p>
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map(u => (
                <div key={u.id} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.progress !== null && (
                        <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                          {u.progress}%
                        </span>
                      )}
                      {u.status && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--neutral-200)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                          {u.status}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
                      {formatDate(u.created_at)}
                    </span>
                  </div>
                  {u.note && (
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--foreground)' }}>{u.note}</p>
                  )}
                  {u.progress !== null && (
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--neutral-200)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${u.progress}%`, background: 'var(--gold)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--muted)' }}>
              ไฟล์แนบ
            </h3>
            {canEdit(profile.role) && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{ color: 'var(--gold-dark)', background: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}
              >
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} strokeWidth={2} />}
                อัปโหลด
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="*/*"
            />
          </div>

          {uploadError && (
            <p className="text-[12px] flex items-center gap-1.5" style={{ color: '#c0392b' }}>
              <AlertCircle size={12} /> {uploadError}
            </p>
          )}

          {/* Path format info */}
          {canEdit(profile.role) && (
            <p className="text-[11px] px-3 py-2 rounded-lg" style={{ background: 'var(--gold-bg)', color: 'var(--muted)', border: '1px solid var(--gold-border)' }}>
              ไฟล์จะเก็บที่: <code className="font-mono text-[10px]">org/…/project/{project.id.slice(0, 8)}…</code>
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin" style={{ color: 'var(--gold)' }} />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <FileText size={24} strokeWidth={1.5} style={{ color: 'var(--gold)', margin: '0 auto' }} />
              <p className="text-[12px] mt-2" style={{ color: 'var(--muted)' }}>ยังไม่มีไฟล์</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map(f => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
                    <FileText size={14} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--foreground)' }}>
                      {f.label ?? 'ไฟล์'}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                      {formatDate(f.created_at)}{f.size_bytes ? ` · ${formatBytes(f.size_bytes)}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(f.storage_path, f.label)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: 'var(--neutral-200)', color: 'var(--muted)' }}
                    title="ดาวน์โหลด"
                  >
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
