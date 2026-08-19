import React from 'react'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#F1F5F9',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const DEGREE_PROGRAMS = [
  'Bachelor of Science in Computer Science',
  'Bachelor of Science in Information Technology',
  'Bachelor of Science in Nursing',
  'Bachelor of Science in Education',
  'Bachelor of Arts in Communication',
]

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const NewStudentForm = ({ showForm, handleSubmit, form, setForm, submitting }) => {
  if (!showForm) return null

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(99,102,241,0.6)'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
  }
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 18,
      padding: '28px',
      marginBottom: 28,
      backdropFilter: 'blur(10px)',
    }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 20 }}>
        New Student
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
          {[
            ['First Name', 'firstName', 'text'],
            ['Middle Name', 'middleName', 'text'],
            ['Last Name', 'lastName', 'text'],
            ['Email', 'email', 'email']
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={key !== 'middleName'}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Degree Program
            </label>
            <select
              value={form.degreeProgram}
              onChange={e => setForm({ ...form, degreeProgram: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            >
              <option value="" disabled>Select program</option>
              {DEGREE_PROGRAMS.map(p => <option key={p} value={p} style={{ background: '#0A0F1E' }}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Year Level
            </label>
            <select
              value={form.yearLevel}
              onChange={e => setForm({ ...form, yearLevel: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            >
              <option value="" disabled>Select year</option>
              {YEAR_LEVELS.map(y => <option key={y} value={y} style={{ background: '#0A0F1E' }}>{y}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? 'rgba(99,102,241,0.35)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 18px rgba(99,102,241,0.2)',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {submitting ? 'Saving...' : 'Save Student'}
        </button>
      </form>
    </div>
  )
}

export default NewStudentForm
