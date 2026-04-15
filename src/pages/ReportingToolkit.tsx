import React, { useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useData'
import { TOOLKIT_TOOLS } from '../data/constants'

interface Props { defaultTool?: string }

type SubTab = 'form' | 'submissions' | 'analytics'

const TOOL_FIELDS: Record<string, { label: string; key: string; type?: string; required?: boolean }[]> = {
  T01: [
    { label: 'Institution', key: 'institution', required: true },
    { label: 'NBSAP Target', key: 'nbsap_target', required: true },
    { label: 'Indicator Name', key: 'indicator_name', required: true },
    { label: 'Baseline Value', key: 'baseline_val', type: 'number' },
    { label: 'Current Status', key: 'current_status', type: 'number' },
    { label: 'Milestone Value', key: 'milestone_val', type: 'number' },
    { label: 'Budget Utilized (RWF)', key: 'budget_utilized', type: 'number' },
    { label: 'Activities', key: 'activities', type: 'textarea' },
    { label: 'Challenges', key: 'challenges', type: 'textarea' },
  ],
  T02: [
    { label: 'District Name', key: 'district_name', required: true },
    { label: 'Officer Name', key: 'officer_name', required: true },
    { label: 'Forest Area (ha)', key: 'forest_ha', type: 'number' },
    { label: 'Wetland Area (ha)', key: 'wetland_ha', type: 'number' },
    { label: 'Agroforestry Households', key: 'agroforestry_hh', type: 'number' },
    { label: 'Conservation Groups', key: 'conservation_groups', type: 'number' },
    { label: 'Illegal Cases', key: 'illegal_cases', type: 'number' },
    { label: 'Awareness Sessions', key: 'awareness_sessions', type: 'number' },
    { label: 'Notes', key: 'notes', type: 'textarea' },
  ],
  T03: [
    { label: 'Area Name', key: 'area_name', required: true },
    { label: 'Agency', key: 'agency', required: true },
    { label: 'Coverage Change (%)', key: 'coverage_change', type: 'number' },
    { label: 'Species Trend', key: 'species_trend' },
    { label: 'Habitat Quality Score', key: 'habitat_quality', type: 'number' },
    { label: 'Visitors', key: 'visitors', type: 'number' },
    { label: 'Restoration (ha)', key: 'restoration_ha', type: 'number' },
    { label: 'Observations', key: 'observations', type: 'textarea' },
  ],
  T04: [
    { label: 'Community', key: 'community', required: true },
    { label: 'Reporter Name', key: 'reporter_name', required: true },
    { label: 'Reporter Type', key: 'reporter_type' },
    { label: 'HWC Incidents', key: 'hwc_incidents', type: 'number' },
    { label: 'Tree Planting Households', key: 'tree_planting_hh', type: 'number' },
    { label: 'Water Source Status', key: 'water_source_status' },
    { label: 'Species Sightings', key: 'species_sightings', type: 'textarea' },
  ],
  T05: [
    { label: 'Institution Type', key: 'institution_type', required: true },
    { label: 'Fiscal Year', key: 'fiscal_year', required: true },
    { label: 'Budget Allocated (RWF)', key: 'budget_allocated', type: 'number' },
    { label: 'Budget Disbursed (RWF)', key: 'budget_disbursed', type: 'number' },
    { label: 'Implementation %', key: 'implementation_pct', type: 'number' },
    { label: 'Activity Funded', key: 'activity_funded', type: 'textarea' },
  ],
  T06: [
    { label: 'Company', key: 'company', required: true },
    { label: 'Sector', key: 'sector', required: true },
    { label: 'Reporting Year', key: 'reporting_year', required: true },
    { label: 'EIA Compliance', key: 'eia_compliance' },
    { label: 'Restoration Commitments (ha)', key: 'restoration_commitments', type: 'number' },
    { label: 'ESG Score', key: 'esg_score', type: 'number' },
    { label: 'Waste Management', key: 'waste_management' },
    { label: 'Certifications', key: 'certifications' },
  ],
  T07: [
    { label: 'Research Institution', key: 'research_institution', required: true },
    { label: 'Study Title', key: 'study_title', required: true },
    { label: 'Year Completed', key: 'year_completed', required: true },
    { label: 'Ecosystem Assessed', key: 'ecosystem_assessed' },
    { label: 'Geographic Scope', key: 'geographic_scope' },
    { label: 'Key Findings', key: 'key_findings', type: 'textarea' },
    { label: 'Policy Relevance', key: 'policy_relevance', type: 'textarea' },
    { label: 'Dataset URL', key: 'dataset_url' },
  ],
}

export function ReportingToolkit({ defaultTool }: Props) {
  const { profile } = useAuth()
  const { reports, stats, submitReport } = useReports()
  const [activeTool, setActiveTool] = useState<string | null>(defaultTool ?? null)
  const [subTab, setSubTab] = useState<SubTab>('form')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [period, setPeriod] = useState('Q1 2025')
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const tool = TOOLKIT_TOOLS.find(t => t.id === activeTool)
  const fields = activeTool ? TOOL_FIELDS[activeTool] ?? [] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTool || !profile) return
    setSubmitting(true)
    try {
      await submitReport(
        { tool_id: activeTool as any, tool_name: tool?.name ?? '', period, ...formData },
        true,
        profile.id,
        files
      )
      setFormData({})
      setFiles([])
      setSubTab('submissions')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!activeTool) {
    return (
      <div>
        <div className="card mb-6" style={{ padding: 24, background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>🗂️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>NBSAP Reporting Toolkit (T01–T07)</div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', marginTop: 2 }}>Standardized data collection tools for biodiversity monitoring and reporting</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['7 Reporting Tools', 'Quarterly & Annual', 'Verified Submissions', 'RBIS Integration'].map(f => (
              <span key={f} style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(56,189,248,.2)', color: '#7dd3fc', fontSize: '.72rem', fontWeight: 600 }}>{f}</span>
            ))}
          </div>
        </div>
        <div className="toolkit-grid">
          {TOOLKIT_TOOLS.map(t => (
            <div key={t.id} className="tool-card" style={{ borderTopColor: t.color }} onClick={() => setActiveTool(t.id)}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.78rem', color: t.color, marginBottom: 4 }}>{t.id}</div>
              <div style={{ fontWeight: 600, fontSize: '.85rem', marginBottom: 6 }}>{t.name}</div>
              <div style={{ fontSize: '.72rem', color: '#94a3b8', marginBottom: 8 }}>Frequency: {t.frequency}</div>
              <div style={{ fontSize: '.7rem', color: '#64748b', fontStyle: 'italic' }}>Output: {t.output}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Back + header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setActiveTool(null)} style={{ padding: '7px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
          ← Back to Toolkit
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.3rem' }}>{tool?.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{tool?.id} · {tool?.name}</div>
            <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>Frequency: {tool?.frequency} · Output: {tool?.output}</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="subtab-bar">
        {(['form', 'submissions', 'analytics'] as SubTab[]).map(t => (
          <button key={t} className={`subtab${subTab === t ? ' active' : ''}`} onClick={() => setSubTab(t)}>
            {t === 'form' ? '📝 Submit Report' : t === 'submissions' ? '📋 Past Submissions' : '📊 Analytics'}
          </button>
        ))}
      </div>

      {subTab === 'form' && (
        <form onSubmit={handleSubmit}>
          <div className="form-card mb-6">
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Reporting Period</label>
                <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)}>
                  {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Annual 2024', 'Annual 2025'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-grid">
              {fields.map(f => (
                <div key={f.key} className={`form-group${f.type === 'textarea' ? ' full' : ''}`}>
                  <label className="form-label">{f.label}{f.required && ' *'}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-textarea" value={formData[f.key] ?? ''} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))} />
                  ) : (
                    <input className="form-input" type={f.type ?? 'text'} value={formData[f.key] ?? ''} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))} required={f.required} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* File drop zone */}
          <div
            className="form-card mb-6"
            style={{ border: `2px dashed ${dragOver ? '#38bdf8' : '#e2e8f0'}`, background: dragOver ? '#f0f9ff' : '#fafafa', textAlign: 'center', padding: 32, cursor: 'pointer', transition: '.2s' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]) }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])} />
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📎</div>
            <div style={{ fontWeight: 600, fontSize: '.85rem', color: '#475569' }}>Drop files here or click to upload</div>
            <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 4 }}>PDF, Excel, CSV, images accepted</div>
            {files.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {files.map((f, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: 20, fontSize: '.72rem', fontWeight: 600 }}>{f.name}</span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', color: '#fff', border: 'none', borderRadius: 9, fontSize: '.85rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            {submitting ? <><span className="spinner" />Submitting…</> : '📤 Submit Report'}
          </button>
        </form>
      )}

      {subTab === 'submissions' && (
        <div className="card">
          <div className="table-wrap">
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.filter(r => r.tool_id === activeTool).length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No submissions yet for {activeTool}</td></tr>
                ) : reports.filter(r => r.tool_id === activeTool).map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.period}</td>
                    <td style={{ fontSize: '.78rem' }}>{r.submitter?.full_name ?? r.submitted_by}</td>
                    <td><span className={`status-${r.status}`}>{r.status}</span></td>
                    <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', color: '#64748b' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td><button style={{ padding: '4px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'analytics' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header"><div className="section-title">📊 {activeTool} Analytics</div></div>
          <div style={{ height: 200, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bae6fd' }}>
            📊 Submission trends and analytics — Chart.js integration pending
          </div>
        </div>
      )}
    </div>
  )
}
