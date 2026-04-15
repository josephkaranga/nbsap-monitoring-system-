import React from 'react'

const PROVIDERS = [
  { name: 'Sector Ministries', icon: '🏛️', desc: 'MINAGRI, MINEMA, MININFRA, MINIRENA — institutional biodiversity data via T01', count: '7 ministries', color: '#0f2744', bg: '#f0f9ff', border: '#bae6fd' },
  { name: 'National Statistics', icon: '📊', desc: 'NISR — population, land use, economic data for biodiversity context indicators', count: 'Annual datasets', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  { name: 'Research Institutions', icon: '🔬', desc: 'UR, INES, RAB — scientific studies and biodiversity assessments via T07', count: '12 institutions', color: '#6366f1', bg: '#faf5ff', border: '#e9d5ff' },
  { name: 'Coordination Unit', icon: '🎯', desc: 'REMA NBSAP Unit — central data validation, quality control, and RBIS management', count: 'Lead agency', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { name: 'Districts (30)', icon: '🗺️', desc: 'All 30 districts — quarterly T02 biodiversity monitoring reports', count: '30 districts', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { name: 'CBD Secretariat', icon: '🌍', desc: 'International reporting obligations — 8th National Report 2027', count: 'Biennial', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
]

const INTEGRATION_STATUS = [
  { system: 'MINEMA', type: 'Institutional', status: 'Active', lastSync: '2025-01-15', records: '1,248', format: 'API' },
  { system: 'MINAGRI', type: 'Agricultural', status: 'Active', lastSync: '2025-01-14', records: '892', format: 'CSV' },
  { system: 'NSO (NISR)', type: 'Statistical', status: 'Pending', lastSync: '2024-12-31', records: '—', format: 'API' },
  { system: 'Research Inst.', type: 'Scientific', status: 'Partial', lastSync: '2025-01-10', records: '234', format: 'Manual' },
  { system: 'Districts', type: 'Field Data', status: 'Active', lastSync: '2025-01-15', records: '3,420', format: 'Form' },
]

const GOVERNANCE = [
  { icon: '🔒', title: 'Data Classification', desc: 'Three-tier classification: Public (aggregated indicators), Restricted (raw district data), Confidential (species locations, sensitive habitats). Automated classification on upload.', color: '#0f2744' },
  { icon: '👤', title: 'Access Control', desc: 'Role-based access: Admin (full), Sector Officer (ministry data), District Officer (own district), Viewer (public data only). Species location fuzzing for non-admin roles.', color: '#10b981' },
  { icon: '📋', title: 'Submission Standards', desc: 'Standardized T01–T07 templates with mandatory fields, validation rules, and metadata requirements. All submissions timestamped and audit-logged.', color: '#6366f1' },
]

export function RBIS() {
  return (
    <div>
      {/* Overview */}
      <div className="ai-panel mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: '1.3rem' }}>🗄️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Rwanda Biodiversity Information System (RBIS)</div>
            <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)', marginTop: 2 }}>Centralized biodiversity data infrastructure for NBSAP monitoring</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Multi-source Integration', 'Real-time Sync', 'Role-based Access', 'CBD Compliant', 'Audit Trail'].map(f => (
            <span key={f} style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(56,189,248,.2)', color: '#7dd3fc', fontSize: '.72rem', fontWeight: 600, border: '1px solid rgba(56,189,248,.3)' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Data Providers */}
      <div className="mb-6">
        <div className="section-header">
          <div className="section-title">🔌 Data Providers</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {PROVIDERS.map(p => (
            <div key={p.name} className="card card-hover" style={{ padding: 18, borderTop: `3px solid ${p.color}`, background: p.bg, borderColor: p.border }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.85rem', color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: '.65rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>{p.count}</div>
                </div>
              </div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Status */}
      <div className="card mb-6">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div className="section-title">🔗 Integration Status</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>System</th>
                <th>Data Type</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Records</th>
                <th>Format</th>
              </tr>
            </thead>
            <tbody>
              {INTEGRATION_STATUS.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: '.82rem' }}>{s.system}</td>
                  <td><span className="tag tag-gray">{s.type}</span></td>
                  <td>
                    <span className={`tag ${s.status === 'Active' ? 'tag-green' : s.status === 'Pending' ? 'tag-yellow' : 'tag-blue'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', color: '#64748b' }}>{s.lastSync}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem', fontWeight: 700 }}>{s.records}</td>
                  <td><span className="tag tag-blue">{s.format}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Governance */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🛡️ Data Governance Protocols</div>
        </div>
        <div className="grid-3">
          {GOVERNANCE.map(g => (
            <div key={g.title} style={{ padding: 18, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{g.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: g.color, marginBottom: 6 }}>{g.title}</div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.6 }}>{g.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
