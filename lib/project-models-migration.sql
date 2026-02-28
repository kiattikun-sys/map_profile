-- ═══════════════════════════════════════════════════════════
-- TRIPIRA Map Profile — 3D Model Migration
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1) Create storage bucket (run once — or create via Dashboard)
-- Dashboard → Storage → New Bucket
--   Name:   project-models
--   Public: false  (signed URLs or use authenticated download)
-- If you prefer public bucket, set Public: true

-- 2) Table: project_models
CREATE TABLE IF NOT EXISTS public.project_models (
  project_id     uuid PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  model_path     text NOT NULL,
  anchor_lng     double precision NOT NULL,
  anchor_lat     double precision NOT NULL,
  altitude_m     double precision NOT NULL DEFAULT 0,
  rotation_z_deg double precision NOT NULL DEFAULT 0,
  scale          double precision NOT NULL DEFAULT 1,
  updated_at     timestamptz      NOT NULL DEFAULT now()
);

-- 3) RLS
ALTER TABLE public.project_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_models public read"
  ON public.project_models FOR SELECT
  TO public
  USING (true);

CREATE POLICY "project_models authenticated write"
  ON public.project_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "project_models authenticated update"
  ON public.project_models FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "project_models authenticated delete"
  ON public.project_models FOR DELETE
  TO authenticated
  USING (true);

-- 4) Storage RLS for project-models bucket
--    (enable RLS on storage.objects first if not already done)

CREATE POLICY "project-models public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'project-models');

CREATE POLICY "project-models authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-models');

CREATE POLICY "project-models authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-models')
  WITH CHECK (bucket_id = 'project-models');

CREATE POLICY "project-models authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-models');
