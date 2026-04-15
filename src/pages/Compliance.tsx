import React from 'react'
import type { TabId } from '../App'

interface Props { onSwitchTab: (tab: TabId) => void }

const COMPLIANCE_ITEMS = [
  { label: 'Environmental Impact Assessment (EIA)', pct: 92, color: '#10b981' },
  { label: 'Protected Areas Regulations', pct: 88, color: '#38bdf8' },
  { label: 'Access & Benefit Sharing (ABS)', pct: 75, color: '#f59e0b' },
  { label: 'Species Protection Laws', pct: 68, color: '#f43f5e' },
]

const ISSUES = [
  { level: 'High', icon: '🔴', title: 'EIA Documentation Missing', desc: '3 infrastructure projects in Eastern Province lack valid EIA certificates', action: 'Escalate to REMA enforcement unit', cls: 'issue-high' },
  { level: 'Medium', icon: '🟡', title: 'Late Quarterly Submission', desc: 'T01 reports from MINEMA and MINAGRI overdue by 14 days', action: 'Send automated reminder + escalation', cls: 'issue-med' },
  { level: 'Low', icon: '🟢', title: 'Incomplete Data Fields', desc: 'T04 community reports missing GPS coordinates for 12 observations', action: 'Request data correction from district officers', cls: 'issue-low' },
  { level: 'Low', icon: '🟢', title: 'ABS Protocol Gap', desc: 'Research institution missing benefit-sharing agreement for 2 studies', action: 'Initiate ABS negotiation process', cls: 'issue-low' },
]

export function Compliance({ onSwitchTab }: Props) {
  return (
    <div>
      <div className="grid-2 mb-6">
        {/* Left: Overview */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">⚖️ Compliance Overview</div>
            <span className="section-badge badge-live">Live</span>
          </div>
          {COMPLIANCE_ITEMS.map(c => (
            <div key={c.label} className="comp-bar-wrap">
              <div className="prog-header">
                <span className="prog-label">{c.label}</span>
                <span className="prog-value" style={{ color: c.color }}>{c.pct}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>📈 Compliance Trend</div>
            <div style={{ height: 140, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bbf7d0' }}>
              📊 Trend Chart — Chart.js integration pending
            </div>
          </div>
        </div>

        {/* Right: Issues */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">🚨 Active Issues</div>
            <button onClick={() => onSwitchTab('risk')} style={{ fontSize: '.75rem', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View Risk Register →</button>
          </div>
          {ISSUES.map((issue, i) => (
            <div key={i} className={`issue-card ${issue.cls}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span>{issue.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '.82rem' }}>{issue.title}</span>
                <span className="severity-tag" style={{ marginLeft: 'auto', background: issue.level === 'High' ? '#fee2e2' : issue.level === 'Medium' ? '#ffedd5' : '#fef9c3', color: issue.level === 'High' ? '#991b1b' : issue.level === 'Medium' ? '#9a3412' : '#854d0e' }}>{issue.level}</span>
              </div>
              <div style={{ fontSize: '.75rem', color: '#475569', marginBottom: 6, lineHeight: 1.5 }}>{issue.desc}</div>
              <div style={{ fontSize: '.72rem', color: '#64748b', fontStyle: 'italic' }}>→ {issue.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">📊 Compliance Trend Over Time</div>
        </div>
        <div style={{ height: 180, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bae6fd' }}>
          📈 Multi-line compliance trend chart — Chart.js integration pending
        </div>
      </div>

      {/* Accountability Mechanisms */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🏛️ Accountability Mechanisms</div>
        </div>
        <div className="grid-3">
          {[
            { icon: '📜', title: 'Regulatory Tracking', desc: 'Automated monitoring of EIA, ABS, and species protection compliance across all sectors. Linked to REMA enforcement database.', color: '#0f2744', bg: '#f0f9ff', border: '#bae6fd' },
            { icon: '🏆', title: 'Performance Incentives', desc: 'District compliance scores linked to budget allocation. Top performers receive biodiversity finance priority access.', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
            { icon: '📣', title: 'Grievance Channels', desc: 'Community reporting portal for biodiversity violations. Anonymous submissions processed within 72 hours.', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
          ].map(m => (
            <div key={m.title} style={{ padding: 18, borderRadius: 12, background: m.bg, border: `1px solid ${m.border}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: m.color, marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
