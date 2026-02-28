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
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: 'rgba(237,231,221,0.97)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="text-white p-1.5 rounded-lg transition-all duration-200"
              style={{ background: 'var(--gold)', boxShadow: '0 2px 8px rgba(179,155,124,0.35)' }}
            >
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="font-black text-[15px] tracking-[-0.02em]" style={{ color: 'var(--foreground)' }}>TRIPIRA</span>
              <span className="hidden sm:inline text-[11px] ml-1.5 font-normal tracking-wide" style={{ color: 'var(--muted)' }}>Map Profile</span>
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
                  className="relative px-4 py-2 text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-[150ms]"
                  style={{ color: active ? 'var(--foreground)' : 'var(--muted)' }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      background: 'var(--gold)',
                      width: active ? '1rem' : '0',
                      opacity: active ? 1 : 0,
                    }}
                  />
                </Link>
              )
            })}
          </div>

          {/* Admin CTA — luxury outline */}
          <div className="hidden md:flex items-center">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-all duration-[150ms]"
              style={{
                border: '1px solid var(--gold-border)',
                color: 'var(--gold-dark)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--gold-bg)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)'
              }}
            >
              <LayoutDashboard size={13} strokeWidth={2} />
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-lg transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-3 pt-2 pb-4 space-y-0.5 animate-[fadeInDown_0.18s_ease-out]"
          style={{ background: 'rgba(246,242,234,0.98)', borderColor: 'var(--border)' }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-[13.5px] font-medium transition-colors duration-150 min-h-[44px]"
                style={{
                  background: active ? 'var(--gold-bg)' : 'transparent',
                  color: active ? 'var(--gold-dark)' : 'var(--muted)',
                }}
              >
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--gold)' }}
                  />
                )}
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-3 text-[13.5px] font-semibold rounded-xl transition-colors duration-150"
              style={{
                border: '1px solid var(--gold-border)',
                color: 'var(--gold-dark)',
                background: 'var(--gold-bg)',
              }}
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
