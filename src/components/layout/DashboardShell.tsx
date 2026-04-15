// src/components/layout/DashboardShell.tsx
import React, { useState, useEffect } from 'react'
import type { TabId } from '../../App'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useData'
import { ROLE_PERMISSIONS } from '../../types/database'
import type { UserRole } from '../../types/database'

interface NavItem { id: TabId; label: string; icon: string; section: string; roles?: UserRole[] }

const NAV: NavItem[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Analytics' },
  { id: 'indicators', icon: '📐', label: 'Indicator Hierarchy', section: 'Analytics' },
  { id: 'targets22', icon: '🎯', label: '22 National Targets', section: 'Analytics' },
  { id: 'adaptive-mgmt', icon: '🔄', label: 'Adaptive Management', section: 'Analytics' },
  { id: 'reporting-toolkit', icon: '🗂️', label: 'All Modules', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't01', icon: '🏛️', label: 'T01 · Institutional', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't02', icon: '🌿', label: 'T02 · District', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't03', icon: '🛡️', label: 'T03 · Protected Areas', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't04', icon: '👥', label: 'T04 · Community', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't05', icon: '💰', label: 'T05 · Finance', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't06', icon: '🏢', label: 'T06 · Private Sector', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't07', icon: '🔬', label: 'T07 · Research', section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 'verif-queue', icon: '✅', label: 'Verification Queue', section: 'Governance', roles: ['admin','sector_officer'] },
  { id: 'compliance', icon: '⚖️', label: 'Compliance', section: 'Governance' },
  { id: 'risk', icon: '⚠️', label: 'Risk Register', section: 'Governance' },
  { id: 'reports', icon: '📋', label: 'Reports', section: 'Governance' },
  { id: 'stakeholders', icon: '👥', label: 'Stakeholders', section: 'Governance' },
  { id: 'rbis', icon: '🗄️', label: 'RBIS Integration', section: 'System' },
  { id: 'data-pipeline', icon: '🔀', label: 'Data Pipeline', section: 'System' },
  { id: 'map', icon: '🗺️', label: 'District Map', section: 'System' },
  { id: 'admin', icon: '🛡️', label: 'Admin Panel', section: 'Admin', roles: ['admin'] },
]

const TITLES: Record<TabId, string> = {
  dashboard: 'Monitoring Dashboard', indicators: '4-Tier Indicator Hierarchy',
  targets22: '22 National Targets', 'adaptive-mgmt': 'Adaptive Management',
  'reporting-toolkit': 'Reporting Modules (T01–T07)',
  t01: 'T01 · Institutional Report', t02: 'T02 · District Restoration',
  t03: 'T03 · Protected Areas', t04: 'T04 · Community Data',
  t05: 'T05 · Finance Tracking', t06: 'T06 · Private Sector EIA', t07: 'T07 · Research Data',
  'verif-queue': 'Verification Queue', compliance: 'Compliance & Accountability',
  risk: 'Risk Register', reports: 'Reports & Documentation',
  stakeholders: 'Stakeholder Matrix', rbis: 'RBIS Integration',
  'data-pipeline': 'Data Pipeline', map: 'District Map', admin: 'Administration Panel',
}

interface Props { activeTab: TabId; onTabChange: (t: TabId) => void; children: React.ReactNode }

