import React, { useState } from 'react'

const FEEDBACK_STEPS = [
  { icon: '📊', title: 'Monitor', desc: 'Continuous data collection via T01–T07 toolkit and RBIS real-time feeds', color: '#0f2744' },
  { icon: '📈', title: 'Analyze', desc: 'AI-powered trend analysis, threshold detection, and gap identification', color: '#0ea5e9' },
  { icon: '⚡', title: 'Trigger', desc: 'Automated alerts when indicators cross critical or warning thresholds', color: '#f59e0b' },
  { icon: '🏛️', title: 'Decide', desc: 'Evidence-based policy recommendations presented to decision-makers', color: '#10b981' },
  { icon: '🔄', title: 'Adapt', desc: 'NBSAP strategy adjustments, resource reallocation, target recalibration', color: '#6366f1' },
]

const TRIGGERS = [
  { level: 'Critical', icon: '🔴', desc: 'Indicator drops >15% below trajectory', action: 'Immediate ministerial briefing + emergency resource allocation', examples: ['Forest cover <25%', 'Wetland loss >200ha/yr', 'Species extinction event'], color: '#f43f5e', bg: '#fef2f2', border: '#fecaca' },
  { level: 'Warning', icon: '🟡', desc: 'Indicator 5–15% below trajectory', action: 'Quarterly review escalation + corrective action plan', examples: ['EIA compliance <80%', 'District reporting <70%', 'Finance gap >40%'], color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { level: 'On Track', icon: '🟢', desc: 'Indicator within 5% of trajectory', action: 'Routine monitoring, no escalation required', examples: ['Forest cover 27–30%', 'Species plans >90%', 'Compliance >85%'], color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
]

const FUNCTIONS = [
  { icon: '🎯', title: 'Target Recalibration', desc: 'Adjust 2030 targets based on mid-term evidence and changed conditions' },
  { icon: '💰', title: 'Resource Reallocation', desc: 'Redirect biodiversity finance to highest-impact interventions' },
  { icon: '📋', title: 'Policy Adjustment', desc: 'Recommend regulatory changes based on compliance data' },
  { icon: '🤝', title: 'Stakeholder Engagement', desc: 'Trigger targeted engagement when district performance drops' },
  { icon: '🔬', title: 'Research Commissioning', desc: 'Identify knowledge gaps and commission targeted studies' },
  { icon: '🌍', title: 'CBD Alignment', desc: 'Ensure adaptive changes maintain KM-GBF alignment' },
]

const TIMELINE = [
  { period: 'Quarterly', label: 'Q1–Q4', desc: 'T01–T04 data review, compliance check, district performance ranking', color: '#0ea5e9' },
  { period: 'Annual', label: 'Dec', desc: 'Full indicator assessment, AI narrative, stakeholder report, budget review', color: '#10b981' },
  { period: 'Mid-term', label: '2027', desc: 'Comprehensive NBSAP review, target recalibration, CBD preparation', color: '#f59e0b' },
  { period: 'Final', label: '2030', desc: 'Terminal evaluation, CBD 9th National Report, lessons learned', color: '#6366f1' },
]

export function AdaptiveMgmt() {
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const generateBrief = async () => {
    setAiLoading(true)
    setAiText('')
    try {
      const prompt = `You are an NBSAP adaptive management specialist for Rwanda. Generate a concise 3-sentence decision brief for the adaptive management dashboard. Current status: Forest cover 27% (target 30%), 2 districts not reporting, 5 compliance issues, wetland restoration at 50% of target. Identify the top adaptive management action needed.`
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
      setAiText(data.content?.[0]?.text ?? 'Unable to generate brief.')
    } catch {
      setAiText('AI brief unavailable. Check your API key configuration.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div>
      {/* AI Decision Brief */}
      <div className="ai-panel mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>🧠</span>
            <span style={{ fontWeight: 700, fontSize: '.9rem' }}>AI Decision Brief</span>
            <span style={{ fontSize: '.65rem', padding: '2px 7px', borderRadius: 10, background: 'rgba(56,189,248,.2)', color: '#7dd3fc', fontFamily: "'DM Mono',monospace" }}>Claude AI</span>
          </div>
          <button className="ai-gen-btn" onClick={generateBrief} disabled={aiLoading}>
            {aiLoading ? <><span className="spinner" />Generating…</> : <>🧠 Generate Brief</>}
          </button>
        </div>
        <p style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.6, minHeight: 40 }}>
          {aiText || 'Click "Generate Brief" to produce an AI-powered adaptive management decision brief based on current indicator performance and threshold analysis.'}
        </p>
      </div>

      {/* Feedback Loop */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">🔄 Monitoring-to-Policy Feedback Loop</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {FEEDBACK_STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              <div style={{ flex: 1, minWidth: 110, textAlign: 'center', padding: '16px 8px', background: `${step.color}12`, borderRadius: 10, border: `2px solid ${step.color}25` }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{step.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.78rem', color: step.color, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: '.65rem', color: '#94a3b8', lineHeight: 1.4 }}>{step.desc}</div>
              </div>
              {i < FEEDBACK_STEPS.length - 1 && (
                <div style={{ fontSize: '1.4rem', color: '#cbd5e1', padding: '0 6px', flexShrink: 0 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Trigger Levels */}
      <div className="grid-3 mb-6">
        {TRIGGERS.map(t => (
          <div key={t.level} style={{ padding: 18, borderRadius: 12, background: t.bg, border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '.9rem', color: t.color }}>{t.level}</span>
            </div>
            <div style={{ fontSize: '.75rem', color: '#475569', marginBottom: 8, lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ fontSize: '.72rem', color: '#64748b', marginBottom: 10, fontStyle: 'italic' }}>→ {t.action}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {t.examples.map(e => (
                <span key={e} style={{ fontSize: '.65rem', padding: '2px 7px', borderRadius: 6, background: 'rgba(0,0,0,.06)', color: t.color, fontFamily: "'DM Mono',monospace" }}>{e}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Decision Support Functions */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">⚙️ Decision Support Functions</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {FUNCTIONS.map(f => (
            <div key={f.title} style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.82rem', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: '.72rem', color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-header">
          <div className="section-title">📅 Reporting & Evaluation Timeline</div>
        </div>
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }} />
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 20, paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%', background: t.color, border: '2px solid #fff', boxShadow: `0 0 0 2px ${t.color}` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', fontWeight: 700, color: t.color, background: `${t.color}15`, padding: '2px 8px', borderRadius: 6 }}>{t.period}</span>
                <span style={{ fontWeight: 700, fontSize: '.82rem' }}>{t.label}</span>
              </div>
              <div style={{ fontSize: '.75rem', color: '#475569', lineHeight: 1.5 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
