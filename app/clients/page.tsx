import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'
import Navbar from '@/components/Navbar'
import { ExternalLink, Users } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl font-bold mb-3">ลูกค้าของเรา</h1>
          <p className="text-blue-100 text-lg">
            องค์กรและบริษัทชั้นนำที่ไว้วางใจในบริการของเรา
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <Users size={24} className="text-gray-400" />
                    )}
                  </div>
                  {projectCountByClient[client.id] && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {projectCountByClient[client.id]} โครงการ
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 leading-snug mb-2">{client.name}</h3>
                {client.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{client.description}</p>
                )}
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink size={11} /> {client.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">ยังไม่มีข้อมูลลูกค้าในระบบ</p>
          </div>
        )}
      </div>
    </div>
  )
}
