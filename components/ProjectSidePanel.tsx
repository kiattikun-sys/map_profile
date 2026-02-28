'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Calendar, Tag, ExternalLink,
  ChevronLeft, ChevronRight, Layers, Eye, EyeOff, Box,
} from 'lucide-react'
import type { Project } from '@/types/database'
import { getProjectCoverImage, getProjectImageUrl, getTypeGradient } from '@/lib/project-utils'
import { supabase } from '@/lib/supabase'

interface ProjectModel {
  project_id: string
  model_path: string
  anchor_lng: number
  anchor_lat: number
  altitude_m: number
  rotation_z_deg: number
  scale: number
}

interface ActiveLayers {
  overlay: boolean
}

interface Props {
  project: Project | null
  open: boolean
  onClose: () => void
  activeLayers: ActiveLayers
  onToggleOverlay: (v: boolean) => void
  overlayOpacity: number
  onOpacityChange: (v: number) => void
  onView3D?: (model: ProjectModel) => void
}

export default function ProjectSidePanel({
  project,
  open,
  onClose,
  activeLayers,
  onToggleOverlay,
  overlayOpacity,
  onOpacityChange,
  onView3D,
}: Props) {
  const [imgIndex, setImgIndex] = useState(0)
  const [projectModel, setProjectModel] = useState<ProjectModel | null>(null)
  const [modelLoading, setModelLoading] = useState(false)

  // reset image index when project changes
  useEffect(() => { setImgIndex(0) }, [project?.id])

  // fetch project_models record when project changes
  useEffect(() => {
    if (!project?.id) { setProjectModel(null); return }
    setModelLoading(true)
    supabase
      .from('project_models')
      .select('*')
      .eq('project_id', project.id)
      .maybeSingle()
      .then(({ data }) => {
        setProjectModel(data as ProjectModel | null)
        setModelLoading(false)
      })
  }, [project?.id])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const hasOverlay = !!(project?.overlay_image && project?.overlay_bounds)
  const images = project?.images ?? []
  const coverUrl = getProjectCoverImage(images)
  const gradient = getTypeGradient(project?.project_type ?? null)

  return (
    <AnimatePresence>
      {open && project && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="side-panel"
            className={[
              'fixed z-40 flex flex-col overflow-hidden',
              // Desktop: left panel — starts below Navbar (60px)
              'md:top-[60px] md:left-0 md:bottom-0 md:w-[440px]',
              // Mobile: bottom sheet
              'bottom-0 left-0 right-0 md:right-auto max-h-[82vh] md:max-h-none rounded-t-2xl md:rounded-none',
            ].join(' ')}
            initial={{ x: 'var(--panel-x, -100%)', y: 'var(--panel-y, 0%)' }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 'var(--panel-x, -100%)', y: 'var(--panel-y, 0%)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={
              {
                '--panel-x': '-100%',
                '--panel-y': '0%',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-xl)',
                borderRight: '1px solid var(--border)',
              } as React.CSSProperties
            }
          >
            {/* Cover image */}
            <div className={`relative flex-shrink-0 h-52 md:h-56 bg-gradient-to-br ${gradient} overflow-hidden`}>
              {coverUrl ? (
                <img
                  key={`${project.id}-${imgIndex}`}
                  src={imgIndex === 0 ? coverUrl : getProjectImageUrl(images[imgIndex])}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <MapPin size={48} className="text-white/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Type badge */}
              {project.project_type && (
                <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full font-semibold">
                  {project.project_type}
                </span>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="ปิด"
              >
                <X size={15} strokeWidth={2.5} />
              </button>

              {/* Image nav */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Image count */}
              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {imgIndex + 1}/{images.length}
                </span>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Project info */}
              <div className="p-5 pb-3">
                <h2 className="font-bold text-[18px] leading-snug tracking-[-0.02em] mb-3" style={{ color: 'var(--foreground)' }}>
                  {project.name}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.project_type && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                      <Tag size={9} strokeWidth={2} /> {project.project_type}
                    </span>
                  )}
                  {project.province && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-700)', border: '1px solid var(--border)' }}>
                      <MapPin size={9} strokeWidth={2} /> {project.province}
                    </span>
                  )}
                  {project.year && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--neutral-200)', color: 'var(--neutral-700)', border: '1px solid var(--border)' }}>
                      <Calendar size={9} strokeWidth={2} /> {project.year}
                    </span>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-[13px] leading-relaxed line-clamp-3 mb-4" style={{ color: 'var(--muted)' }}>
                    {project.description}
                  </p>
                )}

                {/* CTA */}
                <a
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-white text-[13px] font-semibold rounded-xl transition-all duration-200"
                  style={{ background: 'var(--gold)', boxShadow: '0 2px 10px rgba(179,155,124,0.35)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--gold-dark)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--gold)' }}
                >
                  ดูรายละเอียดเต็มหน้า <ExternalLink size={13} strokeWidth={2.5} />
                </a>
              </div>

              {/* Divider */}
              <div className="mx-5" style={{ borderTop: '1px solid var(--border)' }} />

              {/* Layer Control Section */}
              <div className="p-5 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} style={{ color: 'var(--gold)' }} strokeWidth={2} />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--muted)' }}>
                    ชั้นข้อมูลโครงการ
                  </h3>
                </div>

                {/* 3D Model button */}
                <div
                  className="rounded-xl p-3.5 mb-3 transition-all duration-200"
                  style={{
                    background: projectModel ? 'var(--gold-bg)' : 'rgba(30,30,30,0.03)',
                    border: projectModel ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: projectModel ? 'var(--gold-bg)' : 'var(--neutral-200)', border: '1px solid var(--border)' }}
                      >
                        <Box size={14} style={{ color: projectModel ? 'var(--gold)' : 'var(--neutral-400)' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold leading-none" style={{ color: projectModel ? 'var(--foreground)' : 'var(--neutral-400)' }}>โมเดล 3D</p>
                        {!projectModel && !modelLoading && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--neutral-400)' }}>ยังไม่มีโมเดล</p>
                        )}
                        {modelLoading && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--neutral-400)' }}>กำลังตรวจสอบ...</p>
                        )}
                      </div>
                    </div>
                    <button
                      disabled={!projectModel || modelLoading}
                      onClick={() => projectModel && onView3D?.(projectModel)}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
                      style={projectModel && !modelLoading
                        ? { background: 'var(--gold)', color: '#fff', boxShadow: '0 2px 6px rgba(179,155,124,0.35)' }
                        : { background: 'var(--neutral-200)', color: 'var(--neutral-400)', cursor: 'not-allowed' }
                      }
                    >
                      View 3D
                    </button>
                  </div>
                </div>

                {/* Overlay toggle row */}
                <div
                  className="rounded-xl p-3.5 transition-all duration-200"
                  style={{
                    background: 'rgba(30,30,30,0.03)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: activeLayers.overlay && hasOverlay ? 'var(--gold-bg)' : 'var(--neutral-200)', border: '1px solid var(--border)' }}
                      >
                        {activeLayers.overlay && hasOverlay
                          ? <Eye size={14} style={{ color: 'var(--gold)' }} />
                          : <EyeOff size={14} style={{ color: 'var(--neutral-400)' }} />
                        }
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold leading-none" style={{ color: hasOverlay ? 'var(--foreground)' : 'var(--neutral-400)' }}>
                          ผังโครงการ
                        </p>
                        {!hasOverlay && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--neutral-400)' }}>ไม่มีผังโครงการ</p>
                        )}
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <button
                      disabled={!hasOverlay}
                      onClick={() => onToggleOverlay(!activeLayers.overlay)}
                      className="relative rounded-full transition-colors duration-200 flex-shrink-0"
                      style={{
                        height: '22px',
                        width: '40px',
                        background: !hasOverlay
                          ? 'var(--neutral-300)'
                          : activeLayers.overlay
                            ? 'var(--gold)'
                            : 'var(--neutral-300)',
                        cursor: !hasOverlay ? 'not-allowed' : 'pointer',
                      }}
                      aria-label="toggle overlay"
                    >
                      <span
                        className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          activeLayers.overlay && hasOverlay ? 'translate-x-[18px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Opacity slider — only when overlay is enabled and has overlay */}
                  {hasOverlay && activeLayers.overlay && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>ความโปร่งใส</span>
                        <span className="text-[11px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>
                          {Math.round(overlayOpacity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.05}
                        max={1}
                        step={0.01}
                        value={overlayOpacity}
                        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded-full cursor-pointer"
                        style={{ accentColor: 'var(--gold)' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
