'use client'

import { useState } from 'react'
import { Project, Client } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  MapPin, Plus, LogOut, Edit2, Trash2, Search,
  LayoutDashboard, Users, FolderOpen, ChevronRight, X,
  FileText, Megaphone, Star
} from 'lucide-react'
import AdminProjectForm from './AdminProjectForm'
import AdminClientForm from './AdminClientForm'

type Tab = 'projects' | 'clients'

interface AdminDashboardProps {
  initialProjects: (Project & { clients?: { name: string } | null })[]
  initialClients: Client[]
}

export default function AdminDashboard({ initialProjects, initialClients }: AdminDashboardProps) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState(initialProjects)
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState('')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showClientForm, setShowClientForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const refreshProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*, clients(name)')
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
  }

  const refreshClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('name')
    setClients(data ?? [])
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    await refreshProjects()
    setDeleteConfirm(null)
  }

  const deleteClient = async (id: string) => {
    await supabase.from('clients').delete().eq('id', id)
    await refreshClients()
    setDeleteConfirm(null)
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.province ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.project_type ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-30">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <MapPin size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">Map Profile</p>
              <p className="text-gray-400 text-xs">Admin System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Data Management */}
          <p className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">Data</p>
          <button
            onClick={() => setTab('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FolderOpen size={17} />
            โครงการ
            <span className="ml-auto bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setTab('clients')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === 'clients' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Users size={17} />
            ลูกค้า
            <span className="ml-auto bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
              {clients.length}
            </span>
          </button>

          {/* CMS */}
          <p className="px-3 py-1.5 mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">CMS</p>
          <a
            href="/admin/site"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FileText size={17} />
            Site Content
            <ChevronRight size={13} className="ml-auto" />
          </a>
          <a
            href="/admin/banner"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Megaphone size={17} />
            Banner
            <ChevronRight size={13} className="ml-auto" />
          </a>
          <a
            href="/admin/featured"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Star size={17} />
            Featured & Key
            <ChevronRight size={13} className="ml-auto" />
          </a>
        </nav>

        <div className="p-3 border-t border-gray-700">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mb-1"
          >
            <LayoutDashboard size={17} />
            ดูหน้าเว็บ
            <ChevronRight size={14} className="ml-auto" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut size={17} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tab === 'projects' ? 'จัดการโครงการ' : 'จัดการลูกค้า'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {tab === 'projects' ? `${projects.length} โครงการทั้งหมด` : `${clients.length} ลูกค้าทั้งหมด`}
              </p>
            </div>
            <button
              onClick={() => {
                if (tab === 'projects') {
                  setEditingProject(null)
                  setShowProjectForm(true)
                } else {
                  setEditingClient(null)
                  setShowClientForm(true)
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              <Plus size={17} />
              {tab === 'projects' ? 'เพิ่มโครงการ' : 'เพิ่มลูกค้า'}
            </button>
          </div>

          <div className="relative mb-5">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {tab === 'projects' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">ชื่อโครงการ</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">ประเภท</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">จังหวัด</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">ปี</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">สถานะ</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-1">{project.name}</p>
                        {project.clients && (
                          <p className="text-xs text-gray-400 mt-0.5">{project.clients.name}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {project.project_type && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {project.project_type}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{project.province ?? '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{project.year ?? '-'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {project.status === 'active' ? 'เผยแพร่' : 'ซ่อน'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditingProject(project); setShowProjectForm(true) }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(project.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <FolderOpen size={36} className="mx-auto mb-3 opacity-30" />
                  <p>ไม่พบโครงการ</p>
                </div>
              )}
            </div>
          )}

          {tab === 'clients' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <Users size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setEditingClient(client); setShowClientForm(true) }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(client.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                  {client.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{client.description}</p>
                  )}
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="col-span-3 py-16 text-center text-gray-400">
                  <Users size={36} className="mx-auto mb-3 opacity-30" />
                  <p>ไม่พบลูกค้า</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
            <p className="text-sm text-gray-600 mb-5">ต้องการลบรายการนี้ใช่หรือไม่? ไม่สามารถกู้คืนได้</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (tab === 'projects') deleteProject(deleteConfirm)
                  else deleteClient(deleteConfirm)
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <AdminProjectForm
          project={editingProject}
          clients={clients}
          onClose={() => { setShowProjectForm(false); setEditingProject(null) }}
          onSaved={async () => {
            await refreshProjects()
            setShowProjectForm(false)
            setEditingProject(null)
          }}
        />
      )}

      {/* Client Form Modal */}
      {showClientForm && (
        <AdminClientForm
          client={editingClient}
          onClose={() => { setShowClientForm(false); setEditingClient(null) }}
          onSaved={async () => {
            await refreshClients()
            setShowClientForm(false)
            setEditingClient(null)
          }}
        />
      )}
    </div>
  )
}
