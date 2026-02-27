import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientsClient from '@/components/ClientsClient'

export const metadata: Metadata = {
  title: 'ลูกค้าของเรา',
  description: 'หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของ TRIPIRA — กรมโยธาธิการและผังเมือง Bangchak PTT Lotus’s',
  openGraph: {
    title: 'ลูกค้า | TRIPIRA',
    description: 'พาร์ทเนอร์ชั้นนำที่ไว้วางใจในคุณภาพงานวิศวกรรมและภูมิสถาปัตยกรรม',
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
            ลูกค้าของเรา
          </span>
          <h1 className="text-4xl font-bold mb-3">ลูกค้าของเรา</h1>
          <p className="text-blue-100 text-lg">
            หน่วยงานรัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา
          </p>
          <div className="flex items-center gap-2 mt-6">
            <span className="text-2xl font-bold">{clients.length}</span>
            <span className="text-blue-200 text-sm">ลูกค้าและพาร์ทเนอร์</span>
          </div>
        </div>
      </div>

      <ClientsClient clients={clients} projectCountByClient={projectCountByClient} />

      <Footer />
    </div>
  )
}
