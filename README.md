# Map Profile 🗺️

**Company Profile แบบ Map-first** — ใช้แผนที่เป็นศูนย์กลางในการนำเสนอผลงานโครงการของบริษัท

## Tech Stack

- **Next.js 16** + TypeScript + Tailwind CSS
- **Mapbox GL JS** — แผนที่, หมุด, Overlay
- **Supabase** — PostgreSQL, Auth, Storage
- **Vercel** — Deployment

---

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และใส่ค่าต่อไปนี้:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ตั้งค่า Supabase Database

1. เปิด [Supabase Dashboard](https://supabase.com) → SQL Editor
2. รันไฟล์ `lib/supabase-schema.sql` เพื่อสร้างตาราง + sample data
3. ไปที่ **Storage** → สร้าง Buckets ต่อไปนี้ (Public):
   - `project-images`
   - `project-documents`
   - `overlay-images`
4. ไปที่ **Authentication** → สร้างบัญชีผู้ใช้สำหรับ Admin

---

## โครงสร้างโปรเจค

```
app/
├── page.tsx              # หน้าหลัก (Map View)
├── projects/
│   ├── page.tsx          # รายการโครงการทั้งหมด
│   └── [id]/page.tsx     # รายละเอียดโครงการ
├── about/page.tsx        # เกี่ยวกับเรา
├── clients/page.tsx      # ลูกค้า
├── contact/page.tsx      # ติดต่อ
└── admin/
    ├── page.tsx          # Admin Dashboard
    └── login/page.tsx    # Admin Login

components/
├── Navbar.tsx            # Navigation
├── MapView.tsx           # แผนที่หลัก (Mapbox)
├── MapPageClient.tsx     # Client wrapper สำหรับหน้าแผนที่
├── FilterPanel.tsx       # กรองโครงการ
├── ProjectCard.tsx       # การ์ดโครงการ (popup)
├── ProjectDetailClient.tsx # รายละเอียดโครงการ
├── MiniMap.tsx           # แผนที่ขนาดเล็ก (satellite)
└── admin/
    ├── AdminLoginClient.tsx    # หน้า Login
    ├── AdminDashboard.tsx      # Dashboard + ตาราง
    ├── AdminProjectForm.tsx    # Form เพิ่ม/แก้ไขโครงการ (4 steps)
    ├── AdminClientForm.tsx     # Form เพิ่ม/แก้ไขลูกค้า
    ├── PinPickerMap.tsx        # คลิกปักหมุดบนแผนที่
    └── OverlayEditorMap.tsx    # วาง Layout Plan overlay

lib/
├── supabase.ts           # Supabase client
├── supabase-server.ts    # Supabase server client (SSR)
└── supabase-schema.sql   # SQL schema + sample data
```

---

## รันโปรเจค

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
