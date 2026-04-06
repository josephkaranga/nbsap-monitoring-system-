// src/services/reports.service.ts
// ============================================================
// All report / toolkit submission operations
// ============================================================

import { supabase } from '../lib/supabase'
import type { Report, ReportStatus, SubmissionTool, ReportAttachment } from '../types/database'
import { auditService } from './index'

export interface ReportFilters {
  toolId?: SubmissionTool | 'ALL'
  status?: ReportStatus | 'ALL'
  period?: string | 'ALL'
  districtId?: string
  submittedBy?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

export interface ReportInsert extends Omit<Partial<Report>, 'id' | 'created_at' | 'updated_at' | 'submitted_by' | 'status'> {
  tool_id: SubmissionTool
  tool_name: string
}

// ── Fetch reports with filters ─────────────────────────────
export const reportsService = {

  async getAll(filters: ReportFilters = {}) {
    let query = supabase
      .from('reports')
      .select(`
        *,
        submitter:profiles!reports_submitted_by_fkey(id, full_name, email, role, organization),
        reviewer:profiles!reports_reviewed_by_fkey(id, full_name, email, role),
        district:districts(id, name, province_id, provinces(name))
      `)
      .order('created_at', { ascending: false })

    if (filters.toolId && filters.toolId !== 'ALL') {
      query = query.eq('tool_id', filters.toolId)
    }
    if (filters.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status)
    }
    if (filters.period && filters.period !== 'ALL') {
      query = query.ilike('period', `%${filters.period}%`)
    }
    if (filters.districtId) {
      query = query.eq('district_id', filters.districtId)
    }
    if (filters.submittedBy) {
      query = query.eq('submitted_by', filters.submittedBy)
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo + 'T23:59:59')
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data as unknown as Report[]
  },

  async getById(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        submitter:profiles!reports_submitted_by_fkey(id, full_name, email, role, organization),
        reviewer:profiles!reports_reviewed_by_fkey(id, full_name, email, role),
        district:districts(id, name, province_id, provinces(name)),
        report_attachments(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as unknown as Report
  },

  async getCount(filters: ReportFilters = {}): Promise<number> {
    let query = supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })

