import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import BackToTop from '@/components/BackToTop';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://map-profile.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TRIPIRA — บริษัท ไตรพีระ จำกัด',
    template: '%s | TRIPIRA',
  },
  description: 'บริษัท ไตรพีระ จำกัด — ผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรม วิศวกรรมโยธา และงานสำรวจ Geomatics ทั่วประเทศไทย รับความไว้วางใจจาก กรมโยธาธิการและผู้ประกอบการชั้นนำระดับประเทศ',
  keywords: [
    'ภูมิสถาปัตยกรรม', 'วิศวกรรมโยธา', 'สำรวจ', 'Geomatics', 'Tripira', 'ไตรพีระ',
    'landscape architecture', 'civil engineering', 'ออกแบบสวน', 'กรมโยธาธิการ',
  ],
  authors: [{ name: 'TRIPIRA CO.,LTD.' }],
  creator: 'TRIPIRA CO.,LTD.',
  publisher: 'TRIPIRA CO.,LTD.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: BASE_URL,
    siteName: 'TRIPIRA',
    title: 'TRIPIRA — ภูมิสถาปัตยกรรม วิศวกรรม และ Geomatics Survey',
    description: 'ผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรมและวิศวกรรมชั้นนำ ประสบการณ์กว่า 15 ปี 200+ โครงการทั่วประเทศ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRIPIRA — ภูมิสถาปัตยกรรม วิศวกรรม Geomatics',
    description: '200+ โครงการทั่วประเทศไทย',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TRIPIRA CO.,LTD.',
  alternateName: 'บริษัท ไตรพีระ จำกัด',
  url: 'https://map-profile.vercel.app',
  description: 'ผู้เชี่ยวชาญด้านภูมิสถาปัตยกรรม วิศวกรรมโยธา และงานสำรวจ Geomatics',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม',
    addressLocality: 'กรุงเทพมหานคร',
    postalCode: '10230',
    addressCountry: 'TH',
  },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+66-80-996-1080', contactType: 'Project Manager', name: 'พีรพงษ์ ทับนิล' },
    { '@type': 'ContactPoint', telephone: '+66-84-746-3969', contactType: 'Account Manager', name: 'ริณยพัทธ์ แทนสกุล' },
  ],
  email: 'contact@tripira.co.th',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <BackToTop />
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
