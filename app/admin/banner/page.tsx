import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminBannerEditor from '@/components/admin/cms/AdminBannerEditor'
import type { HomepageBanner } from '@/lib/site-content'

export const metadata = { title: 'Homepage Banner | Admin' }

export default async function AdminBannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data } = await supabase
    .from('homepage_banner')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <a href="/admin" className="text-[13px] text-blue-700 hover:underline">← กลับ Admin</a>
        </div>
        <AdminBannerEditor initial={(data as HomepageBanner | null)} />
      </div>
    </div>
  )
}
