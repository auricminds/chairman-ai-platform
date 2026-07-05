-- ══════════════════════════════════════════════════════════════
-- Migration 002: Chairman Constitution Policy Tables
-- Run in Supabase SQL editor (Dashboard → SQL Editor)
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- 1. chairman_policy_versions
-- Stores every version of the Chairman Constitution.
-- Only one version can be "active" at a time.
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chairman_policy_versions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_name        text NOT NULL,
  constitution_text   text NOT NULL,
  editable_settings   jsonb NOT NULL DEFAULT '{}'::jsonb,
  status              text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'testing', 'active', 'archived')),
  created_by          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  published_at        timestamptz,
  archived_at         timestamptz
);

-- Only one active version at a time
CREATE UNIQUE INDEX IF NOT EXISTS chairman_policy_versions_single_active
  ON public.chairman_policy_versions (status)
  WHERE status = 'active';

-- RLS: only owners can read/write
ALTER TABLE public.chairman_policy_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_read_policy_versions"
  ON public.chairman_policy_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('owner', 'super_admin')
    )
  );

CREATE POLICY "owner_write_policy_versions"
  ON public.chairman_policy_versions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('owner', 'super_admin')
    )
  );

-- ──────────────────────────────────────────────
-- 2. chairman_policy_tests
-- Records benchmark test results per policy version + engine.
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chairman_policy_tests (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id   uuid NOT NULL REFERENCES public.chairman_policy_versions(id) ON DELETE CASCADE,
  engine_key          text NOT NULL,
  test_case_key       text NOT NULL,
  passed              boolean NOT NULL DEFAULT false,
  failure_reason      text,
  output_summary      text,    -- truncated safe excerpt, no raw prompt/answer
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chairman_policy_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_read_policy_tests"
  ON public.chairman_policy_tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('owner', 'super_admin')
    )
  );

CREATE POLICY "service_write_policy_tests"
  ON public.chairman_policy_tests FOR INSERT
  WITH CHECK (true); -- written by service role key

-- ──────────────────────────────────────────────
-- 3. chairman_policy_audit_logs
-- Immutable log of every constitution action.
-- Never stores raw prompts or raw answers.
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chairman_policy_audit_logs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id   uuid REFERENCES public.chairman_policy_versions(id) ON DELETE SET NULL,
  owner_id            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action              text NOT NULL,  -- e.g. 'created_draft', 'published', 'archived', 'rolled_back'
  safe_metadata       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Immutable: no UPDATE or DELETE
ALTER TABLE public.chairman_policy_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_read_audit_logs"
  ON public.chairman_policy_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('owner', 'super_admin')
    )
  );

CREATE POLICY "service_insert_audit_logs"
  ON public.chairman_policy_audit_logs FOR INSERT
  WITH CHECK (true); -- written by service role key

-- ──────────────────────────────────────────────
-- 4. ai_requests table
-- Create if it doesn't exist, then add constitution columns.
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ai_requests (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  policy_version                  text,
  scope_category                  text,
  cloud_consent_id                uuid,
  response_validation_status      text DEFAULT 'pending'
    CHECK (response_validation_status IN ('pending', 'clean', 'sanitised', 'flagged')),
  predictive_output_present       boolean DEFAULT false
);

-- If ai_requests already existed, add the new columns safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_requests' AND column_name = 'policy_version') THEN
    ALTER TABLE public.ai_requests ADD COLUMN policy_version text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_requests' AND column_name = 'scope_category') THEN
    ALTER TABLE public.ai_requests ADD COLUMN scope_category text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_requests' AND column_name = 'cloud_consent_id') THEN
    ALTER TABLE public.ai_requests ADD COLUMN cloud_consent_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_requests' AND column_name = 'response_validation_status') THEN
    ALTER TABLE public.ai_requests
      ADD COLUMN response_validation_status text DEFAULT 'pending'
        CHECK (response_validation_status IN ('pending', 'clean', 'sanitised', 'flagged'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ai_requests' AND column_name = 'predictive_output_present') THEN
    ALTER TABLE public.ai_requests ADD COLUMN predictive_output_present boolean DEFAULT false;
  END IF;
END $$;

-- ──────────────────────────────────────────────
-- 5. Seed the v1.0 Constitution as the initial active version
-- ──────────────────────────────────────────────

INSERT INTO public.chairman_policy_versions (
  version_name,
  constitution_text,
  editable_settings,
  status,
  published_at
) VALUES (
  'Chairman Constitution v1.0',
  'See /apps/api/src/policies/chairmanConstitution.ts — CORE_CONSTITUTION export',
  jsonb_build_object(
    'brandTone', 'professional',
    'defaultLanguage', 'en',
    'allowedBusinessCategories', array[
      'business_strategy','operations','professional_writing',
      'project_management','professional_career','document_review',
      'workflow_design','research_request','website_product_analysis',
      'productivity_for_work','business_decision'
    ],
    'responseStyle', 'structured',
    'predictiveAlertStyle', 'conservative',
    'confidenceWording', 'Low / Medium / High',
    'defaultOutputStructure', 'answer + next_action',
    'professionalRedirectWording', 'Chairman AI is designed for professional and business work. Tell me the business goal, project, customer, document, workflow, career objective, or decision you want to improve.'
  ),
  'active',
  now()
);

-- ──────────────────────────────────────────────
-- 6. Log the initial publish
-- ──────────────────────────────────────────────

INSERT INTO public.chairman_policy_audit_logs (
  policy_version_id,
  action,
  safe_metadata
)
SELECT
  id,
  'initial_publish',
  jsonb_build_object('note', 'Chairman Constitution v1.0 — initial publication')
FROM public.chairman_policy_versions
WHERE version_name = 'Chairman Constitution v1.0';
