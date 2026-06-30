import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/auth.services'

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerUser({ email, password })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(139,92,246,0.2) 0%, transparent 60%), #0A0F1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center' }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          <p style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>Create your account to get started</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '40px 36px',
          backdropFilter: 'blur(20px)',
        }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#F1F5F9', marginBottom: 6 }}>
            Create an account
          </h1>
          <p style={{ color: '#334155', fontSize: 14, marginBottom: 32 }}>
            Fill in your details to register.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', padding: '12px 16px', borderRadius: 10,
              fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email Address <span style={{ color: '#6366F1' }}>*</span>
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
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
              <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                Password <span style={{ color: '#6366F1' }}>*</span>
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required
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
              type="submit" disabled={loading}
              className={loading ? '' : 'btn-primary'}
              style={{
                marginTop: 8,
                background: loading ? 'rgba(99,102,241,0.35)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                padding: '13px', borderRadius: 12, border: 'none',
                fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.3)',
                transition: 'all 0.25s ease', fontFamily: 'Inter, sans-serif', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#334155', fontSize: 13, marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Register