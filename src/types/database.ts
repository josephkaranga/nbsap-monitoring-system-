// src/types/database.ts
// ============================================================
// Auto-generated database types (mirrors Supabase schema)
// Run: supabase gen types typescript --local > src/types/database.ts
// ============================================================

export type UserRole = 'admin' | 'district_officer' | 'sector_officer' | 'viewer'
export type ReportStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type IndicatorTier = 'headline' | 'component' | 'binary' | 'diagnostic'
export type IndicatorStatus = 'on-track' | 'at-risk' | 'behind'
export type RiskLevel = 'High' | 'Medium' | 'Low'
export type SubmissionTool = 'T01' | 'T02' | 'T03' | 'T04' | 'T05' | 'T06' | 'T07'
export type DistrictSubmissionStatus = 'submitted' | 'pending' | 'missing'

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ── Entity types ───────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  organization: string | null
  district: string | null
  province: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at' | 'last_login'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>

export interface Province {
  id: string
  name: string
  code: string
  created_at: string
}

export interface District {
  id: string
  name: string
  province_id: string
  compliance_score: number
  forest_cover_pct: number
  submission_status: DistrictSubmissionStatus
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
  // joined
  provinces?: Province
}

export interface Indicator {
  id: string
  sequence_no: number
  name: string
  definition: string
  tier: IndicatorTier
  target_2030: string
  baseline: string | null
  midterm_2027: string | null
  current_value: string | null
  progress_pct: number
  status: IndicatorStatus
  data_source: string | null
  periodicity: string | null
  km_gbf_ref: string | null
  nbsap_target: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  tool_id: SubmissionTool
  tool_name: string
  submitted_by: string
  district_id: string | null
  status: ReportStatus
  period: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null

  // T01
  institution: string | null
  nbsap_target: string | null
  indicator_name: string | null
  baseline_val: number | null
  current_status: number | null
  milestone_val: number | null
  budget_utilized: number | null
  activities: string | null
  challenges: string | null

  // T02
  district_name: string | null
  officer_name: string | null
  forest_ha: number | null
  wetland_ha: number | null
  agroforestry_hh: number | null
  soil_structures: number | null
  livelihood_proj: number | null
  conservation_groups: number | null
  illegal_cases: number | null
  awareness_sessions: number | null
  notes: string | null

  // T03
  area_name: string | null
  agency: string | null
  coverage_change: number | null
  species_trend: string | null
  habitat_quality: number | null
  visitors: number | null
  restoration_ha: number | null
  observations: string | null

  // T04
  community: string | null
  reporter_name: string | null
  reporter_type: string | null
  hwc_incidents: number | null
  tree_planting_hh: number | null
  water_source_status: string | null
  species_sightings: string | null

  // T05
  institution_type: string | null
  fiscal_year: string | null
  budget_allocated: number | null
  budget_disbursed: number | null
  implementation_pct: number | null
  activity_funded: string | null

  // T06
  company: string | null
  sector: string | null
  reporting_year: string | null
  eia_compliance: string | null
  restoration_commitments: number | null
  esg_score: number | null
  waste_management: string | null
  certifications: string | null

  // T07
  research_institution: string | null
  study_title: string | null
  year_completed: string | null
  ecosystem_assessed: string | null
  geographic_scope: string | null
  key_findings: string | null
  policy_relevance: string | null
  dataset_url: string | null

  attachments: ReportAttachment[]
  created_at: string
  updated_at: string

  // joined
  submitter?: Profile
  reviewer?: Profile
  district?: District
}

export interface Risk {
  id: string
  code: string
  description: string
  category: string
  likelihood: string
  impact: string
  level: RiskLevel
  mitigation: string
  owner: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action_type: string
  action: string
  detail: string | null
  table_name: string | null
  record_id: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  // joined
  profile?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warn' | 'alert' | 'success'
  is_read: boolean
  action_url: string | null
  action_label: string | null
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  language: string
  show_live_stats: boolean
  animate_progress: boolean
  compact_sidebar: boolean
  auto_refresh: boolean
  show_baseline: boolean
  require_verification: boolean
  species_location_fuzz: boolean
  mask_species_names: boolean
  restrict_raw_export: boolean
  log_exports: boolean
  notif_overdue: boolean
  notif_compliance: boolean
  notif_compliance_threshold: number
  notif_deadlines: boolean
  notif_deadline_days: number
  notif_pending: boolean
  notif_finance: boolean
  notif_risk: boolean
  notif_email: string | null
  notif_sms: string | null
  watchlist_indicators: number[]
  created_at: string
  updated_at: string
}

