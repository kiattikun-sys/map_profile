import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Building2, Users, MapPin, Award, Target, Eye,
  CheckCircle2, Briefcase, GraduationCap, Wrench,
  TreePine, HardHat, ScanLine, Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา',
  description: 'บริษัท ไตรพีระ จำกัด — ประวัติบริษัท ทีมงาน บริการ และวิสัยทัศน์ของผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรมและวิศวกรรมชั้นนำ ประสบการณ์กว่า 15 ปี',
  openGraph: {
    title: 'เกี่ยวกับ TRIPIRA | บริษัท ไตรพีระ จำกัด',
    description: 'ทีมผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรม วิศวกรรม และ Geomatics กว่า 15 ปี',
  },
}

const STATS = [
  { icon: Building2, label: 'โครงการที่ดำเนินการแล้ว', value: '200+', color: 'blue' },
  { icon: MapPin,    label: 'จังหวัดทั่วประเทศ',        value: '30+',  color: 'green' },
  { icon: Users,     label: 'ลูกค้าภาครัฐและเอกชน',     value: '10+',  color: 'purple' },
  { icon: Award,     label: 'ปีประสบการณ์',              value: '15+',  color: 'amber' },
]

const SERVICES = [
  { icon: TreePine,   title: 'ภูมิสถาปัตยกรรม',        desc: 'ออกแบบพัฒนาพื้นที่สาธารณะ ริมน้ำ สวนเทิดพระเกียรติ และภูมิทัศน์เมืองระดับชาติ' },
  { icon: HardHat,    title: 'วิศวกรรมโยธา',            desc: 'ออกแบบโครงสร้างพื้นฐาน สะพาน ทางเดินเท้า และกำแพงกันดินริมน้ำ' },
  { icon: ScanLine,   title: 'งานสำรวจและ Geomatics',   desc: 'Topographic Survey, Drone Mapping, งานสำรวจผังเมืองและพื้นที่เอกชนขนาดใหญ่' },
  { icon: Building2,  title: 'ออกแบบอาคาร',             desc: 'แบบมาตรฐานสถานีบริการน้ำมัน แบบขออนุญาตก่อสร้าง และอาคารพาณิชย์ขนาดใหญ่' },
  { icon: Wrench,     title: 'บริหารโครงการ (PM/CM)',    desc: 'ควบคุมงาน ตรวจงาน และบริหารโครงการก่อสร้างในพื้นที่ห่างไกล' },
  { icon: Briefcase,  title: 'ที่ปรึกษาและออกแบบ',      desc: 'ให้คำปรึกษาด้านวิศวกรรม งานศึกษาความเหมาะสม และออกแบบรายละเอียด' },
]

const TEAM = [
  { name: 'พีรพงษ์ ทับนิล',      role: 'Project Manager',   exp: 'ผู้จัดการโครงการ · โทร 080-996-1080' },
  { name: 'ริณยพัทธ์ แทนสกุล',  role: 'Account Manager',   exp: 'ผู้จัดการบัญชี · โทร 084-746-3969' },
]

const CERTS = [
  'จดทะเบียนบริษัทถูกต้องตามกฎหมาย กระทรวงพาณิชย์',
  'งานออกแบบภูมิสถาปัตยกรรมระดับชาติ — กรมโยธาธิการและผังเมือง',
  'งานสำรวจ Topographic และ Drone Mapping มาตรฐานสากล',
  'งานออกแบบอาคาร — ได้รับความไว้วางใจจาก Bangchak, PTT, Lotus\'s',
  'ประสบการณ์งานพระราชฐาน — ระดับความน่าเชื่อถือสูงสุด',
  'งานพัฒนาชุมชนริมน้ำโขง — ครอบคลุมกลุ่มจังหวัดภาคอีสาน',
]

const MILESTONES = [
  { year: '2552', title: 'ก่อตั้งบริษัท', desc: 'จดทะเบียน บริษัท ไตรพีระ จำกัด ที่อยู่ 46/178 ถ.นวลจันทร์ เขตบึงกุ่ม กรุงเทพฯ' },
  { year: '2560', title: 'งานพระราชฐาน', desc: 'ได้รับสัญญาปรับปรุงอาคารพระตำหนักจิตรดา กรมโยธาธิการฯ มูลค่า 12.5 ล้านบาท' },
  { year: '2561', title: 'Bangchak ระดับชาติ', desc: 'เริ่มงานแบบมาตรฐานสถานีบริการ Bangchak 249 สาขา — จุดเริ่มต้นงาน National Scale' },
  { year: '2563', title: 'อีสานกลาง ระยะที่ 1', desc: 'ออกแบบพัฒนาพื้นที่กลุ่มจังหวัดอีสานกลาง ร้อยเอ็ด มหาสารคาม นครพนม' },
  { year: '2564', title: 'ริมโขง นครพนม', desc: 'ออกแบบพัฒนาพื้นที่ริมแม่น้ำโขง 3 จุด นครพนม ระยะที่ 1 มูลค่ารวม 220 ล้านบาท' },
  { year: '2566', title: 'ชุมพร + สิงห์บุรี', desc: 'ปรับปรุงภูมิทัศน์ชายฝั่ง ชุมพร 221 ล้านบาท และสะพานสิงห์บุรี 60 ล้านบาท' },
  { year: '2567', title: 'Map Profile Platform', desc: 'เปิดตัวระบบ Map Profile — บริหารโครงการทั่วประเทศด้วย GIS Technology' },
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
                TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                ออกแบบพื้นที่สาธารณะ<br className="hidden md:block" />
                ระดับชาติ ด้วยความเชี่ยวชาญจริง
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ
                อาทิ กรมโยธาธิการและผังเมือง Bangchak PTT และ Lotus's
                ด้วยผลงานมูลค่ารวมกว่า 1,500 ล้านบาททั่วประเทศ
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
                บริษัท ไตรพีระ จำกัด มุ่งมั่นออกแบบและพัฒนาพื้นที่สาธารณะ
                ภูมิทัศน์เมือง และโครงสร้างพื้นฐานให้มีคุณภาพสูงสุด
                ตอบสนองความต้องการของชุมชนและหน่วยงานรัฐอย่างแท้จริง
              </p>
              <p className="text-gray-600 leading-relaxed">
                เราเน้นความแม่นยำในการสำรวจ ความสร้างสรรค์ในการออกแบบ
                และความรับผิดชอบในการส่งมอบงานตรงเวลาและงบประมาณ
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
                เป็นบริษัทออกแบบภูมิสถาปัตยกรรมและวิศวกรรมชั้นนำของไทย
                ที่บูรณาการเทคโนโลยี GIS Drone Survey และ Digital Platform
                เข้ากับงานออกแบบระดับชาติ
              </p>
              <p className="text-gray-600 leading-relaxed">
                สร้างพื้นที่สาธารณะที่มีคุณค่า ยั่งยืน และเป็นที่ภาคภูมิใจ
                ของชุมชน ท้องถิ่น และประเทศ
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
            <p className="text-gray-500 mb-8">ผู้เชี่ยวชาญด้านวิศวกรรม ภูมิสถาปัตย์ และงานสำรวจ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {TEAM.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-snug mb-0.5">{t.name}</h3>
                    <p className="text-sm text-red-700 font-medium mb-1">{t.role}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} /> {t.exp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ความเชี่ยวชาญและจุดแข็ง</h2>
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
