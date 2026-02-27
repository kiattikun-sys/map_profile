import dynamic from 'next/dynamic'

const AdminLoginClient = dynamic(() => import('@/components/admin/AdminLoginClient'), {
  ssr: false,
})

export default function AdminLoginPage() {
  return <AdminLoginClient />
}
