'use client'

import { useState } from 'react'
import { LogOut, Building2, FolderOpen } from 'lucide-react'
import type { Profile } from '@/types/database'
import ClientProjectCard from './ClientProjectCard'
import ClientProjectDetail from './ClientProjectDetail'

interface Props {
  profile: Profile
  projects: {
    id: string
    name: string
    project_type: string | null
    province: string | null
    year: number | null
    status: string | null
    images: string[] | null
    description: string | null
    client_org_id: string | null
  }[]
}

export default function ClientPortal({ profile, projects }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const selectedProject = projects.find(p => p.id === selectedProjectId) ?? null

  const roleLabel: Record<string, string> = {
    super: 'Super Admin',
    admin: 'Admin',
    client: 'Client',
    viewer: 'Viewer',
  }

  async function handleLogout() {
    const { createBrowserClient } = await import('@supabase/ssr')
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)' }}>
              <Building2 size={14} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-[14px] tracking-tight" style={{ color: 'var(--foreground)' }}>Client Portal</span>
              <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                {roleLabel[profile.role]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            <LogOut size={13} /> ออกจากระบบ
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {selectedProject ? (
          <ClientProjectDetail
            project={selectedProject}
            profile={profile}
            onBack={() => setSelectedProjectId(null)}
          />
        ) : (
          <>
            {/* Page title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                โครงการของฉัน
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {projects.length > 0
                  ? `${projects.length} โครงการ — คลิกเพื่อดูรายละเอียดและอัปเดต`
                  : 'ยังไม่มีโครงการที่ผูกกับองค์กรของคุณ'}
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <FolderOpen size={36} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium" style={{ color: 'var(--muted)' }}>ยังไม่มีโครงการ</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>ติดต่อ admin เพื่อผูกโครงการกับองค์กรของคุณ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <ClientProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProjectId(project.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
