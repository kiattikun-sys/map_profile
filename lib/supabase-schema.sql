-- Map Profile Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  website TEXT
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  province TEXT,
  year INTEGER,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  images TEXT[],
  documents TEXT[],
  overlay_image TEXT,
  overlay_bounds JSONB,
  status TEXT DEFAULT 'active',
  tags TEXT[]
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read clients" ON clients FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete clients" ON clients FOR DELETE TO authenticated USING (true);

-- Storage buckets (run separately or via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('overlay-images', 'overlay-images', true);

-- Sample data
INSERT INTO clients (name, description) VALUES
  ('การไฟฟ้าส่วนภูมิภาค', 'Provincial Electricity Authority'),
  ('กรมทางหลวง', 'Department of Highways'),
  ('เทศบาลนครเชียงใหม่', 'Chiang Mai City Municipality'),
  ('บริษัท ปตท. จำกัด (มหาชน)', 'PTT Public Company Limited');

INSERT INTO projects (name, description, project_type, province, year, latitude, longitude, status) VALUES
  ('โครงการก่อสร้างสะพานข้ามแม่น้ำเจ้าพระยา', 'ออกแบบและก่อสร้างสะพานคอนกรีตเสริมเหล็ก ความยาว 450 เมตร', 'โยธา', 'กรุงเทพมหานคร', 2023, 13.7563, 100.5018, 'active'),
  ('โครงการระบบประปาหมู่บ้าน เชียงใหม่', 'วางระบบท่อประปาและสถานีสูบน้ำในชุมชนชนบท', 'สาธารณูปโภค', 'เชียงใหม่', 2022, 18.7883, 98.9853, 'active'),
  ('โครงการปรับปรุงถนนสายหลัก จ.ขอนแก่น', 'ขยายช่องจราจรและปูผิวทางใหม่ ระยะทาง 12 กิโลเมตร', 'ถนน', 'ขอนแก่น', 2023, 16.4419, 102.8360, 'active'),
  ('โครงการอาคารสำนักงานใหม่ กรุงเทพฯ', 'ออกแบบและก่อสร้างอาคารสำนักงาน 15 ชั้น', 'อาคาร', 'กรุงเทพมหานคร', 2024, 13.7300, 100.5200, 'active'),
  ('โครงการระบบไฟฟ้าแรงสูง ภาคใต้', 'ติดตั้งระบบสายส่งไฟฟ้าแรงสูง 115kV ระยะทาง 80 กิโลเมตร', 'ไฟฟ้า', 'สุราษฎร์ธานี', 2022, 9.1396, 99.3276, 'active'),
  ('โครงการฝายกักเก็บน้ำ จ.นครราชสีมา', 'ก่อสร้างฝายคอนกรีตกั้นน้ำ พร้อมระบบระบายน้ำ', 'ชลประทาน', 'นครราชสีมา', 2023, 14.9799, 102.0978, 'active'),
  ('โครงการท่าเรือพาณิชย์ ระยอง', 'ก่อสร้างท่าเทียบเรือและลานกองสินค้า', 'ท่าเรือ', 'ระยอง', 2021, 12.6833, 101.2816, 'active'),
  ('โครงการอุโมงค์ระบายน้ำ กรุงเทพฯ', 'ขุดเจาะและก่อสร้างอุโมงค์ระบายน้ำใต้ดิน', 'ระบบระบายน้ำ', 'กรุงเทพมหานคร', 2024, 13.8000, 100.4900, 'active'),
  ('โครงการสวนสาธารณะเมืองใหม่ เชียงราย', 'ออกแบบภูมิสถาปัตยกรรมและก่อสร้างสวนสาธารณะ 50 ไร่', 'ภูมิสถาปัตย์', 'เชียงราย', 2022, 19.9071, 99.8307, 'active'),
  ('โครงการโรงพยาบาลส่งเสริมสุขภาพ ขอนแก่น', 'ก่อสร้างอาคารโรงพยาบาล 3 ชั้น พร้อมระบบสาธารณูปโภค', 'อาคาร', 'ขอนแก่น', 2023, 16.4200, 102.8100, 'active');
