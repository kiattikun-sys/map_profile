'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export type ToastState = { type: 'success' | 'error'; message: string } | null

interface Props {
  toast: ToastState
  onClose: () => void
}

export default function CmsToast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-[13.5px] font-semibold transition-all duration-300 ${
      toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    }`}>
      {toast.type === 'success'
        ? <CheckCircle2 size={16} strokeWidth={2.5} />
        : <XCircle size={16} strokeWidth={2.5} />
      }
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
