'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Project, Client, FilterState } from '@/types/database'
import { supabase } from '@/lib/supabase'
import FilterPanel from './FilterPanel'
import Navbar from './Navbar'
import ProjectSidePanel from './ProjectSidePanel'
import { Loader2, Layers, MapPin, Building2, ChevronRight, X } from 'lucide-react'
import type { HomepageBanner } from '@/lib/site-content'
import { getSiteAssetUrl } from '@/lib/site-content'
import type { MapViewHandle } from './MapView'

// dynamic with ssr:false but we need forwardRef — use a named export wrapper
const MapView = dynamic(
  () => import('./MapView').then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    ),
  }
) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof import('./MapView')['default']> &
  React.RefAttributes<MapViewHandle>
>

interface Props {
  banner?: HomepageBanner
}

export default function MapPageClient({ banner }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [heroDismissed, setHeroDismissed] = useState(false)

  // Side panel + overlay state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeLayers, setActiveLayers] = useState({ overlay: false })
  const [overlayOpacity, setOverlayOpacity] = useState(0.7)
  const mapViewRef = useRef<MapViewHandle>(null)

  const handleSelectProject = useCallback((project: Project) => {
    // Cleanup overlay for previous project if different
    if (selectedProject && selectedProject.id !== project.id) {
      mapViewRef.current?.cleanupOverlay(selectedProject.id)
    }
    const hasOverlay = !!(project.overlay_image && project.overlay_bounds)
    setSelectedProject(project)
    setPanelOpen(true)
    setActiveLayers({ overlay: hasOverlay })
    setOverlayOpacity(0.7)
  }, [selectedProject])

  const handleClosePanel = useCallback(() => {
    if (selectedProject) {
      mapViewRef.current?.cleanupOverlay(selectedProject.id)
    }
    setPanelOpen(false)
    setSelectedProject(null)
    setActiveLayers({ overlay: false })
  }, [selectedProject])

  // Resize map after panel animation (300ms)
  useEffect(() => {
    const t = setTimeout(() => mapViewRef.current?.resize(), 320)
    return () => clearTimeout(t)
  }, [panelOpen])

  const searchParams = useSearchParams()
  const flyTo = useMemo(() => {
    const lat  = parseFloat(searchParams.get('lat')  ?? '')
    const lng  = parseFloat(searchParams.get('lng')  ?? '')
    const zoom = parseFloat(searchParams.get('zoom') ?? '14')
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng, zoom }
    return null
  }, [searchParams])

  const bannerEnabled   = banner?.enabled ?? true
  const bannerHeadline  = banner?.headline ?? 'ออกแบบภูมิสถาปัตยกรรมและวิศวกรรมระดับชาติ'
  const bannerMessage   = banner?.message  ?? 'แผนที่โครงการ — TRIPIRA'
  const bannerCtaLabel  = banner?.cta_label ?? 'เกี่ยวกับเรา'
  const bannerCtaHref   = banner?.cta_href  ?? '/about'
  const bannerBgUrl     = getSiteAssetUrl(banner?.background_image_path ?? null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    projectType: '',
    province: '',
    year: '',
    clientId: '',
  })
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 300)
    return () => clearTimeout(t)
  }, [filters.search])

  const activeFilters = { ...filters, search: debouncedSearch }

  const filteredProjects = projects.filter((p) => {
    if (debouncedSearch && !p.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false
    if (activeFilters.projectType && p.project_type !== activeFilters.projectType) return false
    if (activeFilters.province && p.province !== activeFilters.province) return false
    if (activeFilters.year && String(p.year) !== activeFilters.year) return false
    if (activeFilters.clientId && p.client_id !== activeFilters.clientId) return false
    return true
  })

  useEffect(() => {
    async function load() {
      const [{ data: projectData }, { data: clientData }] = await Promise.all([
        supabase.from('projects').select('*').eq('status', 'active'),
        supabase.from('clients').select('*').order('name'),
      ])
      setProjects((projectData as Project[]) ?? [])
      setClients((clientData as Client[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const typeCount = projects.reduce<Record<string, number>>((acc, p) => {
    if (p.project_type) acc[p.project_type] = (acc[p.project_type] ?? 0) + 1
    return acc
  }, {})
  const provinceCount = new Set(projects.map((p) => p.province).filter(Boolean)).size

  const HERO_H = heroDismissed ? 0 : 80

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {/* Homepage hero banner — CMS controlled */}
      {!heroDismissed && bannerEnabled && (
        <div
          className="relative overflow-hidden text-white flex items-center shrink-0"
          style={{
            paddingTop: '60px',
            height: `${60 + HERO_H}px`,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e40af 100%)',
          }}
        >
          {/* Background image layer */}
          {bannerBgUrl && (
            <img
              src={bannerBgUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.18 }}
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.88) 0%, rgba(29,78,216,0.80) 100%)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
            {/* Left: brand + tagline */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-[10px] font-semibold tracking-[0.15em] text-blue-300 uppercase">{bannerMessage}</span>
                <span className="text-[15px] font-bold tracking-[-0.01em] text-white leading-tight">{bannerHeadline}</span>
              </div>
            </div>

            {/* Center: quick stats */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { icon: Building2, val: `${projects.length || '200'}+`, label: 'โครงการ' },
                { icon: MapPin,    val: `${new Set(projects.map(p=>p.province).filter(Boolean)).size || '30'}+`, label: 'จังหวัด' },
                { icon: Layers,   val: '1,500M+', label: 'มูลค่างาน' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                    <s.icon size={13} className="text-blue-200" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black leading-none text-white tracking-[-0.02em]">{s.val}</p>
                    <p className="text-[10px] text-blue-300 mt-0.5 leading-none">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: CTA + dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={bannerCtaHref}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 border border-white/25 text-white text-[12px] font-semibold rounded-lg hover:bg-white/25 transition-colors duration-150"
              >
                {bannerCtaLabel} <ChevronRight size={12} strokeWidth={2.5} />
              </a>
              <button
                onClick={() => setHeroDismissed(true)}
                className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-150"
                aria-label="ปิด"
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Filter panel — desktop */}
        <div className="absolute left-4 z-20 hidden md:block" style={{ top: (!heroDismissed && bannerEnabled) ? `${60 + 80 + 8}px` : '76px' }}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            projectCount={filteredProjects.length}
            clients={clients}
          />
        </div>

        {/* Floating stats pill — top right */}
        {!loading && (
          <div className="absolute right-4 z-20 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-4 py-2 text-xs" style={{ top: (!heroDismissed && bannerEnabled) ? `${60 + 80 + 8}px` : '76px', boxShadow: 'var(--shadow-md)' }}>
            <span className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Layers size={13} className="text-blue-600" />
              <span className="text-blue-700 font-bold">{filteredProjects.length}</span>
              <span>/ {projects.length} โครงการ</span>
            </span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5 text-gray-600">
              <MapPin size={12} className="text-emerald-600" />
              <span className="font-medium">{provinceCount}</span> จังหวัด
            </span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-gray-500">{Object.keys(typeCount).length} ประเภท</span>
          </div>
        )}

        {/* Side panel — desktop left slide-in, mobile bottom sheet */}
        <ProjectSidePanel
          project={selectedProject}
          open={panelOpen}
          onClose={handleClosePanel}
          activeLayers={activeLayers}
          onToggleOverlay={(v) => setActiveLayers((l) => ({ ...l, overlay: v }))}
          overlayOpacity={overlayOpacity}
          onOpacityChange={setOverlayOpacity}
        />

        <div className={`flex-1 relative transition-all duration-300 ${panelOpen ? 'md:ml-[440px]' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="animate-spin text-blue-600" size={28} />
                </div>
                <p className="text-gray-600 text-sm font-medium">กำลังโหลดข้อมูลโครงการ...</p>
                <p className="text-gray-400 text-xs mt-1">TRIPIRA Map Profile</p>
              </div>
            </div>
          ) : (
            <MapView
              ref={mapViewRef}
              projects={projects}
              filters={activeFilters}
              flyTo={flyTo}
              onSelectProject={handleSelectProject}
              selectedProjectId={selectedProject?.id ?? null}
              overlayVisible={activeLayers.overlay}
              overlayOpacity={overlayOpacity}
              overlayProject={selectedProject}
            />
          )}
        </div>

        {/* Mobile filter — bottom sheet */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <div className="p-3 overflow-x-auto">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              projectCount={filteredProjects.length}
              clients={clients}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
