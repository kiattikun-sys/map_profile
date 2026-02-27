import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import Navbar from '@/components/Navbar'
import ProjectDetailClient from '@/components/ProjectDetailClient'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getProjectCoverImage } from '@/lib/project-utils'

export const revalidate = 60

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://map-profile.vercel.app'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('projects')
    .select('name, description, images, project_type, province, year')
    .eq('id', id)
    .single()
  if (!data) return { title: 'ไม่พบโครงการ' }
  const cover = getProjectCoverImage((data as Project).images)
  return {
    title: data.name,
    description: data.description ?? `โครงการ${data.project_type ?? ''}ใน${data.province ?? ''} ปี ${data.year ?? ''} — TRIPIRA`,
    openGraph: {
      title: `${data.name} | TRIPIRA`,
      description: data.description ?? `โครงการ${data.project_type ?? ''} จังหวัด${data.province ?? ''}`,
      images: cover ? [{ url: cover, width: 1200, height: 630 }] : [],
      type: 'article',
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const { data: projectRaw } = await supabase
    .from('projects')
    .select('*, clients(name, logo, website)')
    .eq('id', id)
    .single()
  const project = projectRaw as (Project & { clients?: { name: string; logo: string | null; website: string | null } | null }) | null

  if (!project) notFound()

  const cover = getProjectCoverImage(project.images)
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description ?? undefined,
    image: cover ?? undefined,
    dateCreated: project.year ? `${project.year}` : undefined,
    locationCreated: project.province ? {
      '@type': 'Place',
      name: project.province,
      addressCountry: 'TH',
    } : undefined,
    creator: {
      '@type': 'Organization',
      name: 'TRIPIRA CO.,LTD.',
      url: BASE_URL,
    },
    url: `${BASE_URL}/projects/${project.id}`,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProjectDetailClient project={project} />
      <Script
        id="project-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
    </div>
  )
}
