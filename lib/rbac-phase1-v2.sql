-- =============================================================
-- RBAC Phase 1 v2 — Fixed execution order
-- Run in Supabase SQL Editor (safe to re-run — fully idempotent)
-- =============================================================

-- ─────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. client_orgs (no RLS policies yet — profiles doesn't exist)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_orgs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_orgs ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 2. profiles — MUST be created before any policy that references it
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

-- ─────────────────────────────────────────────
-- 3. Helper function — avoids circular dependency in RLS
--    Returns role of current user from profiles table
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION auth_client_org_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT client_org_id FROM profiles WHERE id = auth.uid()
$$;

-- ─────────────────────────────────────────────
-- 4. RLS policies for client_orgs (now profiles exists)
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "super/admin full access client_orgs" ON client_orgs;
DROP POLICY IF EXISTS "client read own org"                 ON client_orgs;
DROP POLICY IF EXISTS "viewer read client_orgs"             ON client_orgs;

CREATE POLICY "super/admin full access client_orgs" ON client_orgs
  FOR ALL TO authenticated
  USING (auth_role() IN ('super', 'admin'))
  WITH CHECK (auth_role() IN ('super', 'admin'));

CREATE POLICY "client read own org" ON client_orgs
  FOR SELECT TO authenticated
  USING (auth_role() = 'client' AND id = auth_client_org_id());

CREATE POLICY "viewer read client_orgs" ON client_orgs
  FOR SELECT TO authenticated
  USING (auth_role() = 'viewer');

-- ─────────────────────────────────────────────
-- 5. RLS policies for profiles
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "super/admin full access profiles" ON profiles;
DROP POLICY IF EXISTS "user read own profile"            ON profiles;
DROP POLICY IF EXISTS "user update own profile"          ON profiles;

CREATE POLICY "super/admin full access profiles" ON profiles
  FOR ALL TO authenticated
  USING (auth_role() IN ('super', 'admin'))
  WITH CHECK (auth_role() IN ('super', 'admin'));

CREATE POLICY "user read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ─────────────────────────────────────────────
-- 6. Auto-create profile on new signup
-- ─────────────────────────────────────────────
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

-- Auto-update updated_at
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
-- 7. Add client_org_id to projects (idempotent)
-- ─────────────────────────────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_org_id UUID REFERENCES client_orgs(id) ON DELETE SET NULL;

-- Replace old permissive write policies with role-aware ones
DROP POLICY IF EXISTS "Auth insert projects"         ON projects;
DROP POLICY IF EXISTS "Auth update projects"         ON projects;
DROP POLICY IF EXISTS "Auth delete projects"         ON projects;
DROP POLICY IF EXISTS "super/admin insert projects"  ON projects;
DROP POLICY IF EXISTS "super/admin update projects"  ON projects;
DROP POLICY IF EXISTS "super/admin delete projects"  ON projects;
DROP POLICY IF EXISTS "client update own projects"   ON projects;

CREATE POLICY "super/admin insert projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (auth_role() IN ('super', 'admin'));

CREATE POLICY "super/admin update projects" ON projects
  FOR UPDATE TO authenticated
  USING (auth_role() IN ('super', 'admin'));

CREATE POLICY "super/admin delete projects" ON projects
  FOR DELETE TO authenticated
  USING (auth_role() IN ('super', 'admin'));

CREATE POLICY "client update own projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    auth_role() = 'client'
    AND client_org_id = auth_client_org_id()
  )
  WITH CHECK (
    auth_role() = 'client'
    AND client_org_id = auth_client_org_id()
  );

-- ─────────────────────────────────────────────
-- 8. project_updates
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_updates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  progress   INTEGER CHECK (progress BETWEEN 0 AND 100),
  status     TEXT,
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super/admin full access project_updates"  ON project_updates;
DROP POLICY IF EXISTS "client read own project_updates"          ON project_updates;
DROP POLICY IF EXISTS "client insert own project_updates"        ON project_updates;
DROP POLICY IF EXISTS "viewer read project_updates"              ON project_updates;

CREATE POLICY "super/admin full access project_updates" ON project_updates
  FOR ALL TO authenticated
  USING (auth_role() IN ('super', 'admin'))
  WITH CHECK (auth_role() IN ('super', 'admin'));

CREATE POLICY "client read own project_updates" ON project_updates
  FOR SELECT TO authenticated
  USING (
    auth_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
        AND projects.client_org_id = auth_client_org_id()
    )
  );

CREATE POLICY "client insert own project_updates" ON project_updates
  FOR INSERT TO authenticated
  WITH CHECK (
    auth_role() = 'client'
    AND author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
        AND projects.client_org_id = auth_client_org_id()
    )
  );

CREATE POLICY "viewer read project_updates" ON project_updates
  FOR SELECT TO authenticated
  USING (auth_role() = 'viewer');

-- ─────────────────────────────────────────────
-- 9. project_files
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_files (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
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
  USING (auth_role() IN ('super', 'admin'))
  WITH CHECK (auth_role() IN ('super', 'admin'));

CREATE POLICY "client read own project_files" ON project_files
  FOR SELECT TO authenticated
  USING (
    auth_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
        AND projects.client_org_id = auth_client_org_id()
    )
  );

CREATE POLICY "client insert own project_files" ON project_files
  FOR INSERT TO authenticated
  WITH CHECK (
    auth_role() = 'client'
    AND uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
        AND projects.client_org_id = auth_client_org_id()
    )
  );

CREATE POLICY "viewer read project_files" ON project_files
  FOR SELECT TO authenticated
  USING (auth_role() = 'viewer');

-- ─────────────────────────────────────────────
-- 10. Storage bucket: project-client-files (private)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-client-files', 'project-client-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "super/admin storage full access" ON storage.objects;
DROP POLICY IF EXISTS "client storage own org"          ON storage.objects;

CREATE POLICY "super/admin storage full access"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'project-client-files'
    AND auth_role() IN ('super', 'admin')
  )
  WITH CHECK (
    bucket_id = 'project-client-files'
    AND auth_role() IN ('super', 'admin')
  );

CREATE POLICY "client storage own org"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'project-client-files'
    AND auth_role() = 'client'
    AND name LIKE 'org/' || auth_client_org_id()::text || '/%'
  )
  WITH CHECK (
    bucket_id = 'project-client-files'
    AND auth_role() = 'client'
    AND name LIKE 'org/' || auth_client_org_id()::text || '/%'
  );

-- ─────────────────────────────────────────────
-- 11. Backfill profiles for existing users
-- ─────────────────────────────────────────────
INSERT INTO profiles (id, role)
SELECT id, 'viewer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 12. Promote roles (uncomment and run separately)
-- ─────────────────────────────────────────────
-- UPDATE profiles SET role = 'super'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'kiattikun@trpra.com');

-- UPDATE profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'mongkolc@tripeera.com');

-- ─────────────────────────────────────────────
-- DONE — Phase 1 v2 complete
-- ─────────────────────────────────────────────
