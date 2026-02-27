import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Phone, Mail, Clock, Facebook, Building2 } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">ติดต่อเรา</span>
          <h1 className="text-4xl font-bold mb-3">พร้อมรับฟังและให้บริการ</h1>
          <p className="text-blue-100 text-lg">ทีมผู้เชี่ยวชาญของเราพร้อมตอบทุกคำถามและให้คำปรึกษาด้านวิศวกรรม</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลการติดต่อ</h2>
              <div className="space-y-3">
                {[
                  { icon: Building2, title: 'บริษัท',     content: 'บริษัท แมพ โปรไฟล์ วิศวกรรม จำกัด', color: 'blue' },
                  { icon: MapPin,    title: 'ที่อยู่',     content: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110', color: 'blue' },
                  { icon: Phone,     title: 'โทรศัพท์',   content: '+66 2-123-4567', color: 'green' },
                  { icon: Mail,      title: 'อีเมล',       content: 'contact@mapprofile.co.th', color: 'purple' },
                  { icon: Clock,     title: 'เวลาทำการ',  content: 'จันทร์ – ศุกร์  08:00 – 17:00 น. (เสาร์ 09:00 – 12:00 น.)', color: 'amber' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.color === 'blue'   ? 'bg-blue-100 text-blue-700' :
                      item.color === 'green'  ? 'bg-green-100 text-green-700' :
                      item.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{item.title}</p>
                      <p className="text-gray-800 font-medium mt-0.5">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">ติดตามเราได้ที่</h3>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Facebook size={16} /> Facebook
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  <span className="font-bold text-xs">LINE</span> LINE Official
                </a>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">สาขาภูมิภาค</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2"><MapPin size={13} /> สาขาเชียงใหม่: 456 ถนนนิมมานเหมินทร์ เชียงใหม่ 50200</li>
                <li className="flex items-center gap-2"><MapPin size={13} /> สาขาขอนแก่น: 789 ถนนมิตรภาพ ขอนแก่น 40000</li>
                <li className="flex items-center gap-2"><MapPin size={13} /> สาขาสงขลา: 321 ถนนกาญจนวณิชย์ สงขลา 90000</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ</label>
                  <input
                    type="text"
                    placeholder="ชื่อของคุณ"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">นามสกุล</label>
                  <input
                    type="text"
                    placeholder="นามสกุลของคุณ"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">หัวข้อ</label>
                <input
                  type="text"
                  placeholder="หัวข้อที่ต้องการติดต่อ"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ข้อความ</label>
                <textarea
                  rows={5}
                  placeholder="รายละเอียดที่ต้องการติดต่อ..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors font-medium text-sm"
              >
                ส่งข้อความ
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
