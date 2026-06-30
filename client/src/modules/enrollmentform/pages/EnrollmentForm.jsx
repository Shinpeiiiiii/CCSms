import { useState } from 'react'
import axios from 'axios'
import NavHeader from '../../home/components/NavHeader'
import { Link } from 'react-router-dom'

const PROGRAMS = [
  'BS Information Technology',
  'BS Computer Science',
  'BS Computer Engineering',
  'BS Education',
]

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

/* ─── Shared input style ─── */
const inputBase = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 14px',
  color: '#F1F5F9',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

/* ─── FormField wrapper ─── */
const FormField = ({ label, required, children }) => (
  <div>
    <label
      style={{
        display: 'block',
        color: '#64748B',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {label}
      {required && <span style={{ color: '#6366F1', marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
)

/* ─── StyledInput ─── */
const StyledInput = ({ type = 'text', placeholder, value, onChange, required }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="form-input"
    style={inputBase}
    onFocus={e => {
      e.target.style.borderColor = 'rgba(99,102,241,0.6)'
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
    }}
    onBlur={e => {
      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
      e.target.style.boxShadow = 'none'
    }}
  />
)

/* ─── StyledSelect ─── */
const StyledSelect = ({ value, onChange, required, children }) => (
  <div style={{ position: 'relative' }}>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="form-select"
      style={{
        ...inputBase,
        cursor: 'pointer',
        paddingRight: 38,
      }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(99,102,241,0.6)'
        e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.1)'
        e.target.style.boxShadow = 'none'
      }}
    >
      {children}
    </select>
    {/* Chevron icon */}
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </div>
)

/* ─── Toast ─── */
const Toast = ({ toast }) => {
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div
      className="toast-enter"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 200,
        background: isSuccess ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
        color: isSuccess ? '#6EE7B7' : '#FCA5A5',
        padding: '14px 20px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        backdropFilter: 'blur(12px)',
        maxWidth: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      {isSuccess ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      <span>{toast.message}</span>
    </div>
  )
}

/* ─── Main Component ─── */
const EnrollmentForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    program: '',
    yearLevel: '',
  })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4500)
  }

  const handleChange = field => e =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/enrollment', form)
      showToast('success', 'Application submitted! Our registrar will contact you within 2–3 business days.')
      setForm({ firstName: '', middleName: '', lastName: '', email: '', program: '', yearLevel: '' })
    } catch (error) {
      console.error(error)
      showToast('error', 'Submission failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E' }}>
      <NavHeader />
      <Toast toast={toast} />

      {/* Page body */}
      <div
        className="enrollment-layout"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '56px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.45fr',
          gap: 56,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Info Panel ── */}
        <div style={{ paddingTop: 16 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#6366F1',
              fontSize: 14,
              textDecoration: 'none',
              fontWeight: 500,
              marginBottom: 40,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </Link>

          {/* Open badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.28)',
              padding: '6px 16px',
              borderRadius: 100,
              marginBottom: 24,
            }}
          >
            <span
              className="pulse-dot"
              style={{ width: 7, height: 7, background: '#6EE7B7', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}
            />
            <span style={{ color: '#A5B4FC', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
              AY 2025–2026 OPEN
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              color: '#F1F5F9',
              marginBottom: 20,
              letterSpacing: '-0.025em',
            }}
          >
            Start Your
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8, #A78BFA, #C084FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Academic Journey
            </span>
          </h1>

          <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: 48, fontSize: '0.9375rem', maxWidth: 360 }}>
            Complete the enrollment form. Once submitted, our registrar reviews your application and will contact you shortly.
          </p>

          {/* Info items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                color: '#6366F1',
                bg: 'rgba(99,102,241,0.1)',
                text: 'Review takes 2–3 business days',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                color: '#8B5CF6',
                bg: 'rgba(139,92,246,0.1)',
                text: 'Confirmation sent via email',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                color: '#A78BFA',
                bg: 'rgba(167,139,250,0.1)',
                text: 'Your data is secured and encrypted',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
            ].map(({ color, bg, text, icon }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form Card ── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: '40px 36px',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Card header */}
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: '1.375rem',
                color: '#F1F5F9',
                marginBottom: 6,
              }}
            >
              Enrollment Application
            </h2>
            <p style={{ color: '#334155', fontSize: '0.875rem' }}>
              All fields marked with <span style={{ color: '#6366F1' }}>*</span> are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Name row */}
            <div
              className="name-row"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
            >
              <FormField label="First Name" required>
                <StyledInput
                  placeholder="e.g. Juan"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  required
                />
              </FormField>
              <FormField label="Middle Name">
                <StyledInput
                  placeholder="Optional"
                  value={form.middleName}
                  onChange={handleChange('middleName')}
                />
              </FormField>
            </div>

            <FormField label="Last Name" required>
              <StyledInput
                placeholder="e.g. Dela Cruz"
                value={form.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <StyledInput
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
                required
              />
            </FormField>

            {/* Divider */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                margin: '4px 0',
              }}
            />

            <FormField label="Program" required>
              <StyledSelect
                value={form.program}
                onChange={handleChange('program')}
                required
              >
                <option value="">Select a degree program</option>
                {PROGRAMS.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </StyledSelect>
            </FormField>

            <FormField label="Year Level" required>
              <StyledSelect
                value={form.yearLevel}
                onChange={handleChange('yearLevel')}
                required
              >
                <option value="">Select your year level</option>
                {YEAR_LEVELS.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </StyledSelect>
            </FormField>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={loading ? '' : 'btn-primary'}
              style={{
                marginTop: 8,
                background: loading
                  ? 'rgba(99,102,241,0.35)'
                  : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                padding: '15px',
                borderRadius: 12,
                border: 'none',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 28px rgba(99,102,241,0.3)',
                transition: 'all 0.25s ease',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', color: '#1E293B', fontSize: 12, lineHeight: 1.6 }}>
              By submitting, you agree to our enrollment terms and conditions.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default EnrollmentForm