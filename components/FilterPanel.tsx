'use client'

import { useEffect, useRef } from 'react'
import { FilterState, Client } from '@/types/database'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const PROJECT_TYPES = [
  'ภูมิสถาปัตย์', 'สำรวจ', 'โยธา', 'อาคาร', 'สาธารณูปโภค',
  'ถนน', 'ไฟฟ้า', 'ชลประทาน', 'ท่าเรือ', 'ระบบระบายน้ำ',
]

const TYPE_COLORS: Record<string, string> = {
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

const PROVINCES = [
  'กรุงเทพมหานคร', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น',
  'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ',
  'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด',
  'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา',
  'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน',
  'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี',
  'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง',
  'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่',
  'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร',
  'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ',
  'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม',
  'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
  'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู',
  'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
]

const YEARS = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + 543 - i))

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  projectCount: number
  clients?: Client[]
}

export default function FilterPanel({ filters, onChange, projectCount, clients = [] }: FilterPanelProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const hasActiveFilters = filters.search || filters.projectType || filters.province || filters.year || filters.clientId

  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value })

  const clearAll = () =>
    onChange({ search: '', projectType: '', province: '', year: '', clientId: '' })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') searchRef.current?.blur()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const selectClass = 'w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer'

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 space-y-4 min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <SlidersHorizontal size={15} className="text-blue-600" />
          <span className="text-sm">กรองข้อมูล</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
            {projectCount} โครงการ
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X size={12} /> ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Search with keyboard shortcut hint */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={searchRef}
          type="text"
          placeholder="ค้นหา... (กด /)"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="w-full pl-8 pr-9 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {filters.search && (
          <button
            onClick={() => update('search', '')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Type chips */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">ประเภทงาน</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => update('projectType', '')}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              !filters.projectType
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            ทั้งหมด
          </button>
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => update('projectType', filters.projectType === t ? '' : t)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                filters.projectType === t
                  ? (TYPE_COLORS[t] ?? 'bg-blue-100 text-blue-700 border-blue-200') + ' ring-1 ring-offset-1 ring-current'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Province select */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">จังหวัด</label>
        <div className="relative">
          <select
            value={filters.province}
            onChange={(e) => update('province', e.target.value)}
            className={selectClass}
          >
            <option value="">ทุกจังหวัด</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Year select */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">ปี (พ.ศ.)</label>
        <div className="relative">
          <select
            value={filters.year}
            onChange={(e) => update('year', e.target.value)}
            className={selectClass}
          >
            <option value="">ทุกปี</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Client select */}
      {clients.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">ลูกค้า</label>
          <div className="relative">
            <select
              value={filters.clientId}
              onChange={(e) => update('clientId', e.target.value)}
              className={selectClass}
            >
              <option value="">ทุกลูกค้า</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="pt-1 border-t border-gray-50">
          <div className="flex flex-wrap gap-1">
            {filters.projectType && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {filters.projectType}
                <button onClick={() => update('projectType', '')}><X size={10} /></button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                {filters.province}
                <button onClick={() => update('province', '')}><X size={10} /></button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                ปี {filters.year}
                <button onClick={() => update('year', '')}><X size={10} /></button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
