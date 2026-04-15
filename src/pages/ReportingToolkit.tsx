// src/pages/ReportingToolkit.tsx
// ============================================================
// T01-T07 reporting modules — submits to Supabase
// Replaces all localStorage toolkit logic
// ============================================================

import React, { useState, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useData'
import { reportsService } from '../services/reports.service'
import { notificationsService } from '../services/index'
import type { SubmissionTool, Report } from '../types/database'

// ── Tool definitions ───────────────────────────────────────
interface ToolField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea'
  options?: string[]
  placeholder?: string
  optional?: boolean
  min?: number
  max?: number
}

interface ToolDef {
  id: SubmissionTool
  name: string
  icon: string
  color: string
  accent: string
  frequency: string
  output: string
  fields: ToolField[]
}

const TOOLS: ToolDef[] = [
  {
    id: 'T01', name: 'National Institutional Reporting', icon: '🏛️',
    color: '#1B6CA8', accent: '#4CA3DD', frequency: 'Quarterly', output: 'Institutional Compliance Scorecard',
    fields: [
      { key: 'institution', label: 'Reporting Institution', type: 'select', options: ['Environment Ministry','Agriculture Ministry','Infrastructure Ministry','Forestry Authority','Wildlife Authority','National Statistics Office','Water Resources Authority'] },
      { key: 'period', label: 'Reporting Period', type: 'select', options: ['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      { key: 'nbsap_target', label: 'NBSAP Target', type: 'text', placeholder: 'e.g. Target 3' },
      { key: 'indicator_name', label: 'Indicator Tracked', type: 'text', placeholder: 'Indicator name' },
      { key: 'baseline_val', label: 'Baseline Value', type: 'number', placeholder: '0' },
      { key: 'current_status', label: 'Current Status / Value', type: 'number', placeholder: '0' },
      { key: 'milestone_val', label: 'Target Milestone', type: 'number', placeholder: '0' },
      { key: 'budget_utilized', label: 'Budget Utilized (RWF)', type: 'number', placeholder: '0' },
      { key: 'activities', label: 'Implementation Activities', type: 'textarea', optional: true, placeholder: 'Describe completed activities…' },
      { key: 'challenges', label: 'Challenges Encountered', type: 'textarea', optional: true, placeholder: 'Describe constraints…' },
    ],
  },
  {
    id: 'T02', name: 'District Biodiversity Monitoring', icon: '🌿',
    color: '#1E7D4B', accent: '#4CBB7F', frequency: 'Quarterly', output: 'District Biodiversity Performance Index',
    fields: [
      { key: 'district_name', label: 'District Name', type: 'text', placeholder: 'e.g. Nyarugenge' },
      { key: 'officer_name', label: 'Reporting Officer', type: 'text', placeholder: 'Full name' },
      { key: 'period', label: 'Reporting Period', type: 'select', options: ['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      { key: 'forest_ha', label: 'Forest Restoration (ha)', type: 'number', placeholder: '0', min: 0 },
      { key: 'wetland_ha', label: 'Wetland Rehabilitation (ha)', type: 'number', placeholder: '0', min: 0 },
      { key: 'agroforestry_hh', label: 'Agroforestry Households', type: 'number', placeholder: '0', min: 0 },
      { key: 'soil_structures', label: 'Soil Conservation Structures', type: 'number', placeholder: '0', min: 0 },
      { key: 'livelihood_proj', label: 'Livelihood Projects', type: 'number', placeholder: '0', min: 0 },
      { key: 'conservation_groups', label: 'Conservation Groups', type: 'number', placeholder: '0', min: 0 },
      { key: 'illegal_cases', label: 'Illegal Activities Reported', type: 'number', placeholder: '0', min: 0 },
      { key: 'awareness_sessions', label: 'Awareness Sessions', type: 'number', placeholder: '0', min: 0 },
      { key: 'notes', label: 'Additional Notes', type: 'textarea', optional: true, placeholder: 'Any observations…' },
    ],
  },
  {
    id: 'T03', name: 'Protected Area Monitoring', icon: '🛡️',
    color: '#5B3FA6', accent: '#9C78E0', frequency: 'Biannual', output: 'Ecosystem Integrity Report',
    fields: [
      { key: 'area_name', label: 'Protected Area Name', type: 'text', placeholder: 'e.g. Nyungwe National Park' },
      { key: 'agency', label: 'Managing Agency', type: 'text', placeholder: 'Agency name' },
      { key: 'period', label: 'Reporting Period', type: 'select', options: ['H1 2024','H2 2024','H1 2025','H2 2025'] },
      { key: 'coverage_change', label: 'Coverage Change (ha)', type: 'number', placeholder: '0' },
      { key: 'species_trend', label: 'Species Population Trend', type: 'select', options: ['Increasing','Stable','Declining','Unknown'] },
      { key: 'habitat_quality', label: 'Habitat Quality (1–10)', type: 'number', placeholder: '5', min: 1, max: 10 },
      { key: 'illegal_cases', label: 'Illegal Activities Detected', type: 'number', placeholder: '0', min: 0 },
      { key: 'visitors', label: 'Visitor Numbers', type: 'number', placeholder: '0', min: 0 },
      { key: 'restoration_ha', label: 'Restoration Activities (ha)', type: 'number', placeholder: '0', min: 0 },
      { key: 'observations', label: 'Field Observations', type: 'textarea', optional: true, placeholder: 'Key findings…' },
    ],
  },
  {
    id: 'T04', name: 'Community Biodiversity Monitoring', icon: '👥',
    color: '#B56A00', accent: '#F0A030', frequency: 'Quarterly', output: 'Community Observation Dataset',
    fields: [
      { key: 'community', label: 'Community / Village', type: 'text', placeholder: 'Community name' },
      { key: 'reporter_name', label: 'Reporter / Group Name', type: 'text', placeholder: 'Name or group' },
      { key: 'reporter_type', label: 'Reporter Type', type: 'select', options: ['Community Conservation Committee','Youth Environmental Club','Women\'s Cooperative','Indigenous Knowledge Holder','Other'] },
      { key: 'period', label: 'Reporting Period', type: 'select', options: ['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      { key: 'hwc_incidents', label: 'Human-Wildlife Conflict Incidents', type: 'number', placeholder: '0', min: 0 },
      { key: 'tree_planting_hh', label: 'Tree Planting Households', type: 'number', placeholder: '0', min: 0 },
      { key: 'water_source_status', label: 'Water Source Condition', type: 'select', options: ['Good','Fair','Degraded','Dry / Absent'] },
      { key: 'species_sightings', label: 'Species Sightings', type: 'textarea', optional: true, placeholder: 'e.g. Mountain gorilla – 3 sightings' },
    ],
  },
  {
    id: 'T05', name: 'Biodiversity Finance Tracking', icon: '💰',
    color: '#0E6655', accent: '#1ABC9C', frequency: 'Annual', output: 'Finance Gap Analysis',
    fields: [
      { key: 'institution', label: 'Institution Name', type: 'text', placeholder: 'Institution or partner' },
      { key: 'institution_type', label: 'Institution Type', type: 'select', options: ['Ministry of Finance','Environment Ministry','Development Partner','NGO','Private Sector','Other'] },
      { key: 'fiscal_year', label: 'Fiscal Year', type: 'select', options: ['2023','2024','2025'] },
      { key: 'budget_allocated', label: 'Budget Allocated (RWF)', type: 'number', placeholder: '0', min: 0 },
      { key: 'budget_disbursed', label: 'Budget Disbursed (RWF)', type: 'number', placeholder: '0', min: 0 },
      { key: 'nbsap_target', label: 'NBSAP Target Supported', type: 'text', placeholder: 'e.g. Target 5' },
      { key: 'implementation_pct', label: 'Implementation Status (%)', type: 'number', placeholder: '0', min: 0, max: 100 },
      { key: 'activity_funded', label: 'Activity / Program Funded', type: 'textarea', optional: true, placeholder: 'Description…' },
    ],
  },
  {
    id: 'T06', name: 'Private Sector Compliance', icon: '🏗️',
    color: '#922B21', accent: '#E74C3C', frequency: 'Annual', output: 'Private-Sector Compliance Index',
    fields: [
      { key: 'company', label: 'Company Name', type: 'text', placeholder: 'Company name' },
      { key: 'sector', label: 'Sector', type: 'select', options: ['Infrastructure','Agribusiness','Mining','Tourism','Finance / Investment','Other'] },
      { key: 'reporting_year', label: 'Reporting Year', type: 'select', options: ['2023','2024','2025'] },
      { key: 'eia_compliance', label: 'EIA Compliance', type: 'select', options: ['Full compliance','Partial compliance','Non-compliant','Not applicable'] },
      { key: 'restoration_commitments', label: 'Restoration Commitments (ha)', type: 'number', placeholder: '0', min: 0 },
      { key: 'esg_score', label: 'ESG Biodiversity Score (1–100)', type: 'number', placeholder: '0', min: 1, max: 100 },
      { key: 'waste_management', label: 'Waste Management Rating', type: 'select', options: ['Excellent','Good','Fair','Poor'] },
      { key: 'certifications', label: 'Environmental Certifications', type: 'text', optional: true, placeholder: 'e.g. ISO 14001' },
    ],
  },
  {
    id: 'T07', name: 'Research & Academic Contribution', icon: '🔬',
    color: '#1A5276', accent: '#2E86C1', frequency: 'Annual', output: 'Biodiversity Evidence Repository',
    fields: [
      { key: 'research_institution', label: 'Research Institution', type: 'text', placeholder: 'University or institute' },
      { key: 'study_title', label: 'Study Title', type: 'text', placeholder: 'Full title' },
      { key: 'year_completed', label: 'Year Completed', type: 'select', options: ['2021','2022','2023','2024','2025'] },
      { key: 'ecosystem_assessed', label: 'Ecosystem Assessed', type: 'select', options: ['Forest','Wetland','Savanna','Aquatic','Agricultural','Urban','Multiple'] },
      { key: 'geographic_scope', label: 'Geographic Scope', type: 'text', placeholder: 'Region or district' },
      { key: 'key_findings', label: 'Key Findings Summary', type: 'textarea', placeholder: 'Summarize main findings…' },
      { key: 'policy_relevance', label: 'Policy Relevance & NBSAP Linkage', type: 'textarea', optional: true, placeholder: 'How does this support NBSAP?' },
      { key: 'dataset_url', label: 'Dataset / Publication URL', type: 'text', optional: true, placeholder: 'https://…' },
    ],
  },
]

// ── Submission form ────────────────────────────────────────
function ToolForm({
  tool,
  onBack,
  onSuccess,
}: {
  tool: ToolDef
  onBack: () => void
  onSuccess: () => void
}) {
  const { profile, preferences } = useAuth()
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [lastReport, setLastReport] = useState<Report | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    tool.fields.forEach(f => {
      if (f.optional) return
      const val = formData[f.key]
      if (val === undefined || val === null || val === '') {
        newErrors[f.key] = 'This field is required.'
      }
      if (f.type === 'number' && val !== undefined && val !== '') {
        const n = Number(val)
        if (isNaN(n)) newErrors[f.key] = 'Must be a number.'
        if (f.min !== undefined && n < f.min) newErrors[f.key] = `Minimum value is ${f.min}.`
        if (f.max !== undefined && n > f.max) newErrors[f.key] = `Maximum value is ${f.max}.`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, tool.fields])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !profile) return

    setSubmitting(true)
    try {
      const requireVerif = preferences?.require_verification !== false
      const payload: Record<string, any> = {
        tool_id: tool.id,
        tool_name: tool.name,
      }
      tool.fields.forEach(f => {
        const val = formData[f.key]
        if (val !== undefined && val !== '') {
          payload[f.key] = f.type === 'number' ? Number(val) : val
        }
      })

      const report = await reportsService.submit(payload as any, requireVerif, profile.id, files.length ? files : undefined)
      setLastReport(report)

      // Notify admins if pending
      if (requireVerif) {
        // In production: trigger server-side notification via Edge Function
        // For now, create in-band notification
      }

      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    const allowed = ['pdf', 'xlsx', 'xls', 'doc', 'docx']
    const valid = Array.from(fl).filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
      return allowed.includes(ext)
    })
    setFiles(prev => [...prev, ...valid])
  }

  if (submitted) return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
        {preferences?.require_verification !== false ? '⏳' : '✅'}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
        {preferences?.require_verification !== false ? 'Submission Queued for Review' : 'Report Submitted Successfully'}
      </h3>
      <p style={{ fontSize: '.82rem', color: '#64748b', marginBottom: '6px' }}>
        {tool.name} · {new Date().toLocaleDateString()} · {files.length} attachment(s)
      </p>
      {preferences?.require_verification !== false && (
        <div style={{
          background: '#fef9c3', borderRadius: '8px', padding: '10px 14px',
          fontSize: '.78rem', color: '#854d0e', marginTop: '12px', marginBottom: '20px',
          borderLeft: '3px solid #f59e0b',
        }}>
          ⏳ This submission is queued for REMA technical review before updating live dashboard metrics.
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setSubmitted(false); setFormData({}); setFiles([]) }}
          style={{ padding: '9px 20px', borderRadius: '9px', border: `1.5px solid ${tool.accent}`, color: tool.accent, background: 'transparent', fontSize: '.83rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >Submit Another</button>
        <button
          onClick={onBack}
          style={{ padding: '9px 20px', borderRadius: '9px', border: 'none', background: tool.accent, color: '#fff', fontSize: '.83rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >← Back to Tools</button>
      </div>
    </div>
  )

  return (
    <div>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#0ea5e9', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', marginBottom: '18px' }}>
        ← Back to Tools
      </button>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
        {/* Tool header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '2.2rem' }}>{tool.icon}</span>
          <div>
            <div style={{ fontSize: '.68rem', fontFamily: "'DM Mono',monospace", color: tool.accent, letterSpacing: '.1em', marginBottom: '2px' }}>{tool.id} · {tool.frequency}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{tool.name}</div>
            <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>→ {tool.output}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            {tool.fields.map(f => {
              const isFullWidth = f.type === 'textarea'
              const err = errors[f.key]
              return (
                <div key={f.key} style={{ gridColumn: isFullWidth ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{
                    fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em',
                    textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Mono',monospace",
                  }}>
                    {f.label}
                    {!f.optional && <span style={{ color: '#f43f5e', marginLeft: '2px' }}>*</span>}
                    {f.optional && <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>(optional)</span>}
                  </label>

                  {f.type === 'select' ? (
                    <select
                      value={String(formData[f.key] ?? '')}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{
                        border: `1.5px solid ${err ? '#f43f5e' : '#e2e8f0'}`,
                        borderRadius: '8px', padding: '9px 12px',
                        fontSize: '.83rem', fontFamily: 'inherit', outline: 'none',
                        background: '#fff',
                      }}
                    >
                      <option value="">— Select —</option>
                      {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={String(formData[f.key] ?? '')}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={3}
                      style={{
                        border: `1.5px solid ${err ? '#f43f5e' : '#e2e8f0'}`,
                        borderRadius: '8px', padding: '9px 12px',
                        fontSize: '.83rem', fontFamily: 'inherit', outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={String(formData[f.key] ?? '')}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      min={f.min}
                      max={f.max}
                      style={{
                        border: `1.5px solid ${err ? '#f43f5e' : '#e2e8f0'}`,
                        borderRadius: '8px', padding: '9px 12px',
                        fontSize: '.83rem', fontFamily: 'inherit', outline: 'none',
                      }}
                    />
                  )}

                  {err && <div style={{ fontSize: '.68rem', color: '#f43f5e' }}>{err}</div>}
                </div>
              )
            })}
          </div>

          {/* File upload */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '20px',
              textAlign: 'center', cursor: 'pointer', transition: '.2s', marginBottom: '16px',
            }}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = tool.accent }}
            onDragLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0' }}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); e.currentTarget.style.borderColor = '#e2e8f0' }}
          >
            <input ref={fileRef} type="file" multiple accept=".pdf,.xlsx,.xls,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>📎</div>
            <div style={{ fontSize: '.82rem', color: '#475569' }}>
              Drop files or <span style={{ color: tool.accent, textDecoration: 'underline' }}>browse</span>
            </div>
            <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: '3px' }}>PDF · Excel · Word</div>
          </div>

          {files.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '6px', border: '1px solid #e2e8f0' }}>
                  <span>📄</span>
                  <span style={{ flex: 1, fontSize: '.78rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <span style={{ fontSize: '.68rem', color: '#94a3b8' }}>{(f.size / 1024).toFixed(1)} KB</span>
                  <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '.9rem' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '.7rem', color: '#94a3b8' }}>
              <span style={{ color: '#f43f5e' }}>*</span> Required fields ·{' '}
              {preferences?.require_verification !== false
                ? '⏳ Will be queued for REMA review'
                : '✅ Auto-approved mode'}
            </span>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 28px', borderRadius: '9px', border: 'none',
                background: submitting ? `${tool.accent}88` : `linear-gradient(135deg,${tool.color},${tool.accent})`,
                color: '#fff', fontSize: '.88rem', fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                transition: 'all .2s',
                boxShadow: submitting ? 'none' : '0 4px 12px rgba(0,0,0,.15)',
              }}
            >
              {submitting ? '⏳ Submitting…' : 'Submit Report →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Submissions table ──────────────────────────────────────
function SubmissionsTable({ reports, onDelete, onRefresh }: { reports: Report[]; onDelete: (id: string) => void; onRefresh: () => void }) {
  const [toolFilter, setToolFilter] = useState<SubmissionTool | 'ALL'>('ALL')
  const [periodFilter, setPeriodFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = reports.filter(r => {
    if (toolFilter !== 'ALL' && r.tool_id !== toolFilter) return false
    if (periodFilter !== 'ALL' && !r.period?.includes(periodFilter)) return false
    return true
  })
  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const statusColors: Record<string, string[]> = {
    pending: ['#fef9c3','#854d0e'],
    approved: ['#dcfce7','#166534'],
    rejected: ['#fee2e2','#991b1b'],
    draft: ['#f1f5f9','#475569'],
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <select value={toolFilter} onChange={e => { setToolFilter(e.target.value as any); setPage(1) }}
          style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.8rem', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
          <option value="ALL">All Tools</option>
          {['T01','T02','T03','T04','T05','T06','T07'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={periodFilter} onChange={e => { setPeriodFilter(e.target.value); setPage(1) }}
          style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.8rem', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
          <option value="ALL">All Periods</option>
          {['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={onRefresh} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', background: '#fff', fontFamily: 'inherit', color: '#475569' }}>
          ↻ Refresh
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '.72rem', color: '#94a3b8', alignSelf: 'center', fontFamily: "'DM Mono',monospace" }}>{filtered.length} records</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
          <p style={{ fontSize: '.85rem' }}>No submissions yet. Use a reporting module above.</p>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Date', 'Tool', 'Status', 'Key Info', 'Period', 'Submitted By', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.67rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map(r => {
                  const [stBg, stColor] = statusColors[r.status] ?? statusColors.draft
                  const keyInfo = r.district_name ?? r.institution ?? r.company ?? r.area_name ?? r.community ?? r.research_institution ?? '—'
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '11px 14px', color: '#94a3b8', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{r.tool_id}</span>
                        <span style={{ fontSize: '.7rem', color: '#94a3b8', marginLeft: '6px' }}>{r.tool_name.split(' ').slice(0, 2).join(' ')}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: stBg, color: stColor }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0f172a', fontWeight: 500 }}>{keyInfo}</td>
                      <td style={{ padding: '11px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>{r.period ?? '—'}</td>
                      <td style={{ padding: '11px 14px', fontSize: '.75rem', color: '#64748b' }}>
                        {(r as any).submitter?.full_name ?? '—'}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <button
                          onClick={() => { if (confirm('Delete this submission? This cannot be undone.')) onDelete(r.id) }}
                          style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '.8rem', padding: '2px 6px', borderRadius: '4px' }}
                          title="Delete"
                        >🗑</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
              <span style={{ fontSize: '.72rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: p === page ? '#0f2744' : '#fff',
                    color: p === page ? '#fff' : '#475569',
                    fontSize: '.78rem', cursor: 'pointer',
                  }}>{p}</button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ReportingToolkit({ defaultTool }: { defaultTool?: string }) {
  const { profile } = useAuth()
  const { reports, stats, loading, refresh, deleteReport } = useReports({})
  const defaultToolDef = defaultTool ? TOOLS.find(t => t.id === defaultTool) ?? null : null
  const [activeTool, setActiveTool] = useState<ToolDef | null>(defaultToolDef)
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'analytics'>('submissions')

  if (activeTool) {
    return (
      <ToolForm
        tool={activeTool}
        onBack={() => { setActiveTool(null); refresh() }}
        onSuccess={() => { setActiveTool(null); refresh() }}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #0ea5e9',
        borderRadius: '12px', padding: '16px 18px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
      }}>
        <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>📝</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '.92rem', color: '#0f172a' }}>Integrated Reporting Modules (T01–T07)</div>
          <div style={{ fontSize: '.73rem', color: '#94a3b8', marginTop: '2px' }}>
            Structured templates linked to the 5-tier data pipeline. All submissions are saved to Supabase and flow through the verification queue.
          </div>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { label: `${stats.approved} Approved`, bg: '#dcfce7', color: '#166534' },
              { label: `${stats.pending} Pending`, bg: '#fef9c3', color: '#854d0e' },
              { label: `${stats.rejected} Rejected`, bg: '#fee2e2', color: '#991b1b' },
            ].map(s => (
              <span key={s.label} style={{ fontSize: '.68rem', padding: '3px 9px', borderRadius: '10px', background: s.bg, color: s.color, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tool cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
        {TOOLS.map(t => {
          const count = reports.filter(r => r.tool_id === t.id).length
          const approved = reports.filter(r => r.tool_id === t.id && r.status === 'approved').length
          const pending = reports.filter(r => r.tool_id === t.id && r.status === 'pending').length
          return (
            <div
              key={t.id}
              onClick={() => setActiveTool(t)}
              style={{
                background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0',
                borderTop: `3px solid ${t.accent}`,
                padding: '18px', cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(0,0,0,.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
            >
              <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '10px' }}>{t.icon}</span>
              <div style={{ fontSize: '.62rem', fontFamily: "'DM Mono',monospace", color: t.accent, marginBottom: '4px', letterSpacing: '.08em' }}>{t.id} · {t.frequency}</div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '4px' }}>{t.name}</div>
              <div style={{ fontSize: '.7rem', color: '#94a3b8', marginBottom: '12px' }}>→ {t.output}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.62rem', padding: '2px 7px', borderRadius: '8px', background: `${t.accent}22`, color: t.accent, fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{t.frequency}</span>
                {count > 0 && (
                  <span style={{ fontSize: '.68rem', color: '#10b981', fontWeight: 700 }}>
                    {approved > 0 ? `✓ ${approved}` : ''}{pending > 0 ? ` ⏳${pending}` : ''}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submissions + Analytics */}
      <div>
        <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
          {([['submissions', '🗂 Submissions'], ['analytics', '📊 Analytics']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveSubTab(tab)} style={{
              padding: '9px 16px', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer',
              background: 'none', border: 'none', fontFamily: 'inherit',
              borderBottom: `2px solid ${activeSubTab === tab ? '#0ea5e9' : 'transparent'}`,
              color: activeSubTab === tab ? '#0ea5e9' : '#64748b', marginBottom: '-1px',
            }}>{label}</button>
          ))}
        </div>

        {activeSubTab === 'submissions' && (
          <SubmissionsTable
            reports={reports}
            onDelete={deleteReport}
            onRefresh={refresh}
          />
        )}

        {activeSubTab === 'analytics' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ fontSize: '.85rem', fontWeight: 700, margin: '0 0 14px' }}>Submissions by Tool</h4>
              {TOOLS.map(t => {
                const cnt = stats.byTool[t.id] ?? 0
                const maxC = Math.max(...Object.values(stats.byTool), 1)
                const pct = Math.round((cnt / maxC) * 100)
                return (
                  <div key={t.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', marginBottom: '3px' }}>
                      <span>{t.icon} {t.id} · {t.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span style={{ color: t.accent, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{cnt}</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: '3px', height: '6px' }}>
                      <div style={{ background: t.accent, width: `${pct}%`, height: '6px', borderRadius: '3px', transition: 'width .6s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ fontSize: '.85rem', fontWeight: 700, margin: '0 0 14px' }}>Key Metrics</h4>
              {[
                { label: 'Forest Restored (T02)', val: `${stats.forestHa.toLocaleString()} ha`, color: '#10b981' },
                { label: 'Wetland Restored (T02)', val: `${stats.wetlandHa.toLocaleString()} ha`, color: '#0ea5e9' },
                { label: 'HWC Incidents (T04)', val: stats.hwcIncidents, color: '#f43f5e' },
                { label: 'Finance Allocated (T05)', val: stats.budgetAllocated >= 1e6 ? `${(stats.budgetAllocated / 1e6).toFixed(1)}M RWF` : `${stats.budgetAllocated.toLocaleString()} RWF`, color: '#059669' },
                { label: 'Finance Disbursed (T05)', val: stats.budgetDisbursed >= 1e6 ? `${(stats.budgetDisbursed / 1e6).toFixed(1)}M RWF` : `${stats.budgetDisbursed.toLocaleString()} RWF`, color: '#0891b2' },
                { label: 'EIA Compliant Firms (T06)', val: `${stats.eiaCompliant}/${stats.eiaCompliant + stats.eiaNonCompliant}`, color: '#8b5cf6' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: '.78rem' }}>
                  <span style={{ color: '#64748b' }}>{m.label}</span>
                  <span style={{ fontWeight: 700, color: m.color, fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
