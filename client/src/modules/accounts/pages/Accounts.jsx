import { useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../../shared/layouts/DashboardLayout'
import useAuthStore from '../../auth/state/auth-store'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, padding: '12px 14px',
  color: '#F1F5F9', fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const handleFocus = (e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }
const handleBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }

const ROLES = ['teacher', 'registrar', 'admin']

const Accounts = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'teacher' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')
    try {
      const token = useAuthStore.getState().token;
      await axios.post('http://localhost:5000/api/accounts/create', form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess(true)
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'teacher' })
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleColors = { teacher: '#6EE7B7', registrar: '#93C5FD', admin: '#FCD34D' }
  const roleBg = { teacher: 'rgba(16,185,129,0.1)', registrar: 'rgba(59,130,246,0.1)', admin: 'rgba(245,158,11,0.1)' }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#F1F5F9', marginBottom: 4 }}>
          Account Management
        </h1>
        <p style={{ color: '#475569', fontSize: 13 }}>Create and manage portal user accounts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>
        {/* Form card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 22, padding: '32px', backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: 'rgba(99,102,241,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: '#F1F5F9', marginBottom: 2 }}>Create New Account</h2>
              <p style={{ color: '#334155', fontSize: 12 }}>Assign portal access to a team member</p>
            </div>
          </div>

          {/* Success */}
          {success && (
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              color: '#6EE7B7', padding: '12px 16px', borderRadius: 10,
              fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Account created successfully!
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#FCA5A5', padding: '12px 16px', borderRadius: 10,
              fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['First Name', 'firstName', 'text'],
              ['Last Name', 'lastName', 'text'],
              ['Email Address', 'email', 'email'],
              ['Password', 'password', 'password'],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 7 }}>
                  {label} <span style={{ color: '#6366F1' }}>*</span>
                </label>
                <input
                  type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={label} required style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>
            ))}

            {/* Role */}
            <div>
              <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
                Role <span style={{ color: '#6366F1' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {ROLES.map(r => (
                  <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                    style={{
                      flex: 1, minWidth: 80, padding: '9px 12px', borderRadius: 10,
                      border: form.role === r ? `1px solid ${roleColors[r]}40` : '1px solid rgba(255,255,255,0.08)',
                      background: form.role === r ? roleBg[r] : 'rgba(255,255,255,0.03)',
                      color: form.role === r ? roleColors[r] : '#475569',
                      fontWeight: form.role === r ? 700 : 500, fontSize: 13, cursor: 'pointer',
                      textTransform: 'capitalize', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                marginTop: 8,
                background: loading ? 'rgba(99,102,241,0.35)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                border: 'none', padding: '13px', borderRadius: 12,
                fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.25)',
                fontFamily: 'Inter, sans-serif', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.25s ease',
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '24px',
          }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 14, color: '#F1F5F9', marginBottom: 16 }}>Role Permissions</h3>
            {[
              { role: 'Teacher', color: '#6EE7B7', bg: 'rgba(16,185,129,0.1)', desc: 'View students, manage attendance, update grades' },
              { role: 'Registrar', color: '#93C5FD', bg: 'rgba(59,130,246,0.1)', desc: 'Review enrollment applications, manage student records' },
              { role: 'Admin', color: '#FCD34D', bg: 'rgba(245,158,11,0.1)', desc: 'Full access: all features + account management' },
            ].map(({ role, color, bg, desc }) => (
              <div key={role} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px', borderRadius: 12, marginBottom: 8, background: bg,
              }}>
                <span style={{
                  flexShrink: 0, padding: '2px 10px', borderRadius: 100,
                  background: `${color}20`, color, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 1,
                }}>
                  {role}
                </span>
                <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 16, padding: '18px 20px',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>
              Created accounts will receive an email invitation to set up their password on first login.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  )
}

export default Accounts