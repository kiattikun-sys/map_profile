'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Calendar, Tag, ExternalLink,
  ChevronLeft, ChevronRight, Layers, Eye, EyeOff,
} from 'lucide-react'
import type { Project } from '@/types/database'
import { getProjectCoverImage, getProjectImageUrl, getTypeGradient } from '@/lib/project-utils'

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
}

export default function ProjectSidePanel({
  project,
  open,
  onClose,
  activeLayers,
  onToggleOverlay,
  overlayOpacity,
  onOpacityChange,
}: Props) {
  const [imgIndex, setImgIndex] = useState(0)

  // reset image index when project changes
  useEffect(() => { setImgIndex(0) }, [project?.id])

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
              'fixed z-40 bg-white shadow-2xl flex flex-col overflow-hidden',
              // Desktop: left panel
              'md:top-0 md:left-0 md:bottom-0 md:w-[440px]',
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
                <h2 className="font-bold text-slate-900 text-[17px] leading-snug tracking-[-0.01em] mb-3">
                  {project.name}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.project_type && (
                    <span className="flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                      <Tag size={9} strokeWidth={2} /> {project.project_type}
                    </span>
                  )}
                  {project.province && (
                    <span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <MapPin size={9} strokeWidth={2} /> {project.province}
                    </span>
                  )}
                  {project.year && (
                    <span className="flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                      <Calendar size={9} strokeWidth={2} /> {project.year}
                    </span>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {project.description}
                  </p>
                )}

                {/* CTA */}
                <a
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-[13px] font-semibold rounded-xl transition-colors duration-200"
                  style={{ boxShadow: '0 2px 8px rgba(30,58,138,0.25)' }}
                >
                  ดูรายละเอียดเต็มหน้า <ExternalLink size={13} strokeWidth={2.5} />
                </a>
              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-slate-100" />

              {/* Layer Control Section */}
              <div className="p-5 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-slate-400" strokeWidth={2} />
                  <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-[0.08em]">
                    ชั้นข้อมูลโครงการ
                  </h3>
                </div>

                {/* Overlay toggle row */}
                <div className={`rounded-xl border p-3.5 transition-colors ${
                  hasOverlay ? 'border-slate-200 bg-slate-50/60' : 'border-slate-100 bg-slate-50/30'
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        hasOverlay
                          ? activeLayers.overlay ? 'bg-purple-100' : 'bg-slate-100'
                          : 'bg-slate-100'
                      }`}>
                        {activeLayers.overlay && hasOverlay
                          ? <Eye size={14} className="text-purple-600" />
                          : <EyeOff size={14} className="text-slate-400" />
                        }
                      </div>
                      <div>
                        <p className={`text-[13px] font-semibold leading-none ${hasOverlay ? 'text-slate-800' : 'text-slate-400'}`}>
                          ผังโครงการ
                        </p>
                        {!hasOverlay && (
                          <p className="text-[11px] text-slate-400 mt-0.5">ไม่มีผังโครงการ</p>
                        )}
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <button
                      disabled={!hasOverlay}
                      onClick={() => onToggleOverlay(!activeLayers.overlay)}
                      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${
                        !hasOverlay
                          ? 'bg-slate-200 cursor-not-allowed'
                          : activeLayers.overlay
                            ? 'bg-purple-500'
                            : 'bg-slate-300'
                      }`}
                      style={{ height: '22px', width: '40px' }}
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
                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-slate-500">ความโปร่งใส</span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700">
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
                        className="w-full h-1.5 rounded-full accent-purple-600 cursor-pointer"
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
