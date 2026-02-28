import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminSiteEditor from '@/components/admin/cms/AdminSiteEditor'
import type { SiteSection } from '@/lib/site-content'

export const metadata = { title: 'Site Content | Admin' }

export default async function AdminSitePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: sections } = await supabase
    .from('site_sections')
    .select('*')

  const { data: settingsRows } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  if (settingsRows) {
    for (const row of settingsRows as { key: string; value: string | null }[]) {
      settings[row.key] = row.value ?? ''
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <a href="/admin" className="text-[13px] text-blue-700 hover:underline">← กลับ Admin</a>
        </div>
        <AdminSiteEditor
          initialSections={(sections as SiteSection[] | null) ?? []}
          initialSettings={settings}
        />
      </div>
    </div>
  )
}
