'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import type { UserRole, Profile, ClientOrg } from '@/types/database'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ManagedUser {
  id: string
  email: string
  role: UserRole
  client_org_id: string | null
  org_name: string | null
  created_at: string
  last_sign_in: string | null
  banned: boolean
}

// ─── Guards ───────────────────────────────────────────────────────────────────

async function requireSuper(): Promise<Profile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHENTICATED')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'super') throw new Error('FORBIDDEN')
  return profile as Profile
}

// ─── List Users ───────────────────────────────────────────────────────────────

export async function listUsers(): Promise<{ users?: ManagedUser[]; error?: string }> {
  try {
    await requireSuper()
    const admin = createAdminClient()

    const { data: authData, error: authErr } = await admin.auth.admin.listUsers({ perPage: 1000 })
    if (authErr) return { error: authErr.message }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profiles } = await (admin as any)
      .from('profiles')
      .select('id, role, client_org_id')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orgs } = await (admin as any)
      .from('client_orgs')
      .select('id, name')

    const profileMap = new Map<string, { role: UserRole; client_org_id: string | null }>(
      (profiles ?? []).map((p: { id: string; role: UserRole; client_org_id: string | null }) => [p.id, p])
    )
    const orgMap = new Map<string, string>(
      (orgs ?? []).map((o: { id: string; name: string }) => [o.id, o.name])
    )

    const users: ManagedUser[] = authData.users.map(u => {
      const prof = profileMap.get(u.id)
      const orgId = prof?.client_org_id ?? null
      return {
        id: u.id,
        email: u.email ?? '',
        role: prof?.role ?? 'viewer',
        client_org_id: orgId,
        org_name: orgId ? (orgMap.get(orgId) ?? null) : null,
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        banned: (u as any).banned ?? false,
      }
    })

    return { users }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ─── Invite User ──────────────────────────────────────────────────────────────

export async function inviteUser(payload: {
  email: string
  role: UserRole
  client_org_id?: string | null
}): Promise<{ message?: string; error?: string }> {
  try {
    await requireSuper()

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return { error: 'รูปแบบอีเมลไม่ถูกต้อง' }
    }
    // Validate org required for client
    if (payload.role === 'client' && !payload.client_org_id) {
      return { error: 'role=client ต้องเลือก org' }
    }

    const admin = createAdminClient()

    // Check if user already exists
    const { data: existingList } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const existing = existingList?.users.find(
      u => u.email?.toLowerCase() === payload.email.toLowerCase()
    )

    let userId: string

    if (existing) {
      userId = existing.id
      // Upsert profile only — no re-invite
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('profiles').upsert({
        id: userId,
        role: payload.role,
        client_org_id: payload.role === 'client' ? (payload.client_org_id ?? null) : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

      return { message: 'User exists — role/org updated' }
    }

    // Invite new user
    const { data: inviteData, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      payload.email,
      { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/login` }
    )
    if (inviteErr) return { error: inviteErr.message }

    userId = inviteData.user.id

    // Upsert profile with selected role/org
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('profiles').upsert({
      id: userId,
      role: payload.role,
      client_org_id: payload.role === 'client' ? (payload.client_org_id ?? null) : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    return { message: 'เชิญ user สำเร็จ — อีเมลถูกส่งแล้ว' }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ─── Update User Role / Org ───────────────────────────────────────────────────

export async function updateUserRole(payload: {
  targetUserId: string
  role: UserRole
  client_org_id?: string | null
}): Promise<{ error?: string }> {
  try {
    const caller = await requireSuper()
    const admin = createAdminClient()

    // Safety: prevent super from demoting themselves if last super
    if (payload.targetUserId === caller.id && payload.role !== 'super') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: supers } = await (admin as any)
        .from('profiles')
        .select('id')
        .eq('role', 'super')
      if (!supers || supers.length <= 1) {
        return { error: 'ไม่สามารถ demote super คนสุดท้ายได้' }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any).from('profiles').update({
      role: payload.role,
      client_org_id: payload.role === 'client' ? (payload.client_org_id ?? null) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', payload.targetUserId)

    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ─── Disable / Enable User ────────────────────────────────────────────────────

export async function toggleUserBan(payload: {
  targetUserId: string
  ban: boolean
}): Promise<{ error?: string }> {
  try {
    const caller = await requireSuper()
    if (payload.targetUserId === caller.id) {
      return { error: 'ไม่สามารถ ban ตัวเองได้' }
    }

    const admin = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.auth.admin as any).updateUserById(payload.targetUserId, {
      ban_duration: payload.ban ? '876600h' : 'none',
    })
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ─── Client Orgs ─────────────────────────────────────────────────────────────

export async function listOrgs(): Promise<{ orgs?: ClientOrg[]; error?: string }> {
  try {
    await requireSuper()
    const admin = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (admin as any)
      .from('client_orgs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return { error: error.message }
    return { orgs: data as ClientOrg[] }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function createOrg(name: string): Promise<{ org?: ClientOrg; error?: string }> {
  try {
    await requireSuper()
    if (!name.trim()) return { error: 'กรุณากรอกชื่อ org' }

    const admin = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (admin as any)
      .from('client_orgs')
      .insert({ name: name.trim() })
      .select('*')
      .single()
    if (error) return { error: error.message }
    return { org: data as ClientOrg }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function getOrgMembers(orgId: string): Promise<{ members?: ManagedUser[]; error?: string }> {
  try {
    await requireSuper()
    const admin = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profiles, error } = await (admin as any)
      .from('profiles')
      .select('id, role, client_org_id')
      .eq('client_org_id', orgId)
    if (error) return { error: error.message }

    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const authMap = new Map(authData?.users.map(u => [u.id, u]) ?? [])

    const members: ManagedUser[] = (profiles ?? []).map((p: { id: string; role: UserRole; client_org_id: string | null }) => {
      const u = authMap.get(p.id)
      return {
        id: p.id,
        email: u?.email ?? '(unknown)',
        role: p.role,
        client_org_id: p.client_org_id,
        org_name: null,
        created_at: u?.created_at ?? '',
        last_sign_in: u?.last_sign_in_at ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        banned: (u as any)?.banned ?? false,
      }
    })

    return { members }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
