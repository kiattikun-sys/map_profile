'use client'

import { MapPin, Calendar, Tag, ChevronRight } from 'lucide-react'
import { getProjectCoverImage } from '@/lib/project-utils'

interface Project {
  id: string
  name: string
  project_type: string | null
  province: string | null
  year: number | null
  status: string | null
  images: string[] | null
  description: string | null
}

interface Props {
  project: Project
  onClick: () => void
}

export default function ClientProjectCard({ project, onClick }: Props) {
  const coverUrl = getProjectCoverImage(project.images ?? [])

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl overflow-hidden transition-all duration-200 group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Cover */}
      <div className="relative h-36 overflow-hidden" style={{ background: 'var(--neutral-200)' }}>
        {coverUrl ? (
          <img src={coverUrl} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={28} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
          </div>
        )}
        {project.status === 'active' && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(179,155,124,0.9)', color: '#fff' }}>
            Active
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[14px] leading-snug line-clamp-2" style={{ color: 'var(--foreground)' }}>
            {project.name}
          </h3>
          <ChevronRight size={16} className="flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--gold)' }} />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {project.project_type && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
              <Tag size={9} strokeWidth={2} /> {project.project_type}
            </span>
          )}
          {project.province && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: 'var(--neutral-200)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              <MapPin size={9} strokeWidth={2} /> {project.province}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: 'var(--neutral-200)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              <Calendar size={9} strokeWidth={2} /> {project.year}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
