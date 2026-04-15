import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useData'
import type { TabId } from '../../App'

interface Props {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: React.ReactNode
}

const TAB_TITLES: Record<TabId, string> = {
  'dashboard': 'Monitoring Dashboard',
  'indicators': '4-Tier Indicator Hierarchy',
  'targets22': '22 National Targets',
  'adaptive-mgmt': 'Adaptive Management',
  'reporting-toolkit': 'Reporting Modules (T01–T07)',
  't01': 'T01 · Institutional Report',
  't02': 'T02 · District Biodiversity Report',
  't03': 'T03 · Protected Areas Report',
  't04': 'T04 · Community Report',
  't05': 'T05 · Finance Tracking Report',
  't06': 'T06 · Private Sector Report',
  't07': 'T07 · Research Contribution Report',
  'verif-queue': 'Verification Queue',
  'compliance': 'Compliance & Accountability',
  'risk': 'Risk Register',
  'reports': 'Reports & Documentation',
  'stakeholders': 'Stakeholder Matrix',
  'rbis': 'RBIS Integration',
  'data-pipeline': 'Data Pipeline',
  'map': 'District Map',
}

const TAB_SUBTITLES: Record<TabId, string> = {
  'dashboard': 'National Biodiversity Strategy & Action Plan — Rwanda 2024–2030',
  'indicators': 'KM-GBF Aligned 4-Tier Framework · 79 Indicators',
  'targets22': 'Kunming-Montreal Global Biodiversity Framework Alignment',
  'adaptive-mgmt': 'Evidence-Based Policy Adjustment System',
  'reporting-toolkit': 'Standardized Data Collection Tools T01–T07',
  't01': 'National Institutional Compliance Reporting',
  't02': 'District-Level Biodiversity Monitoring',
  't03': 'Protected Area Ecosystem Integrity',
  't04': 'Community Biodiversity Observations',
  't05': 'Biodiversity Finance Gap Analysis',
  't06': 'Private Sector Environmental Compliance',
  't07': 'Research & Academic Contributions',
  'verif-queue': 'Review and Approve Submitted Reports',
  'compliance': 'Regulatory Compliance Tracking',
  'risk': 'Risk Identification & Mitigation Matrix',
  'reports': 'Generate and Export Official Reports',
  'stakeholders': 'Multi-Stakeholder Engagement Framework',
  'rbis': 'Rwanda Biodiversity Information System',
  'data-pipeline': 'Data Flow Architecture & Integration',
  'map': 'District-Level Spatial Monitoring',
}

