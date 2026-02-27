import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Building2, Users, MapPin, Award, Target, Eye,
  CheckCircle2, Briefcase, GraduationCap, Wrench,
  Droplets, Zap, TreePine, Ship, HardHat,
} from 'lucide-react'

const STATS = [
  { icon: Building2, label: 'โครงการที่ดำเนินการแล้ว', value: '500+', color: 'blue' },
  { icon: MapPin, label: 'จังหวัดทั่วประเทศ', value: '77', color: 'green' },
  { icon: Users, label: 'ลูกค้าและหน่วยงาน', value: '120+', color: 'purple' },
  { icon: Award, label: 'ปีประสบการณ์', value: '20+', color: 'amber' },
]

const SERVICES = [
  { icon: HardHat,    title: 'วิศวกรรมโยธา',      desc: 'ออกแบบและก่อสร้างสะพาน ถนน โครงสร้างพื้นฐาน และงานโยธาขนาดใหญ่' },
  { icon: Wrench,     title: 'ระบบสาธารณูปโภค',   desc: 'วางระบบประปา ไฟฟ้า โทรคมนาคม สำหรับชุมชน เมือง และนิคมอุตสาหกรรม' },
  { icon: Droplets,   title: 'งานชลประทาน',        desc: 'ก่อสร้างเขื่อน ฝาย อ่างเก็บน้ำ และระบบส่งน้ำเพื่อการเกษตร' },
  { icon: Building2,  title: 'ก่อสร้างอาคาร',      desc: 'อาคารสำนักงาน โรงพยาบาล โรงงาน ศูนย์ราชการ มาตรฐาน ISO 9001' },
  { icon: Zap,        title: 'ระบบไฟฟ้าแรงสูง',    desc: 'สายส่ง 115–230 kV สถานีไฟฟ้าย่อย และระบบจำหน่ายไฟฟ้าชนบท' },
  { icon: Ship,       title: 'งานท่าเรือ',          desc: 'ก่อสร้างท่าเทียบเรือ ถมทะเล และโครงสร้างงานทางน้ำ' },
  { icon: TreePine,   title: 'ภูมิสถาปัตยกรรม',   desc: 'ออกแบบสวนสาธารณะ พื้นที่สีเขียว และงานภูมิทัศน์เมือง' },
  { icon: Briefcase,  title: 'ที่ปรึกษาโครงการ',   desc: 'PM/CM บริหารโครงการ ควบคุมงาน และให้คำปรึกษาด้านวิศวกรรม' },
]

const TEAM = [
  { name: 'ดร.สมชาย วิศวกรรมไทย',  role: 'กรรมการผู้จัดการ',            exp: 'วศ.ด. จุฬาลงกรณ์มหาวิทยาลัย · ประสบการณ์ 28 ปี' },
  { name: 'นางสาวนภาพร ชัยโกศล',   role: 'ผู้อำนวยการฝ่ายวิศวกรรม',    exp: 'วศ.ม. มหาวิทยาลัยเกษตรศาสตร์ · ประสบการณ์ 22 ปี' },
  { name: 'นายอนันต์ สมิทธิวงศ์',   role: 'หัวหน้าฝ่ายก่อสร้าง',         exp: 'วศ.บ. มหาวิทยาลัยขอนแก่น · ประสบการณ์ 18 ปี' },
  { name: 'นางวาสนา ธนกิจมั่นคง',   role: 'ผู้อำนวยการฝ่ายการเงิน',     exp: 'MBA จุฬาลงกรณ์มหาวิทยาลัย · ประสบการณ์ 15 ปี' },
]

const CERTS = [
  'ISO 9001:2015 ระบบบริหารคุณภาพ',
  'ISO 14001:2015 ระบบจัดการสิ่งแวดล้อม',
  'ISO 45001:2018 ระบบบริหารอาชีวอนามัยและความปลอดภัย',
  'มาตรฐาน TISI วิศวกรรมและก่อสร้าง',
  'สมาชิกสมาคมวิศวกรรมสถานแห่งประเทศไทย (วสท.)',
  'ใบอนุญาตผู้รับจ้างก่อสร้าง ชั้น 1 กระทรวงมหาดไทย',
]

