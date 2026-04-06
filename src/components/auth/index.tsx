// src/components/auth/LoginPage.tsx
// ============================================================
// Production login page with role-aware sign-in
// ============================================================

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onSuccess?: () => void
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { signIn, loading, user } = useAuth()
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user && onSuccess) onSuccess()
  }, [user, onSuccess])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }

    const { error: authError } = await signIn(email, password)
    if (authError) {
      if (authError.message.includes('Invalid login')) {
        setError('Incorrect email or password. Please try again.')
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in.')
      } else {
        setError(authError.message)
      }
    } else {
      onSuccess?.()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2744 0%, #0c1e38 60%, #071628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(56,189,248,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>

        {/* Logo + brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            boxShadow: '0 8px 24px rgba(56,189,248,0.3)',
          }}>🌿</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem', fontWeight: 700,
            color: '#fff', margin: '0 0 4px',
            letterSpacing: '0.5px',
          }}>NBSAP Portal</h1>
          <p style={{ fontSize: '.8rem', color: 'rgba(125,211,252,0.7)', margin: 0 }}>
            National Biodiversity Strategy · Rwanda
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@rema.gov.rw"
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#38bdf8'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#38bdf8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'rgba(125,211,252,0.6)',
                    cursor: 'pointer', fontSize: '14px',
                    padding: '4px',
                  }}
                >{showPassword ? '🙈' : '👁'}</button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={{
                  background: 'none', border: 'none',
                  color: '#38bdf8', fontSize: '.78rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                  textDecoration: 'underline',
                }}
              >Forgot password?</button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.4)',
                borderRadius: '8px', padding: '10px 14px',
                color: '#fca5a5', fontSize: '.8rem',
                marginBottom: '16px',
              }}>⚠ {error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading
                  ? 'rgba(56,189,248,0.3)'
                  : 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontSize: '.9rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all .2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(14,165,233,0.3)',
              }}
            >
              {loading ? '⏳ Signing in…' : 'Sign In →'}
            </button>
          </form>
        ) : (
          <ForgotPasswordForm onBack={() => setMode('login')} />
        )}

        {/* Role legend */}
        <div style={{
          marginTop: '28px',
          padding: '14px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '.65rem', color: 'rgba(125,211,252,0.5)', marginBottom: '8px', fontFamily: "'DM Mono',monospace", letterSpacing: '.08em', textTransform: 'uppercase' }}>Access Levels</p>
          {[
            { role: 'Admin', color: '#8b5cf6', desc: 'Full access · Verifications · User management' },
            { role: 'Sector Officer', color: '#0ea5e9', desc: 'Reports · Approve submissions · Analytics' },
            { role: 'District Officer', color: '#10b981', desc: 'Submit reports · View own district data' },
            { role: 'Viewer', color: '#6b7280', desc: 'Read-only public dashboard' },
          ].map(r => (
            <div key={r.role} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, marginTop: '4px', flexShrink: 0 }} />
              <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.5)' }}>
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{r.role}:</strong> {r.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Forgot Password ────────────────────────────────────────

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error: err } = await resetPassword(email)
    if (err) setError(err.message)
    else setSent(true)
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📬</div>
      <p style={{ color: '#e0f2fe', fontSize: '.9rem', fontWeight: 600, marginBottom: '8px' }}>Check your inbox</p>
      <p style={{ color: 'rgba(224,242,254,0.6)', fontSize: '.8rem' }}>Password reset link sent to <strong>{email}</strong></p>
      <button onClick={onBack} style={{ ...backBtnStyle, marginTop: '20px' }}>← Back to login</button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: 'rgba(224,242,254,0.7)', fontSize: '.82rem', marginBottom: '20px' }}>
        Enter your email and we'll send you a password reset link.
      </p>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Email Address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="officer@rema.gov.rw" required style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#38bdf8'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
        />
      </div>
      {error && <div style={{ color: '#fca5a5', fontSize: '.78rem', marginBottom: '12px' }}>⚠ {error}</div>}
      <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        Send Reset Link
      </button>
      <button type="button" onClick={onBack} style={{ ...backBtnStyle, marginTop: '12px' }}>← Back to login</button>
    </form>
  )
}

// ── Style helpers ──────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '.68rem', fontWeight: 600,
  color: 'rgba(125,211,252,0.7)',
  letterSpacing: '.08em', textTransform: 'uppercase',
  marginBottom: '6px', fontFamily: "'DM Mono',monospace",
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: '9px',
  color: '#fff', fontSize: '.85rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .2s',
  boxSizing: 'border-box',
}