export interface ReportAttachment {
  id: string
  report_id: string
  file_name: string
  file_ext: string
  file_size: number
  storage_path: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          organization: string | null
          district: string | null
          province: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: UserRole
          organization?: string | null
          district?: string | null
          province?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          organization?: string | null
          district?: string | null
          province?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          language: string
          show_live_stats: boolean
          animate_progress: boolean
          compact_sidebar: boolean
          auto_refresh: boolean
          show_baseline: boolean
          require_verification: boolean
          species_location_fuzz: boolean
          mask_species_names: boolean
          restrict_raw_export: boolean
          log_exports: boolean
          notif_overdue: boolean
          notif_compliance: boolean
          notif_compliance_threshold: number
          notif_deadlines: boolean
          notif_deadline_days: number
          notif_pending: boolean
          notif_finance: boolean
          notif_risk: boolean
          notif_email: string | null
          notif_sms: string | null
          watchlist_indicators: number[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          show_live_stats?: boolean
          animate_progress?: boolean
          compact_sidebar?: boolean
          auto_refresh?: boolean
          show_baseline?: boolean
          require_verification?: boolean
          species_location_fuzz?: boolean
          mask_species_names?: boolean
          restrict_raw_export?: boolean
          log_exports?: boolean
          notif_overdue?: boolean
          notif_compliance?: boolean
          notif_compliance_threshold?: number
          notif_deadlines?: boolean
          notif_deadline_days?: number
          notif_pending?: boolean
          notif_finance?: boolean
          notif_risk?: boolean
          notif_email?: string | null
          notif_sms?: string | null
          watchlist_indicators?: number[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          show_live_stats?: boolean
          animate_progress?: boolean
          compact_sidebar?: boolean
          auto_refresh?: boolean
          show_baseline?: boolean
          require_verification?: boolean
          species_location_fuzz?: boolean
          mask_species_names?: boolean
          restrict_raw_export?: boolean
          log_exports?: boolean
          notif_overdue?: boolean
          notif_compliance?: boolean
          notif_compliance_threshold?: number
          notif_deadlines?: boolean
          notif_deadline_days?: number
          notif_pending?: boolean
          notif_finance?: boolean
          notif_risk?: boolean
          notif_email?: string | null
          notif_sms?: string | null
          watchlist_indicators?: number[]
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action_type: string
          action: string
          detail: string | null
          table_name: string | null
          record_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action_type: string
          action: string
          detail?: string | null
          table_name?: string | null
          record_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action_type?: string
          action?: string
          detail?: string | null
          table_name?: string | null
          record_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// ── RBAC permission maps ───────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, {
  label: string
  avatar: string
  canSubmitReports: boolean
  canApproveReports: boolean
  canViewAllReports: boolean
  canViewRawData: boolean
  canManageUsers: boolean
  canViewAuditLog: boolean
  canModifyIndicators: boolean
  canExportData: boolean
  canViewVerifQueue: boolean
}> = {
  admin: {
    label: 'REMA Administrator',
    avatar: 'RA',
    canSubmitReports: true,
    canApproveReports: true,
    canViewAllReports: true,
    canViewRawData: true,
    canManageUsers: true,
    canViewAuditLog: true,
    canModifyIndicators: true,
    canExportData: true,
    canViewVerifQueue: true,
  },
  district_officer: {
    label: 'District Officer',
    avatar: 'DO',
    canSubmitReports: true,
    canApproveReports: false,
    canViewAllReports: false,
    canViewRawData: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canModifyIndicators: false,
    canExportData: true,
    canViewVerifQueue: false,
  },
  sector_officer: {
    label: 'Sector Officer',
    avatar: 'SO',
    canSubmitReports: true,
    canApproveReports: true,
    canViewAllReports: true,
    canViewRawData: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canModifyIndicators: false,
    canExportData: true,
    canViewVerifQueue: true,
  },
  viewer: {
    label: 'Public Viewer',
    avatar: 'PV',
    canSubmitReports: false,
    canApproveReports: false,
    canViewAllReports: false,
    canViewRawData: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canModifyIndicators: false,
    canExportData: false,
    canViewVerifQueue: false,
  },
}
