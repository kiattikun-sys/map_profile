# TRIPIRA Map Profile — Progress Summary
**Project:** Map Profile Web App for TRIPIRA CO., LTD.
**Live URL:** https://map-profile-rho.vercel.app
**GitHub:** https://github.com/kiattikun-sys/map_profile
**Last Updated:** 28 Feb 2026

---

## สิ่งที่ทำทั้งหมด (Phase 1–20 + Bug Fixes)

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
| `app/projects/page.tsx` | metadata + hero + ProjectsClient |
| `app/projects/[id]/page.tsx` | generateMetadata + JSON-LD + related projects |
| `app/clients/page.tsx` | metadata + hero + ClientsClient |
| `app/contact/page.tsx` | metadata + hero + ContactClient |
| `app/globals.css` | smooth scroll, scrollbar, selection, keyframes |
| `app/not-found.tsx` | custom 404 |
| `app/projects/loading.tsx` | skeleton |
| `app/clients/loading.tsx` | skeleton |
| `app/sitemap.ts` | dynamic sitemap |
| `app/robots.ts` | robots.txt |
| `components/Navbar.tsx` | TRIPIRA branding + active indicator |
| `components/Footer.tsx` | gradient border + scroll-to-top |
| `components/ProjectCard.tsx` | cover image + premium design |
| `components/ProjectsClient.tsx` | filter chips + sort + search |
| `components/ProjectDetailClient.tsx` | gallery + lightbox + related projects |
| `components/ClientsClient.tsx` | sector filter + search |
| `components/ContactClient.tsx` | copy-to-clipboard |
| `components/AboutAnimated.tsx` | scroll-reveal animations |
| `components/FilterPanel.tsx` | chips + keyboard shortcut |
| `components/MapPageClient.tsx` | stats pill + debounce + loading |
| `components/MapView.tsx` | TYPE_COLOR_MATCH เพิ่ม สำรวจ |
| `components/BackToTop.tsx` | floating button |
| `lib/project-utils.ts` | helper functions |
