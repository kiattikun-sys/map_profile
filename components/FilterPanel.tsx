'use client'

import { FilterState, Client } from '@/types/database'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const PROJECT_TYPES = [
  'โยธา', 'สาธารณูปโภค', 'ถนน', 'อาคาร', 'ไฟฟ้า',
  'ชลประทาน', 'ท่าเรือ', 'ระบบระบายน้ำ', 'ภูมิสถาปัตย์', 'อื่นๆ',
]

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

const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  projectCount: number
  clients?: Client[]
}

export default function FilterPanel({ filters, onChange, projectCount, clients = [] }: FilterPanelProps) {
  const hasActiveFilters = filters.search || filters.projectType || filters.province || filters.year || filters.clientId

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const clearAll = () => {
    onChange({ search: '', projectType: '', province: '', year: '', clientId: '' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3 min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <SlidersHorizontal size={16} className="text-blue-600" />
          <span>กรองข้อมูล</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {projectCount} โครงการ
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X size={12} /> ล้าง
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาชื่อโครงการ..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">ประเภทงาน</label>
        <select
          value={filters.projectType}
          onChange={(e) => update('projectType', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">ทั้งหมด</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">จังหวัด</label>
        <select
          value={filters.province}
          onChange={(e) => update('province', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">ทั้งหมด</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">ปี</label>
        <select
          value={filters.year}
          onChange={(e) => update('year', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">ทั้งหมด</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {clients.length > 0 && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">ลูกค้า</label>
          <select
            value={filters.clientId}
            onChange={(e) => update('clientId', e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">ทั้งหมด</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
