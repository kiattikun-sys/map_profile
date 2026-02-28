'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import type { Project } from '@/types/database'
import { getProjectCoverImage, getTypeGradient } from '@/lib/project-utils'

interface Props {
  projects: Project[]
  typeCount: Record<string, number>
}

const TYPE_CHIP_COLORS: Record<string, string> = {
  'ภูมิสถาปัตย์': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'สำรวจ':        'bg-teal-100 text-teal-700 border-teal-200',
  'โยธา':         'bg-blue-100 text-blue-700 border-blue-200',
  'อาคาร':        'bg-purple-100 text-purple-700 border-purple-200',
  'สาธารณูปโภค':  'bg-green-100 text-green-700 border-green-200',
  'ถนน':          'bg-amber-100 text-amber-700 border-amber-200',
  'ไฟฟ้า':        'bg-orange-100 text-orange-700 border-orange-200',
  'ชลประทาน':     'bg-cyan-100 text-cyan-700 border-cyan-200',
  'ท่าเรือ':       'bg-sky-100 text-sky-700 border-sky-200',
  'ระบบระบายน้ำ': 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

const SORT_OPTIONS = [
  { value: 'year_desc',  label: 'ปีล่าสุด' },
  { value: 'year_asc',   label: 'ปีเก่าสุด' },
  { value: 'name_asc',   label: 'ชื่อ A–Z' },
]

export default function ProjectsClient({ projects, typeCount }: Props) {
  const [activeType, setActiveType] = useState('')
  const [sort, setSort] = useState('year_desc')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = [...projects]
    if (activeType) list = list.filter((p) => p.project_type === activeType)
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'year_desc') list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    else if (sort === 'year_asc') list.sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    else if (sort === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name, 'th'))
    return list
  }, [projects, activeType, sort, search])

  const types = Object.keys(typeCount).sort((a, b) => typeCount[b] - typeCount[a])

  return (
    <div className="flex-1 pt-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            placeholder="ค้นหาโครงการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-400 bg-white transition-all duration-200"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={2} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 bg-white appearance-none cursor-pointer transition-all duration-200"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Result count */}
        <div className="flex items-center text-[13px] text-slate-500 ml-auto">
          <span className="font-semibold text-slate-800">{filtered.length}</span>
          <span className="ml-1">โครงการ</span>
          {(activeType || search) && (
            <button
              onClick={() => { setActiveType(''); setSearch('') }}
              className="ml-2 text-[12px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5 transition-colors"
            >
              <X size={11} /> ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Type chips */}
      <div className="flex flex-wrap gap-1.5 mb-7">
        <button
          onClick={() => setActiveType('')}
          className={`text-[12px] px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 ${
            !activeType
              ? 'bg-blue-800 text-white border-blue-800'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
          }`}
          style={!activeType ? { boxShadow: '0 2px 8px rgba(30,58,138,0.2)' } : {}}
        >
          ทั้งหมด
          <span className="ml-1 opacity-60">({projects.length})</span>
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(activeType === t ? '' : t)}
            className={`text-[12px] px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 ${
              activeType === t
                ? (TYPE_CHIP_COLORS[t] ?? 'bg-blue-100 text-blue-700 border-blue-200')
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {t}
            <span className="ml-1 opacity-50">({typeCount[t]})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const coverUrl = getProjectCoverImage(project.images)
            const gradient = getTypeGradient(project.project_type)
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-2xl overflow-hidden group border border-slate-200/60 transition-all duration-500"
                style={{ boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xl)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = '#c7d2e8'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.4)'; }}
              >
                <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin size={44} className="text-white/25" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {project.year && (
                    <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                      {project.year}
                    </span>
                  )}
                  {project.project_type && (
                    <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/20">
                      {project.project_type}
                    </span>
                  )}
                  {project.images && project.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      +{project.images.length - 1} รูป
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-800 transition-colors duration-300 line-clamp-2 text-[14.5px] tracking-[-0.01em]">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-[13px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between text-[12px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      {project.province && (
                        <span className="flex items-center gap-1"><MapPin size={10} strokeWidth={2} /> {project.province}</span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1"><Calendar size={10} strokeWidth={2} /> {project.year}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-blue-700 font-semibold group-hover:gap-2 transition-all duration-300 text-[12px]">
                      ดูเพิ่มเติม <ArrowRight size={11} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MapPin size={28} className="text-slate-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-[15px] font-semibold text-slate-700 mb-1.5 tracking-[-0.01em]">ไม่พบโครงการที่ตรงกัน</h3>
          <p className="text-[13px] text-slate-400 mb-5">ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น</p>
          <button
            onClick={() => { setActiveType(''); setSearch('') }}
            className="px-5 py-2 bg-blue-800 text-white rounded-xl text-[13px] font-medium hover:bg-blue-900 transition-colors duration-200"
            style={{ boxShadow: '0 2px 8px rgba(30,58,138,0.2)' }}
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  )
}
