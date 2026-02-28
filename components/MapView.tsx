'use client'

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { Project, FilterState } from '@/types/database'

const TYPE_COLOR_MATCH: mapboxgl.Expression = [
  'match', ['get', 'project_type'],
  'ภูมิสถาปัตย์',    '#22c55e',
  'สำรวจ',          '#14b8a6',
  'โยธา',           '#3b82f6',
  'อาคาร',          '#8b5cf6',
  'สาธารณูปโภค',    '#10b981',
  'ถนน',            '#f59e0b',
  'ไฟฟ้า',          '#f97316',
  'ชลประทาน',       '#06b6d4',
  'ท่าเรือ',         '#0ea5e9',
  'ระบบระบายน้ำ',   '#6366f1',
  '#1a56db',
]

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const SOURCE_ID = 'projects'
const LAYER_CLUSTERS = 'clusters'
const LAYER_CLUSTER_COUNT = 'cluster-count'
const LAYER_UNCLUSTERED = 'unclustered-point'
const LAYER_UNCLUSTERED_HOVER = 'unclustered-point-hover'

interface FlyToTarget {
  lat: number
  lng: number
  zoom: number
}

export interface MapViewHandle {
  cleanupOverlay: (projectId: string) => void
  resize: () => void
}

interface MapViewProps {
  projects: Project[]
  filters: FilterState
  flyTo?: FlyToTarget | null
  onSelectProject?: (project: Project) => void
  selectedProjectId?: string | null
  overlayVisible?: boolean
  overlayOpacity?: number
  overlayProject?: Project | null
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView(
  { projects, filters, flyTo, onSelectProject, selectedProjectId, overlayVisible, overlayOpacity = 0.7, overlayProject },
  ref
) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const projectsRef = useRef<Project[]>(projects)
  const [mapLoaded, setMapLoaded] = useState(false)
  const flyToHandled = useRef(false)
  const currentOverlayId = useRef<string | null>(null)

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
          'circle-color': TYPE_COLOR_MATCH,
          'circle-radius': 10,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.addLayer({
        id: LAYER_UNCLUSTERED_HOVER,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-color': TYPE_COLOR_MATCH,
          'circle-radius': 13,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85,
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
        onSelectProject?.(project)
        const geometry = features[0].geometry as GeoJSON.Point
        map.flyTo({
          center: geometry.coordinates as [number, number],
          zoom: Math.max(map.getZoom(), 10),
          duration: 800,
        })
      })

      map.on('mouseenter', LAYER_CLUSTERS, () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', LAYER_CLUSTERS, () => { map.getCanvas().style.cursor = '' })
      const tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
        className: 'map-tooltip',
      })

      map.on('mouseenter', LAYER_UNCLUSTERED, (e) => {
        map.getCanvas().style.cursor = 'pointer'
        const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_UNCLUSTERED] })
        if (!features.length) return
        const props = features[0].properties
        const geometry = features[0].geometry as GeoJSON.Point
        map.setFilter(LAYER_UNCLUSTERED_HOVER, ['==', ['get', 'id'], props?.id ?? ''])
        tooltip
          .setLngLat(geometry.coordinates as [number, number])
          .setHTML(`<span style="font-size:13px;font-weight:600;color:#1e293b">${props?.name ?? ''}</span>`)
          .addTo(map)
      })

      map.on('mouseleave', LAYER_UNCLUSTERED, () => {
        map.getCanvas().style.cursor = ''
        map.setFilter(LAYER_UNCLUSTERED_HOVER, ['==', ['get', 'id'], ''])
        tooltip.remove()
      })

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
  }, [mapLoaded, filteredProjects, buildGeoJSON])

  // Highlight selected marker
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return
    map.setFilter(LAYER_UNCLUSTERED_HOVER, ['==', ['get', 'id'], selectedProjectId ?? ''])
  }, [mapLoaded, selectedProjectId])

  // flyTo — zoom to project location when arriving from project detail page
  useEffect(() => {
    if (!mapLoaded || !flyTo || flyToHandled.current) return
    const map = mapRef.current
    if (!map) return
    flyToHandled.current = true
    map.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom,
      speed: 1.6,
      curve: 1.4,
      essential: true,
    })
  }, [mapLoaded, flyTo])

  // Helper: remove overlay for a given projectId
  const cleanupOverlay = useCallback((projectId: string) => {
    const map = mapRef.current
    if (!map) return
    const layerId = `project:${projectId}:overlay-layer`
    const sourceId = `project:${projectId}:overlay-source`
    if (map.getLayer(layerId)) map.removeLayer(layerId)
    if (map.getSource(sourceId)) map.removeSource(sourceId)
    if (currentOverlayId.current === projectId) currentOverlayId.current = null
  }, [])

  // Expose handle to parent
  useImperativeHandle(ref, () => ({
    cleanupOverlay,
    resize: () => mapRef.current?.resize(),
  }), [cleanupOverlay])

  // Overlay management — controlled by parent via overlayVisible + overlayProject
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return

    const project = overlayProject
    if (!project?.overlay_image || !project?.overlay_bounds) return

    const layerId  = `project:${project.id}:overlay-layer`
    const sourceId = `project:${project.id}:overlay-source`

    if (!overlayVisible) {
      // Hide: set visibility none (keep source)
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none')
      }
      return
    }

    // Need to add source+layer if not present
    if (!map.getSource(sourceId)) {
      // Clean up any previous overlay from a different project
      if (currentOverlayId.current && currentOverlayId.current !== project.id) {
        cleanupOverlay(currentOverlayId.current)
      }
      const imageUrl = project.overlay_image.startsWith('http')
        ? project.overlay_image
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/overlay-images/${project.overlay_image}`

      const bounds = project.overlay_bounds as {
        topLeft: [number, number]
        topRight: [number, number]
        bottomRight: [number, number]
        bottomLeft: [number, number]
      }

      map.addSource(sourceId, {
        type: 'image',
        url: imageUrl,
        coordinates: [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft],
      })
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: { 'raster-opacity': overlayOpacity },
      })
      currentOverlayId.current = project.id
    } else {
      // Source exists: ensure visible and update opacity
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible')
        map.setPaintProperty(layerId, 'raster-opacity', overlayOpacity)
      }
    }
  }, [mapLoaded, overlayVisible, overlayProject, overlayOpacity, cleanupOverlay])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-6 right-4 z-10 text-xs text-gray-400 bg-white/80 rounded px-2 py-1 pointer-events-none">
        {filteredProjects.length} โครงการ
      </div>
    </div>
  )
})

export default MapView
