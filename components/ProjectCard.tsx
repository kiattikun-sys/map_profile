'use client'

import { Project } from '@/types/database'
import { MapPin, Calendar, Tag, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProjectCardProps {
  project: Project
  onClose?: () => void
}

export default function ProjectCard({ project, onClose }: ProjectCardProps) {
  const [imgIndex, setImgIndex] = useState(0)
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

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
      {images.length > 0 ? (
        <div className="relative h-48 bg-gray-100">
          <img
            src={getImageUrl(images[imgIndex])}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center relative">
          <MapPin size={32} className="text-white/60" />
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-black/30 text-white rounded-full p-1.5 hover:bg-black/50"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.project_type && (
            <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              <Tag size={11} /> {project.project_type}
            </span>
          )}
          {project.province && (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <MapPin size={11} /> {project.province}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              <Calendar size={11} /> {project.year}
            </span>
          )}
        </div>

        {project.documents && project.documents.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">เอกสาร</p>
            <div className="space-y-1">
              {project.documents.slice(0, 3).map((doc, i) => (
                <a
                  key={i}
                  href={getDocUrl(doc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <FileText size={12} />
                  <span className="truncate">{doc.split('/').pop()}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <a
          href={`/projects/${project.id}`}
          className="block w-full text-center text-sm bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          ดูรายละเอียดเพิ่มเติม →
        </a>
      </div>
    </div>
  )
}
