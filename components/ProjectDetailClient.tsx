'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Project } from '@/types/database'
import { MapPin, Calendar, Tag, FileText, ArrowLeft, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const MiniMap = dynamic(() => import('./MiniMap'), { ssr: false })

interface ProjectDetailClientProps {
  project: Project & { clients?: { name: string; logo: string | null; website: string | null } | null }
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const [overlayOpacity, setOverlayOpacity] = useState(75)
  const [showOverlay, setShowOverlay] = useState(true)

  const images = project.images ?? []

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('project-images').getPublicUrl(path)
    return data.publicUrl
  }

  const getDocUrl = (path: string) => {
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('project-documents').getPublicUrl(path)
    return data.publicUrl
  }

  const getDocName = (path: string) => {
    return path.split('/').pop() ?? path
  }

  return (
    <div className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={16} /> กลับไปหน้าโครงการทั้งหมด
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {images.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video">
              <img
                src={getImageUrl(images[imgIndex])}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                {imgIndex + 1} / {images.length}
              </span>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 aspect-video flex items-center justify-center">
              <MapPin size={48} className="text-white/30" />
            </div>
          )}

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === imgIndex ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{project.name}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.project_type && (
                <span className="flex items-center gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Tag size={13} /> {project.project_type}
                </span>
              )}
              {project.province && (
                <span className="flex items-center gap-1.5 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <MapPin size={13} /> {project.province}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1.5 text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  <Calendar size={13} /> {project.year}
                </span>
              )}
            </div>

            {project.description && (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p>{project.description}</p>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {project.documents && project.documents.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> เอกสารโครงการ
              </h2>
              <div className="space-y-2">
                {project.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={getDocUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-blue-700 truncate">
                      {getDocName(doc)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" /> ตำแหน่งโครงการ
              </h2>
            </div>
            <div className="h-56">
              <MiniMap
                latitude={project.latitude}
                longitude={project.longitude}
                projectName={project.name}
                overlayImage={project.overlay_image}
                overlayBounds={project.overlay_bounds}
                overlayOpacity={showOverlay ? overlayOpacity / 100 : 0}
              />
            </div>
            {project.overlay_image && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Layers size={14} className="text-purple-600" /> Layout Plan
                  </span>
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      showOverlay
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {showOverlay ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                  </button>
                </div>
                {showOverlay && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ความโปร่งใส</span>
                      <span>{overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-semibold text-gray-900">ข้อมูลโครงการ</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ประเภทงาน</span>
                <span className="font-medium text-gray-800">{project.project_type ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">จังหวัด</span>
                <span className="font-medium text-gray-800">{project.province ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ปี</span>
                <span className="font-medium text-gray-800">{project.year ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">พิกัด</span>
                <span className="font-medium text-gray-800 text-xs">
                  {project.latitude.toFixed(5)}, {project.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {project.clients && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">ลูกค้า</h2>
              <div className="flex items-center gap-3">
                {project.clients.logo && (
                  <img
                    src={project.clients.logo}
                    alt={project.clients.name}
                    className="w-10 h-10 object-contain rounded-lg border border-gray-100"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800">{project.clients.name}</p>
                  {project.clients.website && (
                    <a
                      href={project.clients.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {project.clients.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="block w-full text-center py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors font-medium text-sm"
          >
            ดูบนแผนที่ →
          </Link>
        </div>
      </div>
    </div>
  )
}
