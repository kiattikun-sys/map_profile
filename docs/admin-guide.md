# คู่มือการใช้งานระบบ TRIPIRA Map Profile — Admin
> สำหรับ: ผู้ดูแลระบบ (Administrator)  
> เวอร์ชัน: 1.0 | อัปเดต: กุมภาพันธ์ 2569

---

## 1. การเข้าสู่ระบบ

### 1.1 URL สำหรับ Admin
```
https://[your-domain]/admin/login
```

### 1.2 ขั้นตอนการ Login
1. เปิดเบราว์เซอร์ไปที่ `/admin/login`
2. กรอก **Email** และ **Password** ที่ได้รับจากผู้ดูแลระบบหลัก
3. กด **"เข้าสู่ระบบ"**
4. ระบบจะพาไปยัง Admin Dashboard อัตโนมัติ

> ⚠️ หากลืมรหัสผ่าน ให้ติดต่อผู้ดูแลระบบหลักเพื่อ Reset ผ่าน Supabase Authentication

---

## 2. Admin Dashboard — ภาพรวม

หลัง Login สำเร็จ จะเห็นเมนูด้านซ้าย ประกอบด้วย:

| เมนู | หน้าที่ |
|------|---------|
| **Projects** | จัดการโครงการทั้งหมด |
| **Clients** | จัดการข้อมูลลูกค้า |
| **Banner** | ตั้งค่า Hero Banner หน้าแผนที่ |
| **Featured** | กำหนดโครงการเด่น |
| **3D Models** | อัปโหลด/จัดการโมเดล 3 มิติ |
| **Site Settings** | ตั้งค่าทั่วไปของเว็บไซต์ |

---

## 3. การจัดการโครงการ (Projects)

### 3.1 เพิ่มโครงการใหม่
1. ไปที่เมนู **Projects**
2. กดปุ่ม **"เพิ่มโครงการ"**
3. กรอกข้อมูล:
   - **ชื่อโครงการ** (จำเป็น)
   - **ประเภทงาน** — เลือกจาก dropdown
   - **จังหวัด** (จำเป็น)
   - **ปี พ.ศ.**
   - **ลูกค้า** — เลือกจากรายการที่มี
   - **พิกัด (Lat/Lng)** — สำหรับแสดงบนแผนที่
   - **คำอธิบายโครงการ**
   - **รูปภาพ** — อัปโหลดได้หลายรูป
4. กด **"บันทึก"**

### 3.2 แก้ไขโครงการ
1. คลิกที่ชื่อโครงการในรายการ
2. แก้ไขข้อมูลที่ต้องการ
3. กด **"บันทึก"**

### 3.3 ลบโครงการ
1. คลิกไอคอน **ถังขยะ** ข้างชื่อโครงการ
2. ยืนยันการลบ

> ⚠️ การลบโครงการ**ไม่สามารถกู้คืนได้** กรุณาตรวจสอบก่อนลบ

### 3.4 สถานะโครงการ
- **active** — แสดงบนแผนที่สาธารณะ
- **inactive** — ซ่อนจากผู้ใช้ทั่วไป

---

## 4. การจัดการลูกค้า (Clients)

### 4.1 เพิ่มลูกค้าใหม่
1. ไปที่เมนู **Clients**
2. กดปุ่ม **"เพิ่มลูกค้า"**
3. กรอกข้อมูล:
   - **ชื่อบริษัท/องค์กร** (จำเป็น)
   - **คำอธิบาย**
   - **เว็บไซต์**
   - **โลโก้** — อัปโหลดไฟล์รูปภาพ
4. กด **"บันทึก"**

### 4.2 Key Clients
- ลูกค้าที่ทำเครื่องหมายเป็น **Key Client** จะแสดงในแถบพิเศษบนหน้า Clients
- เปิด/ปิดได้ที่ตัวเลือก `is_key_client` ในฟอร์มแก้ไข

---

## 5. การตั้งค่า Banner (Homepage Banner)

Banner คือแถบข้อมูลที่แสดงด้านบนของหน้าแผนที่

