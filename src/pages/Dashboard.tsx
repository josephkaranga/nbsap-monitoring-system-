import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useReports, useIndicators, useDistricts } from '../hooks/useData'
import type { TabId } from '../App'

interface Props { onSwitchTab: (tab: TabId) => void }

const ACTIVITY = [
  { icon: '✅', bg: '#dcfce7', msg: 'T02 District Report approved — Musanze', time: '2m ago' },
  { icon: '📋', bg: '#dbeafe', msg: 'T01 Institutional Report submitted by MINEMA', time: '18m ago' },
  { icon: '⚠️', bg: '#ffedd5', msg: 'Compliance alert: EIA missing for 3 projects', time: '1h ago' },
  { icon: '🎯', bg: '#f3e8ff', msg: 'Forest cover indicator updated to 27.3%', time: '2h ago' },
  { icon: '📊', bg: '#e0f2fe', msg: 'Q1 2025 dashboard report generated', time: '3h ago' },
]

const PROGRESS_ITEMS = [
  { label: 'Forest Cover', current: 27, target: 30, unit: '%', color: '#10b981' },
  { label: 'Wetland Restoration', current: 600, target: 1200, unit: 'ha', color: '#38bdf8' },
  { label: 'Species Protected', current: 650, target: 800, unit: '', color: '#6366f1' },
  { label: 'Community Engagement', current: 60, target: 80, unit: '%', color: '#f59e0b' },
  { label: 'Water Quality Index', current: 80, target: 90, unit: '%', color: '#0ea5e9' },
  { label: 'Policy Integration', current: 10, target: 15, unit: '', color: '#8b5cf6' },
]

