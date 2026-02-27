import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AboutAnimated from '@/components/AboutAnimated'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา',
  description: 'บริษัท ไตรพีระ จำกัด — ประวัติบริษัท ทีมงาน บริการ และวิสัยทัศน์ของผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรมและวิศวกรรมชั้นนำ ประสบการณ์กว่า 15 ปี',
  openGraph: {
    title: 'เกี่ยวกับ TRIPIRA | บริษัท ไตรพีระ จำกัด',
    description: 'ทีมผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรม วิศวกรรม และ Geomatics กว่า 15 ปี',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <AboutAnimated />
      <Footer />
    </div>
  )
}
