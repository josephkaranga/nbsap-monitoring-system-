// src/components/layout/DashboardShell.tsx
// ============================================================
// Sidebar + topbar layout with role-gated nav items
// ============================================================

import React, { useState, useEffect } from 'react'
import type { TabId } from '../../App'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useData'
import type { UserRole } from '../../types/database'
import { ROLE_PERMISSIONS } from '../../types/database'

interface NavItem {
  id: TabId
  label: string
  icon: string
  section?: string
  roles?: UserRole[]   // if omitted = all roles
  badge?: string | number
}

const NAV_ITEMS: NavItem[] = [
  // Analytics
  { id: 'dashboard',         icon: '📊', label: 'Dashboard',              section: 'Analytics' },
  { id: 'indicators',        icon: '📐', label: 'Indicator Hierarchy',     section: 'Analytics' },
  { id: 'targets22',         icon: '🎯', label: '22 National Targets',     section: 'Analytics' },
  { id: 'adaptive-mgmt',     icon: '🔄', label: 'Adaptive Management',     section: 'Analytics' },
  // Reporting Modules
  { id: 'reporting-toolkit', icon: '🗂️', label: 'All Modules',             section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't01',               icon: '🏛️', label: 'T01 · Institutional',     section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't02',               icon: '🌿', label: 'T02 · District',          section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't03',               icon: '🛡️', label: 'T03 · Protected Areas',   section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't04',               icon: '👥', label: 'T04 · Community',         section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't05',               icon: '💰', label: 'T05 · Finance',           section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't06',               icon: '🏢', label: 'T06 · Private Sector',    section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  { id: 't07',               icon: '🔬', label: 'T07 · Research',          section: 'Reporting Modules', roles: ['admin','district_officer','sector_officer'] },
  // Governance
  { id: 'verif-queue',       icon: '✅', label: 'Verification Queue',      section: 'Governance', roles: ['admin','sector_officer'] },
  { id: 'compliance',        icon: '⚖️', label: 'Compliance',              section: 'Governance' },
  { id: 'risk',              icon: '⚠️', label: 'Risk Register',           section: 'Governance' },
  { id: 'reports',           icon: '📋', label: 'Reports',                 section: 'Governance' },
  { id: 'stakeholders',      icon: '👥', label: 'Stakeholders',            section: 'Governance' },
  // System
  { id: 'rbis',              icon: '🗄️', label: 'RBIS Integration',        section: 'System' },
  { id: 'data-pipeline',     icon: '🔀', label: 'Data Pipeline',           section: 'System' },
  { id: 'map',               icon: '🗺️', label: 'District Map',            section: 'System' },
  // Admin
  { id: 'admin',             icon: '🛡️', label: 'Admin Panel',             section: 'Admin', roles: ['admin'] },
]

const TAB_TITLES: Record<TabId, string> = {
  'dashboard': 'Monitoring Dashboard',
  'indicators': '4-Tier Indicator Hierarchy',
  'targets22': '22 National Targets',
  'adaptive-mgmt': 'Adaptive Management',
  'reporting-toolkit': 'Reporting Modules (T01–T07)',
  't01': 'T01 · Institutional Report',
  't02': 'T02 · District Restoration',
  't03': 'T03 · Protected Areas',
  't04': 'T04 · Community Data',
  't05': 'T05 · Finance Tracking',
  't06': 'T06 · Private Sector EIA',
  't07': 'T07 · Research Data',
  'verif-queue': 'Verification Queue',
  'compliance': 'Compliance & Accountability',
  'risk': 'Risk Register',
  'reports': 'Reports & Documentation',
  'stakeholders': 'Stakeholder Matrix',
  'rbis': 'RBIS Integration',
  'data-pipeline': 'Data Pipeline',
  'map': 'District Map',
  'admin': 'Administration Panel',
}

interface Props {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: React.ReactNode
}

export function DashboardShell({ activeTab, onTabChange, children }: Props) {
  const { profile, signOut } = useAuth()
  const { notifications, unreadCount, markAllRead } = useNotifications(profile?.id ?? null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [time, setTime] = useState(new Date())

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Filter nav items by role
  const isViewer = profile?.role === 'viewer'
  const VIEWER_ALLOWED_TABS: TabId[] = ['dashboard', 'indicators', 'targets22', 'map']
  const visibleNav = NAV_ITEMS.filter(item => {
    if (isViewer && !VIEWER_ALLOWED_TABS.includes(item.id)) return false
    if (!item.roles) return true
    return profile ? item.roles.includes(profile.role) : false
  })

  const sections = [...new Set(visibleNav.map(i => i.section))]

  const perms = profile ? ROLE_PERMISSIONS[profile.role] : null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,39,68,.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 190,
            display: 'none',
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: '248px',
        background: 'linear-gradient(175deg,#0f2744 0%,#0c1e38 100%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0,0,0,.2)',
      }}>
        {/* Brand */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', flexShrink: 0,
            }}>🌿</div>
            <div>
              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '1.05rem', color: '#fff', fontWeight: 700,
              }}>NBSAP</div>
              <div style={{
                fontSize: '.65rem', color: '#7dd3fc',
                fontFamily: "'DM Mono',monospace",
              }}>Monitoring System v2</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {sections.map(section => (
            <div key={section}>
              <div style={{
                fontSize: '.6rem', letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'rgba(125,211,252,.5)',
                padding: '10px 20px 4px',
                fontFamily: "'DM Mono',monospace",
              }}>{section}</div>
              {visibleNav
                .filter(i => i.section === section)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setSidebarOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '9px 18px',
                      cursor: 'pointer',
                      color: activeTab === item.id ? '#38bdf8' : '#bfdbfe',
                      fontSize: '.82rem', fontWeight: 500,
                      background: activeTab === item.id ? 'rgba(56,189,248,.15)' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${activeTab === item.id ? '#38bdf8' : 'transparent'}`,
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all .15s',
                    }}
                  >
                    <span style={{ fontSize: '.85rem' }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.id === 'verif-queue' && unreadCount > 0 && (
                      <span style={{
                        background: '#f59e0b', color: '#fff',
                        fontSize: '.58rem', padding: '1px 6px',
                        borderRadius: '10px', fontWeight: 700,
                      }}>{unreadCount}</span>
                    )}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        {/* User + status footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{
            background: 'rgba(255,255,255,.06)',
            borderRadius: '9px', padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '10px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 0 3px rgba(16,185,129,.3)',
            }} />
            <div style={{ fontSize: '.7rem', color: '#7dd3fc' }}>
              <strong style={{ display: 'block', color: '#a5f3fc', fontSize: '.72rem' }}>System Online</strong>
              Last sync: {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Profile chip */}
          {profile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 10px',
              background: 'rgba(255,255,255,.04)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,.08)',
            }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '.65rem', fontWeight: 700,
                flexShrink: 0,
              }}>
                {profile.full_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: '.75rem', fontWeight: 600, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{profile.full_name}</div>
                <div style={{
                  fontSize: '.62rem', color: '#7dd3fc',
                  fontFamily: "'DM Mono',monospace",
                  textTransform: 'uppercase', letterSpacing: '.05em',
                }}>{profile.role.replace('_', ' ')}</div>
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(125,211,252,.5)',
                  cursor: 'pointer', fontSize: '12px', padding: '2px',
                }}
              >↩</button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ marginLeft: '248px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0,
          background: 'rgba(248,250,252,.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {TAB_TITLES[activeTab]}
            </h2>
            <p style={{ fontSize: '.72rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", margin: '2px 0 0' }}>
              National Biodiversity Strategy & Action Plan 2025–2030
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Live clock */}
            <div style={{
              fontSize: '.65rem', fontFamily: "'DM Mono',monospace",
              color: '#94a3b8', padding: '4px 10px',
              background: '#f1f5f9', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  width: '36px', height: '36px', borderRadius: '9px',
                  border: '1px solid #e2e8f0', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '.85rem',
                }}
              >🔔</button>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#f43f5e', color: '#fff',
                  fontSize: '.55rem', width: '16px', height: '16px',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, border: '2px solid #f8fafc',
                }}>{unreadCount}</span>
              )}
            </div>

            {/* Role badge */}
            {profile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 4px 4px 12px',
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: '20px',
              }}>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#475569' }}>
                  {ROLE_PERMISSIONS[profile.role].label}
                </span>
                <div style={{
                  width: '28px', height: '28px',
                  background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '.65rem', fontWeight: 700,
                }}>
                  {ROLE_PERMISSIONS[profile.role].avatar}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Notifications drawer */}
        {notifOpen && (
          <div style={{
            position: 'fixed', top: '62px', right: '16px',
            width: '340px', background: '#fff',
            borderRadius: '14px', border: '1px solid #e2e8f0',
            boxShadow: '0 12px 32px rgba(0,0,0,.14)',
            zIndex: 400,
          }}>
            <div style={{
              padding: '14px 16px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 700, fontSize: '.88rem' }}>
                Notifications {unreadCount > 0 && (
                  <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '.68rem', padding: '1px 6px', borderRadius: '8px', marginLeft: '6px' }}>{unreadCount}</span>
                )}
              </span>
              <button onClick={markAllRead} style={{ color: '#0ea5e9', fontSize: '.72rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                Mark all read
              </button>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '.82rem' }}>
                  No notifications
                </div>
              ) : notifications.slice(0, 10).map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f8fafc',
                  background: n.is_read ? '#fff' : '#f0f9ff',
                }}>
                  <p style={{ fontSize: '.78rem', fontWeight: 500, color: '#0f172a', margin: '0 0 2px' }}>{n.title}</p>
                  <p style={{ fontSize: '.72rem', color: '#64748b', margin: 0 }}>{n.message}</p>
                  <p style={{ fontSize: '.65rem', color: '#94a3b8', margin: '4px 0 0', fontFamily: "'DM Mono',monospace" }}>
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page content */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
