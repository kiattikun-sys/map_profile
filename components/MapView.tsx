'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Project, FilterState } from '@/types/database'
import ProjectCard from './ProjectCard'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const PROJECT_TYPE_COLORS: Record<string, string> = {
  'โยธา': '#3b82f6',
  'สาธารณูปโภค': '#10b981',
  'ถนน': '#f59e0b',
  'อาคาร': '#8b5cf6',
  'ไฟฟ้า': '#f97316',
  'ชลประทาน': '#06b6d4',
  'ท่าเรือ': '#0ea5e9',
  'ระบบระบายน้ำ': '#6366f1',
  'ภูมิสถาปัตย์': '#22c55e',
  'อื่นๆ': '#6b7280',
}

function getColor(type: string | null) {
  return PROJECT_TYPE_COLORS[type ?? ''] ?? '#1a56db'
}

function createMarkerEl(color: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'custom-marker'
  el.innerHTML = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24S32 28 32 16C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
    </svg>
  `
  return el
}

interface MapViewProps {
  projects: Project[]
  filters: FilterState
}

export default function MapView({ projects, filters }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [101.0, 13.0],
      zoom: 5.5,
      projection: 'mercator',
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    map.on('load', () => {
      setMapLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const filteredProjects = projects.filter((p) => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.projectType && p.project_type !== filters.projectType) return false
    if (filters.province && p.province !== filters.province) return false
    if (filters.year && String(p.year) !== filters.year) return false
    if (filters.clientId && p.client_id !== filters.clientId) return false
    return true
  })

  const placeMarkers = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }
    setSelectedProject(null)

    filteredProjects.forEach((project) => {
      const el = createMarkerEl(getColor(project.project_type))

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([project.longitude, project.latitude])
        .addTo(map)

      el.addEventListener('click', () => {
        setSelectedProject(project)
        map.flyTo({
          center: [project.longitude, project.latitude],
          zoom: Math.max(map.getZoom(), 10),
          duration: 800,
        })
      })

      markersRef.current.push(marker)
    })
  }, [filteredProjects])

  useEffect(() => {
    if (mapLoaded) {
      placeMarkers()
    }
  }, [mapLoaded, placeMarkers])

  const addOverlay = useCallback(() => {
    const map = mapRef.current
    if (!map || !selectedProject?.overlay_image || !selectedProject?.overlay_bounds) return

    const bounds = selectedProject.overlay_bounds as {
      topLeft: [number, number]
      topRight: [number, number]
      bottomRight: [number, number]
      bottomLeft: [number, number]
    }

    const sourceId = `overlay-${selectedProject.id}`
    const layerId = `overlay-layer-${selectedProject.id}`

    if (map.getLayer(layerId)) map.removeLayer(layerId)
    if (map.getSource(sourceId)) map.removeSource(sourceId)

    const imageUrl = selectedProject.overlay_image.startsWith('http')
      ? selectedProject.overlay_image
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/overlay-images/${selectedProject.overlay_image}`

    map.addSource(sourceId, {
      type: 'image',
      url: imageUrl,
      coordinates: [
        bounds.topLeft,
        bounds.topRight,
        bounds.bottomRight,
        bounds.bottomLeft,
      ],
    })

    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': 0.75 },
    })
  }, [selectedProject])

  useEffect(() => {
    if (mapLoaded && selectedProject?.overlay_image && selectedProject?.overlay_bounds) {
      addOverlay()
    }
  }, [mapLoaded, selectedProject, addOverlay])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {selectedProject && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
          <ProjectCard
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </div>
      )}

      <div className="absolute bottom-6 right-4 z-10 text-xs text-gray-400 bg-white/80 rounded px-2 py-1">
        {filteredProjects.length} โครงการ
      </div>
    </div>
  )
}
