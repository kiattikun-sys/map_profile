# TRIPIRA Map Profile — Progress Summary
**Project:** Map Profile Web App for TRIPIRA CO., LTD.
**Live URL:** https://map-profile-rho.vercel.app
**GitHub:** https://github.com/kiattikun-sys/map_profile
**Last Updated:** 28 Feb 2026
**Latest Commit:** `72b0167`

---

## สิ่งที่ทำทั้งหมด (Phase 1–20 + UI/UX Upgrade + Visual Upgrade)

### Phase 1 — Project Card + Cover Image
- สร้าง `lib/project-utils.ts` — helper `getProjectCoverImage`, `getTypeGradient`, `getProjectImageUrl`, `getProjectDocUrl`
- เขียนใหม่ `components/ProjectCard.tsx` — รองรับรูปจริงจาก Supabase Storage, hover effect, premium design

### Phase 2 — UI/UX ยกระดับทั้งเว็บ
- Typography, skeleton loading, empty state, responsive grid
- ปรับ spacing และ color scheme ให้ consistent

### Phase 3 — Framer Motion Animations
- `components/ProjectDetailClient.tsx` — lightbox gallery, fade-in, slide animations
- แก้ Framer Motion Easing type error ด้วย cubic-bezier array tuple

### Phase 4 — SEO / Metadata / JSON-LD
- `app/layout.tsx` — full Tripira SEO metadata, OG tags, Twitter card, JSON-LD Organization schema
- `app/projects/page.tsx` — metadata export
- `app/clients/page.tsx` — metadata export
- `app/contact/page.tsx` — metadata export
- `app/projects/[id]/page.tsx` — dynamic `generateMetadata` + JSON-LD CreativeWork schema per project

### Phase 5 — Project Detail Page Premium
- เขียนใหม่ `components/ProjectDetailClient.tsx` — image gallery, lightbox, minimap, overlay opacity slider, copy coordinates, document links, client card

### Phase 6 — Polish + Infrastructure
- `app/not-found.tsx` — custom 404 page
- `app/projects/loading.tsx` — skeleton loading
- `app/clients/loading.tsx` — skeleton loading
- `app/sitemap.ts` — dynamic sitemap.xml
- `app/robots.ts` — robots.txt
- `components/BackToTop.tsx` — floating scroll-to-top button
- `components/MapPageClient.tsx` — debounced search (300ms)

### Phase 7 — About Page + FilterPanel
- `components/AboutAnimated.tsx` — Framer Motion scroll-reveal สำหรับทุก section (stats, services, timeline, team, certs)
- `app/about/page.tsx` — delegate ไป AboutAnimated
- `components/FilterPanel.tsx` — chip-based type filter, keyboard `/` shortcut focuses search, `Escape` blurs, styled selects

### Phase 8 — Contact Copy-to-Clipboard
- `components/ContactClient.tsx` — copy phone/email/address พร้อม Check icon feedback
- `app/contact/page.tsx` — delegate ไป ContactClient

### Phase 9 — Map Page Floating Stats
- `components/MapPageClient.tsx` — floating stats pill (filtered/total, provinces, types), premium loading screen

### Phase 10 — Navbar TRIPIRA Branding
- `components/Navbar.tsx` — TRIPIRA wordmark + MapPin icon, underline active link indicator, animated mobile menu

### Phase 11 — Projects Client-Side Filter
- `components/ProjectsClient.tsx` — type filter chips พร้อม count badge, sort dropdown (year/name), search input, live count, empty state
- `app/projects/page.tsx` — delegate ไป ProjectsClient

### Phase 12 — Footer Upgrade
- `components/Footer.tsx` — gradient top border, `'use client'`, inline scroll-to-top

### Phase 13 — Clients Sector Filter
- `components/ClientsClient.tsx` — auto-derived sector chips, search input, live filtered count
- `app/clients/page.tsx` — delegate ไป ClientsClient

### Phase 14 — globals.css Polish
- `app/globals.css` — smooth scroll, `::selection` blue tint, slim custom scrollbar, `@keyframes fadeInDown`

### Phase 15 — Cleanup
- ลบ `app/about/metadata.ts` (stale file — metadata ควร export จาก page.tsx โดยตรง)

### Phase 16 — Related Projects Section
- `app/projects/[id]/page.tsx` — fetch ≤3 related projects (same type) server-side
- `components/ProjectDetailClient.tsx` — รับ `related` prop, render card strip ท้ายหน้า

