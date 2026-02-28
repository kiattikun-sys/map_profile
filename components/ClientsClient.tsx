'use client'

import { useState, useMemo } from 'react'
import { Building2, Globe, Search, X } from 'lucide-react'
import type { Client } from '@/types/database'

interface Props {
  clients: Client[]
  projectCountByClient: Record<string, number>
  keyClients?: Client[]
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

export default function ClientsClient({ clients, projectCountByClient, keyClients = [] }: Props) {
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
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Key Clients strip */}
      {keyClients.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-blue-600 inline-block" />
            <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-[0.1em]">Key Clients</h2>
            <span className="text-[12px] text-slate-400 font-medium ml-1">— ลูกค้าหลักที่ไว้วางใจ</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {keyClients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-4 border border-blue-100/80 flex flex-col items-center gap-2.5 text-center transition-all duration-200"
                style={{ boxShadow: '0 2px 12px rgba(30,58,138,0.07)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(30,58,138,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {client.logo
                    ? <img src={client.logo} alt={client.name} className="w-8 h-8 object-contain" />
                    : <Building2 size={18} className="text-blue-200" strokeWidth={1.5} />}
                </div>
                <p className="text-[12px] font-semibold text-slate-800 leading-snug line-clamp-2">{client.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-100" />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative max-w-xs flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-400 bg-white transition-all duration-200"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={12} />
            </button>
          )}
        </div>
        <span className="flex items-center text-[13px] text-slate-500 ml-auto">
          <span className="font-semibold text-slate-800">{filtered.length}</span>
          <span className="ml-1">ลูกค้า</span>
        </span>
      </div>

      {/* Sector chips */}
      {sectors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-7">
          <button
            onClick={() => setActiveSector('')}
            className={`text-[12px] px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 ${
              !activeSector
                ? 'bg-blue-800 text-white border-blue-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
            style={!activeSector ? { boxShadow: '0 2px 8px rgba(30,58,138,0.2)' } : {}}
          >
            ทั้งหมด <span className="opacity-60">({clients.length})</span>
          </button>
          {sectors.map((s) => {
            const count = clients.filter((c) => getSector(c.website)?.label === s).length
            return (
              <button
                key={s}
                onClick={() => setActiveSector(activeSector === s ? '' : s)}
                className={`text-[12px] px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 ${
                  activeSector === s
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
                style={activeSector === s ? { boxShadow: '0 2px 8px rgba(30,58,138,0.2)' } : {}}
              >
                {s} <span className="opacity-50">({count})</span>
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
                className="bg-white rounded-2xl p-5 border border-slate-200/60 flex flex-col transition-all duration-400 group"
                style={{ boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <Building2 size={20} className="text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {count && (
                      <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                        {count} โครงการ
                      </span>
                    )}
                    {sector && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${BADGE_COLORS[sector.color] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {sector.label}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 leading-snug mb-1.5 text-[14px] tracking-[-0.01em]">{client.name}</h3>
                {client.description && (
                  <p className="text-[12.5px] text-slate-500 line-clamp-2 mb-3 flex-1 leading-relaxed">{client.description}</p>
                )}
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-800 hover:underline mt-auto transition-colors duration-150"
                  >
                    <Globe size={10} strokeWidth={2} /> {client.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold text-slate-600 mb-1.5">ไม่พบลูกค้าที่ตรงกัน</p>
          <button
            onClick={() => { setSearch(''); setActiveSector('') }}
            className="mt-2 text-[13px] text-blue-700 hover:text-blue-900 hover:underline transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  )
}
