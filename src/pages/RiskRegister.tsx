import React, { useState } from 'react'
import { RISK_DATA } from '../data/constants'

const LEVEL_COLOR: Record<string, { bg: string; text: string }> = {
  High: { bg: '#fee2e2', text: '#991b1b' },
  Medium: { bg: '#ffedd5', text: '#9a3412' },
  Low: { bg: '#fef9c3', text: '#854d0e' },
}

const LIKELIHOOD_SCORE: Record<string, number> = { Low: 1, Medium: 2, High: 3 }
const IMPACT_SCORE: Record<string, number> = { Low: 1, Medium: 2, High: 3 }

export function RiskRegister() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')

  const categories = Array.from(new Set(RISK_DATA.map(r => r.cat)))

  const filtered = RISK_DATA.filter(r => {
    const matchLevel = levelFilter === 'all' || r.level === levelFilter
    const matchCat = catFilter === 'all' || r.cat === catFilter
    const matchSearch = !search || r.desc.toLowerCase().includes(search.toLowerCase()) || r.cat.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchCat && matchSearch
  })

  const high = RISK_DATA.filter(r => r.level === 'High').length
  const med = RISK_DATA.filter(r => r.level === 'Medium').length
  const low = RISK_DATA.filter(r => r.level === 'Low').length

  const exportCSV = () => {
    const headers = ['ID', 'Description', 'Category', 'Likelihood', 'Impact', 'Level', 'Mitigation', 'Owner']
    const rows = RISK_DATA.map(r => [r.id, r.desc, r.cat, r.likelihood, r.impact, r.level, r.mitigation, r.owner].map(v => `"${v}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'risk-register.csv'
    a.click()
  }

  // Heat map grid: likelihood (rows) x impact (cols)
  const heatMap: Record<string, string[]> = {}
  RISK_DATA.forEach(r => {
    const key = `${r.likelihood}-${r.impact}`
    if (!heatMap[key]) heatMap[key] = []
    heatMap[key].push(r.id)
  })

  const heatColor = (l: string, i: string) => {
    const score = LIKELIHOOD_SCORE[l] * IMPACT_SCORE[i]
    if (score >= 6) return { bg: '#fee2e2', text: '#991b1b', label: 'High' }
    if (score >= 3) return { bg: '#ffedd5', text: '#9a3412', label: 'Medium' }
    return { bg: '#fef9c3', text: '#854d0e', label: 'Low' }
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="🔍 Search risks…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        <div className="filter-chips">
          {['all', 'High', 'Medium', 'Low'].map(l => (
            <button key={l} className={`chip${levelFilter === l ? ' active' : ''}`} onClick={() => setLevelFilter(l)}>
              {l === 'all' ? 'All' : l}
            </button>
          ))}
        </div>
        <select className="form-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={exportCSV} style={{ marginLeft: 'auto', padding: '7px 14px', background: '#0f2744', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Metric cards */}
      <div className="metrics-grid mb-6">
        <div className="metric-card mc-rose">
          <div className="metric-label">High Risks</div>
          <div className="metric-value">{high}</div>
          <div className="metric-sub">Immediate action required</div>
          <span className="metric-icon">🔴</span>
        </div>
        <div className="metric-card mc-amber">
          <div className="metric-label">Medium Risks</div>
          <div className="metric-value">{med}</div>
          <div className="metric-sub">Monitor closely</div>
          <span className="metric-icon">🟡</span>
        </div>
        <div className="metric-card mc-sky">
          <div className="metric-label">Low Risks</div>
          <div className="metric-value">{low}</div>
          <div className="metric-sub">Routine monitoring</div>
          <span className="metric-icon">🟢</span>
        </div>
        <div className="metric-card mc-navy">
          <div className="metric-label">Total Tracked</div>
          <div className="metric-value">{RISK_DATA.length}</div>
          <div className="metric-sub">Active risk items</div>
          <span className="metric-icon">📋</span>
        </div>
      </div>

      {/* Table */}
      <div className="card mb-6">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div className="section-title">⚠️ Risk Mitigation Matrix</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Risk Description</th>
                <th>Category</th>
                <th>Likelihood</th>
                <th>Impact</th>
                <th>Level</th>
                <th>Contingency / Mitigation</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', color: '#94a3b8', fontWeight: 700 }}>{r.id}</td>
                  <td style={{ fontWeight: 500, fontSize: '.82rem', maxWidth: 220 }}>{r.desc}</td>
                  <td><span className="tag tag-gray">{r.cat}</span></td>
                  <td style={{ fontSize: '.78rem' }}>{r.likelihood}</td>
                  <td style={{ fontSize: '.78rem' }}>{r.impact}</td>
                  <td>
                    <span className="severity-tag" style={{ background: LEVEL_COLOR[r.level].bg, color: LEVEL_COLOR[r.level].text }}>
                      {r.level}
                    </span>
                  </td>
                  <td style={{ fontSize: '.75rem', color: '#475569', maxWidth: 260 }}>{r.mitigation}</td>
                  <td style={{ fontSize: '.75rem', fontWeight: 600 }}>{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heat Map */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🔥 Risk Heat Map</div>
          <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>Likelihood × Impact</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 4, maxWidth: 480 }}>
          <div />
          {['Low Impact', 'Medium Impact', 'High Impact'].map(h => (
            <div key={h} style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>{h}</div>
          ))}
          {['High', 'Medium', 'Low'].map(likelihood => (
            <React.Fragment key={likelihood}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', paddingRight: 8, whiteSpace: 'nowrap' }}>{likelihood} Likelihood</div>
              {['Low', 'Medium', 'High'].map(impact => {
                const key = `${likelihood}-${impact}`
                const ids = heatMap[key] ?? []
                const c = heatColor(likelihood, impact)
                return (
                  <div key={impact} style={{ background: c.bg, border: `1px solid ${c.text}22`, borderRadius: 8, padding: '10px 8px', minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    <div style={{ fontSize: '.6rem', fontWeight: 700, color: c.text }}>{c.label}</div>
                    {ids.map(id => (
                      <span key={id} style={{ fontSize: '.6rem', fontFamily: "'DM Mono',monospace", background: 'rgba(0,0,0,.08)', padding: '1px 5px', borderRadius: 4, color: c.text }}>{id}</span>
                    ))}
                    {ids.length === 0 && <span style={{ fontSize: '.6rem', color: '#cbd5e1' }}>—</span>}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
