'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Project, Client, FilterState } from '@/types/database'
import { supabase } from '@/lib/supabase'
import FilterPanel from './FilterPanel'
import Navbar from './Navbar'
import { Loader2, Layers, MapPin } from 'lucide-react'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  ),
})

export default function MapPageClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Filter panel — desktop */}
        <div className="absolute top-20 left-4 z-20 hidden md:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            projectCount={filteredProjects.length}
            clients={clients}
          />
        </div>

        {/* Floating stats pill — top right */}
        {!loading && (
          <div className="absolute top-[4.75rem] right-4 z-20 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-2 shadow-md text-xs">
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

        <div className="flex-1 relative">
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
            <MapView projects={projects} filters={activeFilters} />
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
