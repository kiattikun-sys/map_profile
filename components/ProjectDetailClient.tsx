'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/types/database'
import { getProjectCoverImage, getTypeGradient, getProjectImageUrl, getProjectDocUrl } from '@/lib/project-utils'
import { MapPin, Calendar, Tag, FileText, ArrowLeft, ChevronLeft, ChevronRight, Layers, X, ExternalLink, Phone, ZoomIn, Copy, Check } from 'lucide-react'
import Link from 'next/link'

const MiniMap = dynamic(() => import('./MiniMap'), { ssr: false })

type RelatedProject = Pick<Project, 'id' | 'name' | 'images' | 'province' | 'year' | 'project_type'>

interface ProjectDetailClientProps {
  project: Project & { clients?: { name: string; logo: string | null; website: string | null } | null }
  related?: RelatedProject[]
}

export default function ProjectDetailClient({ project, related = [] }: ProjectDetailClientProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [overlayOpacity, setOverlayOpacity] = useState(75)
  const [showOverlay, setShowOverlay] = useState(true)
  const [copied, setCopied] = useState(false)

  const images = project.images ?? []
  const gradient = getTypeGradient(project.project_type)

  const getDocName = (path: string) => path.split('/').pop() ?? path

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true) }

  const copyCoords = () => {
    navigator.clipboard.writeText(`${project.latitude.toFixed(6)}, ${project.longitude.toFixed(6)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2 z-10"
            >
              <X size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + images.length) % images.length) }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={getProjectImageUrl(images[lightboxIdx])}
              alt={project.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % images.length) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3 z-10"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            กลับไปหน้าโครงการทั้งหมด
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main image */}
            {images.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video group">
                <img
                  src={getProjectImageUrl(images[imgIndex])}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* zoom */}
                <button
                  onClick={() => openLightbox(imgIndex)}
                  className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ZoomIn size={16} />
                </button>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === imgIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {imgIndex + 1} / {images.length}
                </span>
              </div>
            ) : (
              <div className={`rounded-2xl bg-gradient-to-br ${gradient} aspect-video flex items-center justify-center`}>
                <MapPin size={48} className="text-white/30" />
              </div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    onDoubleClick={() => openLightbox(i)}
                    className={`flex-shrink-0 w-18 h-16 rounded-xl overflow-hidden border-2 transition-all hover:opacity-100 ${
                      i === imgIndex ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60'
                    }`}
                    style={{ width: 72 }}
                  >
                    <img src={getProjectImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title + description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{project.name}</h1>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.project_type && (
                  <span className="flex items-center gap-1.5 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    <Tag size={13} /> {project.project_type}
                  </span>
                )}
                {project.province && (
                  <span className="flex items-center gap-1.5 text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
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
                <p className="text-gray-700 leading-relaxed text-[15px]">{project.description}</p>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-gray-50">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" /> เอกสารโครงการ
                </h2>
                <div className="space-y-2">
                  {project.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={getProjectDocUrl(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 truncate flex-1">{getDocName(doc)}</span>
                      <ExternalLink size={13} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <MapPin size={15} className="text-blue-600" /> ตำแหน่งโครงการ
                </h2>
              </div>
              <div className="h-52">
                <MiniMap
                  latitude={project.latitude}
                  longitude={project.longitude}
                  projectName={project.name}
                  overlayImage={project.overlay_image}
                  overlayBounds={project.overlay_bounds}
                  overlayOpacity={showOverlay ? overlayOpacity / 100 : 0}
                />
              </div>
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={copyCoords}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors w-full"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  <span className="font-mono">{project.latitude.toFixed(5)}, {project.longitude.toFixed(5)}</span>
                  {copied && <span className="text-green-500 ml-auto">คัดลอกแล้ว</span>}
                </button>
              </div>
              {project.overlay_image && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <Layers size={13} className="text-purple-600" /> Layout Plan
                    </span>
                    <button
                      onClick={() => setShowOverlay(!showOverlay)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        showOverlay ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {showOverlay ? 'แสดง' : 'ซ่อน'}
                    </button>
                  </div>
                  {showOverlay && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>ความโปร่งใส</span>
                        <span>{overlayOpacity}%</span>
                      </div>
                      <input type="range" min={10} max={100} value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4 text-sm">ข้อมูลโครงการ</h2>
              <dl className="space-y-2.5 text-sm">
                {([
                  ['\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e07\u0e32\u0e19', project.project_type],
                  ['\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14', project.province],
                  ['\u0e1b\u0e35\u0e41\u0e25\u0e49\u0e27\u0e40\u0e2a\u0e23\u0e47\u0e08', project.year?.toString()],
                ] as [string, string | null | undefined][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <dt className="text-gray-500 shrink-0">{label}</dt>
                    <dd className="font-medium text-gray-800 text-right">{value ?? '\u2014'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Client */}
            {project.clients && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-3 text-sm">ลูกค้า</h2>
                <div className="flex items-center gap-3">
                  {project.clients.logo ? (
                    <img src={project.clients.logo} alt={project.clients.name}
                      className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-white p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">{project.clients.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm leading-snug">{project.clients.name}</p>
                    {project.clients.website && (
                      <a href={project.clients.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5 truncate"
                      >
                        <ExternalLink size={10} /> {project.clients.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-2">
              <a
                href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                <MapPin size={14} /> เปิดใน Google Maps
              </a>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                ดูบนแผนที่ →
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Phone size={14} /> ติดต่อเรา
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-5">โครงการที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => {
                const rCover = getProjectCoverImage(r.images)
                const rGrad = getTypeGradient(r.project_type)
                return (
                  <Link
                    key={r.id}
                    href={`/projects/${r.id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className={`h-36 bg-gradient-to-br ${rGrad} relative overflow-hidden`}>
                      {rCover ? (
                        <img src={rCover} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin size={32} className="text-white/25" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {r.project_type && (
                        <span className="absolute bottom-2 left-2 text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20 font-medium">
                          {r.project_type}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">{r.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        {r.province && <span className="flex items-center gap-1"><MapPin size={10} />{r.province}</span>}
                        {r.year && <span className="flex items-center gap-1"><Calendar size={10} />{r.year}</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
