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
  blue:   'bg-[#F6F2EA] text-[#6E6A64] border-[rgba(30,30,30,0.08)]',
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
            <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'var(--gold)' }} />
            <h2 className="text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--foreground)' }}>Key Clients</h2>
            <span className="text-[12px] font-medium ml-1" style={{ color: 'var(--muted)' }}>— ลูกค้าหลักที่ไว้วางใจ</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {keyClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl p-4 flex flex-col items-center gap-2.5 text-center transition-all duration-200"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
                  {client.logo
                    ? <img src={client.logo} alt={client.name} className="w-8 h-8 object-contain" />
                    : <span className="text-[15px] font-black" style={{ color: 'var(--gold)' }}>{client.name.charAt(0)}</span>}
                </div>
                <p className="text-[12px] font-semibold leading-snug line-clamp-2" style={{ color: 'var(--foreground)' }}>{client.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-6" style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative max-w-xs flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--neutral-400)' }} strokeWidth={2} />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-[13px] rounded-xl focus:outline-none transition-all duration-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--neutral-400)' }}>
              <X size={12} />
            </button>
          )}
        </div>
        <span className="flex items-center text-[13px] ml-auto" style={{ color: 'var(--muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{filtered.length}</span>
          <span className="ml-1">ลูกค้า</span>
        </span>
      </div>

      {/* Sector chips */}
      {sectors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-7">
          <button
            onClick={() => setActiveSector('')}
            className="lux-chip"
            style={!activeSector ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#fff', boxShadow: '0 2px 8px rgba(179,155,124,0.35)' } : {}}
          >
            ทั้งหมด <span className="opacity-60">({clients.length})</span>
          </button>
          {sectors.map((s) => {
            const count = clients.filter((c) => getSector(c.website)?.label === s).length
            return (
              <button
                key={s}
                onClick={() => setActiveSector(activeSector === s ? '' : s)}
                className="lux-chip"
                style={activeSector === s ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#fff', boxShadow: '0 2px 8px rgba(179,155,124,0.35)' } : {}}
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
            const monogram = client.name.charAt(0).toUpperCase()
            return (
              <div
                key={client.id}
                className="rounded-2xl p-5 flex flex-col transition-all duration-300"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Monogram / logo badge */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-[18px] font-black" style={{ color: 'var(--gold)' }}>{monogram}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {count && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                        {count} โครงการ
                      </span>
                    )}
                    {sector && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-700)', border: '1px solid var(--border)' }}>
                        {sector.label}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold leading-snug mb-1.5 text-[14px] tracking-[-0.01em]" style={{ color: 'var(--foreground)' }}>{client.name}</h3>
                {client.description && (
                  <p className="text-[12.5px] line-clamp-2 mb-3 flex-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{client.description}</p>
                )}
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] hover:underline mt-auto transition-colors duration-150"
                    style={{ color: 'var(--gold-dark)' }}
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
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Building2 size={24} style={{ color: 'var(--neutral-400)' }} strokeWidth={1.5} />
          </div>
          <p className="text-[14px] font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>ไม่พบลูกค้าที่ตรงกัน</p>
          <button
            onClick={() => { setSearch(''); setActiveSector('') }}
            className="mt-2 text-[13px] hover:underline transition-colors"
            style={{ color: 'var(--gold-dark)' }}
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}
    </div>
  )
}
