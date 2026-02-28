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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Navbar />
      <div className="pt-[60px] brand-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="brand-label">ลูกค้าของเรา — TRIPIRA</p>
          <div className="brand-divider opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-[-0.02em] leading-tight">พาร์ทเนอร์ชั้นนำ</h1>
          <p className="text-blue-200/80 text-[15px] max-w-lg leading-relaxed">
            หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา
          </p>
          <div className="flex flex-wrap gap-8 mt-10">
            <div>
              <p className="text-3xl font-black tracking-[-0.03em]">{clients.length}</p>
              <p className="text-[12px] text-blue-300/70 mt-0.5 uppercase tracking-widest font-medium">ลูกค้าและพาร์ทเนอร์</p>
            </div>
          </div>
        </div>
      </div>

      <ClientsClient clients={clients} projectCountByClient={projectCountByClient} />

      <Footer />
    </div>
  )
}
