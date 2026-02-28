'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'
import CmsToast, { type ToastState } from './CmsToast'
import { Save, X, GripVertical, Star, Search, Plus } from 'lucide-react'

interface Props {
  allProjects: Project[]
  allClients: Client[]
  initialFeaturedIds: string[]
  initialKeyIds: string[]
}

function DraggableList<T extends { id: string; name: string }>({
  items,
  onRemove,
  onReorder,
  emptyLabel,
}: {
  items: T[]
  onRemove: (id: string) => void
  onReorder: (items: T[]) => void
  emptyLabel: string
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    setOverIdx(i)
  }
  const onDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null); setOverIdx(null); return
    }
    const arr = [...items]
    const [moved] = arr.splice(dragIdx, 1)
    arr.splice(targetIdx, 0, moved)
    onReorder(arr)
    setDragIdx(null); setOverIdx(null)
  }
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null) }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-[13px] text-slate-400">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => onDragStart(idx)}
          onDragOver={(e) => onDragOver(e, idx)}
          onDrop={(e) => onDrop(e, idx)}
          onDragEnd={onDragEnd}
          className={`flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
            overIdx === idx ? 'border-blue-400 bg-blue-50' : 'border-slate-200/70'
          }`}
          style={{ boxShadow: dragIdx === idx ? '0 4px 16px rgba(0,0,0,0.12)' : 'var(--shadow-xs, none)', opacity: dragIdx === idx ? 0.5 : 1 }}
        >
          <GripVertical size={14} className="text-slate-300 flex-shrink-0" strokeWidth={2} />
          <span className="w-6 h-6 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-black flex items-center justify-center flex-shrink-0">
            {idx + 1}
          </span>
          <span className="flex-1 text-[13px] text-slate-800 font-medium truncate">{item.name}</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </li>
      ))}
    </ul>
  )
}

function SearchDropdown<T extends { id: string; name: string }>({
  all,
  selectedIds,
  onSelect,
  placeholder,
}: {
  all: T[]
  selectedIds: string[]
  onSelect: (item: T) => void
  placeholder: string
}) {
  const [query, setQuery] = useState('')
  const available = all.filter(
    (item) =>
      !selectedIds.includes(item.id) &&
      item.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-400 transition-all">
        <Search size={13} className="text-slate-400 flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] outline-none text-slate-700 placeholder-slate-400"
        />
      </div>
      {query && available.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-52 overflow-y-auto">
          {available.slice(0, 20).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { onSelect(item); setQuery('') }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <Plus size={12} className="text-blue-500 flex-shrink-0" strokeWidth={2.5} />
              {item.name}
            </button>
          ))}
          {available.length > 20 && (
            <p className="px-4 py-2 text-[12px] text-slate-400 text-center">...และอีก {available.length - 20} รายการ</p>
          )}
        </div>
      )}
      {query && available.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 px-4 py-3">
          <p className="text-[13px] text-slate-400 text-center">ไม่พบ</p>
        </div>
      )}
    </div>
  )
}

export default function AdminFeaturedEditor({
  allProjects,
  allClients,
  initialFeaturedIds,
  initialKeyIds,
}: Props) {
  const [toast, setToast] = useState<ToastState>(null)
  const [saving, setSaving] = useState(false)

  const buildProjectList = (ids: string[]) =>
    ids
      .map((id) => allProjects.find((p) => p.id === id))
      .filter(Boolean) as Project[]

  const buildClientList = (ids: string[]) =>
    ids
      .map((id) => allClients.find((c) => c.id === id))
      .filter(Boolean) as Client[]

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(buildProjectList(initialFeaturedIds))
  const [keyClients, setKeyClients] = useState<Client[]>(buildClientList(initialKeyIds))

  const addProject = (p: Project) => {
    if (featuredProjects.length >= 12) {
      setToast({ type: 'error', message: 'เลือกได้สูงสุด 12 โครงการ' }); return
    }
    setFeaturedProjects((prev) => [...prev, p])
  }

  const removeProject = (id: string) =>
    setFeaturedProjects((prev) => prev.filter((p) => p.id !== id))

  const addClient = (c: Client) => {
    setKeyClients((prev) => [...prev, c])
  }

  const removeClient = (id: string) =>
    setKeyClients((prev) => prev.filter((c) => c.id !== id))

  const save = useCallback(async () => {
    setSaving(true)
    try {
      // Save featured projects
      await supabase.from('featured_projects').delete().neq('project_id', '00000000-0000-0000-0000-000000000000')
      if (featuredProjects.length > 0) {
        const { error: fpErr } = await supabase.from('featured_projects').insert(
          featuredProjects.map((p, idx) => ({ project_id: p.id, position: idx }))
        )
        if (fpErr) throw fpErr
      }

      // Save key clients
      await supabase.from('key_clients').delete().neq('client_id', '00000000-0000-0000-0000-000000000000')
      if (keyClients.length > 0) {
        const { error: kcErr } = await supabase.from('key_clients').insert(
          keyClients.map((c, idx) => ({ client_id: c.id, position: idx }))
        )
        if (kcErr) throw kcErr
      }

      setToast({ type: 'success', message: `บันทึก Featured ${featuredProjects.length} โครงการ + Key ${keyClients.length} ลูกค้า เรียบร้อย` })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      setToast({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }, [featuredProjects, keyClients])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-[-0.02em]">Featured & Key Selector</h2>
        <p className="text-[13px] text-slate-500 mt-1">เลือกและเรียงลำดับโครงการเด่น + ลูกค้าหลัก — ลากเพื่อเปลี่ยนลำดับ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Featured Projects */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={15} className="text-amber-500" strokeWidth={2.5} />
              <h3 className="text-[15px] font-bold text-slate-900">Featured Projects</h3>
            </div>
            <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-lg ${
              featuredProjects.length >= 12 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {featuredProjects.length} / 12
            </span>
          </div>

          <SearchDropdown
            all={allProjects}
            selectedIds={featuredProjects.map((p) => p.id)}
            onSelect={addProject}
            placeholder="ค้นหาโครงการเพื่อเพิ่ม..."
          />

          <DraggableList
            items={featuredProjects}
            onRemove={removeProject}
            onReorder={setFeaturedProjects}
            emptyLabel="ยังไม่มี featured projects — ค้นหาด้านบนเพื่อเพิ่ม"
          />

          <p className="text-[11.5px] text-slate-400">
            ถ้าว่าง → fallback: 12 โครงการล่าสุดตามปี
          </p>
        </div>

        {/* Key Clients */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-2">
            <Star size={15} className="text-blue-500" strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-slate-900">Key Clients</h3>
          </div>

          <SearchDropdown
            all={allClients}
            selectedIds={keyClients.map((c) => c.id)}
            onSelect={addClient}
            placeholder="ค้นหาลูกค้าเพื่อเพิ่ม..."
          />

          <DraggableList
            items={keyClients}
            onRemove={removeClient}
            onReorder={setKeyClients}
            emptyLabel="ยังไม่มี key clients — ค้นหาด้านบนเพื่อเพิ่ม"
          />

          <p className="text-[11.5px] text-slate-400">
            ถ้าว่าง → fallback: 8 ลูกค้าแรกตามชื่อ
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
          style={{ boxShadow: '0 4px 14px rgba(30,58,138,0.2)' }}
        >
          <Save size={14} strokeWidth={2.5} />
          {saving ? 'กำลังบันทึก...' : 'บันทึก Featured & Key'}
        </button>
        <p className="text-[12px] text-slate-400">การเปลี่ยนแปลงจะมีผลทันทีบนหน้า public (revalidate 60s)</p>
      </div>

      <CmsToast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
