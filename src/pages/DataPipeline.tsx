import React from 'react'

const PIPELINE_STEPS = [
  { num: 1, icon: '📥', title: 'Data Collection', desc: 'T01–T07 toolkit forms, field surveys, satellite imagery, community observations', color: '#0f2744' },
  { num: 2, icon: '✅', title: 'Validation', desc: 'Automated field validation, range checks, cross-reference with baseline data', color: '#0ea5e9' },
  { num: 3, icon: '🔄', title: 'Processing', desc: 'Aggregation, normalization, indicator calculation, spatial analysis', color: '#10b981' },
  { num: 4, icon: '🗄️', title: 'RBIS Storage', desc: 'Classified storage with role-based access, audit logging, version control', color: '#6366f1' },
  { num: 5, icon: '📊', title: 'Reporting', desc: 'Dashboard visualization, CBD reports, stakeholder exports, AI narratives', color: '#f59e0b' },
]

const CYCLE_ITEMS = [
  { period: 'Q1/Q3', label: 'Quarterly', desc: 'T01, T02, T04 submissions due. District compliance review.', color: '#0ea5e9', bg: '#f0f9ff' },
  { period: 'ANN', label: 'Annual', desc: 'T03, T05, T06, T07 submissions. National NBSAP progress report.', color: '#10b981', bg: '#f0fdf4' },
  { period: '2027', label: 'Mid-term', desc: 'Comprehensive NBSAP mid-term review. Adaptive management trigger assessment.', color: '#f59e0b', bg: '#fffbeb' },
  { period: 'CBD', label: '2027 Report', desc: '8th National Report to CBD. Full KM-GBF alignment assessment.', color: '#6366f1', bg: '#faf5ff' },
]

const ROADMAP = [
  { phase: 'Phase 1', title: 'Foundation', period: 'Q1 2024', status: 'complete', desc: 'RBIS architecture, T01–T07 templates, stakeholder onboarding' },
  { phase: 'Phase 2', title: 'Pilot Deployment', period: 'Q2 2024', status: 'complete', desc: '5 pilot districts, MINEMA T01, RDB T03 integration' },
  { phase: 'Phase 3', title: 'National Rollout', period: 'Q3–Q4 2024', status: 'complete', desc: 'All 30 districts, all 7 ministries, full T01–T07 activation' },
  { phase: 'Phase 4', title: 'RBIS Integration', period: 'Q1 2025', status: 'active', desc: 'API connections, automated data flows, real-time dashboard' },
  { phase: 'Phase 5', title: 'AI Analytics', period: 'Q2 2025', status: 'planned', desc: 'Claude AI narratives, predictive risk alerts, adaptive triggers' },
  { phase: 'Phase 6', title: 'CBD Preparation', period: 'Q3–Q4 2025', status: 'planned', desc: 'CBD report template population, gap analysis, validation' },
  { phase: 'Phase 7', title: 'Mid-term Review', period: '2027', status: 'planned', desc: 'Comprehensive NBSAP review, target recalibration if needed' },
  { phase: 'Phase 8', title: 'CBD Submission', period: 'Dec 2027', status: 'planned', desc: '8th National Report submission to CBD Secretariat' },
]

export function DataPipeline() {
  return (
    <div>
      {/* Pipeline Flow */}
      <div className="card mb-6" style={{ padding: 24 }}>
        <div className="section-header">
          <div className="section-title">🔀 5-Tier Data Pipeline</div>
        </div>
        {/* Flow visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20, overflowX: 'auto' }}>
          {PIPELINE_STEPS.map((step, i) => (
            <React.Fragment key={step.num}>
              <div style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '14px 10px', background: `${step.color}15`, borderRadius: 10, border: `2px solid ${step.color}30` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{step.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.75rem', color: step.color }}>{step.title}</div>
                <div style={{ fontSize: '.65rem', color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>{step.desc}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={{ fontSize: '1.2rem', color: '#cbd5e1', padding: '0 4px', flexShrink: 0 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Reporting Cycle */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">📅 Reporting Cycle Alignment</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {CYCLE_ITEMS.map(c => (
            <div key={c.period} style={{ padding: 16, borderRadius: 10, background: c.bg, border: `1px solid ${c.color}30` }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: c.color, fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>{c.period}</div>
              <div style={{ fontWeight: 600, fontSize: '.78rem', color: c.color, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: '.72rem', color: '#475569', lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Progress Chart */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">📊 Indicator Progress by Category</div>
        </div>
        <div style={{ height: 180, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bae6fd' }}>
          📊 Bar chart by indicator category — Chart.js integration pending
        </div>
      </div>

      {/* Roadmap */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🗺️ Implementation Roadmap</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Title</th>
                <th>Period</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', fontWeight: 700, color: '#94a3b8' }}>{r.phase}</td>
                  <td style={{ fontWeight: 600, fontSize: '.82rem' }}>{r.title}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', color: '#64748b' }}>{r.period}</td>
                  <td>
                    <span className={`tag ${r.status === 'complete' ? 'tag-green' : r.status === 'active' ? 'tag-blue' : 'tag-gray'}`}>
                      {r.status === 'complete' ? '✓ Complete' : r.status === 'active' ? '● Active' : '○ Planned'}
                    </span>
                  </td>
                  <td style={{ fontSize: '.75rem', color: '#475569' }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
