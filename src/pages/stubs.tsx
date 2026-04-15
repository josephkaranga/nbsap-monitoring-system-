// src/pages/stubs.tsx
// ============================================================
// Stub pages for remaining tabs — each one pulls from Supabase
// Replace with full implementations following the same pattern
// as Dashboard.tsx, Indicators.tsx, ReportingToolkit.tsx
// ============================================================

import React from 'react'
import { useRisks } from '../hooks/useData'
import { useDistricts } from '../hooks/useData'
import { useIndicators } from '../hooks/useData'
import { useReports } from '../hooks/useData'

// ── Risk Register ──────────────────────────────────────────
export function RiskRegister() {
  const { risks, riskStats, loading } = useRisks()
  const [levelFilter, setLevelFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')

  const filtered = risks.filter(r => {
    if (levelFilter !== 'all' && r.level !== levelFilter) return false
    if (search && !r.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const levelColors: Record<string, string[]> = {
    High: ['#fee2e2','#991b1b'], Medium: ['#ffedd5','#9a3412'], Low: ['#dcfce7','#166534']
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'High Risks', val: riskStats?.high ?? 0, color: '#f43f5e', gradient: 'linear-gradient(135deg,#be123c,#f43f5e)' },
          { label: 'Medium Risks', val: riskStats?.medium ?? 0, color: '#f59e0b', gradient: 'linear-gradient(135deg,#d97706,#f59e0b)' },
          { label: 'Low Risks', val: riskStats?.low ?? 0, color: '#38bdf8', gradient: 'linear-gradient(135deg,#0284c7,#38bdf8)' },
          { label: 'Total Tracked', val: riskStats?.total ?? 0, color: '#10b981', gradient: 'linear-gradient(135deg,#059669,#10b981)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.gradient, borderRadius: '14px', padding: '18px', color: '#fff' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '.72rem', opacity: .8, marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search risks…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: '280px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'inherit', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'High', 'Medium', 'Low'].map(l => (
            <button key={l} onClick={() => setLevelFilter(l)} style={{
              padding: '5px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer',
              background: levelFilter === l ? '#0f2744' : '#fff', color: levelFilter === l ? '#fff' : '#475569', fontFamily: 'inherit',
            }}>{l === 'all' ? 'All' : l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '.88rem' }}>⚠️ Risk Mitigation Matrix <span style={{ fontSize: '.72rem', color: '#94a3b8', fontWeight: 400 }}>{filtered.length} Identified Risks</span></span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.78rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['#', 'Risk Description', 'Category', 'Likelihood', 'Impact', 'Level', 'Contingency / Mitigation', 'Owner'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading from Supabase…</td></tr>
                : filtered.map(r => {
                  const [bg, fg] = levelColors[r.level] ?? ['#f1f5f9','#475569']
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '11px 14px', fontWeight: 700, fontFamily: "'DM Mono',monospace", color: '#94a3b8' }}>{r.code}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 600, maxWidth: '180px' }}>{r.description}</td>
                      <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', fontWeight: 700 }}>{r.category}</span></td>
                      <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.75rem' }}>{r.likelihood}</td>
                      <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.75rem' }}>{r.impact}</td>
                      <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: bg, color: fg }}>{r.level}</span></td>
                      <td style={{ padding: '11px 14px', color: '#475569', fontSize: '.73rem', maxWidth: '220px', lineHeight: 1.4 }}>{r.mitigation}</td>
                      <td style={{ padding: '11px 14px', color: '#94a3b8', fontSize: '.72rem', whiteSpace: 'nowrap' }}>{r.owner}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heat map */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginTop: '16px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>🔥 Risk Heat Map (Likelihood × Impact)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '6px', fontSize: '.72rem' }}>
          {/* Header row */}
          <div />
          {['LOW IMPACT','MEDIUM IMPACT','HIGH IMPACT'].map(h => (
            <div key={h} style={{ textAlign: 'center', fontWeight: 700, color: '#94a3b8', fontSize: '.62rem', padding: '6px', fontFamily: "'DM Mono',monospace", letterSpacing: '.06em' }}>{h}</div>
          ))}
          {/* HIGH likelihood */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 700, color: '#94a3b8', fontSize: '.62rem', paddingRight: '8px', fontFamily: "'DM Mono',monospace" }}>HIGH</div>
          <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#854d0e', fontWeight: 700 }}>Medium</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R07</div></div>
          <div style={{ background: '#ffedd5', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#9a3412', fontWeight: 700 }}>Medium</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R04, R05</div></div>
          <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#991b1b', fontWeight: 700 }}>High</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R11</div></div>
          {/* MED likelihood */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 700, color: '#94a3b8', fontSize: '.62em', paddingRight: '8px', fontFamily: "'DM Mono',monospace" }}>MED</div>
          <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#166534', fontWeight: 700 }}>Low</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R10</div></div>
          <div style={{ background: '#ffedd5', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#9a3412', fontWeight: 700 }}>Medium</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R06, R08</div></div>
          <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#991b1b', fontWeight: 700 }}>High</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R01, R03</div></div>
          {/* LOW likelihood */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 700, color: '#94a3b8', fontSize: '.62rem', paddingRight: '8px', fontFamily: "'DM Mono',monospace" }}>LOW</div>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#475569', fontWeight: 700 }}>Low</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R12</div></div>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#475569', fontWeight: 700 }}>—</div></div>
          <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '.65rem', color: '#854d0e', fontWeight: 700 }}>Medium</div><div style={{ fontSize: '.68rem', color: '#475569', marginTop: '3px' }}>R02, R09</div></div>
        </div>
      </div>
    </div>
  )
}

