-- ============================================================
-- NBSAP Monitoring System · Rwanda
-- Supabase Schema v1.0
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'admin',
  'district_officer',
  'sector_officer',
  'viewer'
);

CREATE TYPE report_status AS ENUM (
  'draft',
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE indicator_tier AS ENUM (
  'headline',
  'component',
  'binary',
  'diagnostic'
);

CREATE TYPE indicator_status AS ENUM (
  'on-track',
  'at-risk',
  'behind'
);

CREATE TYPE risk_level AS ENUM (
  'High',
  'Medium',
  'Low'
);

CREATE TYPE submission_tool AS ENUM (
  'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07'
);

CREATE TYPE district_submission_status AS ENUM (
  'submitted',
  'pending',
  'missing'
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'viewer',
  organization  TEXT,
  district      TEXT,
  province      TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROVINCES
-- ============================================================

CREATE TABLE public.provinces (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  code       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.provinces (name, code) VALUES
  ('Kigali', 'KGL'),
  ('North', 'NOR'),
  ('South', 'SOU'),
  ('East', 'EAS'),
  ('West', 'WES');

-- ============================================================
-- DISTRICTS
-- ============================================================

CREATE TABLE public.districts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL UNIQUE,
  province_id       UUID NOT NULL REFERENCES public.provinces(id),
  compliance_score  NUMERIC(5,2) DEFAULT 0,
  forest_cover_pct  NUMERIC(5,2) DEFAULT 0,
  submission_status district_submission_status DEFAULT 'missing',
  latitude          NUMERIC(10,6),
  longitude         NUMERIC(10,6),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed districts
INSERT INTO public.districts (name, province_id, compliance_score, forest_cover_pct, submission_status)
SELECT d.name, p.id, d.compliance, d.forest, d.status::district_submission_status
FROM (VALUES
  ('Kigali City',   'Kigali', 92, 18, 'submitted'),
  ('Nyarugenge',    'Kigali', 88, 12, 'submitted'),
  ('Gasabo',        'Kigali', 91, 15, 'submitted'),
  ('Kicukiro',      'Kigali', 89, 14, 'submitted'),
  ('Nyanza',        'South',  85, 28, 'submitted'),
  ('Gisagara',      'South',  72, 22, 'pending'),
  ('Nyaruguru',     'South',  80, 35, 'submitted'),
  ('Huye',          'South',  87, 26, 'submitted'),
  ('Kamonyi',       'South',  70, 20, 'pending'),
  ('Ruhango',       'South',  82, 24, 'submitted'),
  ('Muhanga',       'South',  84, 21, 'submitted'),
  ('Gakenke',       'North',  58, 42, 'missing'),
  ('Musanze',       'North',  86, 38, 'submitted'),
  ('Burera',        'North',  83, 40, 'submitted'),
  ('Rulindo',       'North',  60, 36, 'missing'),
  ('Gicumbi',       'North',  81, 32, 'submitted'),
  ('Rubavu',        'West',   88, 30, 'submitted'),
  ('Nyabihu',       'West',   82, 29, 'submitted'),
  ('Ngororero',     'West',   74, 27, 'pending'),
  ('Karongi',       'West',   85, 33, 'submitted'),
  ('Rutsiro',       'West',   79, 31, 'submitted'),
  ('Rusizi',        'West',   83, 35, 'submitted'),
  ('Nyamasheke',    'West',   80, 37, 'submitted'),
  ('Rwamagana',     'East',   86, 19, 'submitted'),
  ('Nyagatare',     'East',   84, 16, 'submitted'),
  ('Gatsibo',       'East',   78, 18, 'submitted'),
  ('Kayonza',       'East',   80, 17, 'submitted'),
  ('Kirehe',        'East',   77, 20, 'submitted'),
  ('Ngoma',         'East',   81, 21, 'submitted'),
  ('Bugesera',      'East',   83, 23, 'submitted')
) AS d(name, province_name, compliance, forest, status)
JOIN public.provinces p ON p.name = d.province_name;

-- ============================================================
-- INDICATORS
-- ============================================================

CREATE TABLE public.indicators (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_no   INTEGER NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  definition    TEXT NOT NULL,
  tier          indicator_tier NOT NULL,
  target_2030   TEXT NOT NULL,
  baseline      TEXT,
  midterm_2027  TEXT,
  current_value TEXT,
  progress_pct  NUMERIC(5,2) DEFAULT 0,
  status        indicator_status NOT NULL DEFAULT 'on-track',
  data_source   TEXT,
  periodicity   TEXT,
  km_gbf_ref    TEXT,
  nbsap_target  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed indicators (22 national indicators)
INSERT INTO public.indicators (sequence_no, name, definition, tier, target_2030, baseline, midterm_2027, current_value, progress_pct, status, data_source, periodicity, km_gbf_ref, nbsap_target) VALUES
(1,  'Forest Cover (%)', 'Percentage of total land area under forest cover', 'headline', '30% of total land area', '24%', '27%', '26.5%', 72, 'on-track', 'Remote sensing, National Forest Inventory', 'Annual', 'Target 2 (Restoration)', 'Target 1'),
(2,  'Wetland Area Restored (ha)', 'Total hectares of degraded wetlands restored', 'headline', '1,200 ha restored', '0 ha', '600 ha', '520 ha', 43, 'at-risk', 'Field surveys, Community reports', 'Annual', 'Target 2 (Restoration)', 'Target 2'),
(3,  'Protected Species Trends', 'Population trends of selected threatened species', 'headline', 'Stable or increasing', '500 individuals', '650', '610', 52, 'on-track', 'Wildlife census, Ranger patrols', 'Biannual', 'Target 4', 'Target 3'),
(4,  'Ecosystem Service Value (RWF)', 'Economic value from ecosystem services', 'component', 'RWF 15 billion', 'RWF 10B', 'RWF 12.5B', 'RWF 11.8B', 60, 'on-track', 'District reports, Enterprise data', 'Annual', 'Target 14', 'Target 4'),
(5,  'Indigenous Crop Varieties', 'Total indigenous crop varieties conserved', 'component', '50 varieties', '35', '42', '40', 55, 'on-track', 'RAB reports, Research institutes', 'Annual', 'Target 13', 'Target 5'),
(6,  'Protected Areas with Mgmt Plans', 'Proportion of protected areas with updated management plans', 'binary', '100% coverage', '80%', '90%', '88%', 80, 'on-track', 'RDB reports, PA audits', 'Annual', 'Target 3', 'Target 6'),
(7,  'Forest & Wetland Restored (ha)', 'Total hectares restored (combined)', 'headline', '2,500 ha', '0 ha', '1,250 ha', '1,100 ha', 44, 'at-risk', 'Project reports, Field surveys', 'Annual', 'Target 2', 'Target 7'),
(8,  'Sustainable Resource Use Initiatives', 'Initiatives promoting sustainable harvesting', 'component', '50 initiatives', '20', '35', '32', 53, 'on-track', 'Community & Cooperative records', 'Annual', 'Target 10', 'Target 8'),
(9,  'Water Bodies Meeting Standards (%)', 'Proportion of water bodies meeting national standards', 'headline', '90% compliance', '65%', '80%', '76%', 61, 'on-track', 'WASAC, REMA water quality reports', 'Biannual', 'Target 6', 'Target 9'),
(10, 'Carbon Sequestration (tCO₂e)', 'Total carbon sequestered in forests and wetlands', 'component', '500,000 tCO₂e', '350,000', '425,000', '410,000', 67, 'on-track', 'Remote sensing, National inventories', 'Annual', 'Target 8', 'Target 10'),
(11, 'Restoration Monitoring Compliance', 'Proportion of projects with completed monitoring reports', 'headline', '100%', '50%', '75%', '68%', 60, 'on-track', 'Project M&E reports', 'Biannual', 'Target 2', 'Target 11'),
(12, 'Community Participation (%)', '% of communities actively engaged in monitoring', 'headline', '80% participation', '40%', '60%', '55%', 56, 'on-track', 'Community logs, Participatory M&E', 'Annual', 'Target 22', 'Target 12'),
(13, 'Biodiversity-Friendly Livelihoods Revenue', 'Total revenue from conservation-linked livelihoods', 'headline', 'RWF 5 billion', 'RWF 2B', 'RWF 3.5B', 'RWF 3.1B', 58, 'on-track', 'Cooperative reports, District records', 'Annual', 'Target 13', 'Target 13'),
(14, 'Sector Plans with Biodiversity', 'Plans integrating biodiversity into sectoral policies', 'component', '15 plans', '5', '10', '9', 53, 'on-track', 'Ministry & District reports', 'Annual', 'Target 14', 'Target 14'),
(15, 'Private Sector Biodiversity Actions', 'Enterprises implementing biodiversity practices', 'component', '30 enterprises', '10', '20', '17', 47, 'at-risk', 'Company reports, Regulatory audits', 'Annual', 'Target 15', 'Target 15'),
(16, 'Policy Decisions from M&E', 'Decisions based on M&E data', 'headline', '50 decisions', '15', '30', '28', 52, 'on-track', 'Ministry reports, RBIS analysis', 'Annual', 'Target 20', 'Target 16'),
(17, 'Invasive Species Incidents', 'Number of invasive species detected and reported', 'headline', '0 new invasives', '5', '2', '3', 40, 'behind', 'Field surveys, Community reports, RBIS', 'Quarterly', 'Target 6', 'Target 17'),
(18, 'Biodiversity Funding (RWF)', 'Total funding mobilized for biodiversity', 'component', 'RWF 10 billion', 'RWF 6B', 'RWF 8B', 'RWF 7.2B', 53, 'on-track', 'Donor & Government reports', 'Annual', 'Target 19', 'Target 18'),
(19, 'Stakeholders Trained in M&E', 'Individuals trained in biodiversity monitoring', 'component', '2,000 stakeholders', '500', '1,200', '1,050', 55, 'on-track', 'Training records, Workshop logs', 'Annual', 'Target 21', 'Target 19'),
(20, 'Biodiversity Knowledge Products', 'Reports, maps, policy briefs generated', 'headline', '50 products', '20', '35', '31', 55, 'on-track', 'REMA publications, RBIS', 'Annual', 'Target 21', 'Target 20'),
(21, 'Timely Biodiversity Report Submissions', 'Reports submitted as per CBD requirements', 'binary', '100% compliance', '70%', '85%', '80%', 67, 'on-track', 'Ministry reports, RBIS', 'Annual', 'Target 20', 'Target 21'),
(22, 'Gender & IPLC Participation (%)', 'Women, youth, and IPLCs engaged in M&E', 'headline', '50% women & 30% IPLC', '20% w / 10% IPLC', '35% w / 20% IPLC', '32% w / 18% IPLC', 54, 'at-risk', 'Surveys, Community reports', 'Annual', 'Target 22 & 23', 'Target 22');

-- ============================================================
-- INDICATOR RESPONSIBLE ORGANIZATIONS
-- ============================================================

CREATE TABLE public.indicator_organizations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id  UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  organization  TEXT NOT NULL,
  color_bg      TEXT,
  color_text    TEXT
);

-- ============================================================
-- REPORTS (Toolkit submissions T01-T07)
-- ============================================================

CREATE TABLE public.reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id         submission_tool NOT NULL,
  tool_name       TEXT NOT NULL,
  submitted_by    UUID NOT NULL REFERENCES public.profiles(id),
  district_id     UUID REFERENCES public.districts(id),
  status          report_status NOT NULL DEFAULT 'pending',
  period          TEXT,
  reviewed_by     UUID REFERENCES public.profiles(id),
  reviewed_at     TIMESTAMPTZ,
  review_note     TEXT,

  -- T01 Institutional fields
  institution     TEXT,
  nbsap_target    TEXT,
  indicator_name  TEXT,
  baseline_val    NUMERIC,
  current_status  NUMERIC,
  milestone_val   NUMERIC,
  budget_utilized NUMERIC,
  activities      TEXT,
  challenges      TEXT,

  -- T02 District fields
  district_name   TEXT,
  officer_name    TEXT,
  forest_ha       NUMERIC DEFAULT 0,
  wetland_ha      NUMERIC DEFAULT 0,
  agroforestry_hh INTEGER DEFAULT 0,
  soil_structures INTEGER DEFAULT 0,
  livelihood_proj INTEGER DEFAULT 0,
  conservation_groups INTEGER DEFAULT 0,
  illegal_cases   INTEGER DEFAULT 0,
  awareness_sessions INTEGER DEFAULT 0,
  notes           TEXT,

  -- T03 Protected Area fields
  area_name       TEXT,
  agency          TEXT,
  coverage_change NUMERIC,
  species_trend   TEXT,
  habitat_quality INTEGER,
  visitors        INTEGER,
  restoration_ha  NUMERIC,
  observations    TEXT,

  -- T04 Community fields
  community       TEXT,
  reporter_name   TEXT,
  reporter_type   TEXT,
  hwc_incidents   INTEGER DEFAULT 0,
  tree_planting_hh INTEGER DEFAULT 0,
  water_source_status TEXT,
  species_sightings TEXT,

  -- T05 Finance fields
  institution_type    TEXT,
  fiscal_year         TEXT,
  budget_allocated    NUMERIC DEFAULT 0,
  budget_disbursed    NUMERIC DEFAULT 0,
  implementation_pct  NUMERIC DEFAULT 0,
  activity_funded     TEXT,

  -- T06 Private Sector fields
  company             TEXT,
  sector              TEXT,
  reporting_year      TEXT,
  eia_compliance      TEXT,
  restoration_commitments NUMERIC,
  esg_score           INTEGER,
  waste_management    TEXT,
  certifications      TEXT,

  -- T07 Research fields
  research_institution TEXT,
  study_title          TEXT,
  year_completed       TEXT,
  ecosystem_assessed   TEXT,
  geographic_scope     TEXT,
  key_findings         TEXT,
  policy_relevance     TEXT,
  dataset_url          TEXT,

  -- Metadata
  attachments         JSONB DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RISK REGISTER
-- ============================================================

CREATE TABLE public.risks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category    TEXT NOT NULL,
  likelihood  TEXT NOT NULL,
  impact      TEXT NOT NULL,
  level       risk_level NOT NULL,
  mitigation  TEXT NOT NULL,
  owner       TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.risks (code, description, category, likelihood, impact, level, mitigation, owner) VALUES
('R01', 'Ministerial data sharing refusal', 'Institutional', 'Medium', 'High', 'High', 'Engage Cabinet-level data sharing MOU; designate REMA as lead coordinator; escalate to Environment Ministry if refusal persists', 'REMA'),
('R02', 'RBIS technical integration failure', 'Technical', 'Low', 'High', 'High', 'Maintain parallel offline data collection templates (Excel); run RBIS on staging environment before live; assign dedicated ICT lead', 'ICT Unit'),
('R03', 'Sensitive species data exposed publicly', 'Data Governance', 'Medium', 'High', 'High', 'Apply role-based access control; implement species location fuzzing for threatened taxa; define data classification tiers before RBIS integration', 'REMA / RDB'),
('R04', 'District capacity gaps in data collection', 'Capacity', 'High', 'Medium', 'Medium', 'Pre-deploy T02 training in lowest-performing districts; embed REMA field officers in 5 priority districts; mobile-friendly forms for offline entry', 'Districts / REMA'),
('R05', 'Biodiversity financing gap widens', 'Financial', 'High', 'Medium', 'Medium', 'Activate T05 finance tracking quarterly; trigger early alert if disbursement falls below 60% of allocation; engage GCF and GEF pipeline', 'MINECOFIN'),
('R06', 'Private sector non-compliance with EIA', 'Compliance', 'Medium', 'Medium', 'Medium', 'Enforce T06 annual reporting; link EIA compliance to business licensing renewals; publish sector-level compliance index publicly', 'REMA / RDB'),
('R07', 'Community data quality inconsistencies', 'Data Governance', 'High', 'Low', 'Medium', 'Apply sector-level validation before aggregation; cross-check T04 community data against T02 district data; train community monitors via T04 guide', 'District Officers'),
('R08', 'Staff turnover in key M&E roles', 'Capacity', 'Medium', 'Medium', 'Medium', 'Embed capacity in institutions not individuals; document all protocols in RBIS; cross-train 2 officers per ministry; maintain knowledge repository', 'REMA HR'),
('R09', 'CBD reporting deadline missed', 'Compliance', 'Low', 'High', 'Medium', 'Build 6-month buffer into CBD reporting timeline; assign dedicated CBD focal point; align annual NBSAP reports with CBD submission schedule', 'REMA'),
('R10', 'Gender & IPLC data underreported', 'Inclusion', 'Medium', 'Medium', 'Low', 'Mandate disaggregated gender data in T02 and T04 forms; include IPLC liaison in community monitoring training; use Indicator 22 as early warning', 'REMA / NGOs'),
('R11', 'Invasive species spread unchecked', 'Ecological', 'Medium', 'High', 'High', 'Trigger immediate response protocol if Indicator 17 shows any new invasive; activate community monitoring network (T04) for early detection reporting', 'RDB / Districts'),
('R12', 'Research data not integrated into RBIS', 'Data Governance', 'Low', 'Low', 'Low', 'Mandate T07 submissions for all Rwanda-based biodiversity research; create university MOU framework; appoint Research Liaison Officer at REMA', 'REMA / Universities');

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action      TEXT NOT NULL,
  detail      TEXT,
  table_name  TEXT,
  record_id   UUID,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info', -- info, warn, alert, success
  is_read     BOOLEAN NOT NULL DEFAULT false,
  action_url  TEXT,
  action_label TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER PREFERENCES / SETTINGS
-- ============================================================

CREATE TABLE public.user_preferences (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  language                  TEXT DEFAULT 'en',
  show_live_stats           BOOLEAN DEFAULT true,
  animate_progress          BOOLEAN DEFAULT true,
  compact_sidebar           BOOLEAN DEFAULT false,
  auto_refresh              BOOLEAN DEFAULT true,
  show_baseline             BOOLEAN DEFAULT true,
  require_verification      BOOLEAN DEFAULT true,
  species_location_fuzz     BOOLEAN DEFAULT false,
  mask_species_names        BOOLEAN DEFAULT false,
  restrict_raw_export       BOOLEAN DEFAULT true,
  log_exports               BOOLEAN DEFAULT true,
  notif_overdue             BOOLEAN DEFAULT true,
  notif_compliance          BOOLEAN DEFAULT true,
  notif_compliance_threshold INTEGER DEFAULT 60,
  notif_deadlines           BOOLEAN DEFAULT true,
  notif_deadline_days       INTEGER DEFAULT 14,
  notif_pending             BOOLEAN DEFAULT true,
  notif_finance             BOOLEAN DEFAULT true,
  notif_risk                BOOLEAN DEFAULT true,
  notif_email               TEXT,
  notif_sms                 TEXT,
  watchlist_indicators      INTEGER[] DEFAULT '{}',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REPORT ATTACHMENTS
-- ============================================================

CREATE TABLE public.report_attachments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id   UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_ext    TEXT NOT NULL,
  file_size   BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_indicators_updated_at
  BEFORE UPDATE ON public.indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer')
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_reports_submitted_by ON public.reports(submitted_by);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_tool_id ON public.reports(tool_id);
CREATE INDEX idx_reports_district_id ON public.reports(district_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_districts_province ON public.districts(province_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──────────────────────────────────────────────
-- Users can read all profiles (for reviewer names etc.)
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow profile creation during signup (trigger function)
CREATE POLICY "profiles_insert_signup" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Users can update only their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (get_my_role() = 'admin');

-- ── DISTRICTS ─────────────────────────────────────────────
-- All authenticated users can view districts
CREATE POLICY "districts_select_all" ON public.districts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can modify districts
CREATE POLICY "districts_admin_modify" ON public.districts
  FOR ALL USING (get_my_role() = 'admin');

-- ── INDICATORS ────────────────────────────────────────────
-- All authenticated users can view indicators
CREATE POLICY "indicators_select_all" ON public.indicators
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admins can modify indicators
CREATE POLICY "indicators_admin_modify" ON public.indicators
  FOR ALL USING (get_my_role() = 'admin');

-- ── REPORTS ───────────────────────────────────────────────
-- Admins see everything
CREATE POLICY "reports_admin_all" ON public.reports
  FOR ALL USING (get_my_role() = 'admin');

-- District officers see their own + their district's reports
CREATE POLICY "reports_district_officer_select" ON public.reports
  FOR SELECT USING (
    get_my_role() = 'district_officer' AND (
      submitted_by = auth.uid() OR
      district_id IN (
        SELECT id FROM public.districts
        WHERE name = (SELECT district FROM public.profiles WHERE id = auth.uid())
      )
    )
  );

-- District officers can insert their own reports
CREATE POLICY "reports_district_officer_insert" ON public.reports
  FOR INSERT WITH CHECK (
    get_my_role() IN ('district_officer', 'sector_officer') AND
    submitted_by = auth.uid()
  );

-- Officers can update their own draft/pending reports
CREATE POLICY "reports_officer_update_own" ON public.reports
  FOR UPDATE USING (
    submitted_by = auth.uid() AND
    status IN ('draft', 'pending') AND
    get_my_role() IN ('district_officer', 'sector_officer')
  );

-- Sector officers see all reports
CREATE POLICY "reports_sector_officer_select" ON public.reports
  FOR SELECT USING (get_my_role() = 'sector_officer');

-- Viewers see only approved reports
CREATE POLICY "reports_viewer_select" ON public.reports
  FOR SELECT USING (
    get_my_role() = 'viewer' AND status = 'approved'
  );

-- ── RISKS ─────────────────────────────────────────────────
-- All authenticated users can view risks
CREATE POLICY "risks_select_all" ON public.risks
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can modify risks
CREATE POLICY "risks_admin_modify" ON public.risks
  FOR ALL USING (get_my_role() = 'admin');

-- ── AUDIT LOGS ────────────────────────────────────────────
-- Only admins can view all audit logs
CREATE POLICY "audit_logs_admin_select" ON public.audit_logs
  FOR SELECT USING (get_my_role() = 'admin');

-- Users can view their own audit logs
CREATE POLICY "audit_logs_own_select" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- System can insert audit logs (via service role)
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── NOTIFICATIONS ─────────────────────────────────────────
-- Users only see their own notifications
CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Admins can insert notifications for any user
CREATE POLICY "notifications_admin_insert" ON public.notifications
  FOR INSERT WITH CHECK (get_my_role() = 'admin' OR user_id = auth.uid());

-- ── USER PREFERENCES ──────────────────────────────────────
-- Allow preference creation during signup (trigger function)
CREATE POLICY "user_preferences_insert_signup" ON public.user_preferences
  FOR INSERT WITH CHECK (true);

-- Users only see/modify their own preferences
CREATE POLICY "user_preferences_own" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- ── REPORT ATTACHMENTS ────────────────────────────────────
CREATE POLICY "attachments_owner_select" ON public.report_attachments
  FOR SELECT USING (
    report_id IN (
      SELECT id FROM public.reports WHERE submitted_by = auth.uid()
    ) OR get_my_role() IN ('admin', 'sector_officer')
  );

CREATE POLICY "attachments_owner_insert" ON public.report_attachments
  FOR INSERT WITH CHECK (
    report_id IN (
      SELECT id FROM public.reports WHERE submitted_by = auth.uid()
    )
  );

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or CLI)
-- ============================================================
-- supabase storage create report-attachments --public false
-- supabase storage create avatars --public true
