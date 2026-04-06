// src/hooks/useReports.ts
// ============================================================
// React Query-style hooks for reports data
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { reportsService, type ReportFilters } from '../services/reports.service'
import type { Report } from '../types/database'

export function useReports(filters: ReportFilters = {}) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Awaited<ReturnType<typeof reportsService.getStats>> | null>(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, statsData] = await Promise.all([
        reportsService.getAll(filtersRef.current),
        reportsService.getStats(filtersRef.current),
      ])
      setReports(data)
      setStats(statsData)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [
    load,
    filters.toolId,
    filters.status,
    filters.period,
    filters.dateFrom,
    filters.dateTo,
    filters.districtId,
  ])

  const submitReport = useCallback(async (
    data: Parameters<typeof reportsService.submit>[0],
    requireVerification: boolean,
    userId: string,
    attachments?: File[]
  ) => {
    const report = await reportsService.submit(data, requireVerification, userId, attachments)
    await load()
    return report
  }, [load])

  const verifyReport = useCallback(async (
    id: string,
    decision: 'approved' | 'rejected' | 'pending',
    reviewerId: string,
    note?: string
  ) => {
    const report = await reportsService.verify(id, decision, reviewerId, note)
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...report } : r))
    return report
  }, [])

  const deleteReport = useCallback(async (id: string) => {
    await reportsService.delete(id)
    setReports(prev => prev.filter(r => r.id !== id))
  }, [])

  return {
    reports,
    stats,
    loading,
    error,
    refresh: load,
    submitReport,
    verifyReport,
    deleteReport,
  }
}


// ============================================================
// src/hooks/useIndicators.ts
// ============================================================

import { indicatorsService } from '../services/index'
import type { Indicator, IndicatorTier, IndicatorStatus } from '../types/database'

export function useIndicators(filters: {
  tier?: IndicatorTier
  status?: IndicatorStatus
  search?: string
} = {}) {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indStats, setIndStats] = useState<Awaited<ReturnType<typeof indicatorsService.getStats>> | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [data, s] = await Promise.all([
        indicatorsService.getAll(filters),
        indicatorsService.getStats(),
      ])
      setIndicators(data)
      setIndStats(s)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filters.tier, filters.status, filters.search])

  useEffect(() => { load() }, [load])

  return { indicators, indStats, loading, error, refresh: load }
}


// ============================================================
// src/hooks/useNotifications.ts
// ============================================================

import { notificationsService } from '../services/index'
import type { Notification } from '../types/database'
import { supabase } from '../lib/supabase'

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const load = async () => {
      setLoading(true)
      try {
        const [notifs, count] = await Promise.all([
          notificationsService.getForUser(userId),
          notificationsService.getUnreadCount(userId),
        ])
        setNotifications(notifs)
        setUnreadCount(count)
      } finally {
        setLoading(false)
      }
    }

    load()

    // Real-time subscription for new notifications
    const sub = notificationsService.subscribeToNotifications(userId, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => { supabase.removeChannel(sub) }
  }, [userId])

  const markRead = useCallback(async (id: string) => {
    await notificationsService.markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    await notificationsService.markAllRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }, [userId])

  return { notifications, unreadCount, loading, markRead, markAllRead }
}


// ============================================================
// src/hooks/useDistricts.ts
// ============================================================

import { districtsService } from '../services/index'
import type { District, Province } from '../types/database'

export function useDistricts(provinceId?: string) {
  const [districts, setDistricts] = useState<(District & { provinces: Province })[]>([])
  const [distStats, setDistStats] = useState<Awaited<ReturnType<typeof districtsService.getStats>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [data, s] = await Promise.all([
        districtsService.getAll(provinceId),
        districtsService.getStats(),
      ])
      setDistricts(data)
      setDistStats(s)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [provinceId])

  useEffect(() => { load() }, [load])

  return { districts, distStats, loading, error, refresh: load }
}


// ============================================================
// src/hooks/useRisks.ts
// ============================================================

import { risksService } from '../services/index'
import type { Risk } from '../types/database'

export function useRisks(filters: { level?: string; category?: string; search?: string } = {}) {
  const [risks, setRisks] = useState<Risk[]>([])
  const [riskStats, setRiskStats] = useState<Awaited<ReturnType<typeof risksService.getStats>> | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [data, s] = await Promise.all([
        risksService.getAll(filters),
        risksService.getStats(),
      ])
      setRisks(data)
      setRiskStats(s)
    } finally {
      setLoading(false)
    }
  }, [filters.level, filters.category, filters.search])

  useEffect(() => { load() }, [load])

  return { risks, riskStats, loading, refresh: load }
}


// ============================================================
// src/hooks/useAuditLog.ts
// ============================================================

import { auditService } from '../services/index'
import type { AuditLog } from '../types/database'

export function useAuditLog(filters: { actionType?: string; limit?: number } = {}) {
  const [logs, setLogs] = useState<(AuditLog & { profile: any })[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await auditService.getAll({ ...filters, limit: filters.limit ?? 100 })
      setLogs(data)
    } finally {
      setLoading(false)
    }
  }, [filters.actionType, filters.limit])

  useEffect(() => { load() }, [load])

  return { logs, loading, refresh: load }
}


// ============================================================
// src/hooks/usePreferences.ts
// ============================================================

import { supabase as _supabase } from '../lib/supabase'
import type { UserPreferences } from '../types/database'

export function usePreferences(userId: string | null) {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    _supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        setPrefs(data)
        setLoading(false)
      })
  }, [userId])

  const update = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!userId) return
    const { data } = await _supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    if (data) setPrefs(data)
  }, [userId])

  return { prefs, loading, update }
}