    if (filters.toolId && filters.toolId !== 'ALL') {
      query = query.eq('tool_id', filters.toolId)
    }
    if (filters.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status)
    }

    const { count, error } = await query
    if (error) throw error
    return count ?? 0
  },

  // ── Create (submit) report ─────────────────────────────
  async submit(
    reportData: ReportInsert,
    requireVerification: boolean,
    userId: string,
    attachments?: File[]
  ): Promise<Report> {
    const status: ReportStatus = requireVerification ? 'pending' : 'approved'

    const { data, error } = await supabase
      .from('reports')
      .insert({
        ...reportData,
        submitted_by: userId,
        status,
        reviewed_by: requireVerification ? null : userId,
        reviewed_at: requireVerification ? null : new Date().toISOString(),
        review_note: requireVerification ? null : 'Auto-approved',
      })
      .select()
      .single()

    if (error) throw error
    const report = data as Report

    // Upload attachments if any
    if (attachments?.length) {
      await this.uploadAttachments(report.id, attachments)
    }

    // Audit log
    await auditService.log({
      action_type: 'submit',
      action: `${reportData.tool_name} submitted`,
      detail: `Tool: ${reportData.tool_id} · Status: ${status}`,
      table_name: 'reports',
      record_id: report.id,
    })

    return report
  },

  // ── Update report ──────────────────────────────────────
  async update(id: string, updates: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Report
  },

  // ── Verify (approve / reject) ──────────────────────────
  async verify(
    id: string,
    decision: 'approved' | 'rejected' | 'pending',
    reviewerId: string,
    note?: string
  ): Promise<Report> {
    const updates: Partial<Report> = {
      status: decision as ReportStatus,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      review_note: note ?? null,
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await auditService.log({
      action_type: decision,
      action: `Report ${decision}`,
      detail: note ? `Note: ${note}` : undefined,
      table_name: 'reports',
      record_id: id,
    })

    return data as Report
  },

  // ── Delete report ──────────────────────────────────────
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error

    await auditService.log({
      action_type: 'delete',
      action: 'Report deleted',
      table_name: 'reports',
      record_id: id,
    })
  },

  // ── Upload attachments ─────────────────────────────────
  async uploadAttachments(
    reportId: string,
    files: File[]
  ): Promise<ReportAttachment[]> {
    const results: ReportAttachment[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const path = `reports/${reportId}/${Date.now()}-${file.name}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('report-attachments')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        console.error('Upload error for', file.name, uploadError)
        continue
      }

      // Record in DB
      const { data: att } = await supabase
        .from('report_attachments')
        .insert({
          report_id: reportId,
          file_name: file.name,
          file_ext: ext,
          file_size: file.size,
          storage_path: path,
        })
        .select()
        .single()

      if (att) results.push(att as ReportAttachment)
    }

    return results
  },

  // ── Get attachment download URL ────────────────────────
  async getAttachmentUrl(storagePath: string): Promise<string | null> {
    const { data } = await supabase.storage
      .from('report-attachments')
      .createSignedUrl(storagePath, 3600) // 1 hour expiry

    return data?.signedUrl ?? null
  },

  // ── Aggregate stats ────────────────────────────────────
  async getStats(filters: ReportFilters = {}) {
    const reports = await this.getAll({ ...filters, limit: 1000 })

    const approved = reports.filter(r => r.status === 'approved')
    const pending = reports.filter(r => r.status === 'pending')
    const rejected = reports.filter(r => r.status === 'rejected')

    const t02 = approved.filter(r => r.tool_id === 'T02')
    const t04 = approved.filter(r => r.tool_id === 'T04')
    const t05 = approved.filter(r => r.tool_id === 'T05')
    const t06 = approved.filter(r => r.tool_id === 'T06')

    return {
      total: reports.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      byTool: Object.fromEntries(
        ['T01','T02','T03','T04','T05','T06','T07'].map(t => [
          t,
          reports.filter(r => r.tool_id === t as SubmissionTool).length
        ])
      ),
      forestHa: t02.reduce((a, r) => a + (r.forest_ha ?? 0), 0),
      wetlandHa: t02.reduce((a, r) => a + (r.wetland_ha ?? 0), 0),
      hwcIncidents: t04.reduce((a, r) => a + (r.hwc_incidents ?? 0), 0),
      budgetAllocated: t05.reduce((a, r) => a + (r.budget_allocated ?? 0), 0),
      budgetDisbursed: t05.reduce((a, r) => a + (r.budget_disbursed ?? 0), 0),
      eiaNonCompliant: t06.filter(r => r.eia_compliance === 'Non-compliant').length,
      eiaCompliant: t06.filter(r => r.eia_compliance === 'Full compliance').length,
      activeDistricts: new Set(t02.map(r => r.district_name).filter(Boolean)).size,
    }
  },

  // ── Export as CSV ──────────────────────────────────────
  async exportCSV(filters: ReportFilters = {}): Promise<string> {
    const reports = await this.getAll({ ...filters, limit: 5000 })
    if (!reports.length) return ''

    const skipKeys = new Set(['submitter', 'reviewer', 'district', 'attachments'])
    const headers = Object.keys(reports[0]).filter(k => !skipKeys.has(k))

    const rows = reports.map(r =>
      headers.map(h => {
        const v = (r as any)[h]
        if (v === null || v === undefined) return ''
        if (typeof v === 'object') return JSON.stringify(v)
        return `"${String(v).replace(/"/g, '""')}"`
      }).join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  },

  // ── Real-time subscription ─────────────────────────────
  subscribeToReports(
    callback: (payload: { new: Report; old: Report; eventType: string }) => void
  ) {
    return supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => callback(payload as any)
      )
      .subscribe()
  },
}
