'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MapPin, Menu, X, LayoutDashboard } from 'lucide-react'

const navLinks = [
  { href: '/',         label: 'แผนที่' },
  { href: '/projects', label: 'โครงการ' },
  { href: '/about',    label: 'เกี่ยวกับ' },
  { href: '/clients',  label: 'ลูกค้า' },
  { href: '/contact',  label: 'ติดต่อ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-slate-200/60" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-blue-800 text-white p-1.5 rounded-lg group-hover:bg-blue-900 transition-colors duration-200" style={{ boxShadow: '0 2px 8px rgba(30,58,138,0.25)' }}>
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="font-black text-[15px] text-slate-900 tracking-[-0.02em]">TRIPIRA</span>
              <span className="hidden sm:inline text-[11px] text-slate-400 ml-1.5 font-normal tracking-wide">Map Profile</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                    active
                      ? 'text-blue-800'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-blue-700 rounded-full transition-all duration-300 ${active ? 'w-4 opacity-100' : 'w-0 opacity-0'}`} />
                </Link>
              )
            })}
          </div>

          {/* Admin CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-[13px] font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200 tracking-[-0.01em]"
            >
              <LayoutDashboard size={13} strokeWidth={2} />
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-3 pt-2 pb-4 space-y-0.5 animate-[fadeInDown_0.18s_ease-out]">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-[13.5px] font-medium transition-colors duration-150 min-h-[44px] ${
                  active
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0" />}
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-100 mt-1">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-3 bg-slate-900 text-white text-[13.5px] font-semibold rounded-xl hover:bg-slate-700 transition-colors duration-150"
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
