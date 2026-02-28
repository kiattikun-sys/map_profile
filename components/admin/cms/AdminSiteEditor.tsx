'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteSection } from '@/lib/site-content'
import { SECTION_DEFAULTS, SETTINGS_DEFAULTS } from '@/lib/site-content'
import CmsToast, { type ToastState } from './CmsToast'
import CmsImageUpload from './CmsImageUpload'
import { Save, RotateCcw, Globe, Home, Briefcase, Users, Info, Phone } from 'lucide-react'

const SECTION_TABS = [
  { key: 'home',     label: 'Home',     icon: Home },
  { key: 'projects', label: 'Projects', icon: Briefcase },
  { key: 'clients',  label: 'Clients',  icon: Users },
  { key: 'about',    label: 'About',    icon: Info },
  { key: 'contact',  label: 'Contact',  icon: Phone },
]

interface SectionForm {
  enabled: boolean
  title: string
  subtitle: string
  description: string
  cta_label: string
  cta_href: string
  image_path: string | null
}

interface SettingsForm {
  site_name: string
  site_description: string
  og_image_path: string
  phone_pm: string
  phone_am: string
  email: string
  address: string
  facebook_url: string
  line_url: string
  map_url: string
}

function makeDefaultSection(key: string): SectionForm {
  const d = SECTION_DEFAULTS[key]
  return {
    enabled:     d?.enabled     ?? true,
    title:       d?.title       ?? '',
    subtitle:    d?.subtitle    ?? '',
    description: d?.description ?? '',
    cta_label:   d?.cta_label   ?? '',
    cta_href:    d?.cta_href    ?? '',
    image_path:  d?.image_path  ?? null,
  }
}

interface Props {
  initialSections: SiteSection[]
  initialSettings: Record<string, string>
}