const backBtnStyle: React.CSSProperties = {
  width: '100%', padding: '10px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '9px',
  color: 'rgba(125,211,252,0.7)', fontSize: '.82rem',
  cursor: 'pointer', fontFamily: 'inherit',
  display: 'block', textAlign: 'center',
}


// ============================================================
// src/components/auth/ProtectedRoute.tsx
// ============================================================

import type { UserRole } from '../../types/database'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallback?: React.ReactNode
  redirectToLogin?: boolean
}

export function ProtectedRoute({
  children,
  requiredRoles,
  fallback,
  redirectToLogin = true,
}: ProtectedRouteProps) {
  const { profile, initialized, loading } = useAuth()

  if (!initialized || loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f2744',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '3px solid rgba(56,189,248,0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#7dd3fc', fontSize: '.85rem', fontFamily: "'DM Mono',monospace" }}>
            Loading session…
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    if (redirectToLogin) return <LoginPage />
    return fallback ? <>{fallback}</> : null
  }

  if (requiredRoles && !requiredRoles.includes(profile.role)) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{
          maxWidth: '400px', textAlign: 'center',
          padding: '40px 24px',
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Access Restricted
          </h2>
          <p style={{ fontSize: '.85rem', color: '#64748b', lineHeight: 1.6 }}>
            Your role (<strong>{profile.role.replace('_', ' ')}</strong>) doesn't have
            access to this section. Contact your REMA administrator if you believe this is an error.
          </p>
          <div style={{
            marginTop: '20px',
            background: '#f1f5f9',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '.75rem',
            color: '#64748b',
            fontFamily: "'DM Mono',monospace",
          }}>
            Required: {requiredRoles.map(r => r.replace('_', ' ')).join(' or ')}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


// ============================================================
// src/components/auth/RoleGuard.tsx — inline permission gate
// ============================================================

interface RoleGuardProps {
  permission?: keyof (typeof ROLE_PERMISSIONS)[UserRole]
  roles?: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

import { ROLE_PERMISSIONS } from '../../types/database'

export function RoleGuard({ permission, roles, children, fallback = null }: RoleGuardProps) {
  const { profile, hasPermission, isRole } = useAuth()

  if (!profile) return <>{fallback}</>

  if (permission && !hasPermission(permission as any)) return <>{fallback}</>
  if (roles && !isRole(...roles)) return <>{fallback}</>

  return <>{children}</>
}


// ============================================================
// src/components/auth/SignUpPage.tsx
// ============================================================

export function SignUpPage() {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', organization: '', district: '', province: '',
    role: 'viewer' as UserRole,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const PROVINCES = ['Kigali', 'North', 'South', 'East', 'West']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    const { error: err } = await signUp(
      formData.email,
      formData.password,
      {
        full_name: formData.full_name,
        organization: formData.organization,
        district: formData.district,
        province: formData.province,
        role: formData.role,
      }
    )

    if (err) setError(err.message)
    else setSuccess(true)
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#fff' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
      <h2>Account Created</h2>
      <p style={{ color: '#7dd3fc' }}>
        Check your email to confirm your account, then sign in.
      </p>
    </div>
  )

  const field = (key: keyof typeof formData, label: string, type = 'text', required = true) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#f43f5e' }}> *</span>}</label>
      <input
        type={type}
        value={formData[key] as string}
        onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
        required={required}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#38bdf8'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      {field('full_name', 'Full Name')}
      {field('email', 'Email', 'email')}
      {field('password', 'Password', 'password')}
      {field('confirmPassword', 'Confirm Password', 'password')}
      {field('organization', 'Organization / Ministry', 'text', false)}

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Province</label>
        <select
          value={formData.province}
          onChange={e => setFormData(p => ({ ...p, province: e.target.value }))}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">— Select province —</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {field('district', 'District', 'text', false)}

      {error && (
        <div style={{
          background: 'rgba(244,63,94,0.15)',
          border: '1px solid rgba(244,63,94,0.4)',
          borderRadius: '8px', padding: '10px 14px',
          color: '#fca5a5', fontSize: '.8rem', marginBottom: '16px',
        }}>⚠ {error}</div>
      )}

      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', padding: '12px',
          background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
          border: 'none', borderRadius: '10px',
          color: '#fff', fontSize: '.9rem', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        }}
      >
        {loading ? '⏳ Creating Account…' : 'Create Account →'}
      </button>
    </form>
  )
}
