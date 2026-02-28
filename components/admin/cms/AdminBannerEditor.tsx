'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { HomepageBanner } from '@/lib/site-content'
import { BANNER_DEFAULT } from '@/lib/site-content'
import CmsToast, { type ToastState } from './CmsToast'
import CmsImageUpload from './CmsImageUpload'
import { Save, RotateCcw } from 'lucide-react'

interface Props {
  initial: HomepageBanner | null
}

interface BannerForm {
  id: string | null
  enabled: boolean
  headline: string
  message: string
  cta_label: string
  cta_href: string
  background_image_path: string | null
}

export default function AdminBannerEditor({ initial }: Props) {
  const [form, setForm] = useState<BannerForm>({
    id:                    initial?.id ?? null,
    enabled:               initial?.enabled ?? BANNER_DEFAULT.enabled,
    headline:              initial?.headline ?? BANNER_DEFAULT.headline ?? '',
    message:               initial?.message ?? BANNER_DEFAULT.message ?? '',
    cta_label:             initial?.cta_label ?? BANNER_DEFAULT.cta_label ?? '',
    cta_href:              initial?.cta_href ?? BANNER_DEFAULT.cta_href ?? '',
    background_image_path: initial?.background_image_path ?? null,
  })
  const [toast, setToast] = useState<ToastState>(null)
  const [saving, setSaving] = useState(false)

  const update = <K extends keyof BannerForm>(field: K, value: BannerForm[K]) => {
    setForm((p) => ({ ...p, [field]: value }))
  }

  const save = useCallback(async () => {
    setSaving(true)
    try {
      if (form.id && form.id !== 'default') {
        const { error } = await supabase
          .from('homepage_banner')
          .update({
            enabled:               form.enabled,
            headline:              form.headline || null,
            message:               form.message || null,
            cta_label:             form.cta_label || null,
            cta_href:              form.cta_href || null,
            background_image_path: form.background_image_path || null,
            updated_at:            new Date().toISOString(),
          })
          .eq('id', form.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('homepage_banner')
          .insert({
            enabled:               form.enabled,
            headline:              form.headline || null,
            message:               form.message || null,
            cta_label:             form.cta_label || null,
            cta_href:              form.cta_href || null,
            background_image_path: form.background_image_path || null,
          })
          .select('id')
          .single()
        if (error) throw error
        if (data) setForm((p) => ({ ...p, id: (data as { id: string }).id }))
      }
      setToast({ type: 'success', message: 'บันทึก Banner เรียบร้อย' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      setToast({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }, [form])

  const reset = () => {
    setForm((p) => ({
      ...p,
      enabled:               BANNER_DEFAULT.enabled,
      headline:              BANNER_DEFAULT.headline ?? '',
      message:               BANNER_DEFAULT.message ?? '',
      cta_label:             BANNER_DEFAULT.cta_label ?? '',
      cta_href:              BANNER_DEFAULT.cta_href ?? '',
      background_image_path: null,
    }))
  }

  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-400 transition-all'
  const labelCls = 'block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.06em] mb-1.5'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-[-0.02em]">Homepage Banner</h2>
        <p className="text-[13px] text-slate-500 mt-1">แถบ banner ด้านบน homepage — เปิด/ปิด, แก้ข้อความ, เพิ่มรูปพื้นหลัง</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
        {/* Preview strip */}
        <div
          className="rounded-xl overflow-hidden relative"
          style={{
            background: form.background_image_path
              ? `linear-gradient(135deg, rgba(30,58,138,0.92) 0%, rgba(29,78,216,0.85) 100%)`
              : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e40af 100%)',
            minHeight: '72px',
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between gap-6">
            <div>
              {form.message && (
                <p className="text-[10px] font-semibold tracking-[0.12em] text-blue-300 uppercase mb-0.5">{form.message}</p>
              )}
              <p className="text-[14px] font-bold text-white">{form.headline || '(ยังไม่มี Headline)'}</p>
            </div>
            {form.cta_label && (
              <span className="px-3 py-1.5 bg-white/15 border border-white/25 text-white text-[12px] font-semibold rounded-lg whitespace-nowrap">
                {form.cta_label}
              </span>
            )}
            {!form.enabled && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/80 text-white text-[10px] font-bold rounded-lg">
                DISABLED
              </span>
            )}
          </div>
        </div>

        {/* Enabled toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={form.enabled} onChange={(e) => update('enabled', e.target.checked)} />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${form.enabled ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.enabled ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-[13px] font-medium text-slate-700">
            {form.enabled ? 'Banner เปิดอยู่ (แสดงบน Homepage)' : 'Banner ปิดอยู่'}
          </span>
        </label>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>Headline (ข้อความหลัก)</label>
            <input
              className={inputCls}
              value={form.headline}
              onChange={(e) => update('headline', e.target.value)}
              placeholder={BANNER_DEFAULT.headline ?? ''}
            />
          </div>
          <div>
            <label className={labelCls}>Message (ข้อความย่อย/label บน)</label>
            <input
              className={inputCls}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder={BANNER_DEFAULT.message ?? ''}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>CTA Label (ไม่เกิน 30 ตัวอักษร)</label>
              <input
                className={inputCls}
                value={form.cta_label}
                onChange={(e) => update('cta_label', e.target.value.slice(0, 30))}
                placeholder="เกี่ยวกับเรา"
              />
            </div>
            <div>
              <label className={labelCls}>CTA URL</label>
              <input
                className={inputCls}
                value={form.cta_href}
                onChange={(e) => update('cta_href', e.target.value)}
                placeholder="/about"
              />
            </div>
          </div>

          <CmsImageUpload
            currentPath={form.background_image_path}
            storagePath="banner/banner"
            label="Background Image (ทับบน gradient — optional)"
            onUploaded={(path) => update('background_image_path', path)}
            onCleared={() => update('background_image_path', null)}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
            style={{ boxShadow: '0 4px 14px rgba(30,58,138,0.2)' }}
          >
            <Save size={14} strokeWidth={2.5} />
            {saving ? 'กำลังบันทึก...' : 'บันทึก Banner'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={13} strokeWidth={2} />
            Reset to defaults
          </button>
        </div>
      </div>

      <CmsToast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
