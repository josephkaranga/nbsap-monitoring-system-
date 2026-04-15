import React from 'react'

const STAKEHOLDERS = [
  { name: 'REMA', role: 'Lead Agency', engagement: 'High', influence: 'High', interest: 'High', mechanism: 'Quarterly steering committee', data: 'T01 submissions, compliance reports', status: 'Active' },
  { name: 'MINAGRI', role: 'Sector Ministry', engagement: 'High', influence: 'High', interest: 'High', mechanism: 'Monthly coordination meetings', data: 'Agricultural biodiversity data', status: 'Active' },
  { name: 'RDB', role: 'Protected Areas', engagement: 'High', influence: 'Medium', interest: 'High', mechanism: 'Biannual reviews', data: 'T03 PA monitoring, species data', status: 'Active' },
  { name: 'Districts (30)', role: 'Implementation', engagement: 'Medium', influence: 'Medium', interest: 'High', mechanism: 'T02 quarterly reporting', data: 'District biodiversity indicators', status: 'Active' },
  { name: 'Civil Society', role: 'Advocacy', engagement: 'Medium', influence: 'Low', interest: 'High', mechanism: 'Annual stakeholder forum', data: 'T04 community observations', status: 'Active' },
  { name: 'Private Sector', role: 'Compliance', engagement: 'Low', influence: 'Medium', interest: 'Medium', mechanism: 'T06 annual reporting', data: 'EIA compliance, ESG scores', status: 'Partial' },
  { name: 'Research Institutions', role: 'Evidence', engagement: 'Medium', influence: 'Low', interest: 'High', mechanism: 'T07 research contributions', data: 'Scientific studies, datasets', status: 'Active' },
  { name: 'MINECOFIN', role: 'Finance', engagement: 'Low', influence: 'High', interest: 'Medium', mechanism: 'Annual budget review', data: 'T05 finance tracking', status: 'Active' },
  { name: 'CBD Secretariat', role: 'International', engagement: 'Low', influence: 'Medium', interest: 'High', mechanism: 'National reporting (2027)', data: 'CBD 8th National Report', status: 'Periodic' },
]

const DATA_FLOWS = [
  { chain: 'Government', actors: ['REMA', 'MINAGRI', 'RDB', 'MINECOFIN'], flow: 'T01 Institutional → RBIS → Dashboard → CBD Report', freq: 'Quarterly', color: '#0f2744', bg: '#f0f9ff', border: '#bae6fd' },
  { chain: 'Civil Society', actors: ['Districts', 'Communities', 'NGOs'], flow: 'T04 Community → T02 District → RBIS → Public Dashboard', freq: 'Quarterly', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  { chain: 'Private Sector', actors: ['Companies', 'REMA', 'RDB'], flow: 'T06 Compliance → REMA Verification → Compliance Index', freq: 'Annual', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
]

export function Stakeholders() {
  return (
    <div>
      {/* Table */}
      <div className="card mb-6">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div className="section-title">👥 Stakeholder Engagement Matrix</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Stakeholder</th>
                <th>Role</th>
                <th>Engagement</th>
                <th>Influence</th>
                <th>Interest</th>
                <th>Engagement Mechanism</th>
                <th>Data Contribution</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STAKEHOLDERS.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: '.82rem' }}>{s.name}</td>
                  <td><span className="tag tag-gray">{s.role}</span></td>
                  <td>
                    <span className={`tag ${s.engagement === 'High' ? 'tag-green' : s.engagement === 'Medium' ? 'tag-yellow' : 'tag-gray'}`}>
                      {s.engagement}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${s.influence === 'High' ? 'tag-red' : s.influence === 'Medium' ? 'tag-yellow' : 'tag-gray'}`}>
                      {s.influence}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${s.interest === 'High' ? 'tag-blue' : s.interest === 'Medium' ? 'tag-yellow' : 'tag-gray'}`}>
                      {s.interest}
                    </span>
                  </td>
                  <td style={{ fontSize: '.75rem', color: '#475569' }}>{s.mechanism}</td>
                  <td style={{ fontSize: '.75rem', color: '#475569', maxWidth: 180 }}>{s.data}</td>
                  <td>
                    <span className={`tag ${s.status === 'Active' ? 'tag-green' : 'tag-yellow'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Flows */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🔄 Stakeholder Data Flows</div>
        </div>
        <div className="grid-3">
          {DATA_FLOWS.map(df => (
            <div key={df.chain} style={{ padding: 18, borderRadius: 12, background: df.bg, border: `1px solid ${df.border}` }}>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: df.color, marginBottom: 8 }}>{df.chain} Chain</div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                {df.actors.map(a => (
                  <span key={a} style={{ fontSize: '.65rem', padding: '2px 7px', borderRadius: 10, background: 'rgba(0,0,0,.08)', color: df.color, fontWeight: 600 }}>{a}</span>
                ))}
              </div>
              <div style={{ fontSize: '.72rem', color: '#475569', marginBottom: 6, lineHeight: 1.5 }}>{df.flow}</div>
              <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>Frequency: {df.freq}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
