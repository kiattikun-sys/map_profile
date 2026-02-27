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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-blue-700 text-white p-1.5 rounded-lg group-hover:bg-blue-800 transition-colors">
              <MapPin size={17} />
            </div>
            <div className="leading-none">
              <span className="font-extrabold text-base text-gray-900 tracking-tight">TRIPIRA</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1.5 font-normal">Map Profile</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-blue-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-700 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Admin CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard size={14} />
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-0.5 animate-[fadeInDown_0.15s_ease-out]">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2.5 flex-shrink-0" />}
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard size={14} /> Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