// ── District Map ───────────────────────────────────────────
export function DistrictMap() {
  const { districts, distStats, loading } = useDistricts()
  const [layerMode, setLayerMode] = React.useState<'submission' | 'compliance' | 'forest'>('submission')

  const statusColors = { submitted: '#10b981', pending: '#f59e0b', missing: '#f43f5e' }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '.95rem', fontWeight: 700 }}>🗺️ Rwanda District Compliance Map</h3>
        <select value={layerMode} onChange={e => setLayerMode(e.target.value as any)}
          style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '.78rem', fontFamily: 'inherit', outline: 'none', marginLeft: 'auto' }}>
          <option value="submission">Submission Status</option>
          <option value="compliance">Compliance Score</option>
          <option value="forest">Forest Cover</option>
        </select>
      </div>
      {distStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total Districts', val: distStats.total, color: '#0ea5e9' },
            { label: 'Submitted', val: distStats.submitted, color: '#10b981' },
            { label: 'Pending', val: distStats.pending, color: '#f59e0b' },
            { label: 'Missing', val: distStats.missing, color: '#f43f5e' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {/* District list from Supabase */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['District', 'Province', 'Compliance', 'Forest Cover', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading districts from Supabase…</td></tr>
              : districts.map(d => {
                const stColor = statusColors[d.submission_status]
                return (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.78rem' }}>{(d as any).provinces?.name ?? '—'}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.compliance_score}%`, height: '100%', background: d.compliance_score >= 80 ? '#10b981' : d.compliance_score >= 65 ? '#f59e0b' : '#f43f5e', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '.78rem', color: d.compliance_score >= 80 ? '#10b981' : d.compliance_score >= 65 ? '#f59e0b' : '#f43f5e' }}>{d.compliance_score}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.78rem' }}>{d.forest_cover_pct}%</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: `${stColor}22`, color: stColor }}>
                        {d.submission_status}
                      </span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Reports page ───────────────────────────────────────────
export function Reports() {
  const { reports, stats, loading } = useReports({ status: 'approved' })

  const exportCSV = async () => {
    const csv = await import('../services/reports.service').then(m => m.reportsService.exportCSV())
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `nbsap_reports_${Date.now()}.csv`
    a.click()
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: '📄', label: 'Annual Reports', desc: 'Progress against 22 NBSAP targets', color: '#1e40af', bg: '#dbeafe', action: exportCSV },
          { icon: '📊', label: 'Quarterly Updates', desc: 'Operational activity updates', color: '#16a34a', bg: '#dcfce7', action: exportCSV },
          { icon: '📋', label: 'CBD National Report', desc: 'International reporting obligations', color: '#7c3aed', bg: '#f3e8ff', action: () => {} },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', background: c.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.3rem' }}>{c.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: '.9rem', margin: '0 0 6px' }}>{c.label}</h3>
            <p style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '14px' }}>{c.desc}</p>
            <button onClick={c.action} style={{ background: c.color, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Download / Export
            </button>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.9rem', fontWeight: 700 }}>Report Generation Status</h4>
        {[
          { name: 'Annual NBSAP Report', period: '2025', status: 'Completed', due: 'Mar 30, 2026', badge: '✓ Done', bdg: 'ok' },
          { name: 'Q4 Operational Update', period: 'Oct–Dec 2025', status: 'In Review', due: 'Jan 15, 2026', badge: '✓ Done', bdg: 'ok' },
          { name: 'Gender Monitoring Report', period: '2025', status: 'Pending', due: 'Apr 15, 2026', badge: '16 days', bdg: 'soon' },
          { name: 'Mid-Term Evaluation', period: '2025–2027', status: 'Scheduled', due: 'Q3 2027', badge: '17+ mo', bdg: 'ok' },
          { name: 'CBD National Report', period: '2025–2029', status: 'Scheduled', due: 'Jun 2029', badge: '39 mo', bdg: 'ok' },
        ].map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid #f8fafc', fontSize: '.8rem' }}>
            <span style={{ fontWeight: 600, flex: 2 }}>{r.name}</span>
            <span style={{ color: '#94a3b8', flex: 1 }}>{r.period}</span>
            <span style={{ fontSize: '.68rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: r.status === 'Completed' ? '#dcfce7' : r.status === 'In Review' ? '#dbeafe' : r.status === 'Pending' ? '#fef9c3' : '#f1f5f9', color: r.status === 'Completed' ? '#166534' : r.status === 'In Review' ? '#1e40af' : r.status === 'Pending' ? '#854d0e' : '#475569' }}>{r.status}</span>
            <span style={{ color: '#94a3b8', fontFamily: "'DM Mono',monospace", fontSize: '.72rem', flex: 1 }}>{r.due}</span>
            <span style={{ fontSize: '.62rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: r.bdg === 'soon' ? '#ffedd5' : '#dcfce7', color: r.bdg === 'soon' ? '#9a3412' : '#166534' }}>{r.badge}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Simple stubs for pages that mirror existing HTML functionality ─
export function Compliance() {
  const { reports, stats, loading } = useReports({})

  const eiaCases = reports.filter(r => r.tool_id === 'T06')
  const compliant = eiaCases.filter(r => r.eia_compliance === 'compliant').length
  const nonCompliant = eiaCases.filter(r => r.eia_compliance === 'non-compliant').length
  const partial = eiaCases.filter(r => r.eia_compliance === 'partial').length
  const total = eiaCases.length || 1

  const complianceAreas = [
    { label: 'EIA Compliance', pct: eiaCases.length ? Math.round((compliant / total) * 100) : 92, color: '#10b981' },
    { label: 'Protected Area Regulations', pct: 88, color: '#0ea5e9' },
    { label: 'ABS Rules Compliance', pct: 75, color: '#f59e0b' },
    { label: 'Species Protection Laws', pct: 68, color: '#f43f5e' },
  ]

  const activeIssues = [
    { level: 'High', color: '#f43f5e', bg: '#fee2e2', title: 'EIA Missing Documentation', desc: 'District: Northern Province · Flagged 1 day ago', action: '→ Submit T06 Compliance Report' },
    { level: 'Medium', color: '#f59e0b', bg: '#fef9c3', title: 'Late Data Submission', desc: `${stats?.pending ?? 2} districts pending · Deadline passed`, action: '→ View District Map' },
    { level: 'Low', color: '#0ea5e9', bg: '#e0f2fe', title: 'Incomplete Indicator Data', desc: 'Sector: Fisheries · Partial submission', action: '→ Review Indicators' },
    { level: 'Low', color: '#0ea5e9', bg: '#e0f2fe', title: 'ABS Documentation Gap', desc: '3 enterprises missing Access & Benefit Sharing docs', action: '→ Submit T06 Report' },
  ]

  return (
    <div>
      {/* Compliance overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>⚖️ Compliance Overview</h4>
          {complianceAreas.map(a => (
            <div key={a.label} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: '5px' }}>
                <span style={{ fontWeight: 600 }}>{a.label}</span>
                <span style={{ fontWeight: 700, color: a.color, fontFamily: "'DM Mono',monospace" }}>{a.pct}%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${a.pct}%`, height: '100%', background: a.color, borderRadius: '4px', transition: 'width .8s' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '.9rem', fontWeight: 700 }}>⚠️ Active Issues</h4>
          {activeIssues.map((issue, i) => (
            <div key={i} style={{ background: issue.bg, borderLeft: `3px solid ${issue.color}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '.62rem', padding: '1px 7px', borderRadius: '6px', fontWeight: 700, background: issue.color, color: '#fff', fontFamily: "'DM Mono',monospace" }}>{issue.level}</span>
                <span style={{ fontWeight: 700, fontSize: '.82rem' }}>{issue.title}</span>
              </div>
              <div style={{ fontSize: '.72rem', color: '#475569', marginBottom: '3px' }}>{issue.desc}</div>
              <div style={{ fontSize: '.7rem', color: issue.color, fontWeight: 600 }}>{issue.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accountability mechanisms */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>Accountability Mechanisms</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { icon: '📋', title: 'Regulatory Tracking', desc: 'REMA, RDB, Districts', color: '#0ea5e9' },
            { icon: '🏆', title: 'Performance Incentives', desc: 'MINEMA, Finance', color: '#10b981' },
            { icon: '📣', title: 'Grievance Channels', desc: 'REMA, Ombudsman', color: '#8b5cf6' },
          ].map(m => (
            <div key={m.title} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', borderTop: `3px solid ${m.color}` }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.82rem', marginBottom: '3px' }}>{m.title}</div>
              <div style={{ fontSize: '.72rem', color: '#64748b' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EIA submissions table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontSize: '.88rem', fontWeight: 700 }}>T06 EIA Submissions</h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Company', 'Sector', 'Year', 'EIA Status', 'ESG Score', 'Restoration (ha)'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
            ) : eiaCases.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No T06 EIA submissions yet</td></tr>
            ) : eiaCases.map(r => {
              const sc = r.eia_compliance === 'compliant' ? '#10b981' : r.eia_compliance === 'non-compliant' ? '#f43f5e' : '#f59e0b'
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.company ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{r.sector ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.reporting_year ?? '—'}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${sc}22`, color: sc }}>{r.eia_compliance ?? '—'}</span></td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.esg_score ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.restoration_commitments ?? 0} ha</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Stakeholders() {
  const { reports, loading } = useReports({})
  const { districts } = useDistricts()

  const MATRIX = [
    { name: 'MINEMA / REMA', category: 'Government', role: 'Lead Agency', responsibilities: 'Overall coordination, RBIS management, CBD reporting', module: 'T01 · All modules', engagement: 'High', color: '#0ea5e9' },
    { name: 'Sector Ministries', category: 'Government', role: 'Data Providers', responsibilities: 'Sectoral data collection, policy implementation, NBSAP targets', module: 'T01 · T05', engagement: 'High', color: '#0ea5e9' },
    { name: 'District Governments', category: 'Government', role: 'Local Coordination', responsibilities: 'Local monitoring, community participation, field data collection', module: 'T02 · T04', engagement: 'Medium', color: '#0ea5e9' },
    { name: 'RDB / RFA', category: 'Government', role: 'Protected Areas', responsibilities: 'Species monitoring, habitat management, anti-poaching', module: 'T03', engagement: 'High', color: '#0ea5e9' },
    { name: 'Local Communities & IPLCs', category: 'Community', role: 'Citizen Scientists', responsibilities: 'Biodiversity observations, indigenous knowledge, HWC reporting', module: 'T04', engagement: 'Medium', color: '#10b981' },
    { name: 'CSOs & NGOs', category: 'Civil Society', role: 'Validation & Advocacy', responsibilities: 'Independent monitoring, community mobilization, data validation, grievance channels', module: 'T04 · T07', engagement: 'Growing', color: '#f59e0b' },
    { name: 'Universities & Research Institutes', category: 'Academia', role: 'Evidence Generation', responsibilities: 'Indicator development, species surveys, ecosystem assessments, long-term biodiversity datasets', module: 'T07', engagement: 'Medium', color: '#8b5cf6' },
    { name: 'Private Sector', category: 'Private', role: 'Compliance & Investment', responsibilities: 'EIA compliance, biodiversity offsets, ESG reporting, green investments', module: 'T06', engagement: 'Growing', color: '#ec4899' },
    { name: 'Development Partners', category: 'International', role: 'Capacity & Finance', responsibilities: 'Technical support, resource mobilization, alignment with GEF/GCF frameworks', module: 'T05', engagement: 'High', color: '#059669' },
  ]

  const engagementColor = (e: string) => e === 'High' ? '#10b981' : e === 'Growing' ? '#f59e0b' : '#0ea5e9'

  return (
    <div>
      {/* Data flows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { icon: '🏛️', title: 'GOVERNMENT CHAIN', desc: 'Community → District → Sector → REMA → RBIS → CBD. Primary institutional data pipeline covering T01–T05.', color: '#0ea5e9' },
          { icon: '🌱', title: 'CIVIL SOCIETY CHAIN', desc: 'CSO field observations + University research → T07 submissions → RBIS evidence repository → Policy refinement.', color: '#10b981' },
          { icon: '🏗️', title: 'PRIVATE SECTOR CHAIN', desc: 'Enterprise EIA reports + ESG data → T06 annual submissions → Compliance index → Public dashboard transparency layer.', color: '#8b5cf6' },
        ].map(c => (
          <div key={c.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '.78rem', color: c.color, fontFamily: "'DM Mono',monospace", marginBottom: '6px', letterSpacing: '.06em' }}>{c.title}</div>
            <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Full matrix table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontSize: '.9rem', fontWeight: 700 }}>👥 Stakeholder Engagement Matrix</h4>
          <p style={{ margin: '4px 0 0', fontSize: '.72rem', color: '#94a3b8' }}>Expanded to include Civil Society, Academia, and Private Sector — key biodiversity data holders outside government.</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.78rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Stakeholder', 'Category', 'Role', 'Responsibilities', 'Reporting Module', 'Engagement'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#0f172a' }}>{s.name}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${s.color}22`, color: s.color }}>{s.category}</span>
                  </td>
                  <td style={{ padding: '11px 14px', color: '#475569', fontWeight: 600, fontSize: '.75rem' }}>{s.role}</td>
                  <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.73rem', maxWidth: '260px', lineHeight: 1.4 }}>{s.responsibilities}</td>
                  <td style={{ padding: '11px 14px', fontFamily: "'DM Mono',monospace", fontSize: '.68rem', color: '#0ea5e9', fontWeight: 700 }}>{s.module}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${engagementColor(s.engagement)}22`, color: engagementColor(s.engagement) }}>{s.engagement}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function RBIS() {
  const integrationSources = [
    { source: 'MINEMA', lastSubmission: 'Mar 22, 2026', records: '342', validation: '✓ Passed', status: 'Active', statusColor: '#10b981' },
    { source: 'MINAGRI', lastSubmission: 'Mar 23, 2026', records: '528', validation: '✓ Passed', status: 'Active', statusColor: '#10b981' },
    { source: 'NSO', lastSubmission: 'Mar 20, 2026', records: '1,248', validation: '⟳ Processing', status: 'Validating', statusColor: '#f59e0b' },
    { source: 'Research Inst.', lastSubmission: 'Mar 18, 2026', records: '156', validation: '✓ Passed', status: 'Active', statusColor: '#10b981' },
    { source: 'Districts (Avg)', lastSubmission: 'Mar 21, 2026', records: '2,840', validation: '⚠ Issues', status: 'Review', statusColor: '#f43f5e' },
  ]

  const dataProviders = [
    { icon: '🏛️', title: 'Sector Ministries', subtitle: 'Primary Data Providers', items: ['● Environment (MINEMA)', '● Agriculture (MINAGRI)', '● Forestry (RFA)', '● Fisheries'], status: '✓ Active', statusColor: '#10b981' },
    { icon: '📊', title: 'National Statistics', subtitle: 'Data Integration & Validation', items: ['● Data Integration', '● Indicator Validation', '● Baseline Alignment'], status: '✓ Active', statusColor: '#10b981' },
    { icon: '🔬', title: 'Research Institutions', subtitle: 'Scientific Studies', items: ['● Biodiversity Studies', '● Species Monitoring', '● Ecosystem Analysis'], status: '✓ Active', statusColor: '#10b981' },
    { icon: '🎯', title: 'Coordination Unit', subtitle: 'REMA Biodiversity M&E', items: ['● Data Consolidation', '● Analysis & QA', '● Report Generation'], status: '✓ Active', statusColor: '#10b981' },
    { icon: '🗺️', title: 'Districts & Local Gov.', subtitle: 'Field Monitoring', items: ['● District Reports', '● Field Monitoring', '● Community Data'], status: '⚠ 18/20 Active', statusColor: '#f59e0b' },
    { icon: '🌐', title: 'CBD & Global Reports', subtitle: 'International Reporting', items: ['● CBD National Reports', '● SDG Alignment', '● GBF Indicators'], status: 'Next Report: Jun 2029', statusColor: '#0ea5e9' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', borderRadius: '14px', padding: '20px 24px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(56,189,248,.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🗄️</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Rwanda Biodiversity Information System (RBIS)</h3>
          <p style={{ margin: '4px 0 0', fontSize: '.78rem', opacity: .7 }}>Core biodiversity data repository · Dashboard visualization & analytics interface</p>
        </div>
        <span style={{ fontSize: '.65rem', padding: '4px 10px', borderRadius: '10px', background: '#dcfce7', color: '#166534', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>● Live</span>
      </div>

      {/* Feature badges */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['🗂 Centralized Storage', '⚡ Auto Aggregation', '🗺 GIS Visualization', '📊 National Statistics', '🌐 CBD Compatibility'].map(f => (
          <span key={f} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '.75rem', fontWeight: 600, color: '#475569' }}>{f}</span>
        ))}
      </div>

      {/* Data providers grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {dataProviders.map(p => (
          <div key={p.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.82rem' }}>{p.title}</div>
                <div style={{ fontSize: '.68rem', color: '#94a3b8' }}>{p.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: '.72rem', color: '#475569', lineHeight: 1.7, marginBottom: '10px' }}>
              {p.items.map(item => <div key={item}>{item}</div>)}
            </div>
            <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${p.statusColor}22`, color: p.statusColor }}>{p.status}</span>
          </div>
        ))}
      </div>

      {/* Integration status table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontSize: '.88rem', fontWeight: 700 }}>🔗 Integration Status</h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Source', 'Last Submission', 'Records', 'Validation', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {integrationSources.map(s => (
              <tr key={s.source} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '11px 14px', fontWeight: 700 }}>{s.source}</td>
                <td style={{ padding: '11px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{s.lastSubmission}</td>
                <td style={{ padding: '11px 14px', fontFamily: "'DM Mono',monospace", fontWeight: 700, color: '#0f172a' }}>{s.records}</td>
                <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.75rem' }}>{s.validation}</td>
                <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${s.statusColor}22`, color: s.statusColor }}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data governance */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>🔐 Data Governance Protocols</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { icon: '🔐', title: 'DATA CLASSIFICATION', items: ['Restricted: Threatened species GPS, enforcement locations', 'Internal: District raw data, compliance scores', 'Public: Headline indicators, national summaries, trends'], color: '#f43f5e' },
            { icon: '👤', title: 'ACCESS CONTROL', items: ['Role-based permissions across all 3 dashboard layers', 'Species location fuzzing on public-facing maps', 'Audit log of all data access and exports', 'Annual access review by REMA data officer'], color: '#0ea5e9' },
            { icon: '📋', title: 'SUBMISSION STANDARDS', items: ['Standardized metadata schema per indicator', 'Automated validation checks on submission', 'Manual REMA verification within 10 working days', 'Feedback loop to reporting institution on errors'], color: '#10b981' },
          ].map(g => (
            <div key={g.title} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', borderTop: `3px solid ${g.color}` }}>
              <div style={{ fontSize: '.65rem', fontWeight: 700, color: g.color, fontFamily: "'DM Mono',monospace", letterSpacing: '.08em', marginBottom: '8px' }}>{g.icon} {g.title}</div>
              {g.items.map(item => <div key={item} style={{ fontSize: '.72rem', color: '#475569', marginBottom: '4px', lineHeight: 1.4 }}>• {item}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DataPipeline() {
  const { reports, stats, loading } = useReports({})

  const tiers = [
    { num: '1', name: 'Community', sub: 'Citizen science · Indigenous data', color: '#10b981' },
    { num: '2', name: 'Sector', sub: 'Validation · Field data', color: '#0ea5e9' },
    { num: '3', name: 'District', sub: 'Aggregation · District index', color: '#8b5cf6' },
    { num: '4', name: 'National Agencies', sub: 'Institutional verification', color: '#f59e0b' },
    { num: '5', name: 'REMA Dashboard', sub: 'Visualization & CBD reporting', color: '#0f2744' },
  ]

  const steps = [
    { n: '1', title: 'Data Collection via Structured Templates' },
    { n: '2', title: 'Sector & District Validation' },
    { n: '3', title: 'Institutional Aggregation' },
    { n: '4', title: 'REMA Technical Verification' },
    { n: '5', title: 'RBIS & Dashboard Integration' },
  ]

  const reportingCycle = [
    { tag: 'Q1', color: '#0ea5e9', title: 'Quarterly Submissions', desc: 'All 7 reporting modules — T01 through T07', detail: 'Deadline: Mar / Jun / Sep / Dec' },
    { tag: 'ANN', color: '#10b981', title: 'Annual National Biodiversity Report', desc: 'Consolidated implementation report against 22 NBSAP targets', detail: 'Submitted to Cabinet & Parliament' },
    { tag: '2027', color: '#8b5cf6', title: 'Mid-Term Evaluation', desc: 'Comprehensive review of NBSAP implementation progress', detail: 'Q3 2027 · All 22 indicators reviewed' },
    { tag: 'CBD', color: '#f59e0b', title: 'CBD National Report Submission', desc: 'KM-GBF progress report to Convention on Biological Diversity', detail: 'Due: June 2029 · Final evaluation 2030' },
  ]

  const roadmap = [
    { phase: 'S1 · Indicator Alignment', duration: '3 months', start: 0, len: 3, resources: '2 staff · Low cost', priority: '' },
    { phase: 'S2 · Institutional RACI', duration: '3 months', start: 0, len: 3, resources: '3 staff · Low cost', priority: '' },
    { phase: 'S3 · Reporting Templates', duration: '5 months', start: 1, len: 5, resources: '4 staff · Medium', priority: '' },
    { phase: 'S4 · M&E Framework', duration: '5 months', start: 1, len: 5, resources: '3 staff · Medium', priority: '' },
    { phase: 'S5 · Dashboard & RBIS', duration: '9 months', start: 2, len: 9, resources: '6 staff · High cost', priority: 'HIGH' },
    { phase: 'S6 · Compliance Framework', duration: '5 months', start: 3, len: 5, resources: '3 staff · Medium', priority: '' },
    { phase: 'S7 · Capacity Building', duration: 'Ongoing', start: 0, len: 8, resources: '5 staff · Medium', priority: 'CONCURRENT' },
    { phase: 'S8 · Validation & Testing', duration: '6 months', start: 5, len: 6, resources: '4 staff · Medium', priority: '' },
  ]
  const quarters = ['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026']

  return (
    <div>
      {/* 5-tier pipeline */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔀</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.92rem' }}>5-Tier Biodiversity Data Pipeline</div>
            <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>Community → Sector → District → National Agencies → REMA National Dashboard</div>
          </div>
        </div>
        {/* Tier flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '20px', overflowX: 'auto' }}>
          {tiers.map((t, i) => (
            <React.Fragment key={t.num}>
              <div style={{ textAlign: 'center', minWidth: '120px', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.85rem', margin: '0 auto 8px', boxShadow: `0 4px 12px ${t.color}44` }}>T{t.num}</div>
                <div style={{ fontWeight: 700, fontSize: '.78rem', color: '#0f172a' }}>{t.name}</div>
                <div style={{ fontSize: '.65rem', color: '#94a3b8', marginTop: '2px' }}>{t.sub}</div>
              </div>
              {i < tiers.length - 1 && <div style={{ color: '#cbd5e1', fontSize: '1.2rem', flexShrink: 0, padding: '0 4px' }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        {/* Steps */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '160px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0f2744', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
              <span style={{ fontSize: '.72rem', fontWeight: 600, color: '#475569' }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting cycle */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>📅 Reporting Cycle Alignment</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
          {reportingCycle.map(r => (
            <div key={r.tag} style={{ display: 'flex', gap: '12px', background: '#f8fafc', borderRadius: '10px', padding: '12px', borderLeft: `3px solid ${r.color}` }}>
              <div style={{ width: '40px', height: '40px', background: r.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.65rem', fontWeight: 700, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>{r.tag}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.82rem', marginBottom: '2px' }}>{r.title}</div>
                <div style={{ fontSize: '.72rem', color: '#475569', marginBottom: '2px' }}>{r.desc}</div>
                <div style={{ fontSize: '.65rem', color: r.color, fontWeight: 600 }}>{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation roadmap */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '.88rem', fontWeight: 700 }}>🗓 Implementation Roadmap — Phase & Resource Estimates</h4>
        <p style={{ margin: '0 0 14px', fontSize: '.72rem', color: '#94a3b8' }}>Each bar represents approximate duration. Concurrent phases run simultaneously.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.75rem', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', width: '160px' }}>PHASE</th>
                {quarters.map(q => <th key={q} style={{ padding: '8px 6px', textAlign: 'center', fontSize: '.6rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>{q}</th>)}
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>RESOURCES</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.map(r => (
                <tr key={r.phase} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: '.75rem' }}>
                    {r.phase}
                    {r.priority && <span style={{ marginLeft: '6px', fontSize: '.58rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, background: r.priority === 'HIGH' ? '#fee2e2' : '#fef9c3', color: r.priority === 'HIGH' ? '#991b1b' : '#854d0e' }}>{r.priority}</span>}
                  </td>
                  {quarters.map((_, qi) => (
                    <td key={qi} style={{ padding: '8px 4px', textAlign: 'center' }}>
                      {qi >= r.start && qi < r.start + r.len ? (
                        <div style={{ height: '16px', background: r.priority === 'HIGH' ? '#f43f5e' : r.priority === 'CONCURRENT' ? '#f59e0b' : '#0ea5e9', borderRadius: qi === r.start ? '4px 0 0 4px' : qi === r.start + r.len - 1 ? '0 4px 4px 0' : '0', opacity: .8 }} />
                      ) : null}
                    </td>
                  ))}
                  <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '.7rem' }}>{r.resources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '.68rem', color: '#64748b' }}>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px', marginRight: '4px' }} />Concurrent / ongoing</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px', marginRight: '4px' }} />HIGH resource intensity</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#0ea5e9', borderRadius: '2px', marginRight: '4px' }} />Standard phase</span>
          <span style={{ marginLeft: 'auto', fontWeight: 600 }}>Total estimated duration: 24 months (2025–2026)</span>
        </div>
      </div>
    </div>
  )
}

export function AdaptiveMgmt() {
  const { indStats } = useIndicators()
  const { stats } = useReports({})

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', borderRadius: '14px', padding: '24px', color: '#fff', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>✦ Adaptive Management Panel</h3>
        <p style={{ fontSize: '.82rem', opacity: .8, lineHeight: 1.6, marginBottom: '16px' }}>
          Monitor → Analyse → Alert → Decide → Adjust. Evidence-based policy adjustment using live Supabase data.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { label: 'On Track', val: indStats?.onTrack ?? '—', color: '#10b981', trigger: '≥60% milestone' },
            { label: 'At Risk', val: indStats?.atRisk ?? '—', color: '#f59e0b', trigger: '40–60% milestone' },
            { label: 'Behind', val: indStats?.behind ?? '—', color: '#f43f5e', trigger: '<40% milestone' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,.08)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '.75rem', marginTop: '4px', opacity: .8 }}>{s.label}</div>
              <div style={{ fontSize: '.62rem', opacity: .5, fontFamily: "'DM Mono',monospace", marginTop: '2px' }}>{s.trigger}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          { icon: '⚠️', color: '#f43f5e', title: 'Implementation Gap Detection', desc: `${(indStats?.atRisk ?? 0) + (indStats?.behind ?? 0)} indicators flagged for corrective action this quarter.` },
          { icon: '📈', color: '#10b981', title: 'Restoration Performance', desc: `Toolkit reports ${stats?.forestHa?.toLocaleString() ?? 0} ha forest + ${stats?.wetlandHa?.toLocaleString() ?? 0} ha wetland restored.` },
          { icon: '💰', color: '#f59e0b', title: 'Financing Gap Monitoring', desc: `RWF ${stats?.budgetAllocated?.toLocaleString() ?? 0} allocated, ${stats?.budgetDisbursed?.toLocaleString() ?? 0} disbursed via T05 submissions.` },
          { icon: '📋', color: '#6366f1', title: 'Institutional Compliance', desc: `${5 + (stats?.eiaNonCompliant ?? 0)} compliance issues active. EIA compliance tracked via T06.` },
          { icon: '⚖️', color: '#0ea5e9', title: 'Evidence-Based Policy', desc: 'Decisions logged from M&E data. Target: 50 policy decisions by 2030.' },
          { icon: '♀️', color: '#ec4899', title: 'Gender-Responsive M&E', desc: 'Gender and IPLC participation tracked via Indicator 22 and T04 submissions.' },
        ].map(c => (
          <div key={c.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{c.icon}</div>
            <h4 style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: '6px', color: '#0f172a' }}>{c.title}</h4>
            <p style={{ fontSize: '.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Targets22() {
  const { indicators, indStats, loading } = useIndicators()

  const GBF_GOALS: Record<string, { color: string; bg: string; targets: number[] }> = {
    'Goal A': { color: '#166534', bg: '#dcfce7', targets: [1,2,3,4] },
    'Goal B': { color: '#0369a1', bg: '#dbeafe', targets: [5,6,7,8] },
    'Goal C': { color: '#854d0e', bg: '#ffedd5', targets: [9,10,11,12] },
    'Goal D': { color: '#6b21a8', bg: '#f3e8ff', targets: [13,14,15,16,17,18,19,20,21,22] },
  }

  const statusColor = (s: string) =>
    s === 'on-track' ? '#10b981' : s === 'at-risk' ? '#f59e0b' : '#f43f5e'
  const statusBg = (s: string) =>
    s === 'on-track' ? '#dcfce7' : s === 'at-risk' ? '#fef9c3' : '#fee2e2'

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total Targets', val: 22, color: '#0f2744' },
          { label: 'On Track', val: indStats?.onTrack ?? '—', color: '#10b981' },
          { label: 'At Risk', val: indStats?.atRisk ?? '—', color: '#f59e0b' },
          { label: 'Behind', val: indStats?.behind ?? '—', color: '#f43f5e' },
          { label: 'Avg Progress', val: indStats ? `${indStats.avgProgress}%` : '—', color: '#0ea5e9' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-goal sections */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading targets…</div>
      ) : (
        Object.entries(GBF_GOALS).map(([goal, meta]) => {
          const goalIndicators = indicators.filter(i => meta.targets.includes(i.sequence_no))
          return (
            <div key={goal} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>
              {/* Goal header */}
              <div style={{ background: meta.bg, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `2px solid ${meta.color}22` }}>
                <span style={{ fontWeight: 700, fontSize: '.9rem', color: meta.color }}>{goal}</span>
                <span style={{ fontSize: '.72rem', color: meta.color, fontFamily: "'DM Mono',monospace" }}>
                  {goalIndicators.filter(i => i.status === 'on-track').length}/{goalIndicators.length} on track
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                  {['on-track','at-risk','behind'].map(s => {
                    const n = goalIndicators.filter(i => i.status === s).length
                    if (!n) return null
                    return <span key={s} style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: statusBg(s), color: statusColor(s) }}>{n} {s}</span>
                  })}
                </div>
              </div>
              {/* Targets list */}
              <div>
                {goalIndicators.map((ind, idx) => (
                  <div key={ind.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 180px 80px', gap: '12px', padding: '12px 18px', borderBottom: idx < goalIndicators.length - 1 ? '1px solid #f8fafc' : 'none', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 700, color: meta.color, flexShrink: 0 }}>
                      {ind.sequence_no}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.82rem', color: '#0f172a', marginBottom: '2px' }}>{ind.name}</div>
                      <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{ind.km_gbf_ref ?? ''} · {ind.tier}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: '#94a3b8', marginBottom: '4px' }}>
                        <span>Progress</span><span style={{ fontWeight: 700, color: statusColor(ind.status) }}>{ind.progress_pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${ind.progress_pct}%`, background: statusColor(ind.status), borderRadius: '3px', transition: 'width .8s ease' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '.65rem', padding: '3px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: statusBg(ind.status), color: statusColor(ind.status), textAlign: 'center' }}>
                      {ind.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export function AuthCallback() {
  React.useEffect(() => {
    window.location.replace('/')
  }, [])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f2744', color: '#7dd3fc', fontFamily: "'DM Mono',monospace" }}>
      Processing authentication…
    </div>
  )
}
