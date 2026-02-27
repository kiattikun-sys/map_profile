'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Project, Client, FilterState } from '@/types/database'
import { supabase } from '@/lib/supabase'
import FilterPanel from './FilterPanel'
import Navbar from './Navbar'
import { Loader2 } from 'lucide-react'

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

  const filteredProjects = projects.filter((p) => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.projectType && p.project_type !== filters.projectType) return false
    if (filters.province && p.province !== filters.province) return false
    if (filters.year && String(p.year) !== filters.year) return false
    if (filters.clientId && p.client_id !== filters.clientId) return false
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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        <div className="absolute top-20 left-4 z-20 hidden md:block">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            projectCount={filteredProjects.length}
            clients={clients}
          />
        </div>

        <div className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-3" size={36} />
                <p className="text-gray-500 text-sm">กำลังโหลดข้อมูลโครงการ...</p>
              </div>
            </div>
          ) : (
            <MapView projects={projects} filters={filters} />
          )}
        </div>

        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            projectCount={filteredProjects.length}
            clients={clients}
          />
        </div>
      </div>
    </div>
  )
}
