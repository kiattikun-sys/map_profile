import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function getProjectCoverImage(
  images: string[] | null,
  supabaseClient?: ReturnType<typeof createClient>
): string | null {
  if (!images || images.length === 0) return null
  const first = images[0]
  if (first.startsWith('http')) return first
  const base = `${supabaseUrl}/storage/v1/object/public/project-images/${first}`
  return base
}

export function getProjectImageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${supabaseUrl}/storage/v1/object/public/project-images/${path}`
}

export function getProjectDocUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${supabaseUrl}/storage/v1/object/public/project-documents/${path}`
}

const TYPE_GRADIENT: Record<string, string> = {
  'ภูมิสถาปัตย์': 'from-emerald-700 to-teal-900',
  'สำรวจ':        'from-teal-600 to-cyan-900',
  'อาคาร':        'from-purple-700 to-indigo-900',
  'โยธา':         'from-blue-700 to-blue-900',
  'สาธารณูปโภค':  'from-green-700 to-green-900',
  'ถนน':          'from-amber-600 to-orange-900',
  'ไฟฟ้า':        'from-orange-600 to-red-900',
  'ชลประทาน':     'from-cyan-600 to-blue-900',
  'ท่าเรือ':       'from-sky-600 to-blue-900',
  'ระบบระบายน้ำ': 'from-indigo-600 to-blue-900',
}

export function getTypeGradient(type: string | null): string {
  if (!type) return 'from-gray-700 to-gray-900'
  return TYPE_GRADIENT[type] ?? 'from-blue-700 to-blue-900'
}
