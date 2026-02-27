import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react'

export const revalidate = 60

export default async function ProjectsPage() {
  const { data: projectsRaw } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('year', { ascending: false })
  const projects = projectsRaw as Project[] | null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">โครงการทั้งหมด</h1>
          <p className="text-gray-500 mt-2">ผลงานของเราทั่วประเทศไทย ({projects?.length ?? 0} โครงการ)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group border border-gray-100"
            >
              <div className="h-40 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${project.images[0]}`}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <MapPin size={32} className="text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {project.year && (
                  <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {project.year}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.project_type && (
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      <Tag size={10} /> {project.project_type}
                    </span>
                  )}
                  {project.province && (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      <MapPin size={10} /> {project.province}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {project.year ?? 'N/A'}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                    ดูรายละเอียด <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-20 text-gray-400">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">ยังไม่มีโครงการในระบบ</p>
          </div>
        )}
      </div>
    </div>
  )
}
