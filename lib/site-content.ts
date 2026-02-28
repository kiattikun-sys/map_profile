import { supabase } from '@/lib/supabase'
import type { Project, Client } from '@/types/database'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface SiteSection {
  key: string
  enabled: boolean
  title: string | null
  subtitle: string | null
  description: string | null
  cta_label: string | null
  cta_href: string | null
  image_path: string | null
  updated_at: string
}

export interface SiteSetting {
  key: string
  value: string | null
  updated_at: string
}

export interface HomepageBanner {
  id: string
  enabled: boolean
  headline: string | null
  message: string | null
  cta_label: string | null
  cta_href: string | null
  background_image_path: string | null
  updated_at: string
}

export interface FeaturedProjectRow {
  project_id: string
  position: number
}

export interface KeyClientRow {
  client_id: string
  position: number
}

// ─────────────────────────────────────────────────────────────
// Default fallback content (mirrors existing hard-coded values)
// ─────────────────────────────────────────────────────────────
export const SECTION_DEFAULTS: Record<string, Omit<SiteSection, 'key' | 'updated_at'>> = {
  home: {
    enabled: true,
    title: 'ออกแบบพื้นที่สาธารณะ ระดับชาติ',
    subtitle: 'TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด',
    description: 'บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ ด้วยผลงานมูลค่ารวมกว่า 1,500 ล้านบาท',
    cta_label: 'ดูโครงการ',
    cta_href: '/projects',
    image_path: null,
  },
  projects: {
    enabled: true,
    title: 'โครงการทั้งหมด',
    subtitle: 'ผลงานของเรา — TRIPIRA',
    description: 'ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย',
    cta_label: null,
    cta_href: null,
    image_path: null,
  },
  clients: {
    enabled: true,
    title: 'พาร์ทเนอร์ชั้นนำ',
    subtitle: 'ลูกค้าของเรา — TRIPIRA',
    description: 'หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา',
    cta_label: null,
    cta_href: null,
    image_path: null,
  },
  about: {
    enabled: true,
    title: 'ออกแบบพื้นที่สาธารณะ ระดับชาติ ด้วยความเชี่ยวชาญจริง',
    subtitle: 'TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด',
    description: 'บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ อาทิ กรมโยธาธิการและผังเมือง Bangchak PTT และ Lotus\'s',
    cta_label: 'ดูโครงการ',
    cta_href: '/projects',
    image_path: null,
  },
  contact: {
    enabled: true,
    title: 'ติดต่อ TRIPIRA',
    subtitle: 'ติดต่อเรา — TRIPIRA',
    description: 'บริษัท ไตรพีระ จำกัด — พร้อมรับฟังความต้องการด้านวิศวกรรมและภูมิสถาปัตยกรรมทุกรูปแบบ',
    cta_label: null,
    cta_href: null,
    image_path: null,
  },
}

export const SETTINGS_DEFAULTS: Record<string, string> = {
  site_name: 'TRIPIRA Map Profile',
  site_description: 'บริษัท ไตรพีระ จำกัด — วิศวกรรมและภูมิสถาปัตยกรรมระดับชาติ',
  og_image_path: '',
  phone_pm: '080-996-1080',
  phone_am: '084-746-3969',
  email: 'contact@tripira.co.th',
  address: '46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230',
  facebook_url: '',
  line_url: '',
  map_url: '',
}

export const BANNER_DEFAULT: Omit<HomepageBanner, 'id' | 'updated_at'> = {
  enabled: true,
  headline: 'ออกแบบภูมิสถาปัตยกรรมและวิศวกรรมระดับชาติ',
  message: 'แผนที่โครงการ — TRIPIRA',
  cta_label: 'เกี่ยวกับเรา',
  cta_href: '/about',
  background_image_path: null,
}

// ─────────────────────────────────────────────────────────────
// Helper: build public URL from storage path
// ─────────────────────────────────────────────────────────────
export function getSiteAssetUrl(path: string | null): string | null {
  if (!path) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  return `${base}/storage/v1/object/public/site-assets/${path}`
}

