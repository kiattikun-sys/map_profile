import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Project, Client } from '@/types/database'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: projectsRaw } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
  const projects = projectsRaw as (Project & { clients?: { name: string } | null })[] | null

  const { data: clientsRaw } = await supabase
    .from('clients')
    .select('*')
    .order('name')
  const clients = clientsRaw as Client[] | null

  return <AdminDashboard initialProjects={projects ?? []} initialClients={clients ?? []} />
}
