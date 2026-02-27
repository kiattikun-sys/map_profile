import Link from 'next/link'
import { MapPin, Home, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — ไม่พบหน้านี้',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin size={52} className="text-blue-400" />
          </div>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">404</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">ไม่พบหน้านี้</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors font-medium"
          >
            <Home size={16} /> กลับหน้าแผนที่
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:border-blue-400 hover:text-blue-700 transition-colors font-medium"
          >
            <ArrowLeft size={16} /> ดูโครงการทั้งหมด
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">TRIPIRA CO.,LTD. — ภูมิสถาปัตยกรรม · วิศวกรรม · Geomatics</p>
      </div>
    </div>
  )
}
