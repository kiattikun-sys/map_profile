import Navbar from '@/components/Navbar'
import { Building2, Users, MapPin, Award, Target, Eye } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                เกี่ยวกับเรา
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                บริษัทวิศวกรรมและก่อสร้างชั้นนำ ที่มีประสบการณ์กว่า 20 ปีในการดำเนินโครงการขนาดใหญ่
                ทั่วประเทศไทย ด้วยทีมงานมืออาชีพและเทคโนโลยีที่ทันสมัย
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Building2, label: 'โครงการทั้งหมด', value: '500+', color: 'blue' },
              { icon: MapPin, label: 'จังหวัดที่ทำงาน', value: '77', color: 'green' },
              { icon: Users, label: 'ลูกค้าที่วางใจ', value: '120+', color: 'purple' },
              { icon: Award, label: 'ปีประสบการณ์', value: '20+', color: 'amber' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  stat.color === 'green' ? 'bg-green-100 text-green-700' :
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <Target size={16} className="text-white" />
                </div>
                พันธกิจของเรา
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                มุ่งมั่นในการพัฒนาโครงสร้างพื้นฐานและสิ่งแวดล้อมที่ดีให้กับสังคมไทย
                ด้วยมาตรฐานสากลและความรับผิดชอบต่อสิ่งแวดล้อม
              </p>
              <p className="text-gray-600 leading-relaxed">
                เราเชื่อว่าการก่อสร้างที่ดีไม่ใช่เพียงแค่การสร้างสิ่งก่อสร้าง
                แต่คือการสร้างอนาคตที่ยั่งยืนให้กับชุมชน
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Eye size={16} className="text-white" />
                </div>
                วิสัยทัศน์
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                เป็นบริษัทวิศวกรรมและก่อสร้างชั้นนำของภูมิภาคอาเซียน
                ที่ใช้นวัตกรรมและเทคโนโลยีดิจิทัลในการบริหารโครงการ
              </p>
              <p className="text-gray-600 leading-relaxed">
                สร้างผลงานที่โดดเด่น มีคุณภาพ และตรงเวลา เพื่อตอบสนองความต้องการของลูกค้า
                และสร้างมูลค่าเพิ่มให้กับสังคม
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">บริการของเรา</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'งานวิศวกรรมโยธา', desc: 'ออกแบบและก่อสร้างโครงสร้างพื้นฐาน สะพาน ถนน และอาคาร' },
                { title: 'ระบบสาธารณูปโภค', desc: 'วางระบบประปา ไฟฟ้า และการสื่อสารสำหรับชุมชนและเมือง' },
                { title: 'งานชลประทาน', desc: 'ก่อสร้างฝาย อ่างเก็บน้ำ และระบบชลประทานเพื่อการเกษตร' },
                { title: 'ระบบระบายน้ำ', desc: 'ออกแบบและก่อสร้างระบบระบายน้ำเพื่อป้องกันน้ำท่วม' },
                { title: 'ภูมิสถาปัตยกรรม', desc: 'ออกแบบพื้นที่สีเขียวและสวนสาธารณะสำหรับชุมชน' },
                { title: 'ที่ปรึกษาโครงการ', desc: 'ให้บริการที่ปรึกษาด้านวิศวกรรมและบริหารโครงการ' },
              ].map((service) => (
                <div key={service.title} className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