### 5.1 ข้อมูลที่แก้ไขได้
| ฟิลด์ | ความหมาย |
|-------|----------|
| **เปิด/ปิด Banner** | Toggle แสดง/ซ่อน Banner |
| **ข้อความหัวเรื่อง** | Headline ขนาดใหญ่ |
| **ข้อความรอง** | Sub-message ด้านบน |
| **CTA Label** | ข้อความปุ่ม Call-to-Action |
| **CTA Link** | URL ที่ปุ่มพาไป |
| **รูปพื้นหลัง** | Background image ของ Banner |

### 5.2 การอัปโหลดรูปพื้นหลัง
1. คลิก **"เลือกรูปภาพ"**
2. เลือกไฟล์ JPG/PNG (แนะนำขนาดไม่เกิน 2MB)
3. ระบบจะอัปโหลดขึ้น Supabase Storage อัตโนมัติ
4. กด **"บันทึก"**

---

## 6. โมเดล 3D (3D Models)

### 6.1 การอัปโหลดโมเดล
1. ไปที่เมนู **3D Models**
2. กดปุ่ม **"อัปโหลดโมเดล"**
3. เลือกไฟล์ `.glb` หรือ `.gltf`
4. เชื่อมโยงกับ **โครงการ** ที่ต้องการ
5. ตั้งค่า:
   - **มาตราส่วน (Scale)**
   - **การหมุน (Rotation)**
   - **พิกัดบนแผนที่**
6. กด **"บันทึก"**

### 6.2 การดูโมเดล 3D บนแผนที่
- ผู้ใช้คลิกโครงการที่มีโมเดล → กดปุ่ม **"View 3D"** ใน Side Panel
- โมเดลจะแสดงซ้อนบนแผนที่ Mapbox

---

## 7. Featured Projects

กำหนดโครงการที่ต้องการ **ไฮไลท์** บนหน้าแรก:
1. ไปที่เมนู **Featured**
2. เลือกโครงการจากรายการ
3. กด **"เพิ่มเป็น Featured"**
4. ลากเพื่อเรียงลำดับการแสดงผล

---

## 8. Site Settings

ตั้งค่าทั่วไปของเว็บไซต์:
- **ชื่อเว็บไซต์**
- **Logo URL**
- **Contact Email**
- **Social Media Links**

---

## 9. การทดสอบระบบ (สำหรับ Tester)

### Checklist การทดสอบ

#### แผนที่ (Map Page)
- [ ] แผนที่โหลดแสดงพิน/cluster ได้ปกติ
- [ ] คลิก Cluster แล้ว Zoom เข้าได้
- [ ] คลิก Pin โครงการแล้ว Side Panel เปิดได้
- [ ] กรองโครงการด้วย Filter Panel ได้ (ประเภท/จังหวัด/ปี/ลูกค้า)
- [ ] ปุ่ม "ดูรายละเอียด" พาไปหน้าโครงการได้
- [ ] Toggle ผัง Overlay เปิด/ปิดได้
- [ ] ปุ่ม View 3D เปิดโมเดลได้ (เฉพาะโครงการที่มีโมเดล)

#### หน้า Clients
- [ ] แสดงรายชื่อลูกค้าครบถ้วน
- [ ] ค้นหาลูกค้าได้
- [ ] Filter ตาม Sector ได้
- [ ] Monogram badge แสดงถูกต้อง

#### Admin
- [ ] Login/Logout ได้ปกติ
- [ ] เพิ่ม/แก้ไข/ลบ Project ได้
- [ ] เพิ่ม/แก้ไข/ลบ Client ได้
- [ ] แก้ไข Banner ได้และเห็นการเปลี่ยนแปลงบนหน้าแผนที่
- [ ] อัปโหลดรูปภาพได้

---

## 10. การรายงานปัญหา

หากพบปัญหาหรือ Bug กรุณาแจ้ง:
1. **หน้าที่พบปัญหา** (URL)
2. **ขั้นตอนที่ทำก่อนพบปัญหา**
3. **Screenshot** หรือ **Error message** ที่เห็น
4. **เบราว์เซอร์และเวอร์ชัน**

