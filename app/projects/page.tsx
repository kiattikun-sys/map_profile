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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-16 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">
            TRIPIRA — ผลงานของเรา
          </span>
          <h1 className="text-4xl font-bold mb-3">โครงการทั้งหมด</h1>
          <p className="text-blue-100 text-lg">
            ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="text-sm text-blue-200">โครงการทั้งหมด</p>
            </div>
            <div className="w-px bg-blue-600" />
            <div className="text-center">
              <p className="text-3xl font-bold">{provinces}</p>
              <p className="text-sm text-blue-200">จังหวัดทั่วประเทศ</p>
            </div>
            <div className="w-px bg-blue-600" />
            <div className="text-center">
              <p className="text-3xl font-bold">{Object.keys(typeCount).length}</p>
              <p className="text-sm text-blue-200">ประเภทงาน</p>
            </div>
          </div>
        </div>
      </div>

      <ProjectsClient projects={projects} typeCount={typeCount} />

      <Footer />
    </div>
  )
}
