'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Facebook, Building2, Copy, Check } from 'lucide-react'

type CopiedKey = string | null

export default function ContactClient() {
  const [copied, setCopied] = useState<CopiedKey>(null)

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CONTACT_ITEMS = [
    { key: 'company', icon: Building2, title: 'บริษัท',          content: 'บริษัท ไตรพีระ จำกัด (TRIPIRA CO.,LTD.)',                                        color: 'blue',   copyVal: 'TRIPIRA CO.,LTD.' },
    { key: 'address', icon: MapPin,    title: 'ที่อยู่',          content: '46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230',              color: 'blue',   copyVal: '46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230' },
    { key: 'pm',      icon: Phone,     title: 'Project Manager', content: 'พีรพงษ์ ทับนิล · 080-996-1080',                                                   color: 'green',  copyVal: '0809961080' },
    { key: 'am',      icon: Phone,     title: 'Account Manager', content: 'ริณยพัทธ์ แทนสกุล · 084-746-3969',                                               color: 'green',  copyVal: '0847463969' },
    { key: 'email',   icon: Mail,      title: 'อีเมล',            content: 'contact@tripira.co.th',                                                           color: 'purple', copyVal: 'contact@tripira.co.th' },
    { key: 'hours',   icon: Clock,     title: 'เวลาทำการ',       content: 'จันทร์ – ศุกร์  08:00 – 17:00 น. (เสาร์ 09:00 – 12:00 น.)',                      color: 'amber',  copyVal: null },
  ]

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    amber:  'bg-amber-100 text-amber-700',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลการติดต่อ</h2>
            <div className="space-y-3">
              {CONTACT_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{item.title}</p>
                    <p className="text-gray-800 font-medium mt-0.5 leading-snug">{item.content}</p>
                  </div>
                  {item.copyVal && (
                    <button
                      onClick={() => copyText(item.key, item.copyVal!)}
                      className="flex-shrink-0 self-center p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="คัดลอก"
                    >
                      {copied === item.key
                        ? <Check size={14} className="text-green-500" />
                        : <Copy size={14} />
                      }
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">ติดตามเราได้ที่</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Facebook size={16} /> Facebook
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <span className="font-bold text-xs">LINE</span> LINE Official
              </a>
            </div>
          </div>

          {/* Regions */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <h3 className="font-semibold text-red-900 mb-3">พื้นที่ปฏิบัติงานหลัก</h3>
            <ul className="space-y-2 text-sm text-red-900">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                <span>สำนักงานใหญ่: 46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                <span>ภาคอีสาน: นครพนม มหาสารคาม ร้อยเอ็ด บึงกาฬ หนองคาย</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                <span>ภาคกลาง: กรุงเทพฯ สิงห์บุรี และภาคใต้: ชุมพร</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ</label>
                <input type="text" placeholder="ชื่อของคุณ"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">นามสกุล</label>
                <input type="text" placeholder="นามสกุลของคุณ"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
              <input type="email" placeholder="example@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
              <input type="tel" placeholder="08X-XXX-XXXX"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">หัวข้อ</label>
              <input type="text" placeholder="หัวข้อที่ต้องการติดต่อ"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ข้อความ</label>
              <textarea rows={5} placeholder="รายละเอียดที่ต้องการติดต่อ..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 active:scale-[0.99] transition-all font-medium text-sm"
            >
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