// ─────────────────────────────────────────────────────────────
// getSiteSection(key) — with fallback
// ─────────────────────────────────────────────────────────────
export async function getSiteSection(key: string): Promise<SiteSection> {
  try {
    const { data, error } = await supabase
      .from('site_sections')
      .select('*')
      .eq('key', key)
      .single()

    if (error || !data) throw new Error('fallback')
    return data as SiteSection
  } catch {
    const def = SECTION_DEFAULTS[key]
    return {
      key,
      updated_at: new Date().toISOString(),
      ...(def ?? {
        enabled: true,
        title: null,
        subtitle: null,
        description: null,
        cta_label: null,
        cta_href: null,
        image_path: null,
      }),
    }
  }
}

// ─────────────────────────────────────────────────────────────
// getSiteSetting(key) — with fallback
// ─────────────────────────────────────────────────────────────
export async function getSiteSetting(key: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error || !data) throw new Error('fallback')
    return data.value ?? SETTINGS_DEFAULTS[key] ?? ''
  } catch {
    return SETTINGS_DEFAULTS[key] ?? ''
  }
}

// ─────────────────────────────────────────────────────────────
// getAllSiteSettings() — returns map of all key→value
// ─────────────────────────────────────────────────────────────
export async function getAllSiteSettings(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error || !data) throw new Error('fallback')
    const map: Record<string, string> = { ...SETTINGS_DEFAULTS }
    for (const row of data as SiteSetting[]) {
      if (row.key) map[row.key] = row.value ?? ''
    }
    return map
  } catch {
    return { ...SETTINGS_DEFAULTS }
  }
}

// ─────────────────────────────────────────────────────────────
// getHomepageBanner() — latest row, with fallback
// ─────────────────────────────────────────────────────────────
export async function getHomepageBanner(): Promise<HomepageBanner> {
  try {
    const { data, error } = await supabase
      .from('homepage_banner')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) throw new Error('fallback')
    return data as HomepageBanner
  } catch {
    return {
      id: 'default',
      updated_at: new Date().toISOString(),
      ...BANNER_DEFAULT,
    }
  }
}

// ─────────────────────────────────────────────────────────────
// getFeaturedProjects() — with fallback to newest projects
// ─────────────────────────────────────────────────────────────
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data: featRows, error } = await supabase
      .from('featured_projects')
      .select('project_id, position')
      .order('position', { ascending: true })

    if (error || !featRows || featRows.length === 0) throw new Error('fallback')

    const ids = (featRows as FeaturedProjectRow[]).map((r) => r.project_id)
    const { data: projects, error: pErr } = await supabase
      .from('projects')
      .select('*')
      .in('id', ids)
      .eq('status', 'active')

    if (pErr || !projects) throw new Error('fallback')

    const posMap: Record<string, number> = {}
    ;(featRows as FeaturedProjectRow[]).forEach((r) => {
      posMap[r.project_id] = r.position
    })
    return (projects as Project[]).sort(
      (a, b) => (posMap[a.id] ?? 999) - (posMap[b.id] ?? 999)
    )
  } catch {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('year', { ascending: false })
      .limit(12)
    return (data as Project[] | null) ?? []
  }
}

// ─────────────────────────────────────────────────────────────
// getKeyClients() — with fallback to first clients
// ─────────────────────────────────────────────────────────────
export async function getKeyClients(): Promise<Client[]> {
  try {
    const { data: keyRows, error } = await supabase
      .from('key_clients')
      .select('client_id, position')
      .order('position', { ascending: true })

    if (error || !keyRows || keyRows.length === 0) throw new Error('fallback')

    const ids = (keyRows as KeyClientRow[]).map((r) => r.client_id)
    const { data: clients, error: cErr } = await supabase
      .from('clients')
      .select('*')
      .in('id', ids)

    if (cErr || !clients) throw new Error('fallback')

    const posMap: Record<string, number> = {}
    ;(keyRows as KeyClientRow[]).forEach((r) => {
      posMap[r.client_id] = r.position
    })
    return (clients as Client[]).sort(
      (a, b) => (posMap[a.id] ?? 999) - (posMap[b.id] ?? 999)
    )
  } catch {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('name')
      .limit(8)
    return (data as Client[] | null) ?? []
  }
}
