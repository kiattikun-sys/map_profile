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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Navbar />
      <div className="pt-[60px] brand-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="brand-label">ติดต่อเรา — TRIPIRA</p>
          <div className="brand-divider opacity-60" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-[-0.02em] leading-tight">ติดต่อ TRIPIRA</h1>
          <p className="text-blue-200/80 text-[15px] max-w-lg leading-relaxed">บริษัท ไตรพีระ จำกัด — พร้อมรับฟังความต้องการด้านวิศวกรรมและภูมิสถาปัตยกรรมทุกรูปแบบ</p>
        </div>
      </div>
      <ContactClient />
      <Footer />
    </div>
  )
}
