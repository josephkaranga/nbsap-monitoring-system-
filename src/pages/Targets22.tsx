import React, { useState } from 'react'
import { GOAL_COLORS } from '../data/constants'

interface Props { onViewIndicator: (id: number) => void }

const TARGETS = [
  { id: 1, goal: 'A', code: 'T01', title: 'Spatial Planning & Biodiversity', statement: 'By 2030, ensure that all land-use planning processes integrate biodiversity considerations, with at least 80% of districts having biodiversity-sensitive spatial plans.', baseline: '35% of districts (2020)', indicators: ['Forest cover %', 'Land use change rate', 'Spatial plan compliance'], actions: ['Update district spatial plans', 'Train planners on biodiversity integration', 'Establish biodiversity zoning guidelines'], indIds: [1, 2, 3] },
  { id: 2, goal: 'A', code: 'T02', title: 'Restoration of Degraded Ecosystems', statement: 'By 2030, restore at least 30% of degraded terrestrial and freshwater ecosystems, with priority on wetlands (1,200 ha) and forest landscapes.', baseline: '0 ha wetland restored (2020)', indicators: ['Wetland area restored (ha)', 'Forest restoration ha', 'Ecosystem integrity index'], actions: ['Implement wetland restoration program', 'Scale agroforestry in degraded areas', 'Establish restoration monitoring'], indIds: [4, 5, 6] },
  { id: 3, goal: 'A', code: 'T03', title: 'Protected Area Coverage', statement: 'By 2030, ensure at least 30% of Rwanda\'s land and freshwater areas are effectively conserved through protected areas and OECMs.', baseline: '10.4% protected (2020)', indicators: ['Protected area coverage %', 'Management effectiveness score', 'OECM area (ha)'], actions: ['Gazette new protected areas', 'Strengthen PA management', 'Establish OECM framework'], indIds: [7, 8, 9] },
  { id: 4, goal: 'A', code: 'T04', title: 'Species Recovery', statement: 'By 2030, halt the extinction of known threatened species and improve the conservation status of at least 800 species through active management.', baseline: '450 species with plans (2020)', indicators: ['Species with conservation plans', 'Threatened species trend', 'Invasive species managed'], actions: ['Develop species action plans', 'Control invasive species', 'Strengthen wildlife corridors'], indIds: [10, 11, 12] },
  { id: 5, goal: 'B', code: 'T05', title: 'Sustainable Use of Wild Species', statement: 'By 2030, ensure sustainable, legal, and safe use of wild species, with zero tolerance for illegal wildlife trade.', baseline: '23 HWC incidents/yr (2020)', indicators: ['Illegal wildlife trade cases', 'HWC incidents', 'Sustainable harvest compliance'], actions: ['Strengthen anti-poaching', 'Community HWC mitigation', 'Sustainable use protocols'], indIds: [13, 14] },
  { id: 6, goal: 'B', code: 'T06', title: 'Invasive Alien Species', statement: 'By 2030, reduce the introduction and establishment of invasive alien species by 50% and manage priority invasives in at least 15 ecosystems.', baseline: '3 managed ecosystems (2020)', indicators: ['Invasive species managed', 'New IAS introductions', 'IAS control coverage'], actions: ['National IAS strategy', 'Border biosecurity', 'Community IAS monitoring'], indIds: [15, 16] },
  { id: 7, goal: 'B', code: 'T07', title: 'Pollution Reduction', statement: 'By 2030, reduce pollution from all sources to levels not harmful to biodiversity, including reducing excess nutrients by 50% and pesticides by 50%.', baseline: 'Baseline assessment 2021', indicators: ['Water quality index', 'Nutrient loading', 'Pesticide use reduction'], actions: ['Regulate agricultural inputs', 'Wetland buffer zones', 'Industrial effluent standards'], indIds: [17, 18] },
  { id: 8, goal: 'B', code: 'T08', title: 'Climate Change & Biodiversity', statement: 'By 2030, minimize the impact of climate change on biodiversity through ecosystem-based adaptation covering at least 40% of vulnerable areas.', baseline: '15% EbA coverage (2020)', indicators: ['EbA coverage %', 'Climate-vulnerable ecosystems', 'Carbon sequestration'], actions: ['Integrate EbA in NDC', 'Restore climate-resilient ecosystems', 'Climate-biodiversity monitoring'], indIds: [19, 20] },
  { id: 9, goal: 'C', code: 'T09', title: 'Biodiversity Mainstreaming', statement: 'By 2030, ensure biodiversity values are integrated into national and local planning, poverty reduction strategies, and all sector policies.', baseline: '3 sectors mainstreamed (2020)', indicators: ['Sectors with biodiversity plans', 'Budget with biodiversity tag', 'Policy integration score'], actions: ['Sector biodiversity strategies', 'Green budget tagging', 'Cross-sector coordination'], indIds: [21, 22] },
  { id: 10, goal: 'C', code: 'T10', title: 'Sustainable Agriculture & Forestry', statement: 'By 2030, ensure at least 30% of agricultural and forestry areas are managed sustainably, with biodiversity-friendly practices.', baseline: '18% sustainable practices (2020)', indicators: ['Sustainable agriculture %', 'Agroforestry households', 'Organic certification'], actions: ['Promote agroforestry', 'Sustainable forestry certification', 'Farmer training programs'], indIds: [23, 24] },
  { id: 11, goal: 'C', code: 'T11', title: 'Urban Biodiversity', statement: 'By 2030, increase urban green space to at least 15% of urban areas and integrate biodiversity into urban planning in all cities.', baseline: '8% urban green space (2020)', indicators: ['Urban green space %', 'Urban biodiversity index', 'Green infrastructure'], actions: ['Urban greening programs', 'Biodiversity-sensitive urban planning', 'Community gardens'], indIds: [25, 26] },
  { id: 12, goal: 'C', code: 'T12', title: 'Access & Benefit Sharing', statement: 'By 2030, implement fair and equitable sharing of benefits from genetic resources, with all research institutions compliant with ABS protocols.', baseline: '40% ABS compliance (2020)', indicators: ['ABS compliance rate', 'Benefit-sharing agreements', 'Traditional knowledge documented'], actions: ['ABS legislation enforcement', 'Community benefit-sharing', 'Traditional knowledge registry'], indIds: [27, 28] },
  { id: 13, goal: 'D', code: 'T13', title: 'Biodiversity Finance', statement: 'By 2030, mobilize at least RWF 50 billion annually for biodiversity, closing the finance gap by 60% through domestic and international sources.', baseline: 'RWF 12B/yr (2020)', indicators: ['Biodiversity finance (RWF B)', 'Finance gap %', 'Private sector investment'], actions: ['Biodiversity finance strategy', 'GCF/GEF pipeline', 'Private sector engagement'], indIds: [29, 30] },
  { id: 14, goal: 'D', code: 'T14', title: 'Capacity Building', statement: 'By 2030, ensure all 30 districts have trained biodiversity officers and all sector ministries have dedicated biodiversity focal points.', baseline: '12 trained officers (2020)', indicators: ['Trained district officers', 'Ministry focal points', 'Training hours delivered'], actions: ['District officer training', 'Ministry capacity building', 'NBSAP training curriculum'], indIds: [31, 32] },
  { id: 15, goal: 'D', code: 'T15', title: 'Monitoring & Reporting', statement: 'By 2030, establish a fully operational RBIS with real-time data from all 30 districts and annual reporting to CBD.', baseline: 'Manual reporting (2020)', indicators: ['RBIS operational status', 'Districts reporting digitally', 'Data quality score'], actions: ['RBIS development', 'Digital reporting rollout', 'Data quality protocols'], indIds: [33, 34] },
  { id: 16, goal: 'D', code: 'T16', title: 'Stakeholder Engagement', statement: 'By 2030, ensure meaningful participation of all stakeholders including IPLCs, women, and youth in NBSAP implementation and monitoring.', baseline: 'Limited IPLC engagement (2020)', indicators: ['Stakeholder participation rate', 'Gender balance in governance', 'IPLC representation'], actions: ['Inclusive governance framework', 'Gender mainstreaming', 'Youth biodiversity programs'], indIds: [35, 36] },
  { id: 17, goal: 'D', code: 'T17', title: 'Biodiversity Education', statement: 'By 2030, integrate biodiversity education into national curriculum at all levels and increase public awareness to 70% of population.', baseline: '25% public awareness (2020)', indicators: ['Schools with biodiversity curriculum', 'Public awareness %', 'Media coverage'], actions: ['Curriculum development', 'Public awareness campaigns', 'Biodiversity media program'], indIds: [37, 38] },
  { id: 18, goal: 'D', code: 'T18', title: 'Traditional Knowledge', statement: 'By 2030, document and protect traditional knowledge related to biodiversity from at least 50 communities, with community consent protocols.', baseline: '8 communities documented (2020)', indicators: ['Communities documented', 'TK protection agreements', 'TK integrated in management'], actions: ['TK documentation program', 'Community consent protocols', 'TK integration in RBIS'], indIds: [39, 40] },
  { id: 19, goal: 'D', code: 'T19', title: 'Biosafety', statement: 'By 2030, ensure all GMO and biotechnology activities comply with the Cartagena Protocol, with 100% biosafety assessment compliance.', baseline: '65% compliance (2020)', indicators: ['Biosafety compliance %', 'GMO assessments completed', 'Cartagena Protocol adherence'], actions: ['Biosafety legislation', 'Assessment capacity', 'International reporting'], indIds: [41, 42] },
  { id: 20, goal: 'D', code: 'T20', title: 'Digital Sequence Information', statement: 'By 2030, establish a national DSI framework ensuring equitable benefit-sharing from digital sequence information on genetic resources.', baseline: 'No DSI framework (2020)', indicators: ['DSI framework status', 'DSI benefit-sharing agreements', 'National DSI database'], actions: ['DSI policy development', 'International negotiations', 'National DSI registry'], indIds: [43, 44] },
  { id: 21, goal: 'D', code: 'T21', title: 'Subsidy Reform', statement: 'By 2030, identify and eliminate, phase out, or reform incentives harmful to biodiversity, redirecting at least RWF 5 billion to biodiversity-positive activities.', baseline: 'Assessment underway (2020)', indicators: ['Harmful subsidies identified', 'Subsidies reformed (RWF B)', 'Positive incentives created'], actions: ['Subsidy review', 'Reform roadmap', 'Positive incentive design'], indIds: [45, 46] },
  { id: 22, goal: 'D', code: 'T22', title: 'Gender & IPLC Rights', statement: 'By 2030, ensure full and effective participation of women, IPLCs, and local communities in biodiversity governance, with gender-disaggregated data in all reporting.', baseline: '30% women in governance (2020)', indicators: ['Women in biodiversity governance %', 'IPLC land rights recognized', 'Gender-disaggregated reports'], actions: ['Gender action plan', 'IPLC rights framework', 'Disaggregated data mandate'], indIds: [47, 48] },
]

