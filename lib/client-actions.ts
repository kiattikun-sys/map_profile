'use server'

import { createClient } from '@/lib/supabase-server'
import type { Profile, ProjectUpdateRow, ProjectFileRow } from '@/types/database'

/** Fetch current user's profile (role + client_org_id) */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return (data as Profile) ?? null
}

/** Fetch projects for a client org */
export async function getClientProjects(client_org_id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('id, name, project_type, province, year, status, images, description, client_org_id')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .eq('client_org_id' as any, client_org_id)
    .order('created_at', { ascending: false })
  return data ?? []
}

/** Fetch updates for a project */
export async function getProjectUpdates(project_id: string): Promise<ProjectUpdateRow[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('project_updates')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  return (data as ProjectUpdateRow[]) ?? []
}

/** Fetch files for a project */
export async function getProjectFiles(project_id: string): Promise<ProjectFileRow[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('project_files')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
  return (data as ProjectFileRow[]) ?? []
}

/** Add a project update */
export async function addProjectUpdate(
  project_id: string,
  payload: { progress?: number; status?: string; note?: string }
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('project_updates').insert({
    project_id,
    author_id: user.id,
    progress: payload.progress ?? null,
    status: payload.status ?? null,
    note: payload.note ?? null,
  })
  if (error) return { error: error.message }
  return {}
}

/** Generate signed URL for a storage path (TTL 1 hour) */
export async function getSignedUrl(storage_path: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from('project-client-files')
    .createSignedUrl(storage_path, 3600)
  return data?.signedUrl ?? null
}

/** Upload a file and record in project_files */
export async function uploadProjectFile(
  project_id: string,
  client_org_id: string,
  formData: FormData
): Promise<{ error?: string; file?: ProjectFileRow }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  const file = formData.get('file') as File | null
  if (!file) return { error: 'ไม่พบไฟล์' }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const storagePath = `org/${client_org_id}/project/${project_id}/${filename}`
  const label = (formData.get('label') as string) || file.name

  const { error: upErr } = await supabase.storage
    .from('project-client-files')
    .upload(storagePath, file, { upsert: false })

  if (upErr) return { error: upErr.message }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error: dbErr } = await (supabase as any)
    .from('project_files')
    .insert({
      project_id,
      uploaded_by: user.id,
      storage_path: storagePath,
      label,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select('*')
    .single()

  if (dbErr) return { error: dbErr.message }
  return { file: data as ProjectFileRow }
}
