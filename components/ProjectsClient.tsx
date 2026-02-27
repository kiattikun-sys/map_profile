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
    <div className="flex-1 pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาโครงการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Result count */}
        <div className="flex items-center text-sm text-gray-500 ml-auto">
          <span className="font-semibold text-gray-900">{filtered.length}</span>
          <span className="ml-1">โครงการ</span>
          {(activeType || search) && (
            <button
              onClick={() => { setActiveType(''); setSearch('') }}
              className="ml-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5"
            >
              <X size={11} /> ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Type chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveType('')}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
            !activeType
              ? 'bg-blue-700 text-white border-blue-700'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          ทั้งหมด
          <span className="ml-1.5 opacity-70">({projects.length})</span>
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(activeType === t ? '' : t)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              activeType === t
                ? (TYPE_CHIP_COLORS[t] ?? 'bg-blue-100 text-blue-700 border-blue-200') + ' ring-1 ring-offset-1 ring-current'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {t}
            <span className="ml-1.5 opacity-60">({typeCount[t]})</span>
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
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-100"
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
                  <h3 className="font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 text-[15px]">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      {project.province && (
                        <span className="flex items-center gap-1"><MapPin size={11} /> {project.province}</span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1"><Calendar size={11} /> {project.year}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                      ดูเพิ่มเติม <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin size={36} className="text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">ไม่พบโครงการที่ตรงกัน</h3>
          <p className="text-sm text-gray-400 mb-4">ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น</p>
          <button
            onClick={() => { setActiveType(''); setSearch('') }}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm hover:bg-blue-800 transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  )
}
