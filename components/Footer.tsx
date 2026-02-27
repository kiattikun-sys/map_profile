import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <MapPin size={18} />
              </div>
              <span className="text-white font-bold text-lg">Map Profile</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              บริษัทวิศวกรรมและก่อสร้างชั้นนำ ประสบการณ์กว่า 20 ปี
              ดำเนินโครงการขนาดใหญ่ทั่วประเทศไทยและภูมิภาคอาเซียน
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Facebook size={16} className="text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                <span className="text-white text-xs font-bold">LINE</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">เมนูหลัก</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'แผนที่โครงการ' },
                { href: '/projects', label: 'โครงการทั้งหมด' },
                { href: '/clients', label: 'ลูกค้าของเรา' },
                { href: '/about', label: 'เกี่ยวกับเรา' },
                { href: '/contact', label: 'ติดต่อเรา' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">บริการ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                'วิศวกรรมโยธา',
                'ระบบสาธารณูปโภค',
                'งานชลประทาน',
                'ก่อสร้างอาคาร',
                'ระบบไฟฟ้าแรงสูง',
                'งานท่าเรือ',
              ].map((s) => (
                <li key={s} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">123 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-blue-400 flex-shrink-0" />
                <a href="tel:+6621234567" className="text-gray-400 hover:text-white transition-colors">+66 2-123-4567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:contact@mapprofile.co.th" className="text-gray-400 hover:text-white transition-colors">contact@mapprofile.co.th</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} บริษัท แมพ โปรไฟล์ วิศวกรรม จำกัด. สงวนลิขสิทธิ์</span>
          <span>ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018</span>
        </div>
      </div>
    </footer>
  )
}
