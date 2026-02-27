'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

interface PinPickerMapProps {
  latitude: number
  longitude: number
  onChange: (lat: number, lng: number) => void
}

export default function PinPickerMap({ latitude, longitude, onChange }: PinPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 10,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    const marker = new mapboxgl.Marker({ color: '#1a56db', draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map)

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      onChange(lngLat.lat, lngLat.lng)
    })

    map.on('click', (e) => {
      marker.setLngLat(e.lngLat)
      onChange(e.lngLat.lat, e.lngLat.lng)
    })

    mapRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude])
    }
  }, [latitude, longitude])

  return <div ref={containerRef} className="w-full h-full" />
}
