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
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d\u0e40\u0e23\u0e32</span>
          <h1 className="text-4xl font-bold mb-3">\u0e15\u0e34\u0e14\u0e15\u0e48\u0e2d TRIPIRA</h1>
          <p className="text-blue-100 text-lg">\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17 \u0e44\u0e15\u0e23\u0e1e\u0e35\u0e23\u0e30 \u0e08\u0e33\u0e01\u0e31\u0e14 \u2014 \u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e23\u0e31\u0e1a\u0e1f\u0e31\u0e07\u0e04\u0e27\u0e32\u0e21\u0e15\u0e49\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e14\u0e49\u0e32\u0e19\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e23\u0e21\u0e41\u0e25\u0e30\u0e20\u0e39\u0e21\u0e34\u0e2a\u0e16\u0e32\u0e1b\u0e31\u0e15\u0e22\u0e01\u0e23\u0e23\u0e21\u0e17\u0e38\u0e01\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a</p>
        </div>
      </div>
      <ContactClient />
      <Footer />
    </div>
  )
}
