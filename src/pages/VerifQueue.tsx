// src/pages/VerifQueue.tsx
// ============================================================
// Verification queue — approve / reject toolkit submissions
// Real-time updates via Supabase channel
// ============================================================

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { reportsService } from '../services/reports.service'
import { supabase } from '../lib/supabase'
import type { Report } from '../types/database'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

const TOOL_ICONS: Record<string, string> = {
  T01: '🏛️', T02: '🌿', T03: '🛡️', T04: '👥', T05: '💰', T06: '🏗️', T07: '🔬'
}
const TOOL_COLORS: Record<string, string> = {
  T01: '#4CA3DD', T02: '#4CBB7F', T03: '#9C78E0',
  T04: '#F0A030', T05: '#1ABC9C', T06: '#E74C3C', T07: '#2E86C1'
}

// Key fields to display per tool
const PREVIEW_FIELDS: Record<string, string[]> = {
  T01: ['institution', 'nbsap_target', 'period', 'current_status'],
  T02: ['district_name', 'officer_name', 'period', 'forest_ha', 'wetland_ha'],
  T03: ['area_name', 'agency', 'period', 'species_trend'],
  T04: ['community', 'reporter_name', 'period', 'hwc_incidents'],
  T05: ['institution', 'fiscal_year', 'budget_allocated', 'budget_disbursed'],
  T06: ['company', 'sector', 'reporting_year', 'eia_compliance'],
  T07: ['research_institution', 'study_title', 'year_completed', 'ecosystem_assessed'],
}

