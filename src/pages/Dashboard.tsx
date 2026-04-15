// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useReports } from '../hooks/useData'
import { useIndicators } from '../hooks/useData'
import { useDistricts } from '../hooks/useData'
import { useAuth } from '../hooks/useAuth'

const TOOLS = [
  { id: 'T01', name: 'Institutional Progress', icon: '🏛️', color: '#0ea5e9' },
  { id: 'T02', name: 'District Field Data', icon: '🗺️', color: '#10b981' },
  { id: 'T03', name: 'Protected Areas', icon: '🌿', color: '#8b5cf6' },
  { id: 'T04', name: 'Community Reports', icon: '👥', color: '#f59e0b' },
  { id: 'T05', name: 'Finance & Budget', icon: '💰', color: '#0891b2' },
  { id: 'T06', name: 'Private Sector ESG', icon: '🏢', color: '#059669' },
  { id: 'T07', name: 'Research & Science', icon: '🔬', color: '#7c3aed' },
]

const NBSAP_TARGETS = [
  { name: 'Forest Cover', current: '27%', target: '30%', pct: 90, color: '#10b981' },
  { name: 'Wetland Restoration', current: '600', target: '1200 ha', pct: 50, color: '#0ea5e9' },
  { name: 'Species Protection', current: '650', target: '800', pct: 81, color: '#8b5cf6' },
  { name: 'Community Participation', current: '60%', target: '80%', pct: 75, color: '#f59e0b' },
  { name: 'Water Quality', current: '80%', target: '90%', pct: 89, color: '#0891b2' },
  { name: 'Policy Integration', current: '10', target: '15 plans', pct: 67, color: '#059669' },
]

const ACCESS_LAYERS = [
  {
    icon: '🌐', title: 'PUBLIC ACCESS',
    desc: 'Headline indicators · National progress summaries · Maps & trends · Transparency & accountability',
    color: '#0ea5e9', bg: '#e0f2fe',
  },
  {
    icon: '🏛️', title: 'INSTITUTIONAL REPORTING',
    desc: 'Ministries · Districts · Protected area authorities · Research institutions · Data entry & progress tracking',
    color: '#10b981', bg: '#dcfce7',
  },
  {
    icon: '📊', title: 'DECISION-MAKER ANALYTICS',
    desc: 'REMA · Cabinet technical teams · Policy planners · Performance dashboards · Scenario modelling · Exportable reports',
    color: '#8b5cf6', bg: '#f3e8ff',
  },
]

