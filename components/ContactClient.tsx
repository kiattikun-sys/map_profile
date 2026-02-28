'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Facebook, Building2, Copy, Check } from 'lucide-react'
import { SETTINGS_DEFAULTS } from '@/lib/site-content'

type CopiedKey = string | null

interface Props {
  settings?: Record<string, string>
}

export default function ContactClient({ settings = {} }: Props) {
  const s = { ...SETTINGS_DEFAULTS, ...settings }
  const [copied, setCopied] = useState<CopiedKey>(null)

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CONTACT_ITEMS = [
    { key: 'company', icon: Building2, title: 'บริษัท',          content: 'บริษัท ไตรพีระ จำกัด (TRIPIRA CO.,LTD.)',                                        color: 'blue',   copyVal: 'TRIPIRA CO.,LTD.' },
    { key: 'address', icon: MapPin,    title: 'ที่อยู่',          content: s.address,                                                                        color: 'blue',   copyVal: s.address },
    { key: 'pm',      icon: Phone,     title: 'Project Manager', content: `พีรพงษ์ ทับนิล · ${s.phone_pm}`,                                          color: 'green',  copyVal: s.phone_pm.replace(/-/g, '') },
    { key: 'am',      icon: Phone,     title: 'Account Manager', content: `ริณยพัทธ์ แทนสกุล · ${s.phone_am}`,                                        color: 'green',  copyVal: s.phone_am.replace(/-/g, '') },
    { key: 'email',   icon: Mail,      title: 'อีเมล',            content: s.email,                                                                           color: 'purple', copyVal: s.email },
    { key: 'hours',   icon: Clock,     title: 'เวลาทำการ',       content: 'จันทร์ – ศุกร์  08:00 – 17:00 น. (เสาร์ 09:00 – 12:00 น.)',                      color: 'amber',  copyVal: null },
  ]

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-50 text-blue-700',
    green:  'bg-emerald-50 text-emerald-700',
    purple: 'bg-violet-50 text-violet-700',
    amber:  'bg-amber-50 text-amber-600',
  }

  return (
    <div className="flex-1" style={{ background: 'var(--background)' }}>

      {/* Map embed full-width — CMS map_url or default */}
      <div className="w-full overflow-hidden" style={{ height: '320px' }}>
        <iframe
          src={s.map_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.8234!2d100.6627!3d13.8052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d616e5d5e37bf%3A0x7e8b5c0a2b6e3c4f!2z4666178%20%E0%B8%96%E0%B8%99%E0%B8%99%E0%B8%99%E0%B8%A7%E0%B8%A5%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%20%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%99%E0%B8%A7%E0%B8%A5%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%20%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%9A%E0%B8%B6%E0%B8%87%E0%B8%81%E0%B8%B8%E0%B9%88%E0%B8%A1%20%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%2010230!5e0!3m2!1sth!2sth!4v1700000000000'}
          width="100%"
          height="320"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TRIPIRA Office Location"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left col — 2/5 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Section header */}
            <div>
              <h2 className="text-[22px] font-bold text-slate-900 tracking-[-0.02em] mb-1">ข้อมูลติดต่อ</h2>
              <div className="brand-divider" />
            </div>

            {/* Contact cards */}
            <div className="space-y-2.5">
              {CONTACT_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-3.5 p-4 bg-white rounded-2xl border border-slate-200/60 group hover:border-blue-200 transition-all duration-200"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                    <item.icon size={16} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em]">{item.title}</p>
                    <p className="text-[13px] text-slate-800 font-medium mt-0.5 leading-snug">{item.content}</p>
                  </div>
                  {item.copyVal && (
                    <button
                      onClick={() => copyText(item.key, item.copyVal!)}
                      className="flex-shrink-0 self-center p-1.5 rounded-lg text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                      title="คัดลอก"
                    >
                      {copied === item.key
                        ? <Check size={13} className="text-emerald-500" />
                        : <Copy size={13} />
                      }
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="text-[13px] font-semibold text-slate-700 mb-3">ติดตามเราได้ที่</h3>
              <div className="flex gap-2.5">
                <a href={s.facebook_url || '#'} className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors duration-150 text-[13px] font-semibold">
                  <Facebook size={14} strokeWidth={2} /> Facebook
                </a>
                <a href={s.line_url || '#'} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-150 text-[13px] font-semibold">
                  <span className="font-black text-[11px]">LINE</span> Official
                </a>
              </div>
            </div>

            {/* Coverage areas */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-[13px] font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <MapPin size={14} strokeWidth={2} className="text-blue-700" />
                พื้นที่ปฏิบัติงานหลัก
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'สำนักงานใหญ่', desc: '46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ' },
                  { label: 'ภาคอีสาน', desc: 'นครพนม มหาสารคาม ร้อยเอ็ด บึงกาฬ หนองคาย' },
                  { label: 'ภาคใต้-กลาง', desc: 'ชุมพร สิงห์บุรี และปริมณฑลกรุงเทพฯ' },
                ].map((r) => (
                  <li key={r.label} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    <div>
                      <span className="text-[12px] font-semibold text-blue-900">{r.label}: </span>
                      <span className="text-[12px] text-blue-700">{r.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right col — 3/5 — contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h2 className="text-[20px] font-bold text-slate-900 tracking-[-0.02em] mb-1">ส่งข้อความถึงเรา</h2>
              <div className="brand-divider mb-6" />
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">ชื่อ</label>
                    <input type="text" placeholder="ชื่อของคุณ"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">นามสกุล</label>
                    <input type="text" placeholder="นามสกุลของคุณ"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">อีเมล</label>
                    <input type="email" placeholder="example@email.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">เบอร์โทรศัพท์</label>
                    <input type="tel" placeholder="08X-XXX-XXXX"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">หัวข้อ</label>
                  <input type="text" placeholder="หัวข้อที่ต้องการติดต่อ"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">ข้อความ</label>
                  <textarea rows={5} placeholder="รายละเอียดที่ต้องการติดต่อ..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600/25 focus:border-blue-400 bg-slate-50 transition-all duration-150 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 active:scale-[0.99] transition-all duration-150 font-semibold text-[13.5px] tracking-[-0.01em]"
                  style={{ boxShadow: '0 4px 16px rgba(30,58,138,0.25)' }}
                >
                  ส่งข้อความ
                </button>
                <p className="text-[11.5px] text-slate-400 text-center">ทีมของเราจะตอบกลับภายใน  24 ชั่วโมงในวันทำการ</p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
