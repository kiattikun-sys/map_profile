'use client'

import { useState, useTransition } from 'react'
import {
  Users, Search, Plus, RefreshCw, Shield, ShieldOff,
  ChevronDown, AlertCircle, CheckCircle2, Loader2,
  UserX, UserCheck, Mail
} from 'lucide-react'
import AdminShell from './AdminShell'
import type { ManagedUser } from '@/lib/user-management-actions'
import type { ClientOrg, UserRole } from '@/types/database'
import {
  inviteUser, updateUserRole, toggleUserBan, listUsers
} from '@/lib/user-management-actions'

interface Props {
  initialUsers: ManagedUser[]
  initialOrgs: ClientOrg[]
  loadError: string | null
}

const ROLE_OPTIONS: UserRole[] = ['super', 'admin', 'client', 'viewer']

const ROLE_BADGE: Record<UserRole, string> = {
  super:  'bg-[#2d1f0e] text-[#f0c875] border-[#6b4a1a]',
  admin:  'bg-[#F6F2EA] text-[#8C7355] border-[rgba(179,155,124,0.40)]',
  client: 'bg-[#F0F4EE] text-[#4a7a5a] border-[rgba(74,122,90,0.30)]',
  viewer: 'bg-[#F2F2F2] text-[#6E6A64] border-[rgba(110,106,100,0.25)]',
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${ok ? 'bg-[#1a2e1c] text-[#7fcf8c]' : 'bg-[#2e1a1a] text-[#f08080]'}`}
      style={{ border: `1px solid ${ok ? 'rgba(127,207,140,0.3)' : 'rgba(240,128,128,0.3)'}` }}>
      {ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  )
}

export default function UserManagementClient({ initialUsers, initialOrgs, loadError }: Props) {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer')
  const [inviteOrgId, setInviteOrgId] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function refreshUsers() {
    startTransition(async () => {
      const { users: fresh } = await listUsers()
      if (fresh) setUsers(fresh)
    })
  }

  async function handleInvite() {
    setInviteLoading(true)
    const res = await inviteUser({
      email: inviteEmail,
      role: inviteRole,
      client_org_id: inviteRole === 'client' ? inviteOrgId || null : null,
    })
    setInviteLoading(false)
    if (res.error) { showToast(res.error, false); return }
    showToast(res.message ?? 'สำเร็จ', true)
    setShowInviteModal(false)
    setInviteEmail(''); setInviteRole('viewer'); setInviteOrgId('')
    await refreshUsers()
  }

  async function handleRoleChange(userId: string, role: UserRole, orgId: string | null) {
    const res = await updateUserRole({ targetUserId: userId, role, client_org_id: orgId })
    if (res.error) { showToast(res.error, false); return }
    showToast('อัปเดต role สำเร็จ', true)
    await refreshUsers()
  }

  async function handleBanToggle(userId: string, ban: boolean) {
    const res = await toggleUserBan({ targetUserId: userId, ban })
    if (res.error) { showToast(res.error, false); return }
    showToast(ban ? 'Disabled user แล้ว' : 'Enabled user แล้ว', true)
    await refreshUsers()
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function formatDate(iso: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
  }

  return (
    <AdminShell activePage="users">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              จัดการ Users
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              {users.length} users ทั้งหมด — เฉพาะ super เท่านั้น
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshUsers}
              disabled={isPending}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-all"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition-all"
              style={{ background: 'var(--gold)', boxShadow: '0 2px 8px rgba(179,155,124,0.35)' }}
            >
              <Plus size={15} strokeWidth={2.5} /> Invite User
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: '#2e1a1a', color: '#f08080', border: '1px solid rgba(240,128,128,0.25)' }}>
            <AlertCircle size={14} /> {loadError}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาด้วย email..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
              className="text-sm pl-3 pr-8 py-2 rounded-xl appearance-none outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="all">ทุก role</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ background: 'var(--surface)' }}>
              <Users size={32} strokeWidth={1.5} style={{ color: 'var(--gold)' }} />
              <p className="mt-3 text-sm font-medium" style={{ color: 'var(--muted)' }}>ไม่พบ user</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                  {['Email', 'Role', 'Org', 'สร้างเมื่อ', 'Login ล่าสุด', 'จัดการ'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold uppercase tracking-[0.08em] px-4 py-3"
                      style={{ color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    orgs={initialOrgs}
                    isEven={i % 2 === 0}
                    onRoleChange={handleRoleChange}
                    onBanToggle={handleBanToggle}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowInviteModal(false) }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold)' }}>
                <Mail size={14} className="text-white" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Invite User</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                  Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserRole)}
                  className="w-full text-sm px-3 py-2.5 rounded-xl appearance-none outline-none"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {inviteRole === 'client' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                    Client Org * (required สำหรับ client)
                  </label>
                  <select
                    value={inviteOrgId}
                    onChange={e => setInviteOrgId(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-xl appearance-none outline-none"
                    style={{ background: 'var(--background)', border: `1px solid ${!inviteOrgId ? '#c0392b' : 'var(--border)'}`, color: 'var(--foreground)' }}
                  >
                    <option value="">— เลือก org —</option>
                    {initialOrgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  {initialOrgs.length === 0 && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
                      ยังไม่มี org — ไปสร้างที่ <a href="/admin/orgs" className="underline" style={{ color: 'var(--gold)' }}>จัดการ Orgs</a> ก่อน
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowInviteModal(false); setInviteEmail(''); setInviteRole('viewer'); setInviteOrgId('') }}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail || (inviteRole === 'client' && !inviteOrgId)}
                className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl font-medium text-white disabled:opacity-50"
                style={{ background: 'var(--gold)' }}
              >
                {inviteLoading ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </AdminShell>
  )
}

// ─── Inline Row Component ────────────────────────────────────────────────────

function UserRow({
  user, orgs, isEven, onRoleChange, onBanToggle
}: {
  user: ManagedUser
  orgs: ClientOrg[]
  isEven: boolean
  onRoleChange: (id: string, role: UserRole, orgId: string | null) => void
  onBanToggle: (id: string, ban: boolean) => void
}) {
  const [editingRole, setEditingRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [selectedOrg, setSelectedOrg] = useState(user.client_org_id ?? '')
  const [saving, setSaving] = useState(false)

  async function saveRole() {
    setSaving(true)
    await onRoleChange(user.id, selectedRole, selectedRole === 'client' ? selectedOrg || null : null)
    setSaving(false)
    setEditingRole(false)
  }

  function formatDate(iso: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
  }

  return (
    <tr style={{ background: isEven ? 'var(--surface)' : 'var(--background)', borderBottom: '1px solid var(--border)' }}>
      {/* Email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
            {user.email[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-medium" style={{ color: user.banned ? 'var(--muted)' : 'var(--foreground)' }}>
              {user.email}
            </p>
            {user.banned && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#2e1a1a', color: '#f08080' }}>Disabled</span>}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        {editingRole ? (
          <div className="flex items-center gap-1.5">
            <select
              value={selectedRole}
              onChange={e => { setSelectedRole(e.target.value as UserRole); if (e.target.value !== 'client') setSelectedOrg('') }}
              className="text-[12px] px-2 py-1 rounded-lg appearance-none outline-none"
              style={{ background: 'var(--background)', border: '1px solid var(--gold-border)', color: 'var(--foreground)' }}
            >
              {(['super', 'admin', 'client', 'viewer'] as UserRole[]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {selectedRole === 'client' && (
              <select
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                className="text-[12px] px-2 py-1 rounded-lg appearance-none outline-none"
                style={{ background: 'var(--background)', border: '1px solid var(--gold-border)', color: 'var(--foreground)' }}
              >
                <option value="">— org —</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            )}
            <button onClick={saveRole} disabled={saving} className="p-1 rounded-lg" style={{ background: 'var(--gold)', color: '#fff' }}>
              {saving ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
            </button>
            <button onClick={() => { setEditingRole(false); setSelectedRole(user.role); setSelectedOrg(user.client_org_id ?? '') }} className="p-1 rounded-lg" style={{ background: 'var(--neutral-200)', color: 'var(--muted)' }}>
              ✕
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingRole(true)} className="flex items-center gap-1.5 group">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_BADGE[user.role]}`}>
              {user.role}
            </span>
            <Shield size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }} />
          </button>
        )}
      </td>

      {/* Org */}
      <td className="px-4 py-3">
        <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
          {user.org_name ?? (user.role === 'client' ? '⚠ ไม่มี org' : '—')}
        </span>
      </td>

      {/* Created */}
      <td className="px-4 py-3">
        <span className="text-[12px]" style={{ color: 'var(--muted)' }}>{formatDate(user.created_at)}</span>
      </td>

      {/* Last Login */}
      <td className="px-4 py-3">
        <span className="text-[12px]" style={{ color: 'var(--muted)' }}>{formatDate(user.last_sign_in)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onBanToggle(user.id, !user.banned)}
          title={user.banned ? 'Enable user' : 'Disable user'}
          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-all"
          style={user.banned
            ? { background: '#1a2e1c', color: '#7fcf8c', border: '1px solid rgba(127,207,140,0.25)' }
            : { background: '#2e1a1a', color: '#f08080', border: '1px solid rgba(240,128,128,0.2)' }
          }
        >
          {user.banned ? <><UserCheck size={11} /> Enable</> : <><UserX size={11} /> Disable</>}
        </button>
      </td>
    </tr>
  )
}
