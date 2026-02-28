'use client'

import { Project } from '@/types/database'
import { MapPin, Calendar, Tag, FileText, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { getProjectCoverImage, getProjectImageUrl, getProjectDocUrl, getTypeGradient } from '@/lib/project-utils'

interface ProjectCardProps {
  project: Project
  onClose?: () => void
}

export default function ProjectCard({ project, onClose }: ProjectCardProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.images ?? []
  const coverUrl = getProjectCoverImage(images)
  const gradient = getTypeGradient(project.project_type)

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
      {/* Image / Cover */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {coverUrl ? (
          <img
            src={imgIndex === 0 ? coverUrl : getProjectImageUrl(images[imgIndex])}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <MapPin size={36} className="text-white/40" />
          </div>
        )}

        {/* type badge */}
        {project.project_type && (
          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {project.project_type}
          </span>
        )}

        {/* image nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setImgIndex((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.province && (
            <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
              <MapPin size={10} /> {project.province}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
              <Calendar size={10} /> {project.year}
            </span>
          )}
          {project.documents && project.documents.length > 0 && (
            <span className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full">
              <FileText size={10} /> {project.documents.length} เอกสาร
            </span>
          )}
        </div>

        <a
          href={`/projects/${project.id}`}
          className="flex items-center justify-center gap-1.5 w-full text-center text-sm text-white py-2.5 rounded-xl active:scale-95 transition-all font-medium"
          style={{ background: 'var(--gold)', boxShadow: '0 2px 8px rgba(179,155,124,0.30)' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background='var(--gold-dark)'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background='var(--gold)'}
        >
          ดูรายละเอียด <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