### Phase 17–20 — Final Polish
- `components/MapView.tsx` — เพิ่มสี `สำรวจ` (#14b8a6 teal) ใน TYPE_COLOR_MATCH
- Build verify ผ่าน 12 routes, TypeScript 0 errors

---

## UI/UX Luxury Upgrade (Phase A–I)

### Phase A — Brand Tokens
- `app/globals.css` — CSS custom properties: primary/accent/neutral color scales, typography scale (`--text-xs` → `--text-5xl`), elevation system (`--shadow-sm/md/lg/xl`), border radius system, motion easing/duration tokens
- Classes: `.brand-hero-gradient`, `.brand-label`, `.brand-divider`

### Phase B — Premium Layout Architecture
- ปรับ `max-w-7xl` consistent ทุกหน้า, vertical rhythm, whitespace ระหว่าง section
- `app/projects/page.tsx`, `app/clients/page.tsx`, `app/contact/page.tsx` — เปลี่ยน background เป็น `var(--background)`

### Phase C — Executive Typography Upgrade
- Heading weight hierarchy: `font-bold` / `font-black`, letter-spacing `tracking-[-0.02em]` to `[-0.04em]`
- Label style: uppercase + `tracking-[0.15em]` + `text-[11px]`
- ใช้ `brand-label` + `brand-divider` ใน hero ทุกหน้า

### Phase D — Surface & Card Luxury Polish
- `var(--shadow-sm/md/lg)` แทน Tailwind shadow ตรง
- `rounded-2xl` unified radius บน cards ทุก component
- Hover elevation: `whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}`
- `components/AboutAnimated.tsx` — services, timeline, team, certs sections polish

### Phase E — Motion & Interaction Rebalance
- Unified easing `[0.25, 0.1, 0.25, 1]` (cubic-bezier) ทุก transition
- Duration 0.5–0.6s สำหรับ hero, 0.08s stagger children
- `viewport={{ once: true, margin: '-60px' }}` ทุก whileInView

### Phase F — Executive Hero Sections
- `app/projects/page.tsx` — brand-hero-gradient + brand-label + brand-divider + stats strip
- `app/clients/page.tsx` — brand-hero-gradient + hero text
- `app/contact/page.tsx` — brand-hero-gradient + hero text
- `components/AboutAnimated.tsx` — brand-hero-gradient hero + refined typography

### Phase G — Micro Luxury Details
- Animated nav underline (active link indicator ใน Navbar)
- Section dividers (`brand-divider`)
- Hover parallax `whileHover={{ y: -2 }}` บน cards

### Phase H — Mobile Executive Optimization
- Responsive spacing: `py-16 sm:py-20`, `px-4 sm:px-6 lg:px-8`
- Touch-friendly tap targets ≥44px
- Hero height ปรับตาม breakpoint (`text-3xl sm:text-4xl md:text-5xl`)

### Phase I — Final Visual Audit
- Build verify ผ่านทุก route (12 routes), TypeScript 0 errors
- Color consistency ตรวจสอบ brand token usage
- SEO metadata ครบทุกหน้า

---

## Visual Upgrade (Gradient + Illustration)

### About Page — Split Hero + SVG Illustration
- `components/AboutAnimated.tsx` — เขียนใหม่ hero section เป็น `grid grid-cols-1 lg:grid-cols-2`
- **ซ้าย:** brand label, heading, description, CTA buttons ("ดูโครงการ" + "ติดต่อเรา")
- **ขวา:** SVG cityscape illustration วาด inline — buildings 3 หลัง, trees, road, stars, moon, compass rose, measurement lines (engineering detail)
- Floating animated badges: "15+ ปี ประสบการณ์" และ "200+ โครงการ ทั่วประเทศ" (Framer Motion `animate={{ y: [0,-6,0] }}` loop)
- Decorative grid pattern + glow orbs ใน hero background
- **`AnimatedCounter` component** — `useMotionValue` + `useSpring` (duration: 1800ms) นับตัวเลขจาก 0 → ค่าจริง เมื่อ scroll เข้า viewport

### Projects Hero — Background Image
- `app/projects/page.tsx` — เปลี่ยนจาก `brand-hero-gradient` เป็น Unsplash landscape architecture photo (`photo-1486325212027-8081e485255e`)
- Multi-layer overlay: `from-blue-950/95 via-blue-900/85 to-blue-900/70` + bottom fade
- Decorative grid pattern opacity-[0.06]
- Stats: `text-4xl font-black` + `tracking-[0.15em]` uppercase labels

### Clients Hero — Background Image
- `app/clients/page.tsx` — Unsplash corporate building photo (`photo-1497366216548-37526070297c`)
- Same overlay + grid pattern treatment

### Contact Page — Google Maps + Premium Form
- `components/ContactClient.tsx` — เขียนใหม่ทั้งหมด
- **Google Maps iframe** embed 320px full-width ด้านบน (สำนักงานใหญ่ เขตบึงกุ่ม กรุงเทพฯ)
- Layout `lg:grid-cols-5` — 2/5 info col + 3/5 form col
- Contact info cards: `rounded-2xl`, `var(--shadow-sm)`, icon color-coded, copy-to-clipboard on hover
- Social buttons (Facebook + LINE)
- Coverage areas panel (blue tint bg)
- Premium form: `bg-slate-50` inputs, focus ring `focus:ring-blue-600/25`, 2-column name/phone grid
- Submit button: `var(--shadow)` blue glow

### Homepage — Hero Banner Above Map
- `components/MapPageClient.tsx` — เพิ่ม dismissible hero banner (80px) ระหว่าง Navbar กับ Map
- Gradient `135deg #1e3a8a → #1d4ed8 → #1e40af` + grid pattern
- แสดง: brand tagline (ซ้าย) + live stats chips (กลาง: โครงการ/จังหวัด/มูลค่างาน) + "เกี่ยวกับเรา" CTA + dismiss button (ขวา)
- Filter panel top offset + floating stats pill top offset ปรับ dynamic ตามสถานะ `heroDismissed`

---

## Bug Fixes หลัง Deploy

### Fix — Unicode Escape Sequences
**ปัญหา:** Hero sections แสดง `\u0e15\u0e34\u0e14...` แทนภาษาไทย  
**สาเหตุ:** IDE บันทึก string literals เป็น escape codes แทน UTF-8 ตรงๆ  
**ไฟล์ที่แก้:**
- `app/projects/page.tsx` — hero text ทั้งหมด
- `app/clients/page.tsx` — hero text + metadata
- `app/contact/page.tsx` — hero text

---

## Files Changed (ทั้งหมด)

| ไฟล์ | การเปลี่ยนแปลง |
|------|---------------|
| `app/layout.tsx` | SEO metadata + JSON-LD + BackToTop |
| `app/page.tsx` | homepage → MapPageClient |
| `app/about/page.tsx` | → AboutAnimated |
| `app/projects/page.tsx` | metadata + hero (Unsplash bg) + stats strip + ProjectsClient |
| `app/projects/[id]/page.tsx` | generateMetadata + JSON-LD + related projects |
| `app/clients/page.tsx` | metadata + hero (Unsplash bg) + ClientsClient |
| `app/contact/page.tsx` | metadata + hero + ContactClient |
| `app/globals.css` | brand tokens (colors/typography/elevation/radius/motion) + smooth scroll + scrollbar + selection + keyframes + `.brand-hero-gradient` + `.brand-label` + `.brand-divider` |
| `app/not-found.tsx` | custom 404 |
| `app/projects/loading.tsx` | skeleton |
| `app/clients/loading.tsx` | skeleton |
| `app/sitemap.ts` | dynamic sitemap |
| `app/robots.ts` | robots.txt |
| `components/Navbar.tsx` | TRIPIRA branding + active underline indicator + brand token colors |
| `components/Footer.tsx` | gradient border + scroll-to-top + brand token polish |
| `components/ProjectCard.tsx` | cover image + premium design + hover elevation |
| `components/ProjectsClient.tsx` | filter chips + sort + search + brand token styling |
| `components/ProjectDetailClient.tsx` | gallery + lightbox + related projects |
| `components/ClientsClient.tsx` | sector filter + search + brand token styling |
| `components/ContactClient.tsx` | Google Maps iframe + premium cards + coverage areas + refined form |
| `components/AboutAnimated.tsx` | split hero (text + SVG cityscape illustration) + AnimatedCounter + floating badges + scroll-reveal + brand token polish |
| `components/FilterPanel.tsx` | chips + keyboard shortcut |
| `components/MapPageClient.tsx` | dismissible hero banner + live stats + dynamic filter/pill offsets + stats pill polish |
| `components/MapView.tsx` | TYPE_COLOR_MATCH เพิ่ม สำรวจ |
| `components/BackToTop.tsx` | floating button |
| `lib/project-utils.ts` | helper functions |

---

## Commit History (สำคัญ)

| Commit | รายละเอียด |
|--------|-----------|
| `f4b1a9e` | feat: PHASE A-H luxury UI/UX upgrade — brand tokens, executive hero, premium cards, refined typography, motion rebalance, mobile optimization |
| `72b0167` | feat: Visual Upgrade — About split hero SVG illustration, animated counters, bg-image heroes (Projects/Clients), Google Maps embed + premium Contact form, Homepage hero banner |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties (brand tokens) |
| Animation | Framer Motion (`motion`, `useInView`, `useMotionValue`, `useSpring`) |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Storage) |
| Hosting | Vercel (auto-deploy from `main`) |
| Maps | Leaflet (dynamic import, SSR disabled) |
