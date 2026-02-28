'use client'

import { motion, type Variants } from 'framer-motion'
import {
  Building2, Users, MapPin, Award, Target, Eye,
  CheckCircle2, Briefcase, GraduationCap, Wrench,
  TreePine, HardHat, ScanLine, Phone,
} from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutAnimated() {
  return (
    <div className="pt-[60px] flex-1">
      {/* Hero */}
      <div className="brand-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-22">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl"
          >
            <p className="brand-label">TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด</p>
            <div className="brand-divider opacity-60" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 tracking-[-0.025em]">
              ออกแบบพื้นที่สาธารณะ<br className="hidden md:block" />
              ระดับชาติ ด้วยความเชี่ยวชาญจริง
            </h1>
            <p className="text-[15px] text-blue-200/80 leading-relaxed max-w-2xl">
              บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ
              อาทิ กรมโยธาธิการและผังเมือง Bangchak PTT และ Lotus’s
              ด้วยผลงานมูลค่ารวมกว่า 1,500 ล้านบาททั่วประเทศ
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 text-center transition-all duration-300"
              style={{ boxShadow: 'var(--shadow-md)' }}
              whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 ${
                stat.color === 'blue'   ? 'bg-blue-50 text-blue-700' :
                stat.color === 'green'  ? 'bg-emerald-50 text-emerald-700' :
                stat.color === 'purple' ? 'bg-violet-50 text-violet-700' :
                'bg-amber-50 text-amber-600'
              }`}>
                <stat.icon size={20} strokeWidth={1.8} />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-[-0.03em]">{stat.value}</p>
              <p className="text-[12.5px] text-slate-500 mt-1 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">

        {/* Mission & Vision */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h2 className="text-[17px] font-bold text-slate-900 mb-4 flex items-center gap-3 tracking-[-0.01em]">
                <div className="w-9 h-9 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={16} className="text-white" strokeWidth={2} />
                </div>
                พันธกิจของเรา
              </h2>
              <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">
                บริษัท ไตรพีระ จำกัด มุ่งมั่นออกแบบและพัฒนาพื้นที่สาธารณะ
                ภูมิทัศน์เมือง และโครงสร้างพื้นฐานให้มีคุณภาพสูงสุด
                ตอบสนองความต้องการของชุมชนและหน่วยงานรัฐอย่างแท้จริง
              </p>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">
                เราเน้นความแม่นยำในการสำรวจ ความสร้างสรรค์ในการออกแบบ
                และความรับผิดชอบในการส่งมอบงานตรงเวลาและงบประมาณ
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h2 className="text-[17px] font-bold text-slate-900 mb-4 flex items-center gap-3 tracking-[-0.01em]">
                <div className="w-9 h-9 bg-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye size={16} className="text-white" strokeWidth={2} />
                </div>
                วิสัยทัศน์
              </h2>
              <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">
                เป็นบริษัทออกแบบภูมิสถาปัตยกรรมและวิศวกรรมชั้นนำของไทย
                ที่บูรณาการเทคโนโลยี GIS Drone Survey และ Digital Platform
                เข้ากับงานออกแบบระดับชาติ
              </p>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">
                สร้างพื้นที่สาธารณะที่มีคุณค่า ยั่งยืน และเป็นที่ภาคภูมิใจ
                ของชุมชน ท้องถิ่น และประเทศ
              </p>
            </div>
          </div>
        </Section>

        {/* Services */}
        <Section>
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 mb-1 tracking-[-0.02em]">บริการของเรา</h2>
            <div className="brand-divider" />
          </div>
          <p className="text-[13.5px] text-slate-500 mb-8 -mt-4">ครอบคลุมทุกด้านของงานวิศวกรรมและก่อสร้าง</p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-5 border border-slate-200/60 transition-all duration-300 group"
                style={{ boxShadow: 'var(--shadow-sm)' }}
                whileHover={{ y: -2, boxShadow: 'var(--shadow-md)', borderColor: '#bfdbfe' }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-200">
                  <s.icon size={18} className="text-blue-800" strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5 text-[14px] tracking-[-0.01em]">{s.title}</h3>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Timeline */}
        <Section>
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 mb-1 tracking-[-0.02em]">เส้นทางของเรา</h2>
            <div className="brand-divider" />
          </div>
          <p className="text-[13.5px] text-slate-500 mb-8 -mt-4">จากจุดเริ่มต้นสู่บริษัทวิศวกรรมชั้นนำ</p>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="space-y-6"
            >
              {MILESTONES.map((m, i) => (
                <motion.div key={m.year} variants={fadeUp} className="flex gap-6">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-800 text-white flex items-center justify-center text-[11px] font-black z-10 tracking-tight" style={{ boxShadow: '0 2px 10px rgba(30,58,138,0.3)' }}>
                    {m.year.slice(2)}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{m.year}</span>
                      <h3 className="font-semibold text-slate-900 text-[14px] tracking-[-0.01em]">{m.title}</h3>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* Team */}
        <Section>
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 mb-1 tracking-[-0.02em]">ทีมผู้บริหาร</h2>
            <div className="brand-divider" />
          </div>
          <p className="text-[13.5px] text-slate-500 mb-8 -mt-4">ผู้เชี่ยวชาญด้านวิศวกรรม ภูมิสถาปัตย์ และงานสำรวจ</p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl"
          >
            {TEAM.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center gap-4 transition-all duration-300"
                style={{ boxShadow: 'var(--shadow-sm)' }}
                whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 2px 8px rgba(30,58,138,0.25)' }}>
                  <GraduationCap size={20} className="text-white" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 leading-snug mb-0.5 text-[14px] tracking-[-0.01em]">{t.name}</h3>
                  <p className="text-[12.5px] text-blue-700 font-semibold mb-1">{t.role}</p>
                  <p className="text-[12px] text-slate-400 flex items-center gap-1"><Phone size={10} strokeWidth={2} /> {t.exp}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Certifications */}
        <Section>
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h2 className="text-[22px] font-bold text-slate-900 mb-1 tracking-[-0.02em]">ความเชี่ยวชาญและจุดแข็ง</h2>
            <div className="brand-divider mb-6" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {CERTS.map((c) => (
                <motion.div
                  key={c}
                  variants={fadeUp}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-blue-50 hover:border-blue-100 transition-colors duration-200"
                >
                  <CheckCircle2 size={15} className="text-blue-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-[13px] text-slate-700 font-medium leading-snug">{c}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

      </div>
    </div>
  )
}
