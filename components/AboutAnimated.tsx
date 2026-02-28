'use client'

import { motion, type Variants, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import {
  Building2, Users, MapPin, Award, Target, Eye,
  CheckCircle2, Briefcase, GraduationCap, Wrench,
  TreePine, HardHat, ScanLine, Phone, ArrowRight,
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
  { icon: Building2, label: 'โครงการที่ดำเนินการแล้ว', value: 200, suffix: '+', color: 'blue' },
  { icon: MapPin,    label: 'จังหวัดทั่วประเทศ',        value: 30,  suffix: '+', color: 'green' },
  { icon: Users,     label: 'ลูกค้าภาครัฐและเอกชน',     value: 10,  suffix: '+', color: 'purple' },
  { icon: Award,     label: 'ปีประสบการณ์',              value: 15,  suffix: '+', color: 'amber' },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: 1800, bounce: 0 })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, motionVal, value])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix
    })
  }, [spring, suffix])

  return <span ref={ref}>0{suffix}</span>
}

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
      {/* Hero — Split Layout */}
      <div className="brand-hero-gradient text-white overflow-hidden relative">
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-blue-400/[0.08] blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="brand-label">TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด</p>
              <div className="brand-divider opacity-60" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 tracking-[-0.025em]">
                ออกแบบพื้นที่สาธารณะ<br className="hidden sm:block" />
                ระดับชาติ ด้วยความเชี่ยวชาญจริง
              </h1>
              <p className="text-[15px] text-blue-200/80 leading-relaxed mb-8">
                บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ
                อาทิ กรมโยธาธิการและผังเมือง Bangchak PTT และ Lotus’s
                ด้วยผลงานมูลค่ารวมกว่า 1,500 ล้านบาททั่วประเทศ
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-xl text-[13.5px] font-bold hover:bg-blue-50 transition-colors duration-200" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  ดูโครงการ <ArrowRight size={14} strokeWidth={2.5} />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl text-[13.5px] font-semibold hover:bg-white/20 transition-colors duration-200">
                  ติดต่อเรา
                </a>
              </div>
            </motion.div>

            {/* Right — SVG Architecture Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Glow behind illustration */}
                <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-2xl" />
                <svg viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full drop-shadow-2xl">
                  {/* Sky gradient */}
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="bldg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08"/>
                    </linearGradient>
                    <linearGradient id="bldg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12"/>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04"/>
                    </linearGradient>
                  </defs>
                  {/* Background sky */}
                  <rect width="480" height="380" fill="url(#sky)" rx="20"/>

                  {/* Ground */}
                  <rect x="0" y="300" width="480" height="80" fill="url(#ground)" rx="0"/>
                  {/* Ground line */}
                  <line x1="0" y1="300" x2="480" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>

                  {/* Trees row */}
                  {[40,80,400,440].map((x,i) => (
                    <g key={i}>
                      <rect x={x-4} y="278" width="8" height="22" fill="rgba(255,255,255,0.15)" rx="2"/>
                      <ellipse cx={x} cy="270" rx="14" ry="18" fill="rgba(134,239,172,0.2)"/>
                      <ellipse cx={x} cy="264" rx="10" ry="14" fill="rgba(134,239,172,0.3)"/>
                    </g>
                  ))}

                  {/* Building 1 — tall center */}
                  <rect x="180" y="100" width="120" height="200" fill="url(#bldg1)" rx="4"/>
                  <rect x="180" y="100" width="120" height="200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" rx="4"/>
                  {/* Windows B1 */}
                  {[0,1,2,3,4,5,6,7].map(row => [0,1,2].map(col => (
                    <rect key={`b1-${row}-${col}`} x={190+col*36} y={115+row*22} width="20" height="14"
                      fill={row < 5 ? 'rgba(255,255,255,0.35)' : 'rgba(147,197,253,0.2)'} rx="2"/>
                  )))}
                  {/* Rooftop detail */}
                  <rect x="190" y="90" width="100" height="12" fill="rgba(255,255,255,0.2)" rx="3"/>
                  <rect x="220" y="78" width="40" height="14" fill="rgba(255,255,255,0.15)" rx="2"/>
                  <rect x="235" y="65" width="10" height="15" fill="rgba(255,255,255,0.3)" rx="1"/>

                  {/* Building 2 — left medium */}
                  <rect x="90" y="160" width="80" height="140" fill="url(#bldg2)" rx="3"/>
                  <rect x="90" y="160" width="80" height="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" rx="3"/>
                  {[0,1,2,3,4].map(row => [0,1].map(col => (
                    <rect key={`b2-${row}-${col}`} x={100+col*32} y={173+row*22} width="18" height="13"
                      fill="rgba(255,255,255,0.25)" rx="2"/>
                  )))}

                  {/* Building 3 — right short */}
                  <rect x="310" y="190" width="80" height="110" fill="url(#bldg2)" rx="3"/>
                  <rect x="310" y="190" width="80" height="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" rx="3"/>
                  {[0,1,2,3].map(row => [0,1].map(col => (
                    <rect key={`b3-${row}-${col}`} x={320+col*32} y={203+row*22} width="18" height="13"
                      fill="rgba(255,255,255,0.25)" rx="2"/>
                  )))}

                  {/* Road/path */}
                  <rect x="200" y="300" width="80" height="80" fill="rgba(255,255,255,0.08)"/>
                  <line x1="240" y1="300" x2="240" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="8 6"/>

                  {/* Trees/landscape elements */}
                  {[130,150,330,350].map((x,i) => (
                    <g key={`t2-${i}`}>
                      <rect x={x-3} y="285" width="6" height="15" fill="rgba(255,255,255,0.12)" rx="1"/>
                      <ellipse cx={x} cy="278" rx="10" ry="13" fill="rgba(134,239,172,0.15)"/>
                    </g>
                  ))}

                  {/* Stars/dots */}
                  {[[60,40],[120,25],[380,30],[430,50],[460,20],[50,80]].map(([x,y],i) => (
                    <circle key={`s-${i}`} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.5)"/>
                  ))}

                  {/* Moon/sun */}
                  <circle cx="420" cy="55" r="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  <circle cx="420" cy="55" r="12" fill="rgba(255,255,255,0.12)"/>

                  {/* Measurement lines — engineering detail */}
                  <line x1="180" y1="340" x2="300" y2="340" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <line x1="180" y1="335" x2="180" y2="345" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <line x1="300" y1="335" x2="300" y2="345" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <text x="240" y="338" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">120.00 m.</text>

                  {/* Compass rose — top right */}
                  <g transform="translate(448,45)">
                    <circle cx="0" cy="0" r="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <polygon points="0,-12 -3,-4 3,-4" fill="rgba(255,255,255,0.6)"/>
                    <text x="0" y="-14" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace">N</text>
                  </g>
                </svg>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                >
                  <div className="w-9 h-9 bg-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award size={16} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-slate-900 leading-none">15+ ปี</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">ประสบการณ์</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-4 -right-2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
                >
                  <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-slate-900 leading-none">200+ โครงการ</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">ทั่วประเทศ</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
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
              <p className="text-3xl font-black text-slate-900 tracking-[-0.03em]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
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
