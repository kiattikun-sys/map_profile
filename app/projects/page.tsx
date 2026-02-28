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
      <div className="pt-[60px] brand-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="brand-label">ผลงานของเรา — TRIPIRA</p>
          <div className="brand-divider opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-[-0.02em] leading-tight">โครงการทั้งหมด</h1>
          <p className="text-blue-200/80 text-[15px] max-w-lg leading-relaxed">
            ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย
          </p>
          <div className="flex flex-wrap gap-8 mt-10">
            <div>
              <p className="text-3xl font-black tracking-[-0.03em]">{projects.length}</p>
              <p className="text-[12px] text-blue-300/70 mt-0.5 uppercase tracking-widest font-medium">โครงการ</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black tracking-[-0.03em]">{provinces}</p>
              <p className="text-[12px] text-blue-300/70 mt-0.5 uppercase tracking-widest font-medium">จังหวัด</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black tracking-[-0.03em]">{Object.keys(typeCount).length}</p>
              <p className="text-[12px] text-blue-300/70 mt-0.5 uppercase tracking-widest font-medium">ประเภทงาน</p>
            </div>
          </div>
        </div>
      </div>

      <ProjectsClient projects={projects} typeCount={typeCount} />

      <Footer />
    </div>
  )
}
