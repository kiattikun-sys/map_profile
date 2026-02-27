'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { Project, FilterState } from '@/types/database'
import ProjectCard from './ProjectCard'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const SOURCE_ID = 'projects'
const LAYER_CLUSTERS = 'clusters'
const LAYER_CLUSTER_COUNT = 'cluster-count'
const LAYER_UNCLUSTERED = 'unclustered-point'

interface MapViewProps {
  projects: Project[]
  filters: FilterState
}

export default function MapView({ projects, filters }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const projectsRef = useRef<Project[]>(projects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const filteredProjects = projects.filter((p) => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.projectType && p.project_type !== filters.projectType) return false
    if (filters.province && p.province !== filters.province) return false
    if (filters.year && String(p.year) !== filters.year) return false
    if (filters.clientId && p.client_id !== filters.clientId) return false
    return true
  })

  projectsRef.current = projects

  const buildGeoJSON = useCallback((list: Project[]): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: list.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
      properties: {
        id: p.id,
        name: p.name,
        project_type: p.project_type ?? '',
        province: p.province ?? '',
        year: p.year ?? '',
        client_id: p.client_id ?? '',
      },
    })),
  }), [])

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
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
      })

      map.addLayer({
        id: LAYER_CLUSTERS,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step', ['get', 'point_count'],
            '#60a5fa', 5,
            '#3b82f6', 15,
            '#1d4ed8',
          ],
          'circle-radius': [
            'step', ['get', 'point_count'],
            20, 5,
            28, 15,
            36,
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: { 'text-color': '#ffffff' },
      })

      map.addLayer({
        id: LAYER_UNCLUSTERED,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#1a56db',
          'circle-radius': 10,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.on('click', LAYER_CLUSTERS, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTERS] })
        if (!features.length) return
        const clusterId = features[0].properties?.cluster_id
        const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          const geometry = features[0].geometry as GeoJSON.Point
          map.easeTo({ center: geometry.coordinates as [number, number], zoom })
        })
      })

      map.on('click', LAYER_UNCLUSTERED, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_UNCLUSTERED] })
        if (!features.length) return
        const props = features[0].properties
        const project = projectsRef.current.find((p) => p.id === props?.id)
        if (!project) return
        setSelectedProject(project)
        const geometry = features[0].geometry as GeoJSON.Point
        map.flyTo({
          center: geometry.coordinates as [number, number],
          zoom: Math.max(map.getZoom(), 10),
          duration: 800,
        })
      })

      map.on('mouseenter', LAYER_CLUSTERS, () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', LAYER_CLUSTERS, () => { map.getCanvas().style.cursor = '' })
      map.on('mouseenter', LAYER_UNCLUSTERED, () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', LAYER_UNCLUSTERED, () => { map.getCanvas().style.cursor = '' })

      setMapLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return
    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (!source) return
    source.setData(buildGeoJSON(filteredProjects))
    setSelectedProject(null)
  }, [mapLoaded, filteredProjects, buildGeoJSON])

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
