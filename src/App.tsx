import React, { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { LoginPage } from './components/auth/LoginPage'
import { DashboardShell } from './components/layout/DashboardShell'
import { Dashboard } from './pages/Dashboard'
import { Indicators } from './pages/Indicators'
import { Targets22 } from './pages/Targets22'
import { AdaptiveMgmt } from './pages/AdaptiveMgmt'
import { ReportingToolkit } from './pages/ReportingToolkit'
import { VerifQueue } from './pages/VerifQueue'
import { Compliance } from './pages/Compliance'
import { RiskRegister } from './pages/RiskRegister'
import { Reports } from './pages/Reports'
import { Stakeholders } from './pages/Stakeholders'
import { RBIS } from './pages/RBIS'
import { DataPipeline } from './pages/DataPipeline'
import { DistrictMap } from './pages/DistrictMap'

export type TabId =
  | 'dashboard' | 'indicators' | 'targets22' | 'adaptive-mgmt'
  | 'reporting-toolkit' | 't01' | 't02' | 't03' | 't04' | 't05' | 't06' | 't07'
  | 'verif-queue' | 'compliance' | 'risk' | 'reports' | 'stakeholders'
  | 'rbis' | 'data-pipeline' | 'map'

const TOOL_MAP: Partial<Record<TabId, string>> = {
  t01: 'T01', t02: 'T02', t03: 'T03', t04: 'T04', t05: 'T05', t06: 'T06', t07: 'T07',
}

function AppInner() {
  const { profile, initialized } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [linkedIndicator, setLinkedIndicator] = useState<number | null>(null)

  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      window.history.replaceState({}, '', '/')
    }
  }, [])

  if (!initialized) return <FullPageLoader />
  if (!profile) return <LoginPage onSuccess={() => setActiveTab('dashboard')} />

  const switchTab = (tab: TabId) => {
    setActiveTab(tab)
    setLinkedIndicator(null)
  }

  const goToIndicator = (id: number) => {
    setLinkedIndicator(id)
    setActiveTab('indicators')
  }

  const defaultTool = TOOL_MAP[activeTab]
  const isToolTab = activeTab in TOOL_MAP

  const renderPage = () => {
    if (activeTab === 'dashboard') return <Dashboard onSwitchTab={switchTab} />
    if (activeTab === 'indicators') return <Indicators linkedId={linkedIndicator} onClearLink={() => setLinkedIndicator(null)} />
    if (activeTab === 'targets22') return <Targets22 onViewIndicator={goToIndicator} />
    if (activeTab === 'adaptive-mgmt') return <AdaptiveMgmt />
    if (activeTab === 'reporting-toolkit' || isToolTab) return <ReportingToolkit defaultTool={defaultTool} />
    if (activeTab === 'verif-queue') return <VerifQueue />
    if (activeTab === 'compliance') return <Compliance onSwitchTab={switchTab} />
    if (activeTab === 'risk') return <RiskRegister />
    if (activeTab === 'reports') return <Reports />
    if (activeTab === 'stakeholders') return <Stakeholders />
    if (activeTab === 'rbis') return <RBIS />
    if (activeTab === 'data-pipeline') return <DataPipeline />
    if (activeTab === 'map') return <DistrictMap />
    return null
  }

  return (
    <DashboardShell activeTab={activeTab} onTabChange={switchTab}>
      {renderPage()}
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f2744,#0c1e38)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌿</div>
        <div style={{ width: '36px', height: '36px', border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ color: '#7dd3fc', fontFamily: "'DM Mono',monospace", fontSize: '.8rem' }}>Initializing NBSAP Portal…</p>
      </div>
    </div>
  )
}
