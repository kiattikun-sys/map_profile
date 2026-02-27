import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-700 text-white p-1.5 rounded-lg">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-white font-bold text-lg block leading-none">TRIPIRA</span>
                <span className="text-red-400 text-xs">บริษัท ไตรพีระ จำกัด</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              ออกแบบภูมิสถาปัตยกรรม วิศวกรรม และสำรวจชั้นนำ
              รับความไว้วางใจจาก กรมโยธาธิการฯ Bangchak PTT และ Lotus's
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
                'ภูมิสถาปัตยกรรม',
                'วิศวกรรมโยธา',
                'งานสำรวจ Geomatics',
                'ออกแบบอาคาร',
                'บริหารโครงการ (PM/CM)',
                'ที่ปรึกษาและออกแบบ',
              ].map((s) => (
                <li key={s} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ 10230</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-red-400 flex-shrink-0" />
                <a href="tel:0809961080" className="text-gray-400 hover:text-white transition-colors">080-996-1080 (พีรพงษ์)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-red-400 flex-shrink-0" />
                <a href="tel:0847463969" className="text-gray-400 hover:text-white transition-colors">084-746-3969 (ริณยพัทธ์)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-red-400 flex-shrink-0" />
                <a href="mailto:contact@tripira.co.th" className="text-gray-400 hover:text-white transition-colors">contact@tripira.co.th</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} บริษัท ไตรพีระ จำกัด (TRIPIRA CO.,LTD.). สงวนลิขสิทธิ์</span>
          <span>ภูมิสถาปัตยกรรม · วิศวกรรม · Geomatics Survey</span>
        </div>
      </div>
    </footer>
  )
}