const MILESTONES = [
  { year: '2547', title: 'ก่อตั้งบริษัท', desc: 'เริ่มต้นด้วยทีมวิศวกร 12 คน รับงานโยธาขนาดเล็ก' },
  { year: '2552', title: 'ขยายสู่งานภูมิภาค', desc: 'เปิดสาขาในภาคเหนือและอีสาน รับงานโครงการรัฐ' },
  { year: '2558', title: 'ได้รับ ISO 9001', desc: 'ผ่านการรับรองมาตรฐานคุณภาพสากล ISO 9001:2015' },
  { year: '2562', title: 'ก้าวสู่ 300 โครงการ', desc: 'ดำเนินโครงการสะสมเกิน 300 โครงการทั่วประเทศ' },
  { year: '2566', title: 'นวัตกรรมดิจิทัล', desc: 'เปิดตัว Map Profile ระบบบริหารโครงการด้วย GIS' },
  { year: '2567', title: 'ขยายสู่ ASEAN', desc: 'รับงานโครงการในเมียนมาและ สปป.ลาว' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="pt-16 flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-300 mb-4">
                บริษัท แมพ โปรไฟล์ วิศวกรรม จำกัด
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                สร้างโครงสร้างพื้นฐาน<br className="hidden md:block" />
                ที่ยั่งยืนให้ประเทศไทย
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                บริษัทวิศวกรรมและก่อสร้างชั้นนำที่มีประสบการณ์กว่า 20 ปี
                ในการดำเนินโครงการขนาดใหญ่ทั่วทุกภาคของประเทศ
                ด้วยทีมวิศวกรมืออาชีพกว่า 350 คน และมาตรฐาน ISO ระดับสากล
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                  stat.color === 'blue'   ? 'bg-blue-100 text-blue-700' :
                  stat.color === 'green'  ? 'bg-green-100 text-green-700' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  <stat.icon size={22} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={18} className="text-white" />
                </div>
                พันธกิจของเรา
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                มุ่งมั่นพัฒนาโครงสร้างพื้นฐานของประเทศด้วยมาตรฐานคุณภาพสูงสุด
                ตรงต่อเวลา และอยู่ในงบประมาณที่กำหนด เพื่อยกระดับคุณภาพชีวิตของประชาชน
              </p>
              <p className="text-gray-600 leading-relaxed">
                เราให้ความสำคัญกับความปลอดภัยในการทำงาน สิ่งแวดล้อม
                และการมีส่วนร่วมของชุมชนในทุกโครงการที่เราดำเนินการ
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye size={18} className="text-white" />
                </div>
                วิสัยทัศน์
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                เป็นบริษัทวิศวกรรมและก่อสร้างชั้นนำของอาเซียนภายในปี 2570
                โดยใช้นวัตกรรม BIM เทคโนโลยี GIS และ AI ในการบริหารโครงการ
              </p>
              <p className="text-gray-600 leading-relaxed">
                สร้างผลงานที่โดดเด่น ได้มาตรฐานสากล และเป็นที่ยอมรับของลูกค้า
                ทั้งภาครัฐและเอกชนทั้งในและต่างประเทศ
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">บริการของเรา</h2>
            <p className="text-gray-500 mb-8">ครอบคลุมทุกด้านของงานวิศวกรรมและก่อสร้าง</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <s.icon size={20} className="text-blue-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">เส้นทางของเรา</h2>
            <p className="text-gray-500 mb-8">จากจุดเริ่มต้นสู่บริษัทวิศวกรรมชั้นนำ</p>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-100 hidden md:block" />
              <div className="space-y-6">
                {MILESTONES.map((m, i) => (
                  <div key={m.year} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-md z-10">
                      {m.year.slice(2)}
                    </div>
                    <div className={`flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${i % 2 === 0 ? '' : 'border-l-4 border-l-blue-200'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{m.year}</span>
                        <h3 className="font-semibold text-gray-900">{m.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ทีมผู้บริหาร</h2>
            <p className="text-gray-500 mb-8">ผู้เชี่ยวชาญที่มีประสบการณ์และความมุ่งมั่น</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-snug mb-1">{t.name}</h3>
                  <p className="text-sm text-blue-700 font-medium mb-2">{t.role}</p>
                  <p className="text-xs text-gray-400">{t.exp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">มาตรฐานและการรับรอง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CERTS.map((c) => (
                <div key={c} className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{c}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
