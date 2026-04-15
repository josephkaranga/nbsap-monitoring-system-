import React, { useState } from 'react'

const REPORT_TYPES = [
  { icon: '📅', title: 'Annual Reports', desc: 'Comprehensive NBSAP annual progress reports covering all 22 targets, 79 indicators, and stakeholder contributions', count: 2, color: '#0f2744', bg: '#f0f9ff', border: '#bae6fd' },
  { icon: '📊', title: 'Quarterly Updates', desc: 'Q1–Q4 dashboard summaries with T01–T07 submission statistics, compliance status, and district performance', count: 6, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  { icon: '🌍', title: 'CBD National Report', desc: '8th National Report to CBD Secretariat — KM-GBF alignment, GBF target progress, financial flows', count: 1, color: '#6366f1', bg: '#faf5ff', border: '#e9d5ff' },
]

const REPORT_STATUS = [
  { name: 'NBSAP Annual Report 2024', type: 'Annual', period: '2024', status: 'approved', generated: '2025-01-10', size: '4.2 MB' },
  { name: 'Q4 2024 Dashboard Summary', type: 'Quarterly', period: 'Q4 2024', status: 'approved', generated: '2025-01-05', size: '1.8 MB' },
  { name: 'Q3 2024 Dashboard Summary', type: 'Quarterly', period: 'Q3 2024', status: 'approved', generated: '2024-10-08', size: '1.6 MB' },
  { name: 'CBD 8th National Report (Draft)', type: 'CBD', period: '2024–2027', status: 'pending', generated: '2025-01-12', size: '8.1 MB' },
  { name: 'Q1 2025 Dashboard Summary', type: 'Quarterly', period: 'Q1 2025', status: 'draft', generated: '—', size: '—' },
]

export function Reports() {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <div>
      {/* Report type cards */}
      <div className="grid-3 mb-6">
        {REPORT_TYPES.map(r => (
          <div key={r.title} className="card card-hover" style={{ padding: 20, borderTop: `3px solid ${r.color}`, background: r.bg, borderColor: r.border }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: r.color, marginBottom: 6 }}>{r.title}</div>
            <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>{r.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.68rem', fontFamily: "'DM Mono',monospace", color: '#94a3b8' }}>{r.count} report{r.count !== 1 ? 's' : ''} available</span>
              <button style={{ padding: '5px 12px', background: r.color, color: '#fff', border: 'none', borderRadius: 7, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Status table */}
      <div className="card mb-6">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title">📋 Report Generation Status</div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.78rem', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {generating ? <><span className="spinner" />Generating…</> : '📄 Generate Full Report PDF'}
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Period</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {REPORT_STATUS.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: '.82rem' }}>{r.name}</td>
                  <td><span className="tag tag-blue">{r.type}</span></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', color: '#64748b' }}>{r.period}</td>
                  <td>
                    <span className={`status-${r.status === 'approved' ? 'approved' : r.status === 'pending' ? 'pending' : 'pending'}`}>
                      {r.status === 'approved' ? '✓ Approved' : r.status === 'pending' ? '⏳ Pending' : '✏️ Draft'}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', color: '#64748b' }}>{r.generated}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', color: '#94a3b8' }}>{r.size}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'draft' && (
                        <button style={{ padding: '4px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>↓ PDF</button>
                      )}
                      <button style={{ padding: '4px 10px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>View</button>
                    </div>
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
