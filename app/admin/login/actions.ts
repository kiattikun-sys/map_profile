'use server'

import { createClient } from '@/lib/supabase-server'

export async function loginAction(email: string, password: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
  }

  return { success: true }
}
