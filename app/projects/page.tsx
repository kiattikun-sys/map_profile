import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectsClient from '@/components/ProjectsClient'

export const metadata: Metadata = {
  title: 'โครงการทั้งหมด',
  description: 'ผลงานภูมิสถาปัตยกรรม วิศวกรรม และ Geomatics Survey โดย TRIPIRA — 200+ โครงการทั่วทุกภาคของประเทศไทย',
  openGraph: {
    title: 'โครงการทั้งหมด | TRIPIRA',
    description: '200+ โครงการภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วประเทศไทย',
  },
}

export const revalidate = 60

export default async function ProjectsPage() {
  const { data: projectsRaw } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('year', { ascending: false })
  const projects = (projectsRaw as Project[] | null) ?? []

  const typeCount: Record<string, number> = {}
  projects.forEach((p) => {
    if (p.project_type) typeCount[p.project_type] = (typeCount[p.project_type] ?? 0) + 1
  })
  const provinces = [...new Set(projects.map((p) => p.province).filter(Boolean))].length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-[60px] relative text-white overflow-hidden" style={{ minHeight: '320px' }}>
        {/* Background image via Unsplash - landscape architecture/urban design */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80&auto=format&fit=crop')` }}
        />
        {/* Multi-layer overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="brand-label">ผลงานของเรา — TRIPIRA</p>
          <div className="brand-divider opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-[-0.02em] leading-tight">โครงการทั้งหมด</h1>
          <p className="text-blue-100/80 text-[15px] max-w-lg leading-relaxed mb-10">
            ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย
          </p>
          {/* Stats strip */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-4xl font-black tracking-[-0.04em]">{projects.length}</p>
              <p className="text-[11px] text-blue-300/70 mt-1 uppercase tracking-[0.15em] font-semibold">โครงการ</p>
            </div>
            <div className="w-px bg-white/15 self-stretch" />
            <div>
              <p className="text-4xl font-black tracking-[-0.04em]">{provinces}</p>
              <p className="text-[11px] text-blue-300/70 mt-1 uppercase tracking-[0.15em] font-semibold">จังหวัด</p>
            </div>
            <div className="w-px bg-white/15 self-stretch" />
            <div>
              <p className="text-4xl font-black tracking-[-0.04em]">{Object.keys(typeCount).length}</p>
              <p className="text-[11px] text-blue-300/70 mt-1 uppercase tracking-[0.15em] font-semibold">ประเภทงาน</p>
            </div>
          </div>
        </div>
      </div>

      <ProjectsClient projects={projects} typeCount={typeCount} />

      <Footer />
    </div>
  )
}
