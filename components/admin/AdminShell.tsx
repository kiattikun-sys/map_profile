'use client'

import {
  MapPin, FolderOpen, Users, FileText, Megaphone,
  Star, Box, LayoutDashboard, LogOut, ChevronRight,
  ShieldCheck, Building2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type ActivePage = 'projects' | 'clients' | 'site' | 'banner' | 'featured' | 'model' | 'users' | 'orgs'

interface Props {
  children: React.ReactNode
  activePage: ActivePage
}

const NAV_ITEMS = [
  {
    section: 'Data',
    items: [
      { key: 'projects', label: 'โครงการ', icon: FolderOpen, href: '/admin' },
      { key: 'clients',  label: 'ลูกค้า',   icon: Users,      href: '/admin' },
    ],
  },
  {
    section: 'CMS',
    items: [
      { key: 'site',     label: 'Site Content',  icon: FileText,  href: '/admin/site' },
      { key: 'banner',   label: 'Banner',         icon: Megaphone, href: '/admin/banner' },
      { key: 'featured', label: 'Featured & Key', icon: Star,      href: '/admin/featured' },
    ],
  },
  {
    section: '3D',
    items: [
      { key: 'model', label: '3D Models', icon: Box, href: '/admin/model' },
    ],
  },
  {
    section: 'Access',
    items: [
      { key: 'users', label: 'Users',     icon: ShieldCheck, href: '/admin/users' },
      { key: 'orgs',  label: 'Client Orgs', icon: Building2,   href: '/admin/orgs' },
    ],
  },
]

export default function AdminShell({ children, activePage }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col fixed h-full z-30" style={{ background: '#111111', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold)' }}>
              <MapPin size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Map Profile</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(group => (
            <div key={group.section}>
              <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'rgba(255,255,255,0.25)' }}>
                {group.section}
              </p>
              {group.items.map(item => {
                const Icon = item.icon
                const isActive = activePage === item.key
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={isActive
                      ? { background: 'var(--gold)', color: '#fff' }
                      : { color: 'rgba(255,255,255,0.5)' }
                    }
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)' }}}
                  >
                    <Icon size={16} />
                    {item.label}
                    {!isActive && <ChevronRight size={12} className="ml-auto opacity-40" />}
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-1"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
          >
            <LayoutDashboard size={16} />
            ดูหน้าเว็บ
            <ChevronRight size={12} className="ml-auto opacity-40" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: 'rgba(255,80,80,0.75)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,0.08)'; (e.currentTarget as HTMLElement).style.color = '#ff9090' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,0.75)' }}
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen p-8" style={{ background: 'var(--background)' }}>
        {children}
      </main>
    </div>
  )
}