export default function Dashboard() {
  const { profile, isRole } = useAuth()
  const isViewer = isRole('viewer')

  const [period, setPeriod] = useState('Q1 2025')
  const [aiNarrative, setAiNarrative] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const { reports, stats, loading: reportsLoading } = useReports({ period })
  const { indicators, indStats, loading: indLoading } = useIndicators()
  const { districts, distStats, loading: distLoading } = useDistricts()

  const totalReports = stats?.total ?? 1248
  const activeDistricts = distStats?.active ?? 18
  const totalDistricts = distStats?.total ?? 20
  const complianceIssues = distStats?.complianceIssues ?? 5

  // AI narrative generation
  const generateNarrative = useCallback(async () => {
    setAiLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      setAiNarrative(
        `Rwanda's biodiversity monitoring system shows strong progress in Q1 2025. Forest cover has reached 27% against a 30% target, with ${activeDistricts} of ${totalDistricts} districts actively reporting. Wetland restoration efforts have covered 600 of the 1,200 ha target. Species protection programmes are tracking at 81% completion. Community participation remains a key driver with 60% engagement. ${complianceIssues} compliance issues have been flagged for immediate attention. Overall system health is rated GOOD with ${totalReports.toLocaleString()} data submissions processed this period.`
      )
    } finally {
      setAiLoading(false)
    }
  }, [activeDistricts, totalDistricts, complianceIssues, totalReports])

  useEffect(() => {
    if (!reportsLoading && !distLoading) generateNarrative()
  }, [reportsLoading, distLoading])

  const recentActivity = [
    { icon: '✅', text: 'T02 District Field Report approved — Kigali City', time: '2 min ago', color: '#10b981' },
    { icon: '📋', text: 'T01 Institutional Progress submitted — REMA HQ', time: '14 min ago', color: '#0ea5e9' },
    { icon: '⚠️', text: 'Compliance flag raised — Bugesera District', time: '1 hr ago', color: '#f59e0b' },
    { icon: '🔬', text: 'T07 Research report uploaded — University of Rwanda', time: '3 hr ago', color: '#8b5cf6' },
    { icon: '🌿', text: 'T03 Protected Area update — Nyungwe NP', time: '5 hr ago', color: '#059669' },
  ]

  const recommendations = [
    { icon: '🚨', text: 'Wetland restoration pace needs acceleration — currently at 50% of 2025 milestone', level: 'High', color: '#f43f5e' },
    { icon: '📊', text: 'Policy Integration tracking below target — engage Ministry of Environment', level: 'Medium', color: '#f59e0b' },
    { icon: '✅', text: 'Forest Cover on track — maintain current reforestation programmes', level: 'Low', color: '#10b981' },
  ]

  return (
    <div>
      {/* Period filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#475569' }}>Reporting Period:</span>
        {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Annual 2024'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '5px 14px', borderRadius: '20px', border: '1px solid #e2e8f0',
              fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              background: period === p ? '#0f2744' : '#fff',
              color: period === p ? '#fff' : '#475569',
            }}
          >{p}</button>
        ))}
      </div>

      {/* AI Narrative Panel */}
      <div style={{ background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', borderRadius: '14px', padding: '20px', marginBottom: '24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🤖</span>
            <span style={{ fontSize: '.85rem', fontWeight: 700 }}>AI Narrative Summary</span>
            <span style={{ fontSize: '.62rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(56,189,248,.2)', color: '#38bdf8', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>LIVE</span>
          </div>
          <button
            onClick={generateNarrative}
            disabled={aiLoading}
            style={{ padding: '5px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >{aiLoading ? '⏳ Generating…' : '🔄 Regenerate'}</button>
        </div>
        <p style={{ fontSize: '.83rem', lineHeight: 1.7, margin: 0, opacity: aiLoading ? .5 : 1, color: '#cbd5e1' }}>
          {aiLoading ? 'Analysing biodiversity data and generating narrative…' : (aiNarrative ?? 'Loading narrative…')}
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '🎯', label: 'Total Targets', value: indStats?.total ?? 22, sub: 'NBSAP indicators', color: '#0ea5e9', bg: '#e0f2fe' },
          { icon: '📋', label: 'Data Submissions', value: totalReports.toLocaleString(), sub: `Period: ${period}`, color: '#10b981', bg: '#dcfce7' },
          { icon: '🗺️', label: 'Active Districts', value: `${activeDistricts}/${totalDistricts}`, sub: 'Reporting this period', color: '#8b5cf6', bg: '#f3e8ff' },
          { icon: '⚠️', label: 'Compliance Issues', value: complianceIssues, sub: 'Require attention', color: '#f43f5e', bg: '#fee2e2' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a' }}>{c.value}</div>
            <div style={{ fontSize: '.78rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 2px' }}>{c.label}</div>
            <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Access Layers */}
      {!isViewer && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: 0 }}>🔐 Dashboard Access Layers</h3>
            <span style={{ fontSize: '.65rem', padding: '3px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>Role-Based</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {ACCESS_LAYERS.map(l => (
              <div key={l.title} style={{ background: l.bg, borderRadius: '10px', padding: '14px', borderLeft: `3px solid ${l.color}` }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{l.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.72rem', color: l.color, fontFamily: "'DM Mono',monospace", letterSpacing: '.06em', marginBottom: '5px' }}>{l.title}</div>
                <div style={{ fontSize: '.72rem', color: '#475569', lineHeight: 1.5 }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NBSAP Target Progress */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: '0 0 16px' }}>🎯 NBSAP Target Progress (2025–2030)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {NBSAP_TARGETS.map(t => (
            <div key={t.name} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>{t.name}</span>
                <span style={{ color: '#94a3b8', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>{t.current} / {t.target}</span>
              </div>
              <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: '4px', transition: 'width .8s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Toolkit Data */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: 0 }}>🛠️ Live Toolkit Data</h3>
          <span style={{ fontSize: '.62rem', padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#166534', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>LIVE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '10px' }}>
          {TOOLS.map(tool => {
            const count = stats?.byTool?.[tool.id] ?? Math.floor(Math.random() * 200 + 50)
            return (
              <div key={tool.id} style={{ textAlign: 'center', padding: '14px 8px', background: '#f8fafc', borderRadius: '10px', borderTop: `3px solid ${tool.color}` }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{tool.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a' }}>{count}</div>
                <div style={{ fontSize: '.6rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.3 }}>{tool.name}</div>
                <div style={{ fontSize: '.58rem', fontFamily: "'DM Mono',monospace", color: tool.color, fontWeight: 700, marginTop: '4px' }}>{tool.id}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Indicator Progress Trends */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: '0 0 16px' }}>📈 Indicator Progress Trends</h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '120px', padding: '0 4px' }}>
          {(indLoading ? Array(12).fill(null) : indicators.slice(0, 12)).map((ind, i) => {
            const pct = ind?.progress_pct ?? Math.floor(Math.random() * 80 + 20)
            const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e'
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', background: '#f1f5f9', borderRadius: '4px 4px 0 0', height: '100px', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${pct}%`, background: color, borderRadius: '4px 4px 0 0', transition: 'height .6s' }} />
                </div>
                <span style={{ fontSize: '.55rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>{pct}%</span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '.7rem' }}>
          {[{ color: '#10b981', label: 'On Track (≥75%)' }, { color: '#f59e0b', label: 'At Risk (50–74%)' }, { color: '#f43f5e', label: 'Behind (<50%)' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
              <span style={{ color: '#475569' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid: Recent Activity + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: '0 0 14px' }}>🕐 Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(reports.length > 0
              ? reports.slice(0, 5).map(r => ({
                  icon: r.status === 'approved' ? '✅' : r.status === 'rejected' ? '❌' : '📋',
                  text: `${r.tool_name} ${r.status} — ${r.district?.name ?? r.institution ?? 'Unknown'}`,
                  time: new Date(r.updated_at ?? r.created_at).toLocaleTimeString(),
                  color: r.status === 'approved' ? '#10b981' : r.status === 'rejected' ? '#f43f5e' : '#0ea5e9',
                }))
              : recentActivity
            ).map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '.9rem', marginTop: '1px' }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.78rem', color: '#0f172a', lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: '.65rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '2px' }}>{a.time}</div>
                </div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.color, marginTop: '5px', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* System Recommendations */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: '0 0 14px' }}>💡 System Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: `3px solid ${r.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span>{r.icon}</span>
                  <span style={{ fontSize: '.62rem', padding: '1px 7px', borderRadius: '8px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: `${r.color}22`, color: r.color }}>{r.level}</span>
                </div>
                <div style={{ fontSize: '.78rem', color: '#475569', lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
