import React from 'react'

const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  padding: '10px 14px',
  color: '#111827',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
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

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      padding: '24px',
      marginBottom: 24,
    }}>
      <h2 style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 20 }}>
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
              <label style={{ display: 'block', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
                style={inputStyle}
                required={key !== 'middleName'}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>
              Degree Program
            </label>
            <select
              value={form.degreeProgram}
              onChange={e => setForm({ ...form, degreeProgram: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="" disabled>Select program</option>
              {DEGREE_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>
              Year Level
            </label>
            <select
              value={form.yearLevel}
              onChange={e => setForm({ ...form, yearLevel: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="" disabled>Select year</option>
              {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? '#D1D5DB' : '#111827',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 13,
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.15s',
          }}
        >
          {submitting ? 'Saving...' : 'Save Student'}
        </button>
      </form>
    </div>
  )
}

export default NewStudentForm
