import { useEffect, useState } from 'react'
import DashboardLayout from '../../../shared/layouts/DashboardLayout'
import { getStudents, createStudent, deleteStudent } from '../services/student.service'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, padding: '10px 14px',
  color: '#F1F5F9', fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box',
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

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: '', middleName: '', lastName: '', email: '', degreeProgram: '', yearLevel: '' })
  const [deleteId, setDeleteId] = useState(null)

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newStudent = await createStudent(form)
      if (newStudent) setStudents(prev => [...prev, newStudent])
      setForm({ firstName: '', middleName: '', lastName: '', email: '', degreeProgram: '', yearLevel: '' })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await deleteStudent(id)
      setStudents(prev => prev.filter(s => s._id !== id))
    } catch (e) { console.error(e) }
    finally { setDeleteId(null) }
  }

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleFocus = (e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }
  const handleBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#F1F5F9', marginBottom: 4 }}>Students</h1>
          <p style={{ color: '#475569', fontSize: 13 }}>{students.length} students enrolled</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: 220, paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>
          {/* Add student button */}
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: showForm ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: showForm ? '#818CF8' : 'white',
              border: showForm ? '1px solid rgba(99,102,241,0.3)' : 'none',
              padding: '9px 18px', borderRadius: 10, fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: showForm ? 'none' : '0 0 18px rgba(99,102,241,0.25)',
              transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {showForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18, padding: '28px', marginBottom: 28, backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 20 }}>New Student</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
              {[['First Name', 'firstName', 'text'], ['Middle Name', 'middleName', 'text'], ['Last Name', 'lastName', 'text'], ['Email', 'email', 'email']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={label} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required={key !== 'middleName'} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Degree Program</label>
                <select value={form.degreeProgram} onChange={e => setForm({ ...form, degreeProgram: e.target.value })}
                  style={{ ...inputStyle }} onFocus={handleFocus} onBlur={handleBlur} required>
                  <option value="" disabled>Select program</option>
                  {DEGREE_PROGRAMS.map(p => <option key={p} value={p} style={{ background: '#0A0F1E' }}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Year Level</label>
                <select value={form.yearLevel} onChange={e => setForm({ ...form, yearLevel: e.target.value })}
                  style={{ ...inputStyle }} onFocus={handleFocus} onBlur={handleBlur} required>
                  <option value="" disabled>Select year</option>
                  {YEAR_LEVELS.map(y => <option key={y} value={y} style={{ background: '#0A0F1E' }}>{y}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} style={{
              background: submitting ? 'rgba(99,102,241,0.35)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white', border: 'none', padding: '10px 24px', borderRadius: 10,
              fontWeight: 600, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 18px rgba(99,102,241,0.2)', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {submitting ? 'Saving...' : 'Save Student'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#334155' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" style={{ display: 'block', margin: '0 auto 16px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
            <p style={{ color: '#334155', fontSize: 14 }}>{search ? 'No students match your search.' : 'No students yet. Add your first student!'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name', 'Email', 'Degree Program', 'Year Level', 'Actions'].map(col => (
                    <th key={col} style={{
                      padding: '14px 20px', textAlign: 'left',
                      color: '#334155', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#A5B4FC', fontSize: 12, fontWeight: 700,
                        }}>
                          {s.firstName?.[0] || '?'}
                        </div>
                        <span style={{ color: '#E2E8F0', fontWeight: 500, fontSize: 14 }}>
                          {[s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748B', fontSize: 13 }}>{s.email}</td>
                    <td style={{ padding: '14px 20px', color: '#64748B', fontSize: 13 }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.1)', color: '#818CF8',
                        padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                      }}>
                        {s.degreeProgram || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748B', fontSize: 13 }}>{s.yearLevel || '—'}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => handleDelete(s._id)}
                        disabled={deleteId === s._id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#FCA5A5', padding: '6px 12px', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s', opacity: deleteId === s._id ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                        type="button"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                        </svg>
                        {deleteId === s._id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  )
}

export default Students
