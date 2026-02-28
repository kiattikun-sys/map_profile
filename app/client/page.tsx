import { redirect } from 'next/navigation'
import { getProfile, getClientProjects } from '@/lib/client-actions'
import ClientPortal from '@/components/client/ClientPortal'

export const dynamic = 'force-dynamic'

export default async function ClientPage() {
  const profile = await getProfile()

  if (!profile) redirect('/admin/login')
  if (!['super', 'admin', 'client'].includes(profile.role)) redirect('/')

  let projects: Awaited<ReturnType<typeof getClientProjects>> = []

  if (profile.role === 'client') {
    if (!profile.client_org_id) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="text-center p-8">
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>บัญชีของคุณยังไม่ได้ผูกกับองค์กร</p>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>กรุณาติดต่อผู้ดูแลระบบ</p>
          </div>
        </div>
      )
    }
    projects = await getClientProjects(profile.client_org_id)
  }

  return <ClientPortal profile={profile} projects={projects} />
}
