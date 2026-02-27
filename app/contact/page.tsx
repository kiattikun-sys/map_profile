import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactClient from '@/components/ContactClient'

export const metadata: Metadata = {
  title: 'ติดต่อเรา',
  description: 'ติดต่อบริษัท ไตรพีระ จำกัด — 46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ 10230 โทร 080-996-1080 อีเมล contact@tripira.co.th',
  openGraph: {
    title: 'ติดต่อ TRIPIRA | บริษัท ไตรพีระ จำกัด',
    description: '46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ 10230 — โทร 080-996-1080',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">ติดต่อเรา</span>
          <h1 className="text-4xl font-bold mb-3">ติดต่อ TRIPIRA</h1>
          <p className="text-blue-100 text-lg">บริษัท ไตรพีระ จำกัด — พร้อมรับฟังความต้องการด้านวิศวกรรมและภูมิสถาปัตยกรรมทุกรูปแบบ</p>
        </div>
      </div>
      <ContactClient />
      <Footer />
    </div>
  )
}
