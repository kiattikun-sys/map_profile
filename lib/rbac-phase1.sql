-- =============================================================
-- RBAC Phase 1 — Role-Based Access Control
-- Run in Supabase SQL Editor (safe to re-run — fully idempotent)
-- =============================================================

-- ─────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. client_orgs — organisations that have client-role users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_orgs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_orgs ENABLE ROW LEVEL SECURITY;

-- Drop before recreate to keep idempotent
DROP POLICY IF EXISTS "super/admin full access client_orgs"  ON client_orgs;
DROP POLICY IF EXISTS "client read own org"                  ON client_orgs;
DROP POLICY IF EXISTS "viewer read client_orgs"              ON client_orgs;

CREATE POLICY "super/admin full access client_orgs" ON client_orgs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

CREATE POLICY "client read own org" ON client_orgs
  FOR SELECT TO authenticated
  USING (
    id = (
      SELECT client_org_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "viewer read client_orgs" ON client_orgs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'viewer'
    )
  );

-- ─────────────────────────────────────────────
-- 2. profiles — one row per auth user, holds role + org
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'viewer'
                  CHECK (role IN ('super', 'admin', 'client', 'viewer')),
  client_org_id UUID REFERENCES client_orgs(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super/admin full access profiles"  ON profiles;
DROP POLICY IF EXISTS "user read own profile"             ON profiles;
DROP POLICY IF EXISTS "user update own profile"           ON profiles;

CREATE POLICY "super/admin full access profiles" ON profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid()
        AND p2.role IN ('super', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid()
        AND p2.role IN ('super', 'admin')
    )
  );

CREATE POLICY "user read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    -- users cannot self-promote their role
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- ─────────────────────────────────────────────
-- 3. Add client_org_id to projects (idempotent)
-- ─────────────────────────────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_org_id UUID REFERENCES client_orgs(id) ON DELETE SET NULL;

-- Update existing RLS on projects — replace permissive auth write with role-aware policies
-- (public SELECT policy already exists; we ADD role-aware write policies)

DROP POLICY IF EXISTS "Auth insert projects"  ON projects;
DROP POLICY IF EXISTS "Auth update projects"  ON projects;
DROP POLICY IF EXISTS "Auth delete projects"  ON projects;
DROP POLICY IF EXISTS "super/admin insert projects"  ON projects;
DROP POLICY IF EXISTS "super/admin update projects"  ON projects;
DROP POLICY IF EXISTS "super/admin delete projects"  ON projects;
DROP POLICY IF EXISTS "client update own projects"   ON projects;

-- super/admin: full write
CREATE POLICY "super/admin insert projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

CREATE POLICY "super/admin update projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

CREATE POLICY "super/admin delete projects" ON projects
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

-- client: can only UPDATE their own org's projects (progress/notes via project_updates — not core fields)
CREATE POLICY "client update own projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'client'
        AND profiles.client_org_id = projects.client_org_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'client'
        AND profiles.client_org_id = projects.client_org_id
    )
  );

-- ─────────────────────────────────────────────
-- 4a. project_updates — progress / status notes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_updates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  progress    INTEGER CHECK (progress BETWEEN 0 AND 100),
  status      TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super/admin full access project_updates"    ON project_updates;
DROP POLICY IF EXISTS "client read own project_updates"            ON project_updates;
DROP POLICY IF EXISTS "client insert own project_updates"          ON project_updates;
DROP POLICY IF EXISTS "viewer read project_updates"                ON project_updates;

CREATE POLICY "super/admin full access project_updates" ON project_updates
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

CREATE POLICY "client read own project_updates" ON project_updates
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN projects pr ON pr.id = project_updates.project_id
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND p.client_org_id = pr.client_org_id
    )
  );

CREATE POLICY "client insert own project_updates" ON project_updates
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles p
      JOIN projects pr ON pr.id = project_updates.project_id
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND p.client_org_id = pr.client_org_id
    )
  );

CREATE POLICY "viewer read project_updates" ON project_updates
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'viewer'
    )
  );

-- ─────────────────────────────────────────────
-- 4b. project_files — uploaded files per project
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_files (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,   -- e.g. org/<org_id>/project/<project_id>/<filename>
  label        TEXT,
  mime_type    TEXT,
  size_bytes   BIGINT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super/admin full access project_files"  ON project_files;
DROP POLICY IF EXISTS "client read own project_files"          ON project_files;
DROP POLICY IF EXISTS "client insert own project_files"        ON project_files;
DROP POLICY IF EXISTS "viewer read project_files"              ON project_files;

CREATE POLICY "super/admin full access project_files" ON project_files
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

CREATE POLICY "client read own project_files" ON project_files
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN projects pr ON pr.id = project_files.project_id
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND p.client_org_id = pr.client_org_id
    )
  );

CREATE POLICY "client insert own project_files" ON project_files
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles p
      JOIN projects pr ON pr.id = project_files.project_id
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND p.client_org_id = pr.client_org_id
    )
  );

CREATE POLICY "viewer read project_files" ON project_files
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'viewer'
    )
  );

-- ─────────────────────────────────────────────
-- 5. Storage bucket: project-client-files (PRIVATE)
--    Run this block separately if bucket already exists
-- ─────────────────────────────────────────────

-- Create private bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-client-files', 'project-client-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop existing storage policies before recreating
DELETE FROM storage.policies
WHERE bucket_id = 'project-client-files';

-- super/admin: full read+write on entire bucket
CREATE POLICY "super/admin storage full access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'project-client-files'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  )
  WITH CHECK (
    bucket_id = 'project-client-files'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super', 'admin')
    )
  );

-- client: read+write only under org/<their_client_org_id>/
CREATE POLICY "client storage own org"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'project-client-files'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND storage.objects.name LIKE 'org/' || p.client_org_id::text || '/%'
    )
  )
  WITH CHECK (
    bucket_id = 'project-client-files'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'client'
        AND storage.objects.name LIKE 'org/' || p.client_org_id::text || '/%'
    )
  );

-- viewer / anon: NO access (no policy = deny by default with RLS enabled)

-- ─────────────────────────────────────────────
-- 6. Backfill: create profiles for existing users
--    (safe — ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────────
INSERT INTO profiles (id, role)
SELECT id, 'viewer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Promote the first user (kiattikun) to super — update email to match yours
-- UPDATE profiles
-- SET role = 'super'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'kiattikun@trpra.com');

-- ─────────────────────────────────────────────
-- DONE — Phase 1 complete
-- ─────────────────────────────────────────────
