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
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'Risk', 'Category', 'Likelihood', 'Impact', 'Level', 'Mitigation', 'Owner'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
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
                    <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '.68rem', padding: '2px 8px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af', fontWeight: 700 }}>{r.category}</span></td>
                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.75rem' }}>{r.likelihood}</td>
                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '.75rem' }}>{r.impact}</td>
                    <td style={{ padding: '11px 14px' }}><span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: bg, color: fg }}>{r.level}</span></td>
                    <td style={{ padding: '11px 14px', color: '#475569', fontSize: '.75rem', maxWidth: '200px' }}>{r.mitigation}</td>
                    <td style={{ padding: '11px 14px', color: '#94a3b8', fontSize: '.72rem' }}>{r.owner}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
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
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚖️</div>
      <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Compliance Dashboard</h3>
      <p style={{ fontSize: '.85rem' }}>Compliance data is read live from the reports table in Supabase.<br />EIA compliance scores are aggregated from approved T06 submissions.</p>
    </div>
  )
}

export function Stakeholders() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
      <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Stakeholder Engagement Matrix</h3>
      <p style={{ fontSize: '.85rem' }}>Stakeholder profiles are stored in the profiles table.<br />Engagement data is tracked via T01–T07 submissions.</p>
    </div>
  )
}

export function RBIS() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗄️</div>
      <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Rwanda Biodiversity Information System</h3>
      <p style={{ fontSize: '.85rem' }}>RBIS is the Supabase backend itself. All tables, real-time subscriptions, and file storage are powered by Supabase PostgreSQL. See the schema in <code>supabase/migrations/001_initial_schema.sql</code>.</p>
    </div>
  )
}

export function DataPipeline() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔀</div>
      <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>5-Tier Data Pipeline</h3>
      <p style={{ fontSize: '.85rem' }}>Community → Sector → District → National Agencies → REMA Dashboard.<br />All data flows through Supabase RLS-protected tables.</p>
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
  const { indicators } = useIndicators()
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
      <h3 style={{ fontWeight: 700, margin: '0 0 16px', fontSize: '.95rem' }}>🎯 22 National Targets — Supabase-Backed</h3>
      <p style={{ fontSize: '.82rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
        The 22 NBSAP national targets are stored in the <code>indicators</code> table and linked to the Kunming-Montreal GBF goals A–D. Progress is calculated from approved T01–T07 toolkit submissions via the verification pipeline.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[{label:'Total',val:22,color:'#0f2744'},{label:'Goal A',val:4,color:'#166534'},{label:'Goal B',val:4,color:'#0369a1'},{label:'Goal C',val:4,color:'#854d0e'},{label:'Goal D',val:10,color:'#6b21a8'}].map(s => (
          <div key={s.label} style={{ background: `${s.color}11`, border: `1px solid ${s.color}33`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.72rem', color: s.color, fontFamily: "'DM Mono',monospace", marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '.8rem', color: '#64748b' }}>
        Showing progress from Supabase indicators table · {indicators.filter(i => i.status === 'on-track').length}/22 on track
      </div>
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
