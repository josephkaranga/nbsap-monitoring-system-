// src/hooks/useAuth.tsx
// ============================================================
// Authentication context + hook — wraps Supabase auth
// ============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile, UserRole, UserPreferences } from '../types/database'
import { ROLE_PERMISSIONS } from '../types/database'

// ── Types ─────────────────────────────────────────────────

interface AuthContextValue {
  // State
  user: User | null
  profile: Profile | null
  preferences: UserPreferences | null
  session: Session | null
  loading: boolean
  initialized: boolean

  // Auth actions
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, meta: SignUpMeta) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>

  // Profile actions
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
  refreshProfile: () => Promise<void>

  // Role helpers
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => boolean
  isRole: (...roles: UserRole[]) => boolean
}

interface SignUpMeta {
  full_name: string
  role?: UserRole
  organization?: string
  district?: string
  province?: string
}

// ── Context ───────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // ── Fetch profile + preferences ────────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // 5s timeout on profile fetch to prevent hanging
      const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 5000))
      const [profileRes, prefsRes] = await Promise.all([
        Promise.race([supabase.from('profiles').select('*').eq('id', userId).single(), timeout]),
        Promise.race([supabase.from('user_preferences').select('*').eq('user_id', userId).single(), timeout]),
      ])

      if (profileRes && 'data' in profileRes && profileRes.data) setProfile(profileRes.data)
      if (prefsRes && 'data' in prefsRes && prefsRes.data) setPreferences(prefsRes.data)

      // Update last_login (non-blocking, fire and forget)
      supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', userId)
    } catch (err) {
      console.error('fetchProfile error:', err)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  // ── Bootstrap auth state ───────────────────────────────
  useEffect(() => {
    // Hard 8s timeout — always resolve initialized no matter what
    const safetyTimer = setTimeout(() => setInitialized(true), 8000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => {
          clearTimeout(safetyTimer)
          setInitialized(true)
        })
      } else {
        clearTimeout(safetyTimer)
        setInitialized(true)
      }
    }).catch(() => {
      clearTimeout(safetyTimer)
      setInitialized(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id)
          setInitialized(true)
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
          setPreferences(null)
          setInitialized(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── Sign in ────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (!error) {
        // Audit log
        await supabase.from('audit_logs').insert({
          action_type: 'login',
          action: 'User signed in',
          detail: email,
        })
      }

      return { error }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Sign up ────────────────────────────────────────────
  const signUp = useCallback(async (
    email: string,
    password: string,
    meta: SignUpMeta
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Sign out ───────────────────────────────────────────
  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      // Audit log before signing out
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action_type: 'logout',
          action: 'User signed out',
        })
      }
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }, [user])

  // ── Reset password ─────────────────────────────────────
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }, [])

  // ── Update password ────────────────────────────────────
  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error }
  }, [])

  // ── Update profile ─────────────────────────────────────
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (data) setProfile(data)
  }, [user])

  // ── Update preferences ─────────────────────────────────
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) return
    const { data } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()
    if (data) setPreferences(data)
  }, [user])

  // ── Permission helpers ─────────────────────────────────
  const hasPermission = useCallback((
    permission: keyof typeof ROLE_PERMISSIONS[UserRole]
  ) => {
    if (!profile) return false
    return ROLE_PERMISSIONS[profile.role][permission] as boolean
  }, [profile])

  const isRole = useCallback((...roles: UserRole[]) => {
    if (!profile) return false
    return roles.includes(profile.role)
  }, [profile])

  const value: AuthContextValue = {
    user,
    profile,
    preferences,
    session,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    updatePreferences,
    refreshProfile,
    hasPermission,
    isRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Consumer hook ──────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}

// ── Standalone session hook ────────────────────────────────

export function useSession() {
  const { session, user, loading, initialized } = useAuth()
  return { session, user, loading, initialized, isAuthenticated: !!session }
}
