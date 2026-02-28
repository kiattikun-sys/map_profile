import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminFeaturedEditor from '@/components/admin/cms/AdminFeaturedEditor'
import type { Project, Client } from '@/types/database'

export const metadata = { title: 'Featured & Key | Admin' }

export default async function AdminFeaturedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [
    { data: projectsRaw },
    { data: clientsRaw },
    { data: featuredRows },
    { data: keyRows },
  ] = await Promise.all([
    supabase.from('projects').select('id, name, project_type, year, province').eq('status', 'active').order('year', { ascending: false }),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('featured_projects').select('project_id, position').order('position'),
    supabase.from('key_clients').select('client_id, position').order('position'),
  ])

  const allProjects = (projectsRaw as Pick<Project, 'id' | 'name' | 'project_type' | 'year' | 'province'>[] | null) ?? []
  const allClients  = (clientsRaw  as Pick<Client, 'id' | 'name'>[] | null) ?? []

  const featuredIds = (featuredRows as { project_id: string; position: number }[] | null ?? [])
    .sort((a, b) => a.position - b.position)
    .map((r) => r.project_id)

  const keyIds = (keyRows as { client_id: string; position: number }[] | null ?? [])
    .sort((a, b) => a.position - b.position)
    .map((r) => r.client_id)

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <a href="/admin" className="text-[13px] text-blue-700 hover:underline">← กลับ Admin</a>
        </div>
        <AdminFeaturedEditor
          allProjects={allProjects as Project[]}
          allClients={allClients as Client[]}
          initialFeaturedIds={featuredIds}
          initialKeyIds={keyIds}
        />
      </div>
    </div>
  )
}
