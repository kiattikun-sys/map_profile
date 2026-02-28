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
      <div className="pt-[60px] relative text-white overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Unsplash — corporate/government building */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="brand-label">ลูกค้าของเรา — TRIPIRA</p>
          <div className="brand-divider opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-[-0.02em] leading-tight">พาร์ทเนอร์ชั้นนำ</h1>
          <p className="text-blue-100/80 text-[15px] max-w-lg leading-relaxed mb-10">
            หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-4xl font-black tracking-[-0.04em]">{clients.length}</p>
              <p className="text-[11px] text-blue-300/70 mt-1 uppercase tracking-[0.15em] font-semibold">ลูกค้าและพาร์ทเนอร์</p>
            </div>
          </div>
        </div>
      </div>

      <ClientsClient clients={clients} projectCountByClient={projectCountByClient} />

      <Footer />
    </div>
  )
}
