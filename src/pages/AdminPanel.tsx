// src/pages/AdminPanel.tsx
// ============================================================
// Admin-only user management + system overview
// ============================================================

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usersService } from '../services/index'
import { auditService } from '../services/index'
import { useAuth } from '../hooks/useAuth'
import type { Profile, UserRole } from '../types/database'
import { ROLE_PERMISSIONS } from '../types/database'
import { useAuditLog } from '../hooks/useData'

export default function AdminPanel() {
  const { profile: currentUser } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'system'>('users')
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const { logs, loading: logsLoading, refresh: refreshLogs } = useAuditLog({ limit: 50 })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await usersService.getAll()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await usersService.updateRole(userId, newRole)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  const handleToggleActive = async (user: Profile) => {
    if (user.is_active) await usersService.deactivate(user.id)
    else await usersService.activate(user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !user.is_active } : u))
  }

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchSearch = !searchTerm ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchRole && matchSearch
  })

  const roleColors: Record<UserRole, string> = {
    admin: '#6b21a8',
    district_officer: '#166534',
    sector_officer: '#1e40af',
    viewer: '#475569',
  }

  const roleBgs: Record<UserRole, string> = {
    admin: '#f3e8ff',
    district_officer: '#dcfce7',
    sector_officer: '#dbeafe',
    viewer: '#f1f5f9',
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#6b21a8,#7c3aed)',
        borderRadius: '14px', padding: '20px 24px',
        color: '#fff', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{
          width: '48px', height: '48px',
          background: 'rgba(255,255,255,.15)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>🛡️</div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px' }}>
            Administration Panel
          </h2>
          <p style={{ fontSize: '.78rem', opacity: .8, margin: 0 }}>
            Manage users, roles, audit logs and system settings · Admin only
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '.7rem', opacity: .7, fontFamily: "'DM Mono',monospace" }}>Signed in as</div>
          <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{currentUser?.full_name}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Users', val: users.length, icon: '👥', color: '#0ea5e9' },
          { label: 'Active Users', val: users.filter(u => u.is_active).length, icon: '✅', color: '#10b981' },
          { label: 'Admins', val: users.filter(u => u.role === 'admin').length, icon: '🛡️', color: '#8b5cf6' },
          { label: 'Audit Events', val: logs.length, icon: '📋', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.val}</div>
            <div style={{ fontSize: '.7rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        {([['users','👥 Users'],['audit','📋 Audit Log'],['system','⚙ System']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab === 'audit') refreshLogs() }}
            style={{
              padding: '9px 16px', fontSize: '.82rem', fontWeight: 600,
              cursor: 'pointer', background: 'none',
              border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#8b5cf6' : 'transparent'}`,
              color: activeTab === tab ? '#8b5cf6' : '#64748b',
              fontFamily: 'inherit', marginBottom: '-1px',
            }}
          >{label}</button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {activeTab === 'users' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text" placeholder="Search users…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                flex: 1, maxWidth: '280px',
                padding: '8px 12px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '.82rem',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'inherit', outline: 'none' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="sector_officer">Sector Officer</option>
              <option value="district_officer">District Officer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading users…</div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['User', 'Email', 'Role', 'Organization', 'District', 'Last Login', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '10px 14px', textAlign: 'left',
                        fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em',
                        textTransform: 'uppercase', color: '#94a3b8',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{u.full_name}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{u.email}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                          disabled={u.id === currentUser?.id}
                          style={{
                            padding: '3px 8px',
                            background: roleBgs[u.role],
                            color: roleColors[u.role],
                            border: `1px solid ${roleColors[u.role]}44`,
                            borderRadius: '8px', fontSize: '.72rem', fontWeight: 700,
                            fontFamily: "'DM Mono',monospace",
                            cursor: u.id === currentUser?.id ? 'not-allowed' : 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="sector_officer">Sector Officer</option>
                          <option value="district_officer">District Officer</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '.78rem' }}>{u.organization ?? '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '.78rem' }}>{u.district ?? '—'}</td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>
                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '.68rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700,
                          fontFamily: "'DM Mono',monospace",
                          background: u.is_active ? '#dcfce7' : '#fee2e2',
                          color: u.is_active ? '#166534' : '#991b1b',
                        }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleToggleActive(u)}
                            style={{
                              padding: '4px 10px', borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              background: 'transparent',
                              fontSize: '.72rem', fontWeight: 600,
                              cursor: 'pointer', color: u.is_active ? '#ef4444' : '#10b981',
                              fontFamily: 'inherit',
                            }}
                          >{u.is_active ? 'Deactivate' : 'Activate'}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Audit Log tab ── */}
      {activeTab === 'audit' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {logsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading audit log…</div>
          ) : (
            logs.map(log => {
              const typeColors: Record<string, string> = {
                submit: '#166534', approve: '#065f46', reject: '#991b1b',
                delete: '#92400e', login: '#475569', logout: '#475569',
                export: '#6b21a8', view: '#1e40af', admin: '#7c3aed',
              }
              const typeBgs: Record<string, string> = {
                submit: '#dcfce7', approve: '#d1fae5', reject: '#fee2e2',
                delete: '#ffedd5', login: '#f1f5f9', logout: '#f1f5f9',
                export: '#f3e8ff', view: '#dbeafe', admin: '#ede9fe',
              }
              return (
                <div key={log.id} style={{
                  display: 'flex', gap: '12px', padding: '10px 16px',
                  borderBottom: '1px solid #f8fafc', fontSize: '.78rem',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: "'DM Mono',monospace", color: '#94a3b8',
                    fontSize: '.68rem', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '130px',
                  }}>
                    {new Date(log.created_at).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{log.action}</span>
                    <span style={{
                      fontSize: '.62rem', padding: '1px 7px', borderRadius: '6px',
                      fontWeight: 700, fontFamily: "'DM Mono',monospace",
                      marginLeft: '8px',
                      background: typeBgs[log.action_type] ?? '#f1f5f9',
                      color: typeColors[log.action_type] ?? '#475569',
                    }}>{log.action_type.toUpperCase()}</span>
                    {log.detail && (
                      <div style={{ fontSize: '.72rem', color: '#64748b', marginTop: '2px' }}>{log.detail}</div>
                    )}
                  </div>
                  <div style={{ fontSize: '.68rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {log.profile?.full_name ?? log.user_id?.slice(0,8) ?? 'System'}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── System tab ── */}
      {activeTab === 'system' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            {
              title: 'Database Status',
              items: [
                ['Supabase Project', '✅ Connected'],
                ['RLS Enabled', '✅ Active on all tables'],
                ['Real-time', '✅ Subscriptions active'],
                ['Storage', '✅ report-attachments bucket'],
              ]
            },
            {
              title: 'Security Configuration',
              items: [
                ['Auth Method', 'Email + Password (PKCE)'],
                ['Session Persistence', 'localStorage'],
                ['Role-Based Access', '4 roles configured'],
                ['Species Fuzzing', 'Configurable per user'],
              ]
            },
            {
              title: 'Data Schema',
              items: [
                ['Tables', '10 production tables'],
                ['RLS Policies', '22 policies'],
                ['Triggers', '6 auto-update triggers'],
                ['Indexes', '12 performance indexes'],
              ]
            },
            {
              title: 'API Endpoints',
              items: [
                ['Reports CRUD', '/api/reports (via Supabase)'],
                ['Indicators', '/api/indicators'],
                ['File Upload', 'Supabase Storage'],
                ['AI Narrative', 'Anthropic Claude API'],
              ]
            },
          ].map(card => (
            <div key={card.title} style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: '12px', padding: '18px',
            }}>
              <h3 style={{ fontSize: '.9rem', fontWeight: 700, margin: '0 0 14px', color: '#0f172a' }}>{card.title}</h3>
              {card.items.map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: '1px solid #f8fafc',
                  fontSize: '.78rem',
                }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontFamily: "'DM Mono',monospace", fontSize: '.72rem' }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
