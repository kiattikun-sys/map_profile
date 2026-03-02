import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { listUsers, listOrgs } from '@/lib/user-management-actions'
import UserManagementClient from '@/components/admin/UserManagementClient'

export const dynamic = 'force-dynamic'

async function getCallerRole(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return data?.role ?? null
}

export default async function UsersPage() {
  const role = await getCallerRole()
  if (!role) redirect('/admin/login')
  if (role !== 'super') redirect('/admin')

  const [{ users, error: usersErr }, { orgs, error: orgsErr }] = await Promise.all([
    listUsers(),
    listOrgs(),
  ])

  return (
    <UserManagementClient
      initialUsers={users ?? []}
      initialOrgs={orgs ?? []}
      loadError={usersErr ?? orgsErr ?? null}
    />
  )
}
