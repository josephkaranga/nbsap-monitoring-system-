import React, { useState } from 'react'
import { useIndicators } from '../hooks/useData'
import type { Indicator, IndicatorTier } from '../types/database'

interface Props { linkedId?: number | null; onClearLink?: () => void }

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; label: string; count: number; desc: string }> = {
  headline: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', label: 'Headline', count: 8, desc: 'High-level outcome indicators aligned to KM-GBF goals', },
  component: { bg: '#dbeafe', text: '#1e40af', border: '#bae6fd', label: 'Component', count: 14, desc: 'Intermediate output and process indicators', },
  complementary: { bg: '#fef9c3', text: '#854d0e', border: '#fde68a', label: 'Complementary', count: 35, desc: 'Context-specific national indicators', },
  binary: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', label: 'Binary', count: 22, desc: 'Yes/No policy and legal compliance indicators', },
}

const SAMPLE_INDICATORS = [
  { id: 1, seq: 1, name: 'Forest Cover Percentage', tier: 'headline', target: 'T01', target2030: '30%', responsible: 'REMA/MINAGRI', progress: 90, status: 'on-track', definition: 'Percentage of national land area under forest cover', baseline: '28.4% (2020)', source: 'RNRA Annual Forest Survey', freq: 'Annual', nbsap: 'Target 1' },
  { id: 2, seq: 2, name: 'Wetland Area Restored', tier: 'component', target: 'T02', target2030: '1,200 ha', responsible: 'REMA', progress: 50, status: 'at-risk', definition: 'Total hectares of degraded wetland restored to functional status', baseline: '0 ha (2020)', source: 'REMA Wetland Database', freq: 'Biannual', nbsap: 'Target 2' },
  { id: 3, seq: 3, name: 'Protected Area Coverage', tier: 'headline', target: 'T03', target2030: '30%', responsible: 'RDB', progress: 75, status: 'on-track', definition: 'Percentage of land and freshwater under formal protection', baseline: '10.4% (2020)', source: 'RDB Protected Areas Database', freq: 'Annual', nbsap: 'Target 3' },
  { id: 4, seq: 4, name: 'Species Threat Status', tier: 'component', target: 'T04', target2030: '800 species', responsible: 'RDB', progress: 81, status: 'on-track', definition: 'Number of threatened species with active conservation plans', baseline: '450 (2020)', source: 'RDB Species Database', freq: 'Annual', nbsap: 'Target 4' },
  { id: 5, seq: 5, name: 'Community Conservation Groups', tier: 'complementary', target: 'T05', target2030: '500 groups', responsible: 'Districts', progress: 60, status: 'at-risk', definition: 'Number of active community-based conservation groups', baseline: '180 (2020)', source: 'T04 Community Reports', freq: 'Quarterly', nbsap: 'Target 5' },
  { id: 6, seq: 6, name: 'EIA Compliance Rate', tier: 'binary', target: 'T06', target2030: '100%', responsible: 'REMA', progress: 92, status: 'on-track', definition: 'Percentage of projects with valid EIA documentation', baseline: '78% (2020)', source: 'REMA EIA Registry', freq: 'Quarterly', nbsap: 'Target 6' },
  { id: 7, seq: 7, name: 'Biodiversity Finance Gap', tier: 'component', target: 'T07', target2030: '<20%', responsible: 'MINECOFIN', progress: 45, status: 'behind', definition: 'Gap between required and actual biodiversity financing', baseline: '45% gap (2020)', source: 'T05 Finance Reports', freq: 'Annual', nbsap: 'Target 7' },
  { id: 8, seq: 8, name: 'Invasive Species Control', tier: 'complementary', target: 'T08', target2030: '15 species', responsible: 'RDB/Districts', progress: 33, status: 'behind', definition: 'Number of invasive species with active management plans', baseline: '3 (2020)', source: 'RDB Invasive Species Registry', freq: 'Annual', nbsap: 'Target 8' },
]