export function Targets22({ onViewIndicator }: Props) {
  const [goalFilter, setGoalFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selected, setSelected] = useState<typeof TARGETS[0] | null>(null)

  const filtered = TARGETS.filter(t => {
    const matchGoal = goalFilter === 'all' || t.goal === goalFilter
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.statement.toLowerCase().includes(search.toLowerCase())
    return matchGoal && matchSearch
  })

  const goalCount = (g: string) => TARGETS.filter(t => t.goal === g).length

  return (
    <div>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        <div className="metric-card mc-navy"><div className="metric-label">Total Targets</div><div className="metric-value">22</div><div className="metric-sub">KM-GBF Aligned</div></div>
        <div className="metric-card mc-emerald"><div className="metric-label">Goal A</div><div className="metric-value">4</div><div className="metric-sub">Reducing Threats</div></div>
        <div className="metric-card mc-sky"><div className="metric-label">Goal B</div><div className="metric-value">4</div><div className="metric-sub">Meeting Needs</div></div>
        <div className="metric-card mc-amber"><div className="metric-label">Goal C</div><div className="metric-value">4</div><div className="metric-sub">Tools & Solutions</div></div>
        <div className="metric-card mc-indigo"><div className="metric-label">Goal D</div><div className="metric-value">10</div><div className="metric-sub">Governance</div></div>
      </div>

      {/* GBF Goal Alignment */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header"><div className="section-title">🌐 KM-GBF Goal Alignment</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[
            { goal: 'A', label: 'Reducing Threats to Biodiversity', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', count: 4 },
            { goal: 'B', label: 'Meeting People\'s Needs', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', count: 4 },
            { goal: 'C', label: 'Tools & Solutions', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', count: 4 },
            { goal: 'D', label: 'Governance & Mainstreaming', color: '#6366f1', bg: '#faf5ff', border: '#e9d5ff', count: 10 },
          ].map(g => (
            <div key={g.goal} style={{ padding: 16, borderRadius: 10, background: g.bg, border: `1px solid ${g.border}`, cursor: 'pointer' }} onClick={() => setGoalFilter(goalFilter === g.goal ? 'all' : g.goal)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: g.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.8rem' }}>{g.goal}</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: g.color, fontFamily: "'Playfair Display',serif" }}>{g.count}</span>
              </div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.4 }}>{g.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="filter-chips">
          {['all', 'A', 'B', 'C', 'D'].map(g => (
            <button key={g} className={`chip${goalFilter === g ? ' active' : ''}`} onClick={() => setGoalFilter(g)}>
              {g === 'all' ? 'All Goals' : `Goal ${g}`}
            </button>
          ))}
        </div>
        <input className="form-input" placeholder="🔍 Search targets…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240, marginLeft: 'auto' }} />
      </div>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => {
          const gc = GOAL_COLORS[t.goal]
          const isOpen = expanded === t.id
          return (
            <div key={t.id} className="card" style={{ overflow: 'hidden', borderLeft: `4px solid ${gc.text}` }}>
              <div
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={() => setExpanded(isOpen ? null : t.id)}
              >
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', fontWeight: 700, color: '#94a3b8', minWidth: 32 }}>{t.code}</span>
                <span style={{ padding: '2px 8px', borderRadius: 6, background: gc.bg, color: gc.text, fontSize: '.65rem', fontWeight: 700, border: `1px solid ${gc.border}` }}>Goal {t.goal}</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '.85rem' }}>{t.title}</span>
                <button
                  onClick={e => { e.stopPropagation(); setSelected(t) }}
                  style={{ padding: '4px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Details
                </button>
                <span style={{ color: '#94a3b8', fontSize: '.9rem' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ marginTop: 12, marginBottom: 10, fontSize: '.82rem', color: '#475569', lineHeight: 1.6 }}>{t.statement}</div>
                  <div className="grid-3" style={{ gap: 12 }}>
                    <div>
                      <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Baseline</div>
                      <div style={{ fontSize: '.78rem', color: '#0f172a' }}>{t.baseline}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Key Indicators</div>
                      {t.indicators.map((ind, i) => (
                        <div key={i} style={{ fontSize: '.75rem', color: '#475569', marginBottom: 2 }}>• {ind}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Strategic Actions</div>
                      {t.actions.map((a, i) => (
                        <div key={i} style={{ fontSize: '.75rem', color: '#475569', marginBottom: 2 }}>→ {a}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    {t.indIds.slice(0, 3).map(id => (
                      <button key={id} onClick={() => onViewIndicator(id)} style={{ padding: '4px 10px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 6, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>
                        Indicator #{id} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 600, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ padding: '3px 10px', borderRadius: 6, background: GOAL_COLORS[selected.goal].bg, color: GOAL_COLORS[selected.goal].text, fontSize: '.72rem', fontWeight: 700 }}>Goal {selected.goal}</span>
                <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{selected.code} · {selected.title}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16, fontSize: '.85rem', color: '#475569', lineHeight: 1.7 }}>{selected.statement}</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Baseline (2020)</div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{selected.baseline}</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Indicator Framework</div>
                {selected.indicators.map((ind, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: 6, marginBottom: 4, fontSize: '.78rem', color: '#0f172a' }}>📐 {ind}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Strategic Actions</div>
                {selected.actions.map((a, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: '#f0fdf4', borderRadius: 6, marginBottom: 4, fontSize: '.78rem', color: '#166534' }}>→ {a}</div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.indIds.map(id => (
                  <button key={id} onClick={() => { setSelected(null); onViewIndicator(id) }} style={{ padding: '6px 12px', background: '#0f2744', color: '#fff', border: 'none', borderRadius: 7, fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>
                    View Indicator #{id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