ส่งมาที่: `kiattikun@trpra.com`

---

## 11. ข้อมูลเพิ่มเติม

| รายการ | ข้อมูล |
|--------|--------|
| **Platform** | Next.js 16 + Supabase + Mapbox GL JS |
| **Database** | Supabase PostgreSQL |
| **Storage** | Supabase Storage (รูปภาพ, โมเดล 3D) |
| **Authentication** | Supabase Auth (Email/Password) |
| **Map** | Mapbox GL JS |

---

*คู่มือนี้จัดทำโดย TRIPIRA Development Team*

---

## 12. RBAC — Role-Based Access Control (Phase 1)

### 12.1 Role ทั้ง 4 ระดับ

| Role | สิทธิ์ |
|------|--------|
| **super** | ทุกอย่าง — จัดการ users, roles, ทุก table |
| **admin** | จัดการข้อมูลโครงการ/ลูกค้าทั้งหมด, ดู files/updates ทั้งหมด |
| **client** | เห็นเฉพาะโครงการขององค์กรตัวเอง, เพิ่ม updates/อัปโหลดไฟล์ได้ |
| **viewer** | อ่านอย่างเดียว (read-only ทุก table) |

---

### 12.2 ตารางใหม่ที่เพิ่มใน Phase 1

#### `client_orgs`
องค์กรลูกค้า — 1 org มีหลาย projects

```sql
id         UUID PK
name       TEXT
created_at TIMESTAMPTZ
```

#### `profiles`
ข้อมูล role ของ auth user ทุกคน (สร้างอัตโนมัติเมื่อ user ลงทะเบียน)

```sql
id            UUID PK → auth.users(id)
role          TEXT  ('super'|'admin'|'client'|'viewer')  default 'viewer'
client_org_id UUID → client_orgs(id)   (nullable — เฉพาะ role=client)
created_at    TIMESTAMPTZ
updated_at    TIMESTAMPTZ
```

#### `project_updates`
บันทึกความคืบหน้า / status / note ของโครงการ

```sql
id          UUID PK
project_id  UUID → projects(id)
author_id   UUID → auth.users(id)
progress    INTEGER  (0–100)
status      TEXT
note        TEXT
created_at  TIMESTAMPTZ
```

#### `project_files`
ไฟล์ที่ client อัปโหลดต่อโครงการ

```sql
id           UUID PK
project_id   UUID → projects(id)
uploaded_by  UUID → auth.users(id)
storage_path TEXT   (รูปแบบ: org/<org_id>/project/<project_id>/<filename>)
label        TEXT
mime_type    TEXT
size_bytes   BIGINT
created_at   TIMESTAMPTZ
```

#### คอลัมน์ใหม่ใน `projects`
```sql
client_org_id UUID → client_orgs(id)   (nullable)
```

---

### 12.3 Storage Bucket: `project-client-files`

- **Public = false** (private bucket)
- Path convention: `org/<client_org_id>/project/<project_id>/<filename>`
- สิทธิ์:
  - `super/admin` → อ่าน/เขียนได้ทุก path
  - `client` → อ่าน/เขียนได้เฉพาะ `org/<ตัวเอง>/` เท่านั้น
  - `viewer/anon` → ไม่มีสิทธิ์เลย
- การดูไฟล์ในระบบ UI จะใช้ **Signed URL** (short TTL) — ไม่ต้องเปิด bucket เป็น public

---

### 12.4 วิธีรัน SQL (Phase 1)

1. เปิด **Supabase Dashboard** → **SQL Editor**
2. คัดลอก SQL จาก `lib/rbac-phase1.sql` ทั้งไฟล์
3. วาง → กด **Run**
4. ตรวจสอบว่าไม่มี error
5. **Promote ตัวเองเป็น super** (แก้ comment บรรทัดสุดท้ายในไฟล์):
   ```sql
   UPDATE profiles
   SET role = 'super'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'kiattikun@trpra.com');
   ```
