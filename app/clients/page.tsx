import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientsClient from '@/components/ClientsClient'

export const metadata: Metadata = {
  title: '\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32',
  description: '\u0e2b\u0e19\u0e48\u0e27\u0e22\u0e07\u0e32\u0e19\u0e20\u0e32\u0e04\u0e23\u0e31\u0e10\u0e0a\u0e31\u0e49\u0e19\u0e19\u0e33\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17\u0e40\u0e2d\u0e01\u0e0a\u0e19\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e17\u0e35\u0e48\u0e44\u0e27\u0e49\u0e27\u0e32\u0e07\u0e43\u0e08\u0e43\u0e19\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e07\u0e32\u0e19\u0e02\u0e2d\u0e07 TRIPIRA \u2014 \u0e01\u0e23\u0e21\u0e42\u0e22\u0e18\u0e32\u0e18\u0e34\u0e01\u0e32\u0e23\u0e41\u0e25\u0e30\u0e1c\u0e31\u0e07\u0e40\u0e21\u0e37\u0e2d\u0e07 Bangchak PTT Lotus\u2019s',
  openGraph: {
    title: '\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32 | TRIPIRA',
    description: '\u0e1e\u0e32\u0e23\u0e4c\u0e17\u0e40\u0e19\u0e2d\u0e23\u0e4c\u0e0a\u0e31\u0e49\u0e19\u0e19\u0e33\u0e17\u0e35\u0e48\u0e44\u0e27\u0e49\u0e27\u0e32\u0e07\u0e43\u0e08\u0e43\u0e19\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e07\u0e32\u0e19\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e23\u0e21\u0e41\u0e25\u0e30\u0e20\u0e39\u0e21\u0e34\u0e2a\u0e16\u0e32\u0e1b\u0e31\u0e15\u0e22\u0e01\u0e23\u0e23\u0e21',
  },
}

export const revalidate = 60

export default async function ClientsPage() {
  const { data: clientsRaw } = await supabase.from('clients').select('*').order('name')
  const clients = (clientsRaw as Client[] | null) ?? []
  const { data: projectsRaw } = await supabase.from('projects').select('client_id').eq('status', 'active')
  const projects = (projectsRaw as Pick<Project, 'client_id'>[] | null) ?? []

  const projectCountByClient: Record<string, number> = {}
  projects.forEach((p) => {
    if (p.client_id) {
      projectCountByClient[p.client_id] = (projectCountByClient[p.client_id] ?? 0) + 1
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">
            \u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32
          </span>
          <h1 className="text-4xl font-bold mb-3">\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32</h1>
          <p className="text-blue-100 text-lg">
            \u0e2b\u0e19\u0e48\u0e27\u0e22\u0e07\u0e32\u0e19\u0e23\u0e31\u0e10\u0e0a\u0e31\u0e49\u0e19\u0e19\u0e33\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17\u0e40\u0e2d\u0e01\u0e0a\u0e19\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e17\u0e35\u0e48\u0e44\u0e27\u0e49\u0e27\u0e32\u0e07\u0e43\u0e08\u0e43\u0e19\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e07\u0e32\u0e19\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32
          </p>
          <div className="flex items-center gap-2 mt-6">
            <span className="text-2xl font-bold">{clients.length}</span>
            <span className="text-blue-200 text-sm">\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\u0e41\u0e25\u0e30\u0e1e\u0e32\u0e23\u0e4c\u0e17\u0e40\u0e19\u0e2d\u0e23\u0e4c</span>
          </div>
        </div>
      </div>

      <ClientsClient clients={clients} projectCountByClient={projectCountByClient} />

      <Footer />
    </div>
  )
}
