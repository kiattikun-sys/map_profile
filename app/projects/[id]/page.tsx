import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/database'
import Navbar from '@/components/Navbar'
import ProjectDetailClient from '@/components/ProjectDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProjectDetailClient project={project} />
    </div>
  )
}