6. Promote Mongkol เป็น admin:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'mongkolc@tripeera.com');
   ```

---

### 12.5 วิธีเพิ่ม Client Org และผูก User

```sql
-- 1. สร้าง org
INSERT INTO client_orgs (name) VALUES ('บริษัท ABC จำกัด') RETURNING id;

-- 2. ผูก user กับ org (ใช้ org id ที่ได้จากขั้นตอน 1)
UPDATE profiles
SET role = 'client', client_org_id = '<org_id_here>'
WHERE id = (SELECT id FROM auth.users WHERE email = 'client@example.com');

-- 3. ผูกโครงการเข้ากับ org
UPDATE projects
SET client_org_id = '<org_id_here>'
WHERE id = '<project_id_here>';
```

---

### 12.6 Phase 1 Test Checklist

- [ ] รัน `lib/rbac-phase1.sql` ใน Supabase SQL Editor ได้โดยไม่มี error
- [ ] ตาราง `client_orgs`, `profiles`, `project_updates`, `project_files` สร้างแล้ว
- [ ] คอลัมน์ `client_org_id` ปรากฏใน `projects` table
- [ ] Bucket `project-client-files` สร้างแล้ว (public = false)
- [ ] `profiles` มีแถวสำหรับ users ที่มีอยู่แล้วทั้งหมด (backfill)
- [ ] Promote kiattikun → `super` แล้ว
- [ ] Promote mongkolc → `admin` แล้ว
- [ ] ทดสอบ: user role=viewer ไม่สามารถ INSERT projects ได้
- [ ] ทดสอบ: user role=client เห็นเฉพาะ projects ที่ผูก org ตัวเอง

---

### 12.7 Phase 2 — Client Portal

- route `/client` — "My Projects" สำหรับ role=client
- Project detail: แสดง updates list + form เพิ่ม update + อัปโหลดไฟล์
- ซ่อน admin-only controls จาก client/viewer
- Signed URL generation สำหรับ preview/download ไฟล์

---

## 13. User & Permission Management (Invite-Only)

> ✅ Phase 3 — เพิ่มเมื่อมีนาคม 2569

### 13.1 หลักการสำคัญ

| กฎ | รายละเอียด |
|----|------------|
| **No self-signup** | ระบบปิด self-signup — ผู้ใช้ใหม่มาจาก Invite เท่านั้น |
| **super เท่านั้น** | เข้าหน้า `/admin/users` และ `/admin/orgs` ได้ |
| **Service Role Key** | ใช้เฉพาะ server-side ใน `lib/supabase-admin.ts` เท่านั้น — ห้าม expose ไป client |
| **Defense in depth** | ทุก server action ตรวจ role=super ซ้ำอีกชั้น แม้ route guard จะผ่านแล้ว |

---

### 13.2 ENV Variables ที่ต้องมี

เพิ่มใน `.env.local`:

```env
# Public (ใช้ได้ทั้ง client + server)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-only (ห้ามขึ้นต้นด้วย NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# สำหรับ redirect หลัง invite email
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

> ⚠️ **SUPABASE_SERVICE_ROLE_KEY** bypass RLS ทั้งหมด — ห้าม commit หรือ expose ใน client bundle

---

### 13.3 วิธี Invite User ใหม่

1. Login ด้วย account ที่มี role = **super**
2. ไปที่ **Admin Dashboard → Access → Users** (`/admin/users`)
3. กดปุ่ม **"Invite User"** (มุมขวาบน)
4. กรอก:
   - **Email** — อีเมลผู้ใช้ที่ต้องการเชิญ
   - **Role** — เลือก: `super` / `admin` / `client` / `viewer`
   - **Client Org** — (บังคับ เฉพาะ role=client) เลือก org ที่ต้องการผูก
5. กด **"Invite"**
6. ระบบจะ:
   - ส่ง invite email ไปยัง user (ผ่าน Supabase Auth)
   - สร้าง profile พร้อม role/org ที่เลือกทันที
   - หาก email นั้นมี user อยู่แล้ว → **อัปเดต role/org** และแสดง "User exists — updated"

