'use client'

import { useState, useTransition } from 'react'
import {
  Building2, Plus, RefreshCw, Users, ChevronRight,
  AlertCircle, CheckCircle2, Loader2, X
} from 'lucide-react'
import AdminShell from './AdminShell'
import type { ClientOrg } from '@/types/database'
import { createOrg, getOrgMembers, listOrgs } from '@/lib/user-management-actions'
import type { ManagedUser } from '@/lib/user-management-actions'

interface Props {
  initialOrgs: ClientOrg[]
  loadError: string | null
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg`}
      style={{
        background: ok ? '#1a2e1c' : '#2e1a1a',
        color: ok ? '#7fcf8c' : '#f08080',
        border: `1px solid ${ok ? 'rgba(127,207,140,0.3)' : 'rgba(240,128,128,0.3)'}`,
      }}>
      {ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  )
}

export default function OrgManagementClient({ initialOrgs, loadError }: Props) {
  const [orgs, setOrgs] = useState<ClientOrg[]>(initialOrgs)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [expandedOrgId, setExpandedOrgId] = useState<string | null>(null)
  const [members, setMembers] = useState<Record<string, ManagedUser[]>>({})
  const [loadingMembers, setLoadingMembers] = useState<Record<string, boolean>>({})
  const [isPending, startTransition] = useTransition()

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function refreshOrgs() {
    startTransition(async () => {
      const { orgs: fresh } = await listOrgs()
      if (fresh) setOrgs(fresh)
    })
  }

  async function handleCreate() {
    if (!newOrgName.trim()) return
    setCreating(true)
    const res = await createOrg(newOrgName)
    setCreating(false)
    if (res.error) { showToast(res.error, false); return }
    showToast('สร้าง org สำเร็จ', true)
    setShowCreateModal(false)
    setNewOrgName('')
    await refreshOrgs()
  }

  async function toggleExpand(orgId: string) {
    if (expandedOrgId === orgId) {
      setExpandedOrgId(null)
      return
    }
    setExpandedOrgId(orgId)
    if (!members[orgId]) {
      setLoadingMembers(prev => ({ ...prev, [orgId]: true }))
      const res = await getOrgMembers(orgId)
      setLoadingMembers(prev => ({ ...prev, [orgId]: false }))
      if (res.members) setMembers(prev => ({ ...prev, [orgId]: res.members! }))
    }
  }

  return (
    <AdminShell activePage="orgs">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Client Orgs
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              {orgs.length} organisations — เฉพาะ super เท่านั้น
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshOrgs}
              disabled={isPending}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-all"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white"
              style={{ background: 'var(--gold)', boxShadow: '0 2px 8px rgba(179,155,124,0.35)' }}
            >
              <Plus size={15} strokeWidth={2.5} /> สร้าง Org
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: '#2e1a1a', color: '#f08080', border: '1px solid rgba(240,128,128,0.25)' }}>
            <AlertCircle size={14} /> {loadError}
          </div>
        )}

        {/* Org List */}
        {orgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Building2 size={36} strokeWidth={1.5} style={{ color: 'var(--gold)' }} />
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--muted)' }}>ยังไม่มี org</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>กด "สร้าง Org" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orgs.map(org => (
              <div
                key={org.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: `1px solid ${expandedOrgId === org.id ? 'var(--gold-border)' : 'var(--border)'}`, boxShadow: 'var(--shadow-sm)' }}
              >
                {/* Org Row */}
                <button
                  onClick={() => toggleExpand(org.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
                    <Building2 size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px]" style={{ color: 'var(--foreground)' }}>{org.name}</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--muted)' }}>{org.id}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full"
                      style={{ background: 'var(--neutral-200)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                      <Users size={11} />
                      {members[org.id]?.length ?? '—'}
                    </span>
                    <ChevronRight
                      size={15}
                      className="transition-transform"
                      style={{
                        color: 'var(--muted)',
                        transform: expandedOrgId === org.id ? 'rotate(90deg)' : 'rotate(0deg)'
                      }}
                    />
                  </div>
                </button>

                {/* Members Panel */}
                {expandedOrgId === org.id && (
                  <div style={{ borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
                    {loadingMembers[org.id] ? (
                      <div className="flex justify-center py-6">
                        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--gold)' }} />
                      </div>
                    ) : !members[org.id] || members[org.id].length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-[12px]" style={{ color: 'var(--muted)' }}>ยังไม่มีสมาชิก — ไป Invite Users แล้วผูก org นี้</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            {['Email', 'Role', 'สร้างเมื่อ', 'Login ล่าสุด'].map(h => (
                              <th key={h} className="text-left text-[10px] font-bold uppercase tracking-[0.08em] px-5 py-2.5"
                                style={{ color: 'var(--muted)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {members[org.id].map((m, i) => (
                            <tr key={m.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                    style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                                    {m.email[0]?.toUpperCase()}
                                  </div>
                                  <span className="text-[13px]" style={{ color: 'var(--foreground)' }}>{m.email}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)', border: '1px solid var(--gold-border)' }}>
                                  {m.role}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                                {m.created_at ? new Date(m.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                              </td>
                              <td className="px-5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                                {m.last_sign_in ? new Date(m.last_sign_in).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Org Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false) }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold)' }}>
                  <Building2 size={14} className="text-white" />
                </div>
                <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>สร้าง Client Org</h2>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ color: 'var(--muted)' }}>
                <X size={16} />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                ชื่อองค์กร *
              </label>
              <input
                type="text"
                value={newOrgName}
                onChange={e => setNewOrgName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
                placeholder="เช่น บริษัท ABC จำกัด"
                autoFocus
                className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowCreateModal(false); setNewOrgName('') }}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newOrgName.trim()}
                className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl font-medium text-white disabled:opacity-50"
                style={{ background: 'var(--gold)' }}
              >
                {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                สร้าง
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </AdminShell>
  )
}
