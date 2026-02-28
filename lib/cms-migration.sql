-- ============================================================
-- TRIPIRA CMS Migration — Run this in Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. site_sections  (hero/page content per page key)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_sections (
  key          TEXT PRIMARY KEY,
  enabled      BOOLEAN NOT NULL DEFAULT true,
  title        TEXT,
  subtitle     TEXT,
  description  TEXT,
  cta_label    TEXT,
  cta_href     TEXT,
  image_path   TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. site_settings  (global config: SEO, contact info, socials)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. homepage_banner  (single active banner)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.homepage_banner (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled               BOOLEAN NOT NULL DEFAULT true,
  headline              TEXT,
  message               TEXT,
  cta_label             TEXT,
  cta_href              TEXT,
  background_image_path TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. featured_projects  (FK → projects, ordered)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.featured_projects (
  project_id UUID PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 5. key_clients  (FK → clients, ordered)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.key_clients (
  client_id  UUID PRIMARY KEY REFERENCES public.clients(id) ON DELETE CASCADE,
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- RLS: Enable on all CMS tables
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.site_sections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banner   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_clients       ENABLE ROW LEVEL SECURITY;

-- ─── site_sections ───────────────────────────────────────────
CREATE POLICY "public_read_site_sections"
  ON public.site_sections FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_site_sections"
  ON public.site_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── site_settings ───────────────────────────────────────────
CREATE POLICY "public_read_site_settings"
  ON public.site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_site_settings"
  ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── homepage_banner ─────────────────────────────────────────
CREATE POLICY "public_read_homepage_banner"
  ON public.homepage_banner FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_homepage_banner"
  ON public.homepage_banner FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── featured_projects ───────────────────────────────────────
CREATE POLICY "public_read_featured_projects"
  ON public.featured_projects FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_featured_projects"
  ON public.featured_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── key_clients ─────────────────────────────────────────────
CREATE POLICY "public_read_key_clients"
  ON public.key_clients FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_key_clients"
  ON public.key_clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- Seed default site_settings rows
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name',        'TRIPIRA Map Profile'),
  ('site_description', 'บริษัท ไตรพีระ จำกัด — วิศวกรรมและภูมิสถาปัตยกรรมระดับชาติ'),
  ('og_image_path',    ''),
  ('phone_pm',         '080-996-1080'),
  ('phone_am',         '084-746-3969'),
  ('email',            'contact@tripira.co.th'),
  ('address',          '46/178 ถ.นวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230'),
  ('facebook_url',     ''),
  ('line_url',         ''),
  ('map_url',          '')
ON CONFLICT (key) DO NOTHING;

-- Seed default site_sections rows
INSERT INTO public.site_sections (key, title, subtitle, description, cta_label, cta_href) VALUES
  ('home',     'ออกแบบพื้นที่สาธารณะ ระดับชาติ', 'TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด', 'บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ ด้วยผลงานมูลค่ารวมกว่า 1,500 ล้านบาท', 'ดูโครงการ', '/projects'),
  ('projects', 'โครงการทั้งหมด', 'ผลงานของเรา — TRIPIRA', 'ผลงานภูมิสถาปัตยกรรม วิศวกรรม และสำรวจ ทั่วทุกภาคของประเทศไทย', '', ''),
  ('clients',  'พาร์ทเนอร์ชั้นนำ', 'ลูกค้าของเรา — TRIPIRA', 'หน่วยงานภาครัฐชั้นนำและบริษัทเอกชนระดับประเทศที่ไว้วางใจในคุณภาพงานของเรา', '', ''),
  ('about',    'ออกแบบพื้นที่สาธารณะ ระดับชาติ ด้วยความเชี่ยวชาญจริง', 'TRIPIRA CO., LTD. · บริษัท ไตรพีระ จำกัด', 'บริษัทวิศวกรรมและภูมิสถาปัตยกรรมที่ได้รับความไว้วางใจจากหน่วยงานรัฐชั้นนำ อาทิ กรมโยธาธิการและผังเมือง Bangchak PTT และ Lotus''s', 'ดูโครงการ', '/projects'),
  ('contact',  'ติดต่อ TRIPIRA', 'ติดต่อเรา — TRIPIRA', 'บริษัท ไตรพีระ จำกัด — พร้อมรับฟังความต้องการด้านวิศวกรรมและภูมิสถาปัตยกรรมทุกรูปแบบ', '', '')
ON CONFLICT (key) DO NOTHING;

-- Seed default homepage_banner (enabled by default)
INSERT INTO public.homepage_banner (enabled, headline, message, cta_label, cta_href)
VALUES (true, 'ออกแบบภูมิสถาปัตยกรรมและวิศวกรรมระดับชาติ', 'แผนที่โครงการ — TRIPIRA', 'เกี่ยวกับเรา', '/about')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Storage bucket: site-assets
-- (Run via Supabase Dashboard → Storage → New Bucket)
-- Name: site-assets
-- Public: true  (so image_path can be served as public URL)
-- Suggested folder structure:
--   hero/home.jpg
--   hero/projects.jpg
--   hero/clients.jpg
--   hero/about.jpg
--   hero/contact.jpg
--   banner/banner.jpg
--   seo/og.jpg
-- ─────────────────────────────────────────────────────────────
