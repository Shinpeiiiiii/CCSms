import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import { loginUser } from '../services/auth.services'

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const token = useAuthStore((state) => state.token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginUser({ 
        email, password 
      })

      console.log("Login response:",data)
      //localStorage.setItem('token', data.token)
      login(data)
      console.log("After login:",useAuthStore.getState())
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.22) 0%, transparent 60%), #0A0F1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '8%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center' }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.45)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20, color: '#F1F5F9' }}>
              TeacherPortal
            </span>
          </Link>
          <p style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(20px)',
        }}>
          <Link to= "/">
            Back
          </Link>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: '#F1F5F9',
            marginBottom: 6,
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#334155', fontSize: 14, marginBottom: 32 }}>
            Enter your credentials to access the portal.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5',
              padding: '12px 16px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="form-input"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                  padding: '12px 14px', color: '#F1F5F9', fontSize: 14,
                  outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ color: '#6366F1', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                  padding: '12px 14px', color: '#F1F5F9', fontSize: 14,
                  outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={loading ? '' : 'btn-primary'}
              style={{
                marginTop: 8,
                background: loading ? 'rgba(99,102,241,0.35)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                padding: '13px', borderRadius: 12, border: 'none',
                fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.3)',
                transition: 'all 0.25s ease',
                fontFamily: 'Inter, sans-serif', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Login