export function Indicators({ linkedId, onClearLink }: Props) {
  const { indicators, indStats, loading } = useIndicators()
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [selected, setSelected] = useState<typeof SAMPLE_INDICATORS[0] | null>(null)

  const displayData = indicators.length > 0 ? indicators : SAMPLE_INDICATORS
  const filtered = displayData.filter(ind => {
    const matchTier = tierFilter === 'all' || ind.tier === tierFilter
    const matchSearch = !search || ind.name.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchSearch
  })

  const statusColor = (s: string) => s === 'on-track' ? '#10b981' : s === 'at-risk' ? '#f59e0b' : '#f43f5e'

  return (
    <div>
      {linkedId && (
        <div style={{ padding: '10px 16px', background: '#e0f2fe', borderRadius: 10, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bae6fd' }}>
          <span style={{ fontSize: '.8rem', color: '#0369a1' }}>🔗 Linked from Target — showing indicator #{linkedId}</span>
          <button onClick={onClearLink} style={{ border: 'none', background: 'none', color: '#0369a1', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600 }}>Clear ✕</button>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Indicators', value: indStats?.total ?? 79, color: '#0f2744', cls: 'mc-navy' },
          { label: 'Headline', value: indStats?.byTier?.headline ?? 8, color: '#10b981', cls: 'mc-emerald' },
          { label: 'Component', value: indStats?.byTier?.component ?? 14, color: '#0ea5e9', cls: 'mc-sky' },
          { label: 'Complementary', value: 35, color: '#f59e0b', cls: 'mc-amber' },
          { label: 'Binary', value: indStats?.byTier?.binary ?? 22, color: '#6366f1', cls: 'mc-indigo' },
        ].map(c => (
          <div key={c.label} className={`metric-card ${c.cls}`}>
            <div className="metric-label">{c.label}</div>
            <div className="metric-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* 4-Tier Hierarchy */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🏗️ KM-GBF 4-Tier Hierarchy</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {Object.entries(TIER_COLORS).map(([tier, c]) => (
            <div key={tier} style={{ padding: 16, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '.8rem', color: c.text }}>{c.label}</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: c.text, fontFamily: "'Playfair Display',serif" }}>{c.count}</span>
              </div>
              <div style={{ fontSize: '.72rem', color: '#475569', lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GBF Goals */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🌐 Indicators by GBF Goal</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { goal: 'A', label: 'Reducing Threats', count: 22, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Biodiversity loss halted' },
            { goal: 'B', label: 'Meeting Needs', count: 18, color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', desc: 'Sustainable use & benefits' },
            { goal: 'C', label: 'Tools & Solutions', count: 21, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', desc: 'Implementation means' },
            { goal: 'D', label: 'Governance', count: 18, color: '#6366f1', bg: '#faf5ff', border: '#e9d5ff', desc: 'Mainstreaming & justice' },
          ].map(g => (
            <div key={g.goal} style={{ padding: 16, borderRadius: 10, background: g.bg, border: `1px solid ${g.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: g.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.8rem' }}>{g.goal}</span>
                <span style={{ fontWeight: 700, fontSize: '.8rem', color: g.color }}>{g.label}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: g.color, fontFamily: "'Playfair Display',serif" }}>{g.count}</div>
              <div style={{ fontSize: '.7rem', color: '#64748b' }}>{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="🔍 Search indicators…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        <div className="filter-chips">
          {['all', 'headline', 'component', 'complementary', 'binary'].map(t => (
            <button key={t} className={`chip${tierFilter === t ? ' active' : ''}`} onClick={() => setTierFilter(t)}>
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select className="form-select" style={{ marginLeft: 'auto' }}>
          <option>All Targets</option>
          {Array.from({ length: 22 }, (_, i) => <option key={i}>Target {i + 1}</option>)}
        </select>
        <select className="form-select">
          <option>All Goals</option>
          <option>Goal A</option><option>Goal B</option><option>Goal C</option><option>Goal D</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Indicator Name</th>
                <th>Tier</th>
                <th>NBSAP Target</th>
                <th>Target 2030</th>
                <th>Responsible</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ind: any) => (
                <tr key={ind.id} onClick={() => setSelected(ind)}>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', color: '#94a3b8' }}>{ind.seq ?? ind.sequence_no}</td>
                  <td style={{ fontWeight: 600, fontSize: '.82rem' }}>{ind.name}</td>
                  <td><span className={`tier-pill tier-${ind.tier}`}>{ind.tier}</span></td>
                  <td style={{ fontSize: '.75rem', color: '#64748b' }}>{ind.target ?? ind.nbsap_target}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{ind.target2030 ?? ind.target_2030}</td>
                  <td style={{ fontSize: '.75rem', color: '#64748b' }}>{ind.responsible ?? ind.data_source}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${ind.progress ?? ind.progress_pct}%`, background: statusColor(ind.status), borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '.72rem', fontWeight: 700, color: statusColor(ind.status), fontFamily: "'DM Mono',monospace", minWidth: 32 }}>{ind.progress ?? ind.progress_pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 560, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span className={`tier-pill tier-${selected.tier}`} style={{ marginRight: 8 }}>{selected.tier}</span>
                <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{selected.name}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Definition</div>
                <div style={{ fontSize: '.83rem', color: '#475569', lineHeight: 1.6 }}>{selected.definition}</div>
              </div>
              <div className="grid-2" style={{ marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Target 2030</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selected.target2030 ?? selected.target_2030}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Baseline</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{selected.baseline}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Data Source</div>
                  <div style={{ fontSize: '.83rem', color: '#475569' }}>{selected.source ?? selected.data_source}</div>
                </div>
                <div>
                  <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Frequency</div>
                  <div style={{ fontSize: '.83rem', color: '#475569' }}>{selected.freq ?? selected.periodicity}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Progress</div>
                <div className="prog-track" style={{ height: 10 }}>
                  <div className="prog-fill" style={{ width: `${selected.progress ?? selected.progress_pct}%`, background: statusColor(selected.status) }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '.72rem', color: '#94a3b8' }}>
                  <span>0%</span>
                  <span style={{ fontWeight: 700, color: statusColor(selected.status) }}>{selected.progress ?? selected.progress_pct}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
