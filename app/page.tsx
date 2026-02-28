import { Suspense } from 'react'
import MapPageClient from '@/components/MapPageClient'
import { getHomepageBanner } from '@/lib/site-content'

export const revalidate = 60

export default async function Home() {
  const banner = await getHomepageBanner()
  return (
    <Suspense>
      <MapPageClient banner={banner} />
    </Suspense>
  )
}
