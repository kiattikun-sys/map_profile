'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #8C7355, #B39B7C, #CDB99A)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="text-white p-1.5 rounded-lg" style={{ background: 'var(--gold)', boxShadow: '0 2px 10px rgba(179,155,124,0.35)' }}>
                <MapPin size={16} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-white font-black text-[15px] tracking-[-0.02em] block leading-none">TRIPIRA</span>
                <span className="text-slate-500 text-[11px] tracking-wide">บริษัท ไตรพีระ จำกัด</span>
              </div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-5">
              ออกแบบภูมิสถาปัตยกรรม วิศวกรรม และสำรวจชั้นนำ<br />
              รับความไว้วางใจจาก กรมโยธาธิการฯ Bangchak PTT และ Lotus's
            </p>
            <div className="flex gap-2.5">
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center transition-colors duration-200" style={{}} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='#B39B7C'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=''}>
                <Facebook size={14} className="text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200">
                <span className="text-slate-400 text-[10px] font-bold">LINE</span>
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-slate-300 font-semibold text-[13px] tracking-[-0.01em] mb-4">เมนูหลัก</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'แผนที่โครงการ' },
                { href: '/projects', label: 'โครงการทั้งหมด' },
                { href: '/clients', label: 'ลูกค้าของเรา' },
                { href: '/about', label: 'เกี่ยวกับเรา' },
                { href: '/contact', label: 'ติดต่อเรา' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-slate-500 hover:text-white transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-slate-300 font-semibold text-[13px] tracking-[-0.01em] mb-4">บริการ</h3>
            <ul className="space-y-2.5">
              {[
                'ภูมิสถาปัตยกรรม',
                'วิศวกรรมโยธา',
                'งานสำรวจ Geomatics',
                'ออกแบบอาคาร',
                'บริหารโครงการ (PM/CM)',
                'ที่ปรึกษาและออกแบบ',
              ].map((s) => (
                <li key={s} className="text-[13px] text-slate-500">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-300 font-semibold text-[13px] tracking-[-0.01em] mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} strokeWidth={2} />
                <span className="text-[13px] text-slate-500 leading-relaxed">46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ 10230</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="flex-shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={2} />
                <a href="tel:0809961080" className="text-[13px] text-slate-500 hover:text-white transition-colors duration-150">080-996-1080 (พีรพงษ์)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="flex-shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={2} />
                <a href="tel:0847463969" className="text-[13px] text-slate-500 hover:text-white transition-colors duration-150">084-746-3969 (ริณยพัทธ์)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="flex-shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={2} />
                <a href="mailto:contact@tripira.co.th" className="text-[13px] text-slate-500 hover:text-white transition-colors duration-150">contact@tripira.co.th</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-slate-600">© {new Date().getFullYear()} บริษัท ไตรพีระ จำกัด (TRIPIRA CO.,LTD.) · สงวนลิขสิทธิ์</span>
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-[12px] text-slate-700 tracking-wide">ภูมิสถาปัตยกรรม · วิศวกรรม · Geomatics Survey</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-white transition-colors duration-200"
            >
              <ArrowUp size={12} strokeWidth={2} /> กลับด้านบน
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
