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
  const { reports, stats, loading } = useReports({})

  const eiaCases = reports.filter(r => r.tool_id === 'T06')
  const compliant = eiaCases.filter(r => r.eia_compliance === 'compliant').length
  const nonCompliant = eiaCases.filter(r => r.eia_compliance === 'non-compliant').length
  const partial = eiaCases.filter(r => r.eia_compliance === 'partial').length
  const complianceRate = eiaCases.length ? Math.round((compliant / eiaCases.length) * 100) : 0

  const sectors = eiaCases.reduce((acc, r) => {
    const s = r.sector ?? 'Unknown'
    if (!acc[s]) acc[s] = { compliant: 0, nonCompliant: 0, partial: 0 }
    if (r.eia_compliance === 'compliant') acc[s].compliant++
    else if (r.eia_compliance === 'non-compliant') acc[s].nonCompliant++
    else acc[s].partial++
    return acc
  }, {} as Record<string, { compliant: number; nonCompliant: number; partial: number }>)

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'EIA Reports', val: eiaCases.length, color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0284c7,#38bdf8)' },
          { label: 'Compliant', val: compliant, color: '#10b981', gradient: 'linear-gradient(135deg,#059669,#10b981)' },
          { label: 'Non-Compliant', val: nonCompliant, color: '#f43f5e', gradient: 'linear-gradient(135deg,#be123c,#f43f5e)' },
          { label: 'Compliance Rate', val: `${complianceRate}%`, color: '#8b5cf6', gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.gradient, borderRadius: '14px', padding: '18px', color: '#fff' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '.72rem', opacity: .8, marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall compliance bar */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 700, fontSize: '.88rem' }}>Overall EIA Compliance Rate</span>
          <span style={{ fontWeight: 700, color: complianceRate >= 80 ? '#10b981' : complianceRate >= 60 ? '#f59e0b' : '#f43f5e', fontFamily: "'DM Mono',monospace" }}>{complianceRate}%</span>
        </div>
        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${complianceRate}%`, background: 'linear-gradient(90deg,#10b981,#34d399)', transition: 'width .8s' }} />
          <div style={{ width: `${partial ? Math.round((partial / eiaCases.length) * 100) : 0}%`, background: '#f59e0b' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '.72rem', color: '#64748b' }}>
          <span>🟢 Compliant: {compliant}</span>
          <span>🟡 Partial: {partial}</span>
          <span>🔴 Non-compliant: {nonCompliant}</span>
        </div>
      </div>

      {/* Sector breakdown */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>Compliance by Sector</h4>
        {loading ? (
          <div style={{ color: '#94a3b8', fontSize: '.82rem' }}>Loading…</div>
        ) : Object.keys(sectors).length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '.82rem', padding: '20px 0', textAlign: 'center' }}>No T06 EIA submissions yet</div>
        ) : (
          Object.entries(sectors).map(([sector, counts]) => {
            const total = counts.compliant + counts.nonCompliant + counts.partial
            const rate = Math.round((counts.compliant / total) * 100)
            return (
              <div key={sector} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{sector}</span>
                  <span style={{ color: rate >= 80 ? '#10b981' : rate >= 60 ? '#f59e0b' : '#f43f5e', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{rate}%</span>
                </div>
                <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${rate}%`, height: '100%', background: rate >= 80 ? '#10b981' : rate >= 60 ? '#f59e0b' : '#f43f5e', borderRadius: '4px' }} />
                </div>
              </div>
            )
          })
        )}
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
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No EIA submissions yet</td></tr>
            ) : eiaCases.map(r => {
              const statusColor = r.eia_compliance === 'compliant' ? '#10b981' : r.eia_compliance === 'non-compliant' ? '#f43f5e' : '#f59e0b'
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.company ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{r.sector ?? '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.reporting_year ?? '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: `${statusColor}22`, color: statusColor }}>{r.eia_compliance ?? '—'}</span>
                  </td>
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

  // Derive stakeholders from T01 (institutional) and T04 (community) submissions
  const institutional = reports.filter(r => r.tool_id === 'T01')
  const community = reports.filter(r => r.tool_id === 'T04')
  const research = reports.filter(r => r.tool_id === 'T07')
  const private_sector = reports.filter(r => r.tool_id === 'T06')

  const categories = [
    { label: 'Government / Institutional', icon: '🏛️', color: '#0ea5e9', bg: '#e0f2fe', count: institutional.length, desc: 'Ministries, agencies, and public institutions submitting T01 reports' },
    { label: 'District Authorities', icon: '🗺️', color: '#10b981', bg: '#dcfce7', count: districts.length, desc: `${districts.filter(d => d.submission_status === 'submitted').length} of ${districts.length} districts actively reporting` },
    { label: 'Community Groups', icon: '👥', color: '#f59e0b', bg: '#fef9c3', count: community.length, desc: 'Community reporters submitting T04 biodiversity observations' },
    { label: 'Private Sector', icon: '🏢', color: '#8b5cf6', bg: '#f3e8ff', count: private_sector.length, desc: 'Companies submitting T06 EIA compliance and ESG reports' },
    { label: 'Research Institutions', icon: '🔬', color: '#ec4899', bg: '#fce7f3', count: research.length, desc: 'Academic and research bodies submitting T07 biodiversity studies' },
  ]

  // Unique institutions from T01
  const institutions = [...new Set(institutional.map(r => r.institution).filter(Boolean))]

  return (
    <div>
      {/* Category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {categories.map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: c.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{c.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: c.color }}>{c.count}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#0f172a', marginBottom: '4px' }}>{c.label}</div>
            <div style={{ fontSize: '.75rem', color: '#64748b', lineHeight: 1.4 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Engagement matrix */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '.88rem', fontWeight: 700 }}>Engagement by Tool</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '8px' }}>
          {(['T01','T02','T03','T04','T05','T06','T07'] as const).map(tool => {
            const toolReports = reports.filter(r => r.tool_id === tool)
            const toolNames: Record<string, string> = { T01: 'Institutional', T02: 'District', T03: 'Protected Areas', T04: 'Community', T05: 'Finance', T06: 'Private Sector', T07: 'Research' }
            const toolColors: Record<string, string> = { T01: '#0ea5e9', T02: '#10b981', T03: '#8b5cf6', T04: '#f59e0b', T05: '#059669', T06: '#ec4899', T07: '#0284c7' }
            return (
              <div key={tool} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid ${toolColors[tool]}33` }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: toolColors[tool], fontFamily: "'Playfair Display',serif" }}>{toolReports.length}</div>
                <div style={{ fontSize: '.65rem', fontWeight: 700, color: toolColors[tool], fontFamily: "'DM Mono',monospace", marginTop: '2px' }}>{tool}</div>
                <div style={{ fontSize: '.62rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>{toolNames[tool]}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Institutional reporters list */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontSize: '.88rem', fontWeight: 700 }}>Institutional Reporters (T01)</h4>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : institutions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '.82rem' }}>No institutional submissions yet</div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {institutions.map((inst, i) => {
              const instReports = institutional.filter(r => r.institution === inst)
              const approved = instReports.filter(r => r.status === 'approved').length
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', borderBottom: '1px solid #f8fafc', fontSize: '.8rem' }}>
                  <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, color: '#1e40af', flexShrink: 0 }}>
                    {inst!.slice(0,2).toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontWeight: 600 }}>{inst}</span>
                  <span style={{ color: '#94a3b8', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>{instReports.length} reports</span>
                  <span style={{ fontSize: '.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 700, background: '#dcfce7', color: '#166534' }}>{approved} approved</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
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
  const { reports, stats, loading } = useReports({})
  const { districts } = useDistricts()

  const tiers = [
    { level: '01', name: 'Community', icon: '👥', color: '#10b981', bg: '#dcfce7', desc: 'Field observers, community groups, IPLC reporters', tool: 'T04', count: reports.filter(r => r.tool_id === 'T04').length },
    { level: '02', name: 'Sector / District', icon: '🗺️', color: '#0ea5e9', bg: '#e0f2fe', desc: 'District officers submitting T02 restoration data', tool: 'T02', count: reports.filter(r => r.tool_id === 'T02').length },
    { level: '03', name: 'National Agencies', icon: '🏛️', color: '#8b5cf6', bg: '#f3e8ff', desc: 'MINAGRI, RDB, REMA institutional T01 submissions', tool: 'T01', count: reports.filter(r => r.tool_id === 'T01').length },
    { level: '04', name: 'Verification', icon: '✅', color: '#f59e0b', bg: '#fef9c3', desc: 'Sector officers review and approve submissions', tool: null, count: reports.filter(r => r.status === 'approved').length },
    { level: '05', name: 'REMA Dashboard', icon: '📊', color: '#0f2744', bg: '#e0f2fe', desc: 'Aggregated indicators update in real-time', tool: null, count: reports.filter(r => r.status === 'approved').length },
  ]

  const toolFlow = [
    { id: 'T01', name: 'Institutional Report', icon: '🏛️', color: '#0ea5e9', submissions: reports.filter(r => r.tool_id === 'T01').length, approved: reports.filter(r => r.tool_id === 'T01' && r.status === 'approved').length },
    { id: 'T02', name: 'District Restoration', icon: '🌿', color: '#10b981', submissions: reports.filter(r => r.tool_id === 'T02').length, approved: reports.filter(r => r.tool_id === 'T02' && r.status === 'approved').length },
    { id: 'T03', name: 'Protected Areas', icon: '🛡️', color: '#8b5cf6', submissions: reports.filter(r => r.tool_id === 'T03').length, approved: reports.filter(r => r.tool_id === 'T03' && r.status === 'approved').length },
    { id: 'T04', name: 'Community Data', icon: '👥', color: '#f59e0b', submissions: reports.filter(r => r.tool_id === 'T04').length, approved: reports.filter(r => r.tool_id === 'T04' && r.status === 'approved').length },
    { id: 'T05', name: 'Finance Tracking', icon: '💰', color: '#059669', submissions: reports.filter(r => r.tool_id === 'T05').length, approved: reports.filter(r => r.tool_id === 'T05' && r.status === 'approved').length },
    { id: 'T06', name: 'Private Sector EIA', icon: '🏢', color: '#ec4899', submissions: reports.filter(r => r.tool_id === 'T06').length, approved: reports.filter(r => r.tool_id === 'T06' && r.status === 'approved').length },
    { id: 'T07', name: 'Research Data', icon: '🔬', color: '#0284c7', submissions: reports.filter(r => r.tool_id === 'T07').length, approved: reports.filter(r => r.tool_id === 'T07' && r.status === 'approved').length },
  ]

  return (
    <div>
      {/* Pipeline stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Submissions', val: stats?.total ?? 0, color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0284c7,#38bdf8)' },
          { label: 'Approved', val: stats?.approved ?? 0, color: '#10b981', gradient: 'linear-gradient(135deg,#059669,#10b981)' },
          { label: 'Pending Review', val: stats?.pending ?? 0, color: '#f59e0b', gradient: 'linear-gradient(135deg,#d97706,#f59e0b)' },
          { label: 'Active Districts', val: stats?.activeDistricts ?? 0, color: '#8b5cf6', gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.gradient, borderRadius: '14px', padding: '18px', color: '#fff' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '.72rem', opacity: .8, marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 5-tier pipeline visual */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 16px', fontSize: '.88rem', fontWeight: 700 }}>5-Tier Data Flow</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {tiers.map((tier, i) => (
            <div key={tier.level}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', background: tier.bg, borderRadius: '10px', border: `1px solid ${tier.color}33` }}>
                <div style={{ width: '36px', height: '36px', background: tier.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.75rem', fontWeight: 700, flexShrink: 0 }}>T{tier.level}</div>
                <div style={{ fontSize: '1.2rem' }}>{tier.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#0f172a' }}>{tier.name}</div>
                  <div style={{ fontSize: '.72rem', color: '#64748b' }}>{tier.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: tier.color, fontFamily: "'Playfair Display',serif" }}>{tier.count}</div>
                  <div style={{ fontSize: '.62rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>{tier.tool ? 'submissions' : 'records'}</div>
                </div>
              </div>
              {i < tiers.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', color: '#94a3b8', fontSize: '.8rem' }}>↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Per-tool breakdown */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontSize: '.88rem', fontWeight: 700 }}>Toolkit Submission Status</h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Tool', 'Name', 'Submissions', 'Approved', 'Approval Rate'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
            ) : toolFlow.map(t => {
              const rate = t.submissions ? Math.round((t.approved / t.submissions) * 100) : 0
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '.72rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: `${t.color}22`, color: t.color }}>{t.id}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{t.icon} {t.name}</td>
                  <td style={{ padding: '10px 14px', fontFamily: "'DM Mono',monospace", color: '#475569' }}>{t.submissions}</td>
                  <td style={{ padding: '10px 14px', fontFamily: "'DM Mono',monospace', color: '#10b981', fontWeight: 600" }}>{t.approved}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${rate}%`, height: '100%', background: rate >= 80 ? '#10b981' : rate >= 50 ? '#f59e0b' : '#f43f5e', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '.72rem', fontWeight: 700, color: rate >= 80 ? '#10b981' : rate >= 50 ? '#f59e0b' : '#94a3b8' }}>{t.submissions ? `${rate}%` : '—'}</span>
                    </div>
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

export function Targets22({ onViewIndicator }: { onViewIndicator?: (id: string) => void }) {
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
                  <div key={ind.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 180px 80px 90px', gap: '12px', padding: '12px 18px', borderBottom: idx < goalIndicators.length - 1 ? '1px solid #f8fafc' : 'none', alignItems: 'center' }}>
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
                    <button
                      onClick={() => onViewIndicator?.(ind.id)}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', border: `1px solid ${meta.color}44`,
                        background: meta.bg, color: meta.color, fontSize: '.68rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                      }}
                    >View →</button>
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
