'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { Json } from '@/types/database'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

interface MiniMapProps {
  latitude: number
  longitude: number
  projectName: string
  overlayImage?: string | null
  overlayBounds?: Json | null
  overlayOpacity?: number
}

export default function MiniMap({
  latitude,
  longitude,
  projectName,
  overlayImage,
  overlayBounds,
  overlayOpacity = 0.75,
}: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [longitude, latitude],
      zoom: 13,
      interactive: true,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      new mapboxgl.Marker({ color: '#1a56db' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setText(projectName))
        .addTo(map)

      if (overlayImage && overlayBounds) {
        const bounds = overlayBounds as {
          topLeft: [number, number]
          topRight: [number, number]
          bottomRight: [number, number]
          bottomLeft: [number, number]
        }

        const imageUrl = overlayImage.startsWith('http')
          ? overlayImage
          : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/overlay-images/${overlayImage}`

        map.addSource('overlay', {
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
          id: 'overlay-layer',
          type: 'raster',
          source: 'overlay',
          paint: { 'raster-opacity': overlayOpacity },
        })
      }
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [latitude, longitude, projectName, overlayImage, overlayBounds, overlayOpacity])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (map.getLayer('overlay-layer')) {
      map.setPaintProperty('overlay-layer', 'raster-opacity', overlayOpacity)
    }
  }, [overlayOpacity])

  return <div ref={containerRef} className="w-full h-full" />
}
