import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useData'

export function VerifQueue() {
  const { profile } = useAuth()
  const { reports, stats, loading, verifyReport, refresh } = useReports({ status: 'pending' })
  const [noteModal, setNoteModal] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null)
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [filterTool, setFilterTool] = useState('all')

  const allReports = useReports()
  const pending = allReports.reports.filter(r => r.status === 'pending').length
  const approved = allReports.reports.filter(r => r.status === 'approved').length
  const rejected = allReports.reports.filter(r => r.status === 'rejected').length

  const handleVerify = async (id: string, decision: 'approved' | 'rejected', reviewNote?: string) => {
    if (!profile) return
    setProcessing(id)
    try {
      await verifyReport(id, decision, profile.id, reviewNote)
    } finally {
      setProcessing(null)
      setNoteModal(null)
      setNote('')
    }
  }

  const displayReports = reports.filter(r => filterTool === 'all' || r.tool_id === filterTool)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700 }}>Verification Queue</h2>
          <p style={{ fontSize: '.78rem', color: '#94a3b8', marginTop: 2 }}>Review and approve submitted toolkit reports</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-select" value={filterTool} onChange={e => setFilterTool(e.target.value)}>
            <option value="all">All Tools</option>
            {['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={refresh} style={{ padding: '7px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="metrics-grid mb-6">
        <div className="metric-card mc-amber">
          <div className="metric-label">Pending Review</div>
          <div className="metric-value">{pending}</div>
          <div className="metric-sub">Awaiting decision</div>
          <span className="metric-icon">⏳</span>
        </div>
        <div className="metric-card mc-emerald">
          <div className="metric-label">Approved</div>
          <div className="metric-value">{approved}</div>
          <div className="metric-sub">This period</div>
          <span className="metric-icon">✅</span>
        </div>
        <div className="metric-card mc-rose">
          <div className="metric-label">Rejected</div>
          <div className="metric-value">{rejected}</div>
          <div className="metric-sub">Returned for revision</div>
          <span className="metric-icon">❌</span>
        </div>
        <div className="metric-card mc-navy">
          <div className="metric-label">Total Submissions</div>
          <div className="metric-value">{allReports.reports.length}</div>
          <div className="metric-sub">All time</div>
          <span className="metric-icon">📋</span>
        </div>
      </div>

      {/* Queue */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{ width: 24, height: 24, borderColor: 'rgba(15,39,68,.2)', borderTopColor: '#0f2744', margin: '0 auto 12px' }} />
          <p>Loading submissions…</p>
        </div>
      ) : displayReports.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Queue is clear</div>
          <div style={{ fontSize: '.78rem' }}>No pending submissions to review</div>
        </div>
      ) : (
        displayReports.map(r => (
          <div key={r.id} className="verif-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '.72rem', fontWeight: 700, padding: '2px 7px', background: '#e0f2fe', color: '#0369a1', borderRadius: 6 }}>{r.tool_id}</span>
                  <span style={{ fontWeight: 600, fontSize: '.85rem' }}>{r.tool_name}</span>
                  <span className="status-pending" style={{ marginLeft: 'auto' }}>⏳ Pending</span>
                </div>
                <div style={{ fontSize: '.78rem', color: '#475569', marginBottom: 4 }}>
                  Submitted by <strong>{r.submitter?.full_name ?? r.submitted_by}</strong>
                  {r.district_name && <> · District: <strong>{r.district_name}</strong></>}
                  {r.period && <> · Period: <strong>{r.period}</strong></>}
                </div>
                <div style={{ fontSize: '.72rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Key data preview */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {r.institution && <span style={{ fontSize: '.72rem', padding: '2px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, color: '#475569' }}>🏛️ {r.institution}</span>}
              {r.forest_ha && <span style={{ fontSize: '.72rem', padding: '2px 8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, color: '#166534' }}>🌲 {r.forest_ha} ha forest</span>}
              {r.wetland_ha && <span style={{ fontSize: '.72rem', padding: '2px 8px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, color: '#0369a1' }}>💧 {r.wetland_ha} ha wetland</span>}
              {r.budget_utilized && <span style={{ fontSize: '.72rem', padding: '2px 8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, color: '#854d0e' }}>💰 RWF {r.budget_utilized?.toLocaleString()}</span>}
              {r.attachments?.length > 0 && <span style={{ fontSize: '.72rem', padding: '2px 8px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 6, color: '#6b21a8' }}>📎 {r.attachments.length} attachment{r.attachments.length !== 1 ? 's' : ''}</span>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="verif-btn verif-btn-approve"
                disabled={processing === r.id}
                onClick={() => handleVerify(r.id, 'approved')}
              >
                {processing === r.id ? '…' : '✓ Approve'}
              </button>
              <button
                className="verif-btn verif-btn-reject"
                disabled={processing === r.id}
                onClick={() => setNoteModal({ id: r.id, action: 'rejected' })}
              >
                ✕ Reject
              </button>
              <button
                className="verif-btn verif-btn-info"
                onClick={() => setNoteModal({ id: r.id, action: 'approved' })}
              >
                💬 Add Note
              </button>
            </div>
          </div>
        ))
      )}

      {/* Note Modal */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNoteModal(null)}>
          <div style={{ background: '#fff', borderRadius: 14, width: 420, padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 14 }}>
              {noteModal.action === 'rejected' ? '❌ Reject Submission' : '💬 Add Review Note'}
            </div>
            <textarea
              className="form-textarea"
              placeholder={noteModal.action === 'rejected' ? 'Reason for rejection (required)…' : 'Optional note for submitter…'}
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ width: '100%', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setNoteModal(null)} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => handleVerify(noteModal.id, noteModal.action, note)}
                disabled={noteModal.action === 'rejected' && !note.trim()}
                style={{ padding: '8px 16px', background: noteModal.action === 'rejected' ? '#f43f5e' : '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {noteModal.action === 'rejected' ? 'Confirm Reject' : 'Save Note & Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
