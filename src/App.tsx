// src/App.tsx
// ============================================================
// Root application — auth-aware routing + global providers
// ============================================================

import React, { useEffect, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { LoginPage, ProtectedRoute } from './components/auth/index'
import { DashboardShell } from './components/layout/DashboardShell'

// Lazy-loaded tabs for code splitting
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const IndicatorsLazy = lazy(() => import('./pages/Indicators'))
const ReportingToolkit = lazy(() => import('./pages/ReportingToolkit'))
const VerifQueue   = lazy(() => import('./pages/VerifQueue'))
const Compliance   = lazy(() => import('./pages/stubs').then(m => ({ default: m.Compliance })))
const RiskRegister = lazy(() => import('./pages/stubs').then(m => ({ default: m.RiskRegister })))
const DistrictMap  = lazy(() => import('./pages/DistrictMap').then(m => ({ default: m.DistrictMap })))
const Reports      = lazy(() => import('./pages/stubs').then(m => ({ default: m.Reports })))
const Stakeholders = lazy(() => import('./pages/stubs').then(m => ({ default: m.Stakeholders })))
const RBISPage     = lazy(() => import('./pages/stubs').then(m => ({ default: m.RBIS })))
const DataPipeline = lazy(() => import('./pages/stubs').then(m => ({ default: m.DataPipeline })))
const AdaptiveMgmt = lazy(() => import('./pages/stubs').then(m => ({ default: m.AdaptiveMgmt })))
const Targets22Lazy = lazy(() => import('./pages/stubs').then(m => ({ default: m.Targets22 })))
const AdminPanel   = lazy(() => import('./pages/AdminPanel'))
const AuthCallback = lazy(() => import('./pages/stubs').then(m => ({ default: m.AuthCallback })))

// Typed wrappers to restore prop types lost by lazy()
const Indicators = IndicatorsLazy as unknown as React.ComponentType<{ linkedIndicatorId?: string | null; onClearLink?: () => void }>
const Targets22  = Targets22Lazy  as unknown as React.ComponentType<{ onViewIndicator?: (id: string) => void }>

// ── Tab routing (SPA without React Router for simplicity) ──
export type TabId =
  | 'dashboard' | 'indicators' | 'targets22' | 'adaptive-mgmt'
  | 'reporting-toolkit' | 't01' | 't02' | 't03' | 't04' | 't05' | 't06' | 't07'
  | 'verif-queue' | 'compliance' | 'risk'
  | 'reports' | 'stakeholders' | 'rbis' | 'data-pipeline' | 'map'
  | 'admin'

function AppInner() {
  const { profile, initialized } = useAuth()
  const [activeTab, setActiveTab] = React.useState<TabId>('dashboard')
  const [linkedIndicatorId, setLinkedIndicatorId] = React.useState<string | null>(null)

  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      window.history.replaceState({}, '', '/')
    }
  }, [])

  if (!initialized) return <FullPageLoader />
  if (!profile) return <LoginPage onSuccess={() => setActiveTab('dashboard')} />

  const switchTab = (tab: TabId) => { setActiveTab(tab); setLinkedIndicatorId(null) }
  const goToIndicator = (id: string) => { setLinkedIndicatorId(id); setActiveTab('indicators') }

  // Map individual tool tabs to tool ID
  const toolTabMap: Partial<Record<TabId, string>> = {
    't01': 'T01', 't02': 'T02', 't03': 'T03', 't04': 'T04',
    't05': 'T05', 't06': 'T06', 't07': 'T07',
  }
  const isToolTab = (tab: TabId) => tab in toolTabMap

  return (
    <DashboardShell activeTab={activeTab} onTabChange={switchTab}>
      <Suspense fallback={<TabLoader />}>
        {activeTab === 'dashboard'         && <Dashboard />}
        {activeTab === 'indicators'        && <Indicators linkedIndicatorId={linkedIndicatorId} onClearLink={() => setLinkedIndicatorId(null)} />}
        {activeTab === 'targets22'         && <Targets22 onViewIndicator={goToIndicator} />}
        {activeTab === 'adaptive-mgmt'     && <AdaptiveMgmt />}
        {(activeTab === 'reporting-toolkit' || isToolTab(activeTab)) && (
          <ProtectedRoute requiredRoles={['admin','district_officer','sector_officer']}>
            <ReportingToolkit defaultTool={toolTabMap[activeTab]} />
          </ProtectedRoute>
        )}
        {activeTab === 'verif-queue'       && (
          <ProtectedRoute requiredRoles={['admin','sector_officer']}>
            <VerifQueue />
          </ProtectedRoute>
        )}
        {activeTab === 'compliance'        && <Compliance />}
        {activeTab === 'risk'              && <RiskRegister />}
        {activeTab === 'reports'           && <Reports />}
        {activeTab === 'stakeholders'      && <Stakeholders />}
        {activeTab === 'rbis'              && <RBISPage />}
        {activeTab === 'data-pipeline'     && <DataPipeline />}
        {activeTab === 'map'               && <DistrictMap />}
        {activeTab === 'admin'             && (
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        )}
      </Suspense>
    </DashboardShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

function FullPageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#0f2744,#0c1e38)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌿</div>
        <div style={{
          width: '36px', height: '36px',
          border: '3px solid rgba(56,189,248,0.2)',
          borderTopColor: '#38bdf8',
          borderRadius: '50%',
          margin: '0 auto 14px',
          animation: 'spin 0.7s linear infinite',
        }} />
        <p style={{ color: '#7dd3fc', fontFamily: "'DM Mono',monospace", fontSize: '.8rem' }}>
          Initializing NBSAP Portal…
        </p>
      </div>
    </div>
  )
}

function TabLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', minHeight: '300px',
    }}>
      <div style={{
        width: '28px', height: '28px',
        border: '2px solid #e2e8f0',
        borderTopColor: '#0ea5e9',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  )
}
