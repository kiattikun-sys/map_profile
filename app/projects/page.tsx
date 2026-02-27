import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Building2, Zap, Droplets, Ship, TreePine, HardHat, Wrench } from 'lucide-react'
import { getProjectCoverImage, getTypeGradient } from '@/lib/project-utils'

export const metadata: Metadata = {
  title: 'โครงการทั้งหมด',
  description: 'ผลงานภูมิสถาปัตยกรรม วิศวกรรม และ Geomatics Survey โดย TRIPIRA — 200+ โครงการทั่วทุกภาคของประเทศไทย',
  openGraph: {
    title: 'โครงการทั้งหมด | TRIPIRA',
    description: '200+ โครงการภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วประเทศไทย',
  },
}

const TYPE_CONFIG: Record<string, { color: string; from: string; to: string; icon: React.ElementType }> = {
  'ภูมิสถาปัตย์':   { color: 'emerald', from: 'from-emerald-600', to: 'to-emerald-800', icon: TreePine },
  'สำรวจ':         { color: 'teal',   from: 'from-teal-600',   to: 'to-teal-800',   icon: MapPin },
  'อาคาร':         { color: 'purple', from: 'from-purple-600', to: 'to-purple-800', icon: Building2 },
  'โยธา':          { color: 'blue',   from: 'from-blue-600',   to: 'to-blue-800',   icon: HardHat },
  'สาธารณูปโภค':   { color: 'green',  from: 'from-green-600',  to: 'to-green-800',  icon: Wrench },
  'ถนน':           { color: 'amber',  from: 'from-amber-500',  to: 'to-amber-700',  icon: MapPin },
  'ไฟฟ้า':         { color: 'orange', from: 'from-orange-500', to: 'to-orange-700', icon: Zap },
  'ชลประทาน':      { color: 'cyan',   from: 'from-cyan-500',   to: 'to-cyan-700',   icon: Droplets },
  'ท่าเรือ':        { color: 'sky',    from: 'from-sky-500',    to: 'to-sky-700',    icon: Ship },
  'ระบบระบายน้ำ':  { color: 'indigo', from: 'from-indigo-500', to: 'to-indigo-700', icon: Droplets },
}

export const revalidate = 60

export default async function ProjectsPage() {
  const { data: projectsRaw } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('year', { ascending: false })
  const projects = projectsRaw as Project[] | null

  const typeCount: Record<string, number> = {}
  projects?.forEach((p) => {
    if (p.project_type) typeCount[p.project_type] = (typeCount[p.project_type] ?? 0) + 1
  })
  const provinces = [...new Set(projects?.map((p) => p.province).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-16 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">TRIPIRA — ผลงานของเรา</span>
          <h1 className="text-4xl font-bold mb-3">โครงการทั้งหมด</h1>
          <p className="text-blue-100 text-lg">ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย</p>
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{projects?.length ?? 0}</p>
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

      <div className="flex-1 pt-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => {
            const cfg = TYPE_CONFIG[project.project_type ?? ''] ?? { from: 'from-blue-600', to: 'to-blue-800', icon: MapPin }
            const Icon = cfg.icon
            const coverUrl = getProjectCoverImage(project.images)
            const gradient = getTypeGradient(project.project_type)
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Cover image */}
                <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Icon size={44} className="text-white/25" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {project.year && (
                    <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                      {project.year}
                    </span>
                  )}
                  {project.project_type && (
                    <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/20">
                      {project.project_type}
                    </span>
                  )}
                  {project.images && project.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      +{project.images.length - 1} รูป
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 text-[15px]">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      {project.province && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {project.province}
                        </span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {project.year}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                      ดูเพิ่มเติม <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <MapPin size={36} className="text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ยังไม่มีโครงการในระบบ</h3>
            <p className="text-sm text-gray-400">โครงการจะแสดงที่นี่เมื่อมีข้อมูลในฐานข้อมูล</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