export function DashboardShell({ activeTab, onTabChange, children }: Props) {
  const { profile, signOut } = useAuth()
  const { notifications, unreadCount } = useNotifications(profile?.id ?? null)
  const [clock, setClock] = useState('')
  const [lang, setLang] = useState('EN')
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'general' | 'alerts' | 'security' | 'audit'>('general')
  const [settings, setSettings] = useState({
    showLiveStats: true,
    animateProgress: true,
    compactSidebar: false,
    autoRefresh: true,
    showBaseline: true,
    requireVerification: true,
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const isViewer = profile?.role === 'viewer'
  const canVerif = profile?.role === 'admin' || profile?.role === 'sector_officer'

  const nav = (tab: TabId, icon: string, label: string, badge?: string | number) => {
    const active = activeTab === tab
    return (
      <div
        key={tab}
        className={`nav-item${active ? ' active' : ''}`}
        onClick={() => onTabChange(tab)}
      >
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge !== undefined && (
          <span className="nav-badge">{badge}</span>
        )}
      </div>
    )
  }

  const sectionLabel = (text: string) => (
    <div style={{ padding: '14px 18px 4px', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(148,163,184,.5)' }}>
      {text}
    </div>
  )

  const pendingCount = notifications.filter(n => !n.is_read).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🌿</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '.85rem', fontFamily: "'Playfair Display',serif" }}>NBSAP Portal</div>
              <div style={{ color: 'rgba(148,163,184,.6)', fontSize: '.6rem', fontFamily: "'DM Mono',monospace" }}>Rwanda 2024–2030</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
          {sectionLabel('Analytics')}
          {nav('dashboard', '📊', 'Dashboard')}
          {nav('indicators', '📐', 'Indicator Hierarchy')}
          {nav('targets22', '🎯', '22 National Targets', '22')}
          {nav('adaptive-mgmt', '🔄', 'Adaptive Management')}

          {!isViewer && (
            <>
              {sectionLabel('Reporting Modules')}
              {nav('reporting-toolkit', '🗂️', 'All Modules')}
              {nav('t01', '🏛️', 'T01 · Institutional')}
              {nav('t02', '🌿', 'T02 · District')}
              {nav('t03', '🛡️', 'T03 · Protected Areas')}
              {nav('t04', '👥', 'T04 · Community')}
              {nav('t05', '💰', 'T05 · Finance')}
              {nav('t06', '🏗️', 'T06 · Private Sector')}
              {nav('t07', '🔬', 'T07 · Research')}
            </>
          )}

          {sectionLabel('Governance')}
          {canVerif && nav('verif-queue', '✅', 'Verification Queue', pendingCount > 0 ? pendingCount : undefined)}
          {nav('compliance', '⚖️', 'Compliance', '5')}
          {nav('risk', '⚠️', 'Risk Register')}
          {nav('reports', '📋', 'Reports')}
          {nav('stakeholders', '👥', 'Stakeholders')}

          {sectionLabel('System')}
          {nav('rbis', '🗄️', 'RBIS Integration')}
          {nav('data-pipeline', '🔀', 'Data Pipeline')}
          {nav('map', '🗺️', 'District Map')}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '.68rem', color: 'rgba(125,211,252,.6)', fontFamily: "'DM Mono',monospace" }}>System Online</span>
          </div>
          <div className="storage-bar-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Storage</span><span>2.4 / 10 GB</span>
            </div>
            <div className="storage-track">
              <div className="storage-fill" style={{ width: '24%', background: 'linear-gradient(90deg,#38bdf8,#0ea5e9)' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 248, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(248,250,252,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '.95rem', color: '#0f172a', fontFamily: "'Playfair Display',serif" }}>{TAB_TITLES[activeTab]}</div>
            <div style={{ fontSize: '.68rem', color: '#94a3b8' }}>{TAB_SUBTITLES[activeTab]}</div>
          </div>

          {/* Clock */}
          <div className="live-clock">
            <span style={{ color: '#10b981' }}>●</span>
            {clock}
          </div>

          {/* Lang */}
          <div className="lang-switcher">
            {(['EN', 'FR', 'RW'] as const).map(l => (
              <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifs(v => !v); setShowSettings(false) }}
              style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#f43f5e', color: '#fff', fontSize: '.55rem', fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>{unreadCount}</span>
              )}
            </button>
            {showNotifs && (
              <div style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(0,0,0,.14)', zIndex: 300 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '.85rem' }}>Notifications</span>
                  <span style={{ fontSize: '.68rem', color: '#0ea5e9', cursor: 'pointer' }}>Mark all read</span>
                </div>
                {[
                  { icon: '⚠️', title: 'Compliance Alert', msg: 'EIA documentation missing for 3 projects', time: '2m ago', type: 'warn' },
                  { icon: '✅', title: 'Report Approved', msg: 'T02 District Report — Musanze approved', time: '18m ago', type: 'success' },
                  { icon: '📋', title: 'New Submission', msg: 'T01 Institutional Report submitted by MINEMA', time: '1h ago', type: 'info' },
                  { icon: '🎯', title: 'Target Update', msg: 'Forest cover indicator updated to 27.3%', time: '3h ago', type: 'info' },
                ].map((n, i) => (
                  <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: 10, cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.1rem' }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.78rem' }}>{n.title}</div>
                      <div style={{ fontSize: '.72rem', color: '#64748b', marginTop: 2 }}>{n.msg}</div>
                      <div style={{ fontSize: '.65rem', color: '#94a3b8', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => { setShowSettings(v => !v); setShowNotifs(false) }}
            style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >⚙️</button>

          {/* Export */}
          <button style={{ padding: '7px 14px', background: 'linear-gradient(135deg,#0f2744,#1e3a5f)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            ↓ Export
          </button>

          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={signOut}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0f2744,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.65rem', fontWeight: 700 }}>
              {profile?.full_name?.slice(0, 2).toUpperCase() ?? 'U'}
            </div>
            <div>
              <div style={{ fontSize: '.75rem', fontWeight: 600, color: '#0f172a' }}>{profile?.full_name ?? 'User'}</div>
              <div style={{ fontSize: '.6rem', color: '#94a3b8' }}>{profile?.role ?? ''}</div>
            </div>
          </div>
        </header>

        {/* Settings Modal */}
        {showSettings && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowSettings(false)}>
            <div style={{ background: '#fff', borderRadius: 16, width: 520, maxHeight: '80vh', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>⚙️ Settings</span>
                <button onClick={() => setShowSettings(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              </div>
              <div className="subtab-bar" style={{ padding: '0 24px' }}>
                {(['general', 'alerts', 'security', 'audit'] as const).map(t => (
                  <button key={t} className={`subtab${settingsTab === t ? ' active' : ''}`} onClick={() => setSettingsTab(t)}>
                    {t === 'general' ? 'General' : t === 'alerts' ? 'Alerts & Notifications' : t === 'security' ? 'Data Security' : 'Audit Log'}
                  </button>
                ))}
              </div>
              <div style={{ padding: '16px 24px', overflowY: 'auto', maxHeight: 400 }}>
                {settingsTab === 'general' && (
                  <>
                    {([
                      ['showLiveStats', 'Show Live Toolkit Stats', 'Display real-time data from toolkit submissions'],
                      ['animateProgress', 'Animate Progress Bars', 'Enable smooth animations on progress indicators'],
                      ['compactSidebar', 'Compact Sidebar', 'Reduce sidebar padding for more screen space'],
                      ['autoRefresh', 'Auto-refresh Dashboard', 'Refresh data every 5 minutes automatically'],
                      ['showBaseline', 'Show Baseline Data', 'Display 2020 baseline values alongside current data'],
                      ['requireVerification', 'Require Verification', 'All submissions require admin approval before publishing'],
                    ] as [keyof typeof settings, string, string][]).map(([key, label, desc]) => (
                      <div key={key} className="settings-row">
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '.83rem' }}>{label}</div>
                          <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                        </div>
                        <label className="toggle">
                          <input type="checkbox" checked={settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.checked }))} />
                          <span className="toggle-track" />
                        </label>
                      </div>
                    ))}
                  </>
                )}
                {settingsTab === 'alerts' && (
                  <div style={{ color: '#64748b', fontSize: '.83rem', padding: '12px 0' }}>Alert & notification preferences are managed per-user in your profile settings.</div>
                )}
                {settingsTab === 'security' && (
                  <div style={{ color: '#64748b', fontSize: '.83rem', padding: '12px 0' }}>Data security settings including species location fuzzing and export restrictions.</div>
                )}
                {settingsTab === 'audit' && (
                  <div style={{ color: '#64748b', fontSize: '.83rem', padding: '12px 0' }}>Audit log viewer — all system actions are recorded automatically.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
