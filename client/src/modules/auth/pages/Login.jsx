import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import { loginUser } from '../services/auth.services'
import { Layers, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const token = useAuthStore((state) => state.token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [submitHovered, setSubmitHovered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginUser({ 
        email, password 
      })
      login(data)
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
        background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(26,115,232,0.08) 0%, transparent 60%), #F8F9FA',
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
        background: 'radial-gradient(circle, rgba(26,115,232,0.03) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '8%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(139,92,246,0.02) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center' }}>
            <div style={{
              width: 44, height: 44,
              background: '#1A73E8',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(26,115,232,0.2)',
              color: '#FFFFFF',
            }}>
              <Layers size={22} />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: '#202124' }}>
              School Portal Management System
            </span>
          </Link>
          <p style={{ color: '#5F6368', fontSize: 13, marginTop: 8 }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #DADCE0',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6, 
              color: '#1A73E8', 
              textDecoration: 'none', 
              fontSize: 13, 
              fontWeight: 500,
              marginBottom: 20
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '1.375rem',
            color: '#202124',
            marginBottom: 6,
            marginTop: 0,
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#5F6368', fontSize: 14, marginBottom: 32, marginTop: 0 }}>
            Enter your credentials to access the portal.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FCE8E6',
              border: '1px solid #FAD2CF',
              color: '#C5221F',
              padding: '12px 16px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#5F6368', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" autoComplete="current-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="form-input"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  width: '100%', background: '#FFFFFF',
                  border: emailFocused ? '1px solid #1A73E8' : '1px solid #DADCE0', 
                  borderRadius: 10,
                  padding: '12px 14px', color: '#202124', fontSize: 14,
                  outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  boxShadow: emailFocused ? '0 0 0 3px rgba(26,115,232,0.12)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ color: '#5F6368', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ color: '#1A73E8', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  width: '100%', background: '#FFFFFF',
                  border: passwordFocused ? '1px solid #1A73E8' : '1px solid #DADCE0', 
                  borderRadius: 10,
                  padding: '12px 14px', color: '#202124', fontSize: 14,
                  outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  boxShadow: passwordFocused ? '0 0 0 3px rgba(26,115,232,0.12)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{
                marginTop: 8,
                background: loading ? '#DADCE0' : submitHovered ? '#1765CC' : '#1A73E8',
                color: loading ? '#9AA0A6' : 'white',
                padding: '13px', borderRadius: 12, border: 'none',
                fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : submitHovered ? '0 2px 6px rgba(26,115,232,0.24)' : 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
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