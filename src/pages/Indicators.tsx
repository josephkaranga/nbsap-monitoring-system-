// src/pages/Indicators.tsx
import React, { useState, useEffect } from 'react'
import { useIndicators } from '../hooks/useData'
import type { IndicatorTier, IndicatorStatus, Indicator } from '../types/database'

interface Props {
  linkedIndicatorId?: string | null
  onClearLink?: () => void
}

export default function Indicators({ linkedIndicatorId, onClearLink }: Props) {
  const [tierFilter, setTierFilter] = useState<IndicatorTier | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null)
  const { indicators, indStats, loading } = useIndicators({ tier: tierFilter, search })

  // Auto-open modal when navigated from Targets22
  useEffect(() => {
    if (linkedIndicatorId && indicators.length > 0) {
      const ind = indicators.find(i => i.id === linkedIndicatorId)
      if (ind) { setSelectedIndicator(ind); onClearLink?.() }
    }
  }, [linkedIndicatorId, indicators, onClearLink])

  const tierColors: Record<IndicatorTier, { bg: string; text: string; border: string }> = {
    headline: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    component: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
    binary: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
    diagnostic: { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' },
  }
  const statusColors: Record<IndicatorStatus, string> = {
    'on-track': '#10b981', 'at-risk': '#f59e0b', 'behind': '#f43f5e'
  }

  return (
    <div>
      {/* Tier summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { tier: 'headline' as IndicatorTier, label: 'Headline', count: indStats?.byTier.headline ?? 14, desc: 'Global commitments' },
          { tier: 'component' as IndicatorTier, label: 'Complementary', count: indStats?.byTier.component ?? 6, desc: 'National priorities' },
          { tier: 'binary' as IndicatorTier, label: 'Country-Specific', count: indStats?.byTier.binary ?? 2, desc: "Rwanda's ecology" },
          { tier: 'diagnostic' as IndicatorTier, label: 'Diagnostic', count: indStats?.byTier.diagnostic ?? 0, desc: 'Adaptive management' },
        ].map(s => (
          <button
            key={s.tier}
            onClick={() => setTierFilter(tierFilter === s.tier ? undefined : s.tier)}
            style={{
              background: tierFilter === s.tier ? tierColors[s.tier].bg : '#fff',
              border: `${tierFilter === s.tier ? '2px' : '1px'} solid ${tierColors[s.tier].border}`,
              borderRadius: '12px', padding: '16px', textAlign: 'center',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: tierColors[s.tier].text }}>{s.count}</div>
            <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 2px' }}>{s.label}</div>
            <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Status summary */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #0ea5e9', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'On Track', val: indStats?.onTrack ?? '—', color: '#10b981' },
          { label: 'At Risk', val: indStats?.atRisk ?? '—', color: '#f59e0b' },
          { label: 'Behind', val: indStats?.behind ?? '—', color: '#f43f5e' },
          { label: 'Avg Progress', val: `${indStats?.avgProgress ?? '—'}%`, color: '#0ea5e9' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
        <input
          type="text" placeholder="Search indicators…" value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: '320px', padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'inherit', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[undefined, 'headline', 'component', 'binary'].map((t, i) => (
            <button
              key={i}
              onClick={() => setTierFilter(t as IndicatorTier | undefined)}
              style={{
                padding: '5px 12px', borderRadius: '20px', border: '1px solid #e2e8f0',
                fontSize: '.75rem', fontWeight: 600, cursor: 'pointer',
                background: tierFilter === t ? '#0f2744' : '#fff',
                color: tierFilter === t ? '#fff' : '#475569',
                fontFamily: 'inherit',
              }}
            >{t ? (t.charAt(0).toUpperCase() + t.slice(1)) : 'All'}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          📐 Complete List of NBSAP Indicators {!loading && <span style={{ fontSize: '.7rem', color: '#94a3b8', fontWeight: 400, fontFamily: "'DM Mono',monospace" }}>({indicators.length} shown)</span>}
        </div>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading indicators from Supabase…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['#', 'Indicator', 'Tier', 'Target 2030', 'Frequency', 'Progress', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {indicators.map(ind => {
                  const tc = tierColors[ind.tier]
                  const progColor = statusColors[ind.status]
                  return (
                    <tr key={ind.id} onClick={() => setSelectedIndicator(ind)} style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: '.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                      <td style={{ padding: '11px 14px', fontWeight: 700, color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>{String(ind.sequence_no).padStart(2, '0')}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 600, maxWidth: '220px' }}>{ind.name}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '.63rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: tc.bg, color: tc.text }}>{ind.tier}</span>
                      </td>
                      <td style={{ padding: '11px 14px', color: '#475569', fontSize: '.77rem', maxWidth: '140px' }}>{ind.target_2030}</td>
                      <td style={{ padding: '11px 14px', color: '#94a3b8', fontSize: '.72rem', fontFamily: "'DM Mono',monospace" }}>{ind.periodicity}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '64px', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${ind.progress_pct}%`, height: '100%', background: `linear-gradient(90deg,#0ea5e9,#38bdf8)`, borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '.75rem', fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{ind.progress_pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: '.63rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: `${progColor}22`, color: progColor }}>{ind.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedIndicator && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,39,68,.6)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedIndicator(null) }}
        >
          <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 24px 64px rgba(0,0,0,.2)', width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>#{selectedIndicator.sequence_no} – {selectedIndicator.name}</h3>
              <button onClick={() => setSelectedIndicator(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '.85rem' }}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[
                  { label: 'Definition', val: selectedIndicator.definition },
                  { label: 'Target 2030', val: selectedIndicator.target_2030 },
                  { label: 'Data Source', val: selectedIndicator.data_source ?? '—' },
                  { label: 'Reporting Frequency', val: selectedIndicator.periodicity ?? '—' },
                ].map(f => (
                  <div key={f.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginBottom: '6px' }}>{f.label}</div>
                    <div style={{ fontSize: '.82rem', color: '#475569', lineHeight: 1.5 }}>{f.val}</div>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div style={{ background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', borderRadius: '12px', padding: '18px', color: '#fff', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '.82rem', fontWeight: 600 }}>Overall Progress</span>
                  <span style={{ fontSize: '.72rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 700, fontFamily: "'DM Mono',monospace", background: `${statusColors[selectedIndicator.status]}33`, color: statusColors[selectedIndicator.status] }}>{selectedIndicator.status}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: '6px', height: '10px', marginBottom: '8px' }}>
                  <div style={{ background: '#38bdf8', width: `${selectedIndicator.progress_pct}%`, height: '10px', borderRadius: '6px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', opacity: .8 }}>
                  <span>Baseline: <strong style={{ color: '#fff' }}>{selectedIndicator.baseline ?? '—'}</strong></span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>{selectedIndicator.progress_pct}%</span>
                  <span>Target: <strong style={{ color: '#fff' }}>{selectedIndicator.target_2030}</strong></span>
                </div>
              </div>
              {/* Milestones */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {[
                  { label: 'Baseline 2025', val: selectedIndicator.baseline ?? '—', style: {} },
                  { label: 'Mid-term 2027', val: selectedIndicator.midterm_2027 ?? '—', style: { background: '#dbeafe', color: '#1e40af' } },
                  { label: 'Final 2030', val: selectedIndicator.target_2030, style: { background: '#dcfce7', color: '#166534' } },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', padding: '14px', borderRadius: '10px', background: '#f8fafc', ...m.style }}>
                    <div style={{ fontSize: '.65rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: "'DM Mono',monospace", opacity: .7 }}>{m.label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '14px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '.72rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
                KM-GBF: {selectedIndicator.km_gbf_ref ?? '—'} · NBSAP: {selectedIndicator.nbsap_target ?? '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