---

### 13.4 วิธีเปลี่ยน Role / Org

1. ไปที่ `/admin/users`
2. ค้นหา user ด้วย email หรือ filter by role
3. คลิก **role badge** ในแถวของ user → dropdown จะเปิด
4. เลือก role ใหม่ (และ org ถ้า role=client)
5. กด ✓ เพื่อบันทึก

**Safety guards:**
- super ไม่สามารถ demote ตัวเองหาก **ยังเป็น super คนสุดท้าย**
- การเปลี่ยน role จาก client → อื่น จะ **clear client_org_id** อัตโนมัติ

---

### 13.5 วิธีจัดการ Client Orgs

1. ไปที่ **Admin Dashboard → Access → Client Orgs** (`/admin/orgs`)
2. **สร้าง org ใหม่:** กด "สร้าง Org" → กรอกชื่อ → กด "สร้าง"
3. **ดูสมาชิก:** คลิกที่ชื่อ org → expand ออกมาแสดง users ทั้งหมดในนั้น
4. ID ของ org ใช้ใน `UPDATE projects SET client_org_id = '<id>'` เพื่อผูกโครงการ

---

### 13.6 Disable / Enable User

- ในตาราง users กดปุ่ม **"Disable"** ที่ column "จัดการ"
- User จะถูก ban และไม่สามารถ login ได้ (ban_duration = 100 ปี)
- กด **"Enable"** เพื่อยกเลิก ban
- **ไม่สามารถ Disable ตัวเองได้**

---

### 13.7 Test Checklist — User Management

**Setup:**
- [ ] เพิ่ม `SUPABASE_SERVICE_ROLE_KEY` ใน `.env.local` และ Vercel env vars
- [ ] เพิ่ม `NEXT_PUBLIC_SITE_URL` ใน Vercel env vars

**Security:**
- [ ] `/admin/users` — login ด้วย role=admin → redirect ไป `/admin` (ไม่ให้เข้า)
- [ ] `/admin/users` — ไม่ได้ login → redirect ไป `/admin/login`
- [ ] `/admin/orgs` — role ≠ super → redirect ไป `/admin`
- [ ] เรียก `inviteUser()` โดยตรงจาก client → throw FORBIDDEN

**Invite:**
- [ ] Invite email ใหม่ → user ได้รับ email → login แล้วเห็น profile ถูกต้อง
- [ ] Invite email ที่มีอยู่แล้ว → แสดง "User exists — updated" + profile เปลี่ยน
- [ ] Invite role=client โดยไม่เลือก org → ปุ่ม Invite disabled / error

**Role change:**
- [ ] เปลี่ยน role=viewer → client → เลือก org → บันทึก → ตรวจ profiles table
- [ ] Demote super คนสุดท้าย → แสดง error "ไม่สามารถ demote super คนสุดท้ายได้"

**Orgs:**
- [ ] สร้าง org ใหม่ → ปรากฏในรายการ
- [ ] Expand org → เห็นสมาชิก (ถ้ามี)

---

### 13.8 Troubleshooting

| ปัญหา | วิธีแก้ |
|-------|---------|
| Invite แล้ว error "Missing SUPABASE_SERVICE_ROLE_KEY" | เพิ่ม env var แล้ว restart dev server หรือ redeploy |
| Invite แล้วไม่ได้รับ email | ตรวจ Supabase Dashboard → Auth Logs; ตรวจ spam folder; ตรวจ SMTP settings |
| profiles ไม่ถูกสร้างหลัง invite | รัน SQL trigger fix: `CREATE OR REPLACE FUNCTION handle_new_user()...` (ดู Section 12) |
| `/admin/users` redirect กลับ `/admin` ทั้งที่เป็น super | ตรวจ profiles table ว่า role = 'super' จริงหรือไม่: `SELECT role FROM profiles WHERE id = auth.uid()` |
| เปลี่ยน role แล้วไม่ save | ตรวจ Vercel/server logs หา FORBIDDEN หรือ DB error |
