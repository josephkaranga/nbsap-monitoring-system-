import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { signIn, signUp, resetPassword, loading, user } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { if (user && onSuccess) onSuccess() }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: err } = await signIn(email, password)
    if (err) {
      if (err.message.includes('Invalid login')) setError('Incorrect email or password.')
      else if (err.message.includes('Email not confirmed')) setError('Please verify your email before signing in.')
      else setError(err.message)
    } else { onSuccess?.() }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    const { error: err } = await signUp(email, password, { full_name: fullName })
    if (err) setError(err.message)
    else setSuccess('Account created! Check your email to confirm, then sign in.')
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: err } = await resetPassword(email)
    if (err) setError(err.message)
    else setSuccess('Password reset link sent to ' + email)
  }

  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(255,255,255,.12)', borderRadius: '9px', color: '#fff', fontSize: '.85rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '.68rem', fontWeight: 600, color: 'rgba(125,211,252,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'DM Mono',monospace" }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2744 0%,#0c1e38 60%,#071628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,.4)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', boxShadow: '0 8px 24px rgba(56,189,248,.3)' }}>🌿</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>NBSAP Portal</h1>
          <p style={{ fontSize: '.8rem', color: 'rgba(125,211,252,.7)', margin: 0 }}>National Biodiversity Strategy · Rwanda</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', borderRadius: '10px', padding: '3px', marginBottom: '24px' }}>
          {(['login', 'signup'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => { setMode(tab); setError(''); setSuccess('') }} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '.82rem', fontWeight: 600, background: mode === tab ? 'rgba(56,189,248,.2)' : 'transparent', color: mode === tab ? '#38bdf8' : 'rgba(125,211,252,.5)', transition: 'all .2s' }}>
              {tab === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {success && <div style={{ background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.4)', borderRadius: '8px', padding: '10px 14px', color: '#6ee7b7', fontSize: '.8rem', marginBottom: '16px' }}>✓ {success}</div>}
        {error && <div style={{ background: 'rgba(244,63,94,.15)', border: '1px solid rgba(244,63,94,.4)', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '.8rem', marginBottom: '16px' }}>⚠ {error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Email Address</label>
              <input id="login-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="officer@rema.gov.rw" required autoComplete="email" style={inp} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={lbl}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" style={{ ...inp, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(125,211,252,.6)', cursor: 'pointer', fontSize: '14px' }}>{showPassword ? '🙈' : '👁'}</button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? 'rgba(56,189,248,.3)' : 'linear-gradient(135deg,#0ea5e9,#38bdf8)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Signing in…' : 'Sign In →'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>Full Name</label>
              <input id="signup-fullname" name="full_name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={inp} placeholder="Your full name" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>Email</label>
              <input id="signup-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} placeholder="officer@rema.gov.rw" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>Password</label>
              <input id="signup-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inp} placeholder="Min. 8 characters" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Confirm Password</label>
              <input id="signup-confirm" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inp} placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Creating…' : 'Create Account →'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot}>
            <p style={{ color: 'rgba(224,242,254,.7)', fontSize: '.82rem', marginBottom: '20px' }}>Enter your email and we'll send a reset link.</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Email Address</label>
              <input id="forgot-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} placeholder="officer@rema.gov.rw" />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Send Reset Link</button>
            <button type="button" onClick={() => setMode('login')} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,.12)', borderRadius: '9px', color: 'rgba(125,211,252,.7)', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit', marginTop: '10px' }}>← Back to Sign In</button>
          </form>
        )}

        {/* Role legend */}
        <div style={{ marginTop: '28px', padding: '14px', background: 'rgba(255,255,255,.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,.06)' }}>
          <p style={{ fontSize: '.65rem', color: 'rgba(125,211,252,.5)', marginBottom: '8px', fontFamily: "'DM Mono',monospace", letterSpacing: '.08em', textTransform: 'uppercase' }}>Access Levels</p>
          {[
            { role: 'Admin', color: '#8b5cf6', desc: 'Full access · Verifications · User management' },
            { role: 'Sector Officer', color: '#0ea5e9', desc: 'Reports · Approve submissions · Analytics' },
            { role: 'District Officer', color: '#10b981', desc: 'Submit reports · View own district data' },
            { role: 'Viewer', color: '#6b7280', desc: 'Read-only public dashboard' },
          ].map(r => (
            <div key={r.role} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, marginTop: '4px', flexShrink: 0 }} />
              <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)' }}><strong style={{ color: 'rgba(255,255,255,.75)' }}>{r.role}:</strong> {r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