export default function VerifQueue() {
  const { profile } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [all, filtered] = await Promise.all([
        reportsService.getAll({}),
        reportsService.getAll({ status: filter === 'all' ? undefined : filter as any }),
      ])
      setCounts({
        pending: all.filter(r => r.status === 'pending').length,
        approved: all.filter(r => r.status === 'approved').length,
        rejected: all.filter(r => r.status === 'rejected').length,
        total: all.length,
      })
      setReports(filter === 'all' ? all : filtered)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  // Real-time subscription
  useEffect(() => {
    const channel = reportsService.subscribeToReports(() => load())
    return () => { supabase.removeChannel(channel) }
  }, [load])

  const handleVerify = async (reportId: string, decision: 'approved' | 'rejected' | 'pending') => {
    if (!profile) return
    setActionLoading(reportId)
    try {
      const note = reviewNotes[reportId] ?? ''
      await reportsService.verify(reportId, decision, profile.id, note)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  const StatusPill = ({ status }: { status: string }) => {
    const styles: Record<string, { bg: string; color: string; label: string; icon: string }> = {
      pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending', icon: '⏳' },
      approved: { bg: '#dcfce7', color: '#166534', label: 'Approved', icon: '✓' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected', icon: '✕' },
      draft: { bg: '#f1f5f9', color: '#475569', label: 'Draft', icon: '✏️' },
    }
    const s = styles[status] ?? styles.draft
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '.68rem', fontWeight: 700, fontFamily: "'DM Mono',monospace",
        padding: '3px 9px', borderRadius: '10px',
        background: s.bg, color: s.color,
      }}>{s.icon} {s.label}</span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✅ Verification Queue
          {counts.pending > 0 && (
            <span style={{ background: '#f59e0b', color: '#fff', fontSize: '.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              {counts.pending} pending
            </span>
          )}
        </h2>
        <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0 }}>
          Review and approve or reject toolkit submissions before they update live dashboard metrics.
          Only approved records influence indicator calculations.
        </p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { id: 'pending', label: 'PENDING', val: counts.pending, color: '#f59e0b' },
          { id: 'approved', label: 'APPROVED', val: counts.approved, color: '#10b981' },
          { id: 'rejected', label: 'REJECTED', val: counts.rejected, color: '#f43f5e' },
          { id: 'all', label: 'TOTAL', val: counts.total, color: '#0ea5e9' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id as FilterStatus)}
            style={{
              background: filter === s.id ? '#fff' : '#f8fafc',
              border: `${filter === s.id ? '2px' : '1px'} solid ${filter === s.id ? s.color : '#e2e8f0'}`,
              borderRadius: '12px', padding: '14px', textAlign: 'center',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '3px' }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filter + refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as FilterStatus)}
          style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'inherit', outline: 'none' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={load}
          style={{ padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', background: '#fff', fontFamily: 'inherit' }}
        >↻ Refresh</button>
        <span style={{ marginLeft: 'auto', fontSize: '.72rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
          {reports.length} record{reports.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Queue list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
          Loading submissions…
        </div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
          <p style={{ fontSize: '.85rem' }}>No submissions match this filter.</p>
        </div>
      ) : (
        reports.map(r => {
          const previewKeys = PREVIEW_FIELDS[r.tool_id] ?? []
          const isPending = r.status === 'pending'
          const isLoading = actionLoading === r.id

          return (
            <div key={r.id} style={{
              background: '#fff',
              borderRadius: '12px',
              border: `1.5px solid ${isPending ? '#fed7aa' : '#e2e8f0'}`,
              padding: '16px', marginBottom: '12px',
              transition: 'box-shadow .2s',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{TOOL_ICONS[r.tool_id]}</span>
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#0f172a' }}>{r.tool_name}</div>
                    <div style={{ fontSize: '.7rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
                      Submitted {new Date(r.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {(r as any).submitter?.full_name ? ` · ${(r as any).submitter.full_name}` : ''}
                      {r.reviewed_by && (r as any).reviewer ? ` · Reviewed by ${(r as any).reviewer.full_name}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusPill status={r.status} />
                  <span style={{ fontSize: '.68rem', fontFamily: "'DM Mono',monospace", color: '#94a3b8' }}>
                    #{r.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Preview fields */}
              {previewKeys.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {previewKeys.map(key => {
                    const val = (r as any)[key]
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    return (
                      <div key={key} style={{ background: '#f8fafc', borderRadius: '7px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: "'DM Mono',monospace", marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-word' }}>
                          {val !== null && val !== undefined ? String(val) : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Attachments */}
              {r.attachments && (r.attachments as any[]).length > 0 && (
                <div style={{ marginBottom: '10px', fontSize: '.75rem', color: '#64748b' }}>
                  📎 {(r.attachments as any[]).map((a: any) => a.file_name).join(', ')}
                </div>
              )}

              {/* Reviewer note + actions */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Reviewer note (optional)…"
                  value={reviewNotes[r.id] ?? r.review_note ?? ''}
                  onChange={e => setReviewNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid #e2e8f0', borderRadius: '7px',
                    fontSize: '.78rem', fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {isPending ? (
                  <>
                    <button
                      onClick={() => handleVerify(r.id, 'approved')}
                      disabled={isLoading}
                      style={{
                        padding: '7px 16px', borderRadius: '8px',
                        background: isLoading ? '#d1fae5' : '#dcfce7', color: '#166534',
                        border: 'none', fontSize: '.78rem', fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                        transition: '.15s',
                      }}
                    >{isLoading ? '⏳' : '✓ Approve'}</button>
                    <button
                      onClick={() => handleVerify(r.id, 'rejected')}
                      disabled={isLoading}
                      style={{
                        padding: '7px 16px', borderRadius: '8px',
                        background: '#fee2e2', color: '#991b1b',
                        border: 'none', fontSize: '.78rem', fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                      }}
                    >✕ Reject</button>
                    <button
                      onClick={() => handleVerify(r.id, 'pending')}
                      disabled={isLoading}
                      style={{
                        padding: '7px 16px', borderRadius: '8px',
                        background: '#f1f5f9', color: '#475569',
                        border: 'none', fontSize: '.78rem', fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                      }}
                    >💬 Save Note</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleVerify(r.id, r.status === 'approved' ? 'rejected' : 'approved')}
                      disabled={isLoading}
                      style={{
                        padding: '7px 14px', borderRadius: '8px',
                        background: '#f1f5f9', color: '#475569',
                        border: 'none', fontSize: '.78rem', fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                      }}
                    >↩ {r.status === 'approved' ? 'Revoke' : 'Reinstate'}</button>
                    <button
                      onClick={() => handleVerify(r.id, r.status as any)}
                      disabled={isLoading}
                      style={{
                        padding: '7px 14px', borderRadius: '8px',
                        background: '#f1f5f9', color: '#475569',
                        border: 'none', fontSize: '.78rem', fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                      }}
                    >💬 Update Note</button>
                  </>
                )}
                {r.review_note && (
                  <span style={{ fontSize: '.72rem', color: '#64748b', marginLeft: '8px', fontStyle: 'italic' }}>
                    Note: {r.review_note}
                  </span>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
