'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 text-white rounded-full hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center"
      style={{ background: 'var(--gold)', boxShadow: '0 4px 12px rgba(179,155,124,0.40)' }}
    >
      <ArrowUp size={18} />
    </button>
  )
}
