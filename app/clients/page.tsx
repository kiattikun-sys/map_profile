import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ExternalLink, Users, Globe, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ลูกค้าของเรา',
  description: 'หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของ TRIPIRA — กรมโยธาธิการและผังเมือง Bangchak PTT Lotus’s',
  openGraph: {
    title: 'ลูกค้า | TRIPIRA',
    description: 'พาร์ทเนอร์ชั้นนำที่ไว้วางใจในคุณภาพงานวิศวกรรมและภูมิสถาปัตยกรรม',
  },
}

const SECTOR_MAP: Record<string, { label: string; color: string }> = {
  'dpt.go.th':         { label: 'รัฐ — ภูมิสถาปัตย์',  color: 'purple' },
  'bangchak.co.th':    { label: 'พลังงาน',            color: 'yellow' },
  'pttplc.com':        { label: 'พลังงาน',            color: 'yellow' },
  'lotuss.com':        { label: 'ค้าปลีก',           color: 'green' },
  'singburipao.go.th': { label: 'ท้องถิ่น',           color: 'blue' },
}

function getSector(website: string | null) {
  if (!website) return null
  const domain = Object.keys(SECTOR_MAP).find((d) => website.includes(d))
  return domain ? SECTOR_MAP[domain] : null
}

const BADGE_COLORS: Record<string, string> = {
  yellow:  'bg-yellow-100 text-yellow-800',
  blue:    'bg-blue-100 text-blue-800',
  cyan:    'bg-cyan-100 text-cyan-800',
  green:   'bg-green-100 text-green-800',
  gray:    'bg-gray-100 text-gray-700',
  purple:  'bg-purple-100 text-purple-800',
  orange:  'bg-orange-100 text-orange-800',
  indigo:  'bg-indigo-100 text-indigo-800',
  red:     'bg-red-100 text-red-800',
  teal:    'bg-teal-100 text-teal-800',
}

export const revalidate = 60

export default async function ClientsPage() {
  const { data: clientsRaw } = await supabase.from('clients').select('*').order('name')
  const clients = clientsRaw as Client[] | null
  const { data: projectsRaw } = await supabase.from('projects').select('*').eq('status', 'active')
  const projects = projectsRaw as Project[] | null

  const projectCountByClient: Record<string, number> = {}
  projects?.forEach((p) => {
    if (p.client_id) {
      projectCountByClient[p.client_id] = (projectCountByClient[p.client_id] ?? 0) + 1
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">ลูกค้าของเรา</span>
          <h1 className="text-4xl font-bold mb-3">ลูกค้าของเรา</h1>
          <p className="text-blue-100 text-lg">
            หน่วยงานรัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => {
              const sector = getSector(client.website)
              const count = projectCountByClient[client.id]
              return (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
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
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {count} โครงการ
                        </span>
                      )}
                      {sector && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_COLORS[sector.color]}`}>
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
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">ยังไม่มีข้อมูลลูกค้าในระบบ</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