export function Dashboard({ onSwitchTab }: Props) {
  const { profile } = useAuth()
  const { stats } = useReports()
  const { indStats } = useIndicators()
  const { distStats } = useDistricts()
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [chartType, setChartType] = useState<'line' | 'radar' | 'tier'>('line')
  const [period, setPeriod] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const generateInsight = async () => {
    setAiLoading(true)
    setAiText('')
    try {
      const prompt = `You are an NBSAP biodiversity monitoring analyst for Rwanda. Generate a concise 3-sentence progress narrative for the NBSAP 2024-2030 dashboard. Current data: Forest cover 27% (target 30%), Wetland restoration 600ha (target 1200ha), 18/20 districts reporting, 5 compliance issues, 1,248 total submissions. Focus on achievements, gaps, and one key recommendation.`
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await resp.json()
      setAiText(data.content?.[0]?.text ?? 'Unable to generate insight.')
    } catch {
      setAiText('AI insight unavailable. Check your API key configuration.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div>
      {/* Date filter bar */}
      <div className="date-filter-bar">
        <label>Period</label>
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="all">All Time</option>
          <option value="q1-2025">Q1 2025</option>
          <option value="q2-2025">Q2 2025</option>
          <option value="q3-2025">Q3 2025</option>
          <option value="q4-2025">Q4 2025</option>
          <option value="q1-2026">Q1 2026</option>
        </select>
        <div className="date-filter-divider" />
        <label>From</label>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <label>To</label>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <div className="date-filter-divider" />
        <span className="date-filter-badge">● Live Data</span>
      </div>

      {/* AI Narrative */}
      <div className="ai-panel mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <span style={{ fontWeight: 700, fontSize: '.9rem' }}>AI Progress Narrative</span>
            <span style={{ fontSize: '.65rem', padding: '2px 7px', borderRadius: 10, background: 'rgba(56,189,248,.2)', color: '#7dd3fc', fontFamily: "'DM Mono',monospace" }}>Claude AI</span>
          </div>
          <button className="ai-gen-btn" onClick={generateInsight} disabled={aiLoading}>
            {aiLoading ? <><span className="spinner" />Generating…</> : <>✨ Generate Insight</>}
          </button>
        </div>
        <p style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.6, minHeight: 40 }}>
          {aiText || 'Click "Generate Insight" to produce an AI-powered narrative summary of current NBSAP progress, gaps, and recommendations based on live dashboard data.'}
        </p>
      </div>

      {/* Metric cards */}
      <div className="metrics-grid mb-6">
        <div className="metric-card mc-navy">
          <div className="metric-label">Total Targets</div>
          <div className="metric-value">22</div>
          <div className="metric-sub">KM-GBF Aligned</div>
          <span className="metric-icon">🎯</span>
        </div>
        <div className="metric-card mc-emerald">
          <div className="metric-label">Data Submissions</div>
          <div className="metric-value">{stats?.total ?? 1248}</div>
          <div className="metric-sub">↑ 12% from last month</div>
          <span className="metric-icon">📋</span>
        </div>
        <div className="metric-card mc-sky">
          <div className="metric-label">Active Districts</div>
          <div className="metric-value">{distStats ? `${distStats.submitted}/${distStats.total}` : '18/20'}</div>
          <div className="metric-sub">Reporting this quarter</div>
          <span className="metric-icon">🗺️</span>
        </div>
        <div className="metric-card mc-rose">
          <div className="metric-label">Compliance Issues</div>
          <div className="metric-value">5</div>
          <div className="metric-sub">Requires attention</div>
          <span className="metric-icon">⚖️</span>
        </div>
      </div>

      {/* Access Layers */}
      <div className="mb-6">
        <div className="section-header">
          <div className="section-title">🔐 Dashboard Access Layers</div>
        </div>
        <div className="grid-3">
          {[
            { icon: '🌍', title: 'PUBLIC ACCESS', desc: 'Aggregated national biodiversity indicators, target progress, and public reports', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
            { icon: '🏛️', title: 'INSTITUTIONAL REPORTING', desc: 'T01–T07 toolkit submissions, district data, verification queue, compliance tracking', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
            { icon: '📊', title: 'DECISION-MAKER ANALYTICS', desc: 'AI narratives, risk register, adaptive management triggers, CBD reporting', color: '#6366f1', bg: '#faf5ff', border: '#e9d5ff' },
          ].map(l => (
            <div key={l.title} className="card card-hover" style={{ padding: 18, borderTop: `3px solid ${l.color}`, background: l.bg, borderColor: l.border }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{l.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.78rem', color: l.color, letterSpacing: '.06em', marginBottom: 6 }}>{l.title}</div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.5 }}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Toolkit Stats */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">📡 Live Toolkit Data <span className="section-badge badge-live">LIVE</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {[
            { label: 'Toolkit Reports', value: '1,248', icon: '📋', color: '#0f2744' },
            { label: 'Forest (ha)', value: '847,320', icon: '🌲', color: '#10b981' },
            { label: 'Wetland (ha)', value: '600', icon: '💧', color: '#38bdf8' },
            { label: 'Districts', value: '18/20', icon: '🗺️', color: '#6366f1' },
            { label: 'Finance (RWF M)', value: '12,450', icon: '💰', color: '#f59e0b' },
            { label: 'HWC Incidents', value: '23', icon: '🐘', color: '#f43f5e' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '14px 8px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
              <div style={{ fontSize: '.65rem', color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="grid-2-1 mb-6">
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">📈 Indicator Progress Trends</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['line', 'radar', 'tier'] as const).map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: chartType === t ? '#0f2744' : '#fff', color: chartType === t ? '#fff' : '#475569', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer' }}>
                  {t === 'line' ? 'Line' : t === 'radar' ? 'Radar' : 'By Tier'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 200, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bae6fd' }}>
            📊 {chartType === 'line' ? 'Line Chart' : chartType === 'radar' ? 'Radar Chart' : 'Tier Breakdown'} — Chart.js integration pending
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">🕐 Recent Activity</div>
          </div>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.78rem', fontWeight: 500, color: '#0f172a' }}>{a.msg}</div>
                <div style={{ fontSize: '.68rem', color: '#94a3b8', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Progress */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🎯 NBSAP Target Progress</div>
          <button onClick={() => onSwitchTab('targets22')} style={{ fontSize: '.75rem', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All 22 →</button>
        </div>
        <div className="grid-2">
          {PROGRESS_ITEMS.map(p => {
            const pct = Math.round((p.current / p.target) * 100)
            return (
              <div key={p.label} className="prog-row">
                <div className="prog-header">
                  <span className="prog-label">{p.label}</span>
                  <span className="prog-value">{p.current}{p.unit} / {p.target}{p.unit}</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg,#fefce8,#fef9c3)', border: '1px solid #fde68a' }}>
        <div className="section-title" style={{ marginBottom: 12 }}>💡 System Recommendations</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: '🌿', text: 'Accelerate wetland restoration — currently at 50% of 2030 target', level: 'high' },
            { icon: '📋', text: '2 districts (Gakenke, Rulindo) have not submitted Q1 reports', level: 'med' },
            { icon: '⚖️', text: 'Review 5 open compliance issues before CBD reporting deadline', level: 'med' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: r.level === 'high' ? '#fef2f2' : '#fff7ed', border: `1px solid ${r.level === 'high' ? '#fecaca' : '#fed7aa'}`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem' }}>{r.icon}</span>
              <span style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.5 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