export function DashboardShell({ activeTab, onTabChange, children }: Props) {
  const { profile, signOut } = useAuth()
  const { notifications, unreadCount, markAllRead } = useNotifications(profile?.id ?? null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const [lang, setLang] = useState('EN')

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  const isViewer = profile?.role === 'viewer'
  const VIEWER_TABS: TabId[] = ['dashboard', 'indicators', 'targets22', 'map']

  const visible = NAV.filter(item => {
    if (isViewer && !VIEWER_TABS.includes(item.id)) return false
    if (!item.roles) return true
    return profile ? item.roles.includes(profile.role) : false
  })

  const sections = [...new Set(visible.map(i => i.section))]

  const badgeCount: Partial<Record<TabId, number>> = { 'verif-queue': 0, compliance: 5 }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '220px', background: 'linear-gradient(175deg,#0f2744 0%,#0c1e38 100%)', zIndex: 200, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 20px rgba(0,0,0,.25)' }}>
        {/* Brand */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>🌿</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: '#fff', fontWeight: 700 }}>NBSAP</div>
            <div style={{ fontSize: '.6rem', color: '#7dd3fc', fontFamily: "'DM Mono',monospace" }}>Monitoring System</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontSize: '.58rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(125,211,252,.45)', padding: '10px 16px 3px', fontFamily: "'DM Mono',monospace" }}>{sec}</div>
              {visible.filter(i => i.section === sec).map(item => (
                <button key={item.id} onClick={() => onTabChange(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 14px',
                  cursor: 'pointer', color: activeTab === item.id ? '#38bdf8' : '#bfdbfe',
                  fontSize: '.78rem', fontWeight: activeTab === item.id ? 700 : 400,
                  background: activeTab === item.id ? 'rgba(56,189,248,.15)' : 'transparent',
                  border: 'none', borderLeft: `3px solid ${activeTab === item.id ? '#38bdf8' : 'transparent'}`,
                  textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s',
                }}>
                  <span style={{ fontSize: '.8rem', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badgeCount[item.id] !== undefined && (
                    <span style={{ background: badgeCount[item.id]! > 0 ? '#f59e0b' : 'rgba(255,255,255,.15)', color: '#fff', fontSize: '.55rem', padding: '1px 5px', borderRadius: '8px', fontWeight: 700 }}>{badgeCount[item.id]}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '8px', padding: '8px 10px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 2px rgba(16,185,129,.3)' }} />
            <div style={{ fontSize: '.65rem', color: '#7dd3fc' }}>
              <strong style={{ display: 'block', color: '#a5f3fc', fontSize: '.67rem' }}>System Online</strong>
              Last sync: {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div style={{ fontSize: '.6rem', color: 'rgba(125,211,252,.4)', fontFamily: "'DM Mono',monospace", marginBottom: '6px' }}>Storage: calculating…</div>
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', background: 'rgba(255,255,255,.04)', borderRadius: '7px', border: '1px solid rgba(255,255,255,.07)' }}>
              <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.6rem', fontWeight: 700, flexShrink: 0 }}>
                {profile.full_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '.7rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.full_name}</div>
                <div style={{ fontSize: '.58rem', color: '#7dd3fc', fontFamily: "'DM Mono',monospace", textTransform: 'uppercase' }}>{profile.role.replace('_',' ')}</div>
              </div>
              <button onClick={signOut} title="Sign out" style={{ background: 'none', border: 'none', color: 'rgba(125,211,252,.5)', cursor: 'pointer', fontSize: '11px', padding: '2px' }}>↩</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header style={{ position: 'sticky', top: 0, background: 'rgba(248,250,252,.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{TITLES[activeTab]}</h2>
            <p style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", margin: '1px 0 0' }}>National Biodiversity Strategy & Action Plan 2025–2030</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Clock */}
            <div style={{ fontSize: '.62rem', fontFamily: "'DM Mono',monospace", color: '#94a3b8', padding: '3px 9px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            {/* Lang */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {['EN','FR','RW'].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: '3px 7px', borderRadius: '5px', border: '1px solid #e2e8f0', fontSize: '.65rem', fontWeight: 600, cursor: 'pointer', background: lang === l ? '#0f2744' : '#fff', color: lang === l ? '#fff' : '#475569', fontFamily: 'inherit' }}>{l}</button>
              ))}
            </div>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '.82rem' }}>🔔</button>
              {unreadCount > 0 && <span style={{ position: 'absolute', top: '-3px', right: '-3px', background: '#f43f5e', color: '#fff', fontSize: '.5rem', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #f8fafc' }}>{unreadCount}</span>}
            </div>
            {/* Export */}
            {!isViewer && <button style={{ padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: '7px', background: '#fff', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#475569' }}>⬇ Export</button>}
            {/* Settings */}
            <button onClick={() => setSettingsOpen(true)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '.82rem' }}>⚙️</button>
            {/* Role badge */}
            {profile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '3px 4px 3px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
                <span style={{ fontSize: '.75rem', fontWeight: 600, color: '#475569' }}>{ROLE_PERMISSIONS[profile.role].label}</span>
                <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.6rem', fontWeight: 700 }}>{ROLE_PERMISSIONS[profile.role].avatar}</div>
              </div>
            )}
          </div>
        </header>

        {/* Notifications drawer */}
        {notifOpen && (
          <div style={{ position: 'fixed', top: '58px', right: '16px', width: '320px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(0,0,0,.14)', zIndex: 400 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '.85rem' }}>Notifications {unreadCount > 0 && <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '.65rem', padding: '1px 6px', borderRadius: '8px', marginLeft: '6px' }}>{unreadCount}</span>}</span>
              <button onClick={markAllRead} style={{ color: '#0ea5e9', fontSize: '.7rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {[
                { icon: '⚠️', title: 'EIA Missing Documentation — Northern Province', time: '1 day ago · High priority', action: '→ Submit T06 Report', color: '#fee2e2' },
                { icon: '🗺️', title: '2 districts have late data submissions for Q4', time: '2 days ago · Medium priority', action: '→ View District Map', color: '#fef9c3' },
                { icon: '📋', title: 'Gender Monitoring Report due in 16 days', time: '3 days ago · Apr 15, 2026', action: '→ View Reports', color: '#e0f2fe' },
                { icon: '✅', title: 'MINAGRI Q4 data submission passed validation', time: '4 days ago', action: '', color: '#dcfce7' },
              ].map((n, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid #f8fafc', background: i === 0 ? '#f0f9ff' : '#fff' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', flexShrink: 0 }}>{n.icon}</div>
                    <div>
                      <p style={{ fontSize: '.75rem', fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{n.title}</p>
                      <p style={{ fontSize: '.68rem', color: '#94a3b8', margin: '0 0 2px' }}>{n.time}</p>
                      {n.action && <p style={{ fontSize: '.68rem', color: '#0ea5e9', margin: 0, fontWeight: 600 }}>{n.action}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings modal */}
        {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

        {/* Page content */}
        <div style={{ padding: '20px 24px', flex: 1 }}>{children}</div>
      </main>
    </div>
  )
}

// ── Settings Modal ─────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'general'|'alerts'|'security'|'audit'>('general')
  const { preferences, updatePreferences } = useAuth()

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff' }}>
          <span style={{ fontWeight: 700, fontSize: '.95rem' }}>⚙️ Dashboard Settings</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 20px' }}>
          {(['general','alerts','security','audit'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 14px', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#0ea5e9' : 'transparent'}`, color: tab === t ? '#0ea5e9' : '#64748b', fontFamily: 'inherit', marginBottom: '-1px', textTransform: 'capitalize' }}>{t === 'audit' ? 'Audit Log' : t === 'alerts' ? 'Alerts & Notifications' : t === 'security' ? 'Data Security' : 'General'}</button>
          ))}
        </div>
        <div style={{ padding: '20px' }}>
          {tab === 'general' && (
            <div>
              <SettingSection title="Display">
                <Toggle label="Show Live Toolkit Stats" desc="Display real-time T01–T07 submission counts on dashboard" checked={preferences?.show_live_stats ?? true} onChange={v => updatePreferences({ show_live_stats: v })} />
                <Toggle label="Animate Progress Bars" desc="Animate bars on tab load" checked={preferences?.animate_progress ?? true} onChange={v => updatePreferences({ animate_progress: v })} />
                <Toggle label="Compact Sidebar" desc="Hide label text, show icons only" checked={preferences?.compact_sidebar ?? false} onChange={v => updatePreferences({ compact_sidebar: v })} />
              </SettingSection>
              <SettingSection title="Data & Reporting">
                <Toggle label="Auto-refresh Dashboard" desc="Refresh metrics every 60 seconds" checked={preferences?.auto_refresh ?? false} onChange={v => updatePreferences({ auto_refresh: v })} />
                <Toggle label="Show Baseline Data on Charts" desc="Include 2025 baseline in trend charts" checked={preferences?.show_baseline ?? true} onChange={v => updatePreferences({ show_baseline: v })} />
                <Toggle label="Require Verification Before Dashboard Update" desc="New toolkit submissions stay pending until approved by REMA reviewer" checked={preferences?.require_verification ?? true} onChange={v => updatePreferences({ require_verification: v })} />
              </SettingSection>
              <div style={{ fontSize: '.65rem', color: '#94a3b8', textAlign: 'center', marginTop: '16px', fontFamily: "'DM Mono',monospace" }}>NBSAP Monitoring System · Rwanda · v2.0 · Powered by Supabase</div>
            </div>
          )}
          {tab === 'alerts' && (
            <div>
              <SettingSection title="Contact Details">
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelSt}>Email Address (for deadline & compliance alerts)</label>
                  <input type="email" defaultValue={preferences?.notif_email ?? ''} style={inputSt} placeholder="officer@rema.gov.rw" />
                </div>
                <div>
                  <label style={labelSt}>SMS / Phone (for critical compliance triggers)</label>
                  <input type="tel" defaultValue={preferences?.notif_sms ?? ''} style={inputSt} placeholder="+250 7XX XXX XXX" />
                </div>
              </SettingSection>
              <SettingSection title="Alert Subscriptions">
                <Toggle label="Overdue District Reports" desc="Alert when districts have not submitted within the reporting window" checked={preferences?.notif_overdue ?? true} onChange={v => updatePreferences({ notif_overdue: v })} />
                <Toggle label="Compliance Below Threshold" desc="Alert when an indicator drops below the warning level" checked={preferences?.notif_compliance ?? true} onChange={v => updatePreferences({ notif_compliance: v })} />
                <Toggle label="Upcoming Report Deadlines" desc="Alert N days before a reporting deadline" checked={preferences?.notif_deadlines ?? true} onChange={v => updatePreferences({ notif_deadlines: v })} />
                <Toggle label="New Submissions Pending Verification" desc="Notify when toolkit submissions are awaiting REMA review" checked={preferences?.notif_pending ?? true} onChange={v => updatePreferences({ notif_pending: v })} />
                <Toggle label="Finance Disbursement Gap" desc="Alert when disbursement falls below allocation by more than 30%" checked={preferences?.notif_finance ?? true} onChange={v => updatePreferences({ notif_finance: v })} />
                <Toggle label="High-Risk Trigger Activated" desc="Alert when a High-level risk in the Risk Register is triggered" checked={preferences?.notif_risk ?? true} onChange={v => updatePreferences({ notif_risk: v })} />
              </SettingSection>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button style={{ flex: 1, padding: '9px', background: '#0f2744', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save Preferences</button>
                <button style={{ flex: 1, padding: '9px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Send Test Alert</button>
              </div>
            </div>
          )}
          {tab === 'security' && (
            <div>
              <SettingSection title="Species Location Privacy">
                <Toggle label="Enable Species Location Fuzzing" desc="Blur exact GPS coordinates of sensitive species observations to ~5 km radius before display or export. Applies to T03 Protected Area data." checked={preferences?.species_location_fuzz ?? true} onChange={v => updatePreferences({ species_location_fuzz: v })} />
                <Toggle label="Mask Sensitive Species Names in Public View" desc="Replace threatened species names with generic taxonomy in public-access exports" checked={preferences?.mask_species_names ?? false} onChange={v => updatePreferences({ mask_species_names: v })} />
                <div style={{ background: '#e0f2fe', borderRadius: '8px', padding: '10px 12px', fontSize: '.72rem', color: '#0369a1', marginTop: '8px' }}>Fuzzing Active: T03 species coordinates are being displayed at ±5 km precision. Raw coordinates are accessible only to Decision-Maker role and are never included in public exports.</div>
              </SettingSection>
              <SettingSection title="Export Controls">
                <Toggle label="Restrict Raw Data Export by Role" desc="Public users can only export aggregated summaries. Raw records require Institutional or Decision-Maker role." checked={preferences?.restrict_raw_export ?? true} onChange={v => updatePreferences({ restrict_raw_export: v })} />
                <Toggle label="Log All Data Exports" desc="Record every export action in the Audit Log with user role and timestamp" checked={preferences?.log_exports ?? true} onChange={v => updatePreferences({ log_exports: v })} />
              </SettingSection>
              <SettingSection title="Access Control Summary">
                {[
                  { icon: '🌐', role: 'Public', desc: 'Headline indicators, national summaries, aggregated maps. No data entry. No raw export.' },
                  { icon: '🏛', role: 'Institutional', desc: 'Own ministry/district data entry and submission. Can view own submissions. No approval rights.' },
                  { icon: '📊', role: 'Decision-Maker', desc: 'Full dashboard, verification queue, all exports, AI narratives, risk register, audit log.' },
                ].map(a => (
                  <div key={a.role} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: '.75rem' }}>
                    <span>{a.icon}</span>
                    <div><strong>{a.role}</strong> — {a.desc}</div>
                  </div>
                ))}
              </SettingSection>
            </div>
          )}
          {tab === 'audit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.85rem' }}>Activity Audit Log</div>
                  <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>Tracks data access, exports, submissions, approvals and role changes.</div>
                </div>
                <button style={{ padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: '7px', background: '#fff', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>⬇ Export</button>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '.8rem' }}>No audit events recorded yet.</div>
              <div style={{ fontSize: '.68rem', color: '#94a3b8', textAlign: 'center', marginTop: '8px', fontFamily: "'DM Mono',monospace" }}>0 events recorded this session</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: "'DM Mono',monospace", marginBottom: '10px' }}>{title}</div>
      {children}
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
      <div style={{ flex: 1, paddingRight: '12px' }}>
        <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#0f172a' }}>{label}</div>
        <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: '2px' }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', background: checked ? '#0ea5e9' : '#e2e8f0', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
        <div style={{ position: 'absolute', top: '2px', left: checked ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </button>
    </div>
  )
}

const labelSt: React.CSSProperties = { display: 'block', fontSize: '.72rem', fontWeight: 600, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.06em' }
const inputSt: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
