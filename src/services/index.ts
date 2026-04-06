// src/services/indicators.service.ts
import { supabase } from '../lib/supabase'
import type { Indicator, IndicatorStatus, IndicatorTier } from '../types/database'

export const indicatorsService = {
  async getAll(filters: { tier?: IndicatorTier; status?: IndicatorStatus; search?: string } = {}) {
    let query = supabase
      .from('indicators')
      .select('*')
      .order('sequence_no', { ascending: true })

    if (filters.tier) query = query.eq('tier', filters.tier)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)

    const { data, error } = await query
    if (error) throw error
    return data as Indicator[]
  },

  async getById(id: string): Promise<Indicator> {
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Indicator
  },

  async update(id: string, updates: Partial<Indicator>): Promise<Indicator> {
    const { data, error } = await supabase
      .from('indicators')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Indicator
  },

  async getStats() {
    const indicators = await this.getAll()
    return {
      total: indicators.length,
      onTrack: indicators.filter(i => i.status === 'on-track').length,
      atRisk: indicators.filter(i => i.status === 'at-risk').length,
      behind: indicators.filter(i => i.status === 'behind').length,
      avgProgress: Math.round(
        indicators.reduce((a, i) => a + i.progress_pct, 0) / indicators.length
      ),
      byTier: {
        headline: indicators.filter(i => i.tier === 'headline').length,
        component: indicators.filter(i => i.tier === 'component').length,
        binary: indicators.filter(i => i.tier === 'binary').length,
        diagnostic: indicators.filter(i => i.tier === 'diagnostic').length,
      },
    }
  },

  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('indicators-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'indicators' }, callback)
      .subscribe()
  },
}


// ============================================================
// src/services/districts.service.ts
// ============================================================

import type { District, Province, DistrictSubmissionStatus } from '../types/database'

export const districtsService = {
  async getAll(provinceId?: string) {
    let query = supabase
      .from('districts')
      .select('*, provinces(id, name, code)')
      .order('name', { ascending: true })

    if (provinceId) query = query.eq('province_id', provinceId)

    const { data, error } = await query
    if (error) throw error
    return data as (District & { provinces: Province })[]
  },

  async getById(id: string): Promise<District> {
    const { data, error } = await supabase
      .from('districts')
      .select('*, provinces(id, name, code)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as District
  },

  async update(id: string, updates: Partial<District>): Promise<District> {
    const { data, error } = await supabase
      .from('districts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as District
  },

  async updateSubmissionStatus(
    districtName: string,
    status: DistrictSubmissionStatus
  ): Promise<void> {
    await supabase
      .from('districts')
      .update({ submission_status: status })
      .ilike('name', districtName)
  },

  async getStats() {
    const districts = await this.getAll()
    return {
      total: districts.length,
      submitted: districts.filter(d => d.submission_status === 'submitted').length,
      pending: districts.filter(d => d.submission_status === 'pending').length,
      missing: districts.filter(d => d.submission_status === 'missing').length,
      avgCompliance: Math.round(
        districts.reduce((a, d) => a + d.compliance_score, 0) / districts.length
      ),
      byProvince: districts.reduce((acc, d) => {
        const prov = (d as any).provinces?.name ?? 'Unknown'
        if (!acc[prov]) acc[prov] = { total: 0, submitted: 0, pending: 0, missing: 0 }
        acc[prov].total++
        acc[prov][d.submission_status]++
        return acc
      }, {} as Record<string, { total: number; submitted: number; pending: number; missing: number }>),
    }
  },
}


// ============================================================
// src/services/audit.service.ts
// ============================================================

import type { AuditLog } from '../types/database'

interface AuditEntry {
  action_type: string
  action: string
  detail?: string
  table_name?: string
  record_id?: string
}

export const auditService = {
  async log(entry: AuditEntry): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('audit_logs').insert({
      user_id: user?.id ?? null,
      ...entry,
      user_agent: navigator.userAgent.substring(0, 255),
    })

    if (error) console.warn('Audit log failed:', error.message)
  },

  async getAll(filters: {
    actionType?: string
    userId?: string
    limit?: number
    offset?: number
  } = {}) {
    let query = supabase
      .from('audit_logs')
      .select('*, profile:profiles(id, full_name, email, role)')
      .order('created_at', { ascending: false })

    if (filters.actionType && filters.actionType !== 'all') {
      query = query.eq('action_type', filters.actionType)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data as (AuditLog & { profile: any })[]
  },

  async exportCSV(): Promise<string> {
    const logs = await this.getAll({ limit: 5000 })
    const headers = ['timestamp', 'user', 'action_type', 'action', 'detail', 'table', 'record_id']
    const rows = logs.map(l => [
      new Date(l.created_at).toISOString(),
      l.profile?.full_name ?? l.user_id ?? 'System',
      l.action_type,
      l.action,
      l.detail ?? '',
      l.table_name ?? '',
      l.record_id ?? '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    return [headers.join(','), ...rows].join('\n')
  },
}


// ============================================================
// src/services/notifications.service.ts
// ============================================================

import type { Notification } from '../types/database'

export const notificationsService = {
  async getForUser(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Notification[]
  },

  async markAsRead(id: string): Promise<void> {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  },

  async markAllRead(userId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
  },

  async create(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<void> {
    await supabase.from('notifications').insert(notification)
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    return count ?? 0
  },

  subscribeToNotifications(userId: string, callback: (notif: Notification) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe()
  },
}


// ============================================================
// src/services/users.service.ts  (admin only)
// ============================================================

import type { Profile, UserRole } from '../types/database'

export const usersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Profile[]
  },

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) throw error

    await auditService.log({
      action_type: 'admin',
      action: `Role updated to ${role}`,
      detail: `User ID: ${userId}`,
      table_name: 'profiles',
      record_id: userId,
    })
  },

  async deactivate(userId: string): Promise<void> {
    await supabase.from('profiles').update({ is_active: false }).eq('id', userId)
  },

  async activate(userId: string): Promise<void> {
    await supabase.from('profiles').update({ is_active: true }).eq('id', userId)
  },
}


// ============================================================
// src/services/risks.service.ts
// ============================================================

import type { Risk } from '../types/database'

export const risksService = {
  async getAll(filters: { level?: string; category?: string; search?: string } = {}) {
    let query = supabase
      .from('risks')
      .select('*')
      .eq('is_active', true)
      .order('code', { ascending: true })

    if (filters.level && filters.level !== 'all') {
      query = query.eq('level', filters.level)
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters.search) {
      query = query.or(`description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Risk[]
  },

  async getStats() {
    const risks = await this.getAll()
    return {
      total: risks.length,
      high: risks.filter(r => r.level === 'High').length,
      medium: risks.filter(r => r.level === 'Medium').length,
      low: risks.filter(r => r.level === 'Low').length,
    }
  },
}
