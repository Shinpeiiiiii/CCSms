import { useEffect, useState } from 'react'
import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import { getApplications, updateApplicationStatus } from '../services/review.service'
import StatusBadge from '../components/StatusBadge'
import { TableSkeleton } from '@/components/toast/Skeleton'


const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, padding: '10px 14px',
  color: '#F1F5F9', fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const handleFocus = (e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }
const handleBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none' }

const EnrollmentReview = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'accepted', 'rejected', 'all'
  const [processingId, setProcessingId] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const data = await getApplications()
      setApplications(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      showFeedback('error', 'Failed to load enrollment applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000)
  }

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id)
    try {
      const dbStatus = status === 'accepted' ? 'Approved' : 'Rejected';
      await updateApplicationStatus(id, status)
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: dbStatus } : app))
      showFeedback('success', `Application has been successfully ${status}.`)
    } catch (err) {
      console.error(err)
      showFeedback('error', err.response?.data?.message || `Failed to update application to ${status}.`)
    } finally {
      setProcessingId(null)
    }
  }

  // Filter calculations
  const filtered = applications.filter(app => {
    const fullName = `${app.firstName || ''} ${app.middleName || ''} ${app.lastName || ''}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) || (app.email || '').toLowerCase().includes(search.toLowerCase())
    
    const dbStatus = (app.status || '').toLowerCase();
    let mappedStatus = 'pending';
    if (dbStatus === 'approved' || dbStatus === 'accepted') mappedStatus = 'accepted';
    if (dbStatus === 'rejected') mappedStatus = 'rejected';
    if (dbStatus === 'needs revision' || dbStatus === 'needs-revision') mappedStatus = 'needs-revision';
    
    const matchesTab = activeTab === 'all' || mappedStatus === activeTab
    return matchesSearch && matchesTab
  })

  // Stats summaries
  const pendingCount = applications.filter(app => (app.status || '').toLowerCase() === 'pending').length
  const acceptedCount = applications.filter(app => (app.status || '').toLowerCase() === 'approved' || (app.status || '').toLowerCase() === 'accepted').length
  const rejectedCount = applications.filter(app => (app.status || '').toLowerCase() === 'rejected').length
  const totalCount = applications.length

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'accepted' || s === 'approved') return { color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' }
    if (s === 'rejected') return { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' }
    return { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className='mb-7 flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='font-sora text-2xl font-extrabold text-slate-100 mb-1'>
            Enrollment Applications
          </h1>
          <p className='text-sm text-slate-400'>Review and manage student admission applications.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className='grid gap-5 mb-7 grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
        {[
          { label: 'Pending Review', count: pendingCount, color: '#FBBF24', bg: 'rgba(251,191,36,0.06)' },
          { label: 'Accepted Students', count: acceptedCount, color: '#34D399', bg: 'rgba(52,211,153,0.06)' },
          { label: 'Rejected Applications', count: rejectedCount, color: '#F87171', bg: 'rgba(248,113,113,0.06)' },
          { label: 'Total Submitted', count: totalCount, color: '#818CF8', bg: 'rgba(129,140,248,0.06)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: stat.bg, border: `1px solid ${stat.color}25`}}
            className='rounded-2xl px-6 py-5 flex flex-col gap-1'>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Sora, sans-serif', color: stat.color }}>{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Feedback banner */}
      {feedback.message && (
        <div style={{
          background: 
            feedback.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
          border: 
            feedback.type === 'success' ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(248,113,113,0.25)',
          color: 
            feedback.type === 'success' ? '#34D399' : '#F87171'}}

          className='mb-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm'>
            
          {feedback.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}

      {/* Table Card */}
      <div className='bg-white/2.5 border border-white/10 rounded-3xl py-6 backdrop-blur-md'>
        {/* Table Controls */}
        <div className='px-6 pb-5 flex items-center justify-between flex-wrap gap-4 border-b border-slate-800' >
          {/* Tabs */}
          <div style={{ background: 'rgba(255,255,255,0.03)',border: '1px solid rgba(255,255,255,0.06)' }}
                className='flex gap-1.5 p-1 rounded-xl'>
            {[
              { id: 'pending', label: 'Pending' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'all', label: 'All' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                      className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 cursor-pointer 
                      ${
                        activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400 font-medium hover:text-slate-200'
                      }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className='relative w-full max-w-70'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)}
                   onFocus={handleFocus} onBlur={handleBlur}
                   style={inputStyle}
                   className='pl-9'
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className='p-6'>
            <TableSkeleton rows={5} cols={5} isDark={true} />
          </div>
        ) : filtered.length === 0 ? (
          <div className='p-20 text-center'>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1.75" style={{ display: 'block', margin: '0 auto 16px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <p className='text-slate-400 text-sm'>
              {search ? 'No applications match your criteria.' : `No ${activeTab} applications found.`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Applicant', 'Program & Year', 'Date Submitted', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '16px 24px', textAlign: 'left',
                      color: '#94A3B8', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const statusColors = getStatusColor(app.status)
                  const fullName = [app.firstName, app.middleName, app.lastName].filter(Boolean).join(' ') || 'Unnamed Applicant'
                  const dateStr = app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
                  const programName = typeof app.program === 'object' ? app.program?.programName : (app.program || '—')

                  return (
                    <tr key={app._id} style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Applicant details */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#A5B4FC', fontSize: 13, fontWeight: 700,
                          }}>
                            {app.firstName?.[0] || app.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 14 }}>{fullName}</div>
                            <div style={{ color: '#64748B', fontSize: 12, marginTop: 1 }}>{app.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Program & Year */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{
                            alignSelf: 'flex-start', background: 'rgba(99,102,241,0.1)', color: '#818CF8',
                            padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                          }}>
                            {programName}
                          </span>
                          <span style={{ color: '#64748B', fontSize: 11, paddingLeft: 6 }}>Year Level: {app.yearlevel || app.yearLevel || 1}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 24px', color: '#E2E8F0', fontSize: 13 }}>{dateStr}</td>

                      {/* Status */}
                      <td style={{ padding: '16px 24px' }}>
                        <StatusBadge
                          status= {app.status}
                        />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 24px' }}>
                        {(app.status || '').toLowerCase() === 'pending' ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'accepted')}
                              disabled={processingId !== null}
                              style={{
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8,
                                fontWeight: 600, fontSize: 12, cursor: processingId ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                                boxShadow: '0 0 12px rgba(16,185,129,0.2)',
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'rejected')}
                              disabled={processingId !== null}
                              style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#FCA5A5', padding: '6px 14px', borderRadius: 8,
                                fontWeight: 600, fontSize: 12, cursor: processingId ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className='text-slate-500 text-xs italic'>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  )
}

export default EnrollmentReview
