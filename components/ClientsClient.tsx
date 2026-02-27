'use client'

import { useState, useMemo } from 'react'
import { Building2, Globe, Search, X } from 'lucide-react'
import type { Client } from '@/types/database'

interface Props {
  clients: Client[]
  projectCountByClient: Record<string, number>
}

const SECTOR_MAP: Record<string, { label: string; color: string }> = {
  'dpt.go.th':         { label: 'รัฐ — ภูมิสถาปัตย์', color: 'purple' },
  'bangchak.co.th':    { label: 'พลังงาน',           color: 'yellow' },
  'pttplc.com':        { label: 'พลังงาน',           color: 'yellow' },
  'lotuss.com':        { label: 'ค้าปลีก',          color: 'green'  },
  'singburipao.go.th': { label: 'ท้องถิ่น',          color: 'blue'   },
}

const BADGE_COLORS: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-green-100 text-green-800 border-green-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
}

function getSector(website: string | null) {
  if (!website) return null
  const domain = Object.keys(SECTOR_MAP).find((d) => website.includes(d))
  return domain ? SECTOR_MAP[domain] : null
}

export default function ClientsClient({ clients, projectCountByClient }: Props) {
  const [search, setSearch] = useState('')
  const [activeSector, setActiveSector] = useState('')

  const sectors = useMemo(() => {
    const set = new Set<string>()
    clients.forEach((c) => {
      const s = getSector(c.website)
      if (s) set.add(s.label)
    })
    return [...set].sort()
  }, [clients])

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (activeSector) {
        const s = getSector(c.website)
        if (!s || s.label !== activeSector) return false
      }
      return true
    })
  }, [clients, search, activeSector])

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>
        <span className="flex items-center text-sm text-gray-500 ml-auto">
          <span className="font-semibold text-gray-900">{filtered.length}</span>
          <span className="ml-1">ลูกค้า</span>
        </span>
      </div>

      {/* Sector chips */}
      {sectors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveSector('')}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              !activeSector
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            ทั้งหมด ({clients.length})
          </button>
          {sectors.map((s) => {
            const count = clients.filter((c) => getSector(c.website)?.label === s).length
            return (
              <button
                key={s}
                onClick={() => setActiveSector(activeSector === s ? '' : s)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  activeSector === s
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {s} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((client) => {
            const sector = getSector(client.website)
            const count = projectCountByClient[client.id]
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <Building2 size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {count && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                        {count} โครงการ
                      </span>
                    )}
                    {sector && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${BADGE_COLORS[sector.color] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {sector.label}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 leading-snug mb-2">{client.name}</h3>
                {client.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{client.description}</p>
                )}
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline mt-auto"
                  >
                    <Globe size={11} /> {client.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Building2 size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-base font-medium text-gray-600">ไม่พบลูกค้าที่ตรงกัน</p>
          <button
            onClick={() => { setSearch(''); setActiveSector('') }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  )
}