export default function AdminSiteEditor({ initialSections, initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [toast, setToast] = useState<ToastState>(null)
  const [saving, setSaving] = useState(false)

  // Build section form map from initial data
  const buildSectionMap = () => {
    const map: Record<string, SectionForm> = {}
    SECTION_TABS.forEach(({ key }) => {
      const row = initialSections.find((s) => s.key === key)
      map[key] = {
        enabled:     row?.enabled     ?? true,
        title:       row?.title       ?? SECTION_DEFAULTS[key]?.title ?? '',
        subtitle:    row?.subtitle    ?? SECTION_DEFAULTS[key]?.subtitle ?? '',
        description: row?.description ?? SECTION_DEFAULTS[key]?.description ?? '',
        cta_label:   row?.cta_label   ?? SECTION_DEFAULTS[key]?.cta_label ?? '',
        cta_href:    row?.cta_href    ?? SECTION_DEFAULTS[key]?.cta_href ?? '',
        image_path:  row?.image_path  ?? null,
      }
    })
    return map
  }

  const [sections, setSections] = useState<Record<string, SectionForm>>(buildSectionMap)
  const [settings, setSettings] = useState<SettingsForm>({
    site_name:       initialSettings.site_name       ?? SETTINGS_DEFAULTS.site_name,
    site_description:initialSettings.site_description?? SETTINGS_DEFAULTS.site_description,
    og_image_path:   initialSettings.og_image_path   ?? '',
    phone_pm:        initialSettings.phone_pm        ?? SETTINGS_DEFAULTS.phone_pm,
    phone_am:        initialSettings.phone_am        ?? SETTINGS_DEFAULTS.phone_am,
    email:           initialSettings.email           ?? SETTINGS_DEFAULTS.email,
    address:         initialSettings.address         ?? SETTINGS_DEFAULTS.address,
    facebook_url:    initialSettings.facebook_url    ?? '',
    line_url:        initialSettings.line_url        ?? '',
    map_url:         initialSettings.map_url         ?? '',
  })

  const updateSection = (key: string, field: keyof SectionForm, value: string | boolean | null) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const resetSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: makeDefaultSection(key) }))
  }

  const saveSection = useCallback(async (key: string) => {
    setSaving(true)
    try {
      const form = sections[key]
      const { error } = await supabase
        .from('site_sections')
        .upsert({
          key,
          enabled:     form.enabled,
          title:       form.title       || null,
          subtitle:    form.subtitle    || null,
          description: form.description || null,
          cta_label:   form.cta_label   || null,
          cta_href:    form.cta_href    || null,
          image_path:  form.image_path  || null,
          updated_at:  new Date().toISOString(),
        }, { onConflict: 'key' })
      if (error) throw error
      setToast({ type: 'success', message: `บันทึก "${key}" เรียบร้อย` })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      setToast({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }, [sections])

  const saveSettings = useCallback(async () => {
    setSaving(true)
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' })
      if (error) throw error
      setToast({ type: 'success', message: 'บันทึก SEO & Settings เรียบร้อย' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      setToast({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }, [settings])

  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-400 transition-all'
  const labelCls = 'block text-[12px] font-semibold text-slate-500 uppercase tracking-[0.06em] mb-1.5'

  function SectionPanel({ sKey }: { sKey: string }) {
    const form = sections[sKey]
    if (!form) return null
    return (
      <div className="space-y-5">
        {/* Enable toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={form.enabled}
              onChange={(e) => updateSection(sKey, 'enabled', e.target.checked)}
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${form.enabled ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.enabled ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-[13px] font-medium text-slate-700">
            {form.enabled ? 'หน้านี้เปิดใช้งาน' : 'หน้านี้ปิดอยู่'}
          </span>
        </label>

        <div className="grid grid-cols-1 gap-4">
          {/* Title */}
          <div>
            <label className={labelCls}>Title (ไม่เกิน 80 ตัวอักษร)</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => updateSection(sKey, 'title', e.target.value.slice(0, 80))}
              placeholder={SECTION_DEFAULTS[sKey]?.title ?? ''}
            />
            <p className="text-[11px] text-slate-400 mt-1 text-right">{form.title.length}/80</p>
          </div>

          {/* Subtitle */}
          <div>
            <label className={labelCls}>Subtitle / Brand Label</label>
            <input
              className={inputCls}
              value={form.subtitle}
              onChange={(e) => updateSection(sKey, 'subtitle', e.target.value)}
              placeholder={SECTION_DEFAULTS[sKey]?.subtitle ?? ''}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description (ไม่เกิน 200 ตัวอักษร)</label>
            <textarea
              rows={3}
              className={inputCls + ' resize-none'}
              value={form.description}
              onChange={(e) => updateSection(sKey, 'description', e.target.value.slice(0, 200))}
              placeholder={SECTION_DEFAULTS[sKey]?.description ?? ''}
            />
            <p className="text-[11px] text-slate-400 mt-1 text-right">{form.description.length}/200</p>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>CTA Label (ไม่เกิน 30 ตัวอักษร)</label>
              <input
                className={inputCls}
                value={form.cta_label ?? ''}
                onChange={(e) => updateSection(sKey, 'cta_label', e.target.value.slice(0, 30))}
                placeholder="เช่น ดูโครงการ"
              />
            </div>
            <div>
              <label className={labelCls}>CTA URL</label>
              <input
                className={inputCls}
                value={form.cta_href ?? ''}
                onChange={(e) => updateSection(sKey, 'cta_href', e.target.value)}
                placeholder="/projects"
              />
            </div>
          </div>

          {/* Hero image upload */}
          <CmsImageUpload
            currentPath={form.image_path}
            storagePath={`hero/${sKey}`}
            label="Hero Image (แทน Unsplash default)"
            onUploaded={(path) => updateSection(sKey, 'image_path', path)}
            onCleared={() => updateSection(sKey, 'image_path', null)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => saveSection(sKey)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
            style={{ boxShadow: '0 4px 14px rgba(30,58,138,0.2)' }}
          >
            <Save size={14} strokeWidth={2.5} />
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <button
            type="button"
            onClick={() => resetSection(sKey)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={13} strokeWidth={2} />
            Reset to defaults
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-[-0.02em]">Site Content</h2>
        <p className="text-[13px] text-slate-500 mt-1">แก้ไขเนื้อหา Hero / SEO แต่ละหน้า — ไม่กระทบ layout หรือ animation</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[...SECTION_TABS, { key: 'seo', label: 'SEO & Settings', icon: Globe }].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
              activeTab === key
                ? 'bg-white text-blue-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={13} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
        {activeTab !== 'seo' && <SectionPanel sKey={activeTab} />}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Site Name</label>
                <input
                  className={inputCls}
                  value={settings.site_name}
                  onChange={(e) => setSettings((p) => ({ ...p, site_name: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Site Description (ไม่เกิน 200 ตัวอักษร)</label>
                <textarea
                  rows={3}
                  className={inputCls + ' resize-none'}
                  value={settings.site_description}
                  onChange={(e) => setSettings((p) => ({ ...p, site_description: e.target.value.slice(0, 200) }))}
                />
                <p className="text-[11px] text-slate-400 mt-1 text-right">{settings.site_description.length}/200</p>
              </div>

              {/* OG Image */}
              <CmsImageUpload
                currentPath={settings.og_image_path || null}
                storagePath="seo/og"
                label="OG / Social Share Image (1200×630 แนะนำ)"
                onUploaded={(path) => setSettings((p) => ({ ...p, og_image_path: path }))}
                onCleared={() => setSettings((p) => ({ ...p, og_image_path: '' }))}
              />

              <hr className="border-slate-100" />
              <p className="text-[12px] font-bold text-slate-700 uppercase tracking-[0.08em]">Contact Info</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>โทร PM (พีรพงษ์)</label>
                  <input className={inputCls} value={settings.phone_pm} onChange={(e) => setSettings((p) => ({ ...p, phone_pm: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>โทร AM (ริณยพัทธ์)</label>
                  <input className={inputCls} value={settings.phone_am} onChange={(e) => setSettings((p) => ({ ...p, phone_am: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={settings.email} onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>ที่อยู่</label>
                <textarea rows={2} className={inputCls + ' resize-none'} value={settings.address} onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))} />
              </div>

              <hr className="border-slate-100" />
              <p className="text-[12px] font-bold text-slate-700 uppercase tracking-[0.08em]">Social Links</p>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className={labelCls}>Facebook URL</label>
                  <input className={inputCls} value={settings.facebook_url} onChange={(e) => setSettings((p) => ({ ...p, facebook_url: e.target.value }))} placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className={labelCls}>LINE URL</label>
                  <input className={inputCls} value={settings.line_url} onChange={(e) => setSettings((p) => ({ ...p, line_url: e.target.value }))} placeholder="https://line.me/..." />
                </div>
                <div>
                  <label className={labelCls}>Google Maps Embed URL</label>
                  <input className={inputCls} value={settings.map_url} onChange={(e) => setSettings((p) => ({ ...p, map_url: e.target.value }))} placeholder="https://www.google.com/maps/embed?pb=..." />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={saveSettings}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
                style={{ boxShadow: '0 4px 14px rgba(30,58,138,0.2)' }}
              >
                <Save size={14} strokeWidth={2.5} />
                {saving ? 'กำลังบันทึก...' : 'บันทึก SEO & Settings'}
              </button>
              <button
                type="button"
                onClick={() => setSettings({
                  site_name: SETTINGS_DEFAULTS.site_name,
                  site_description: SETTINGS_DEFAULTS.site_description,
                  og_image_path: '',
                  phone_pm: SETTINGS_DEFAULTS.phone_pm,
                  phone_am: SETTINGS_DEFAULTS.phone_am,
                  email: SETTINGS_DEFAULTS.email,
                  address: SETTINGS_DEFAULTS.address,
                  facebook_url: '',
                  line_url: '',
                  map_url: '',
                })}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-medium hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={13} strokeWidth={2} />
                Reset to defaults
              </button>
            </div>
          </div>
        )}
      </div>

      <CmsToast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
