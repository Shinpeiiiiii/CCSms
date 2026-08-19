import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowRight, FileText, Calendar, GraduationCap, Mail, User } from 'lucide-react'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'
import { trackApplication } from '../../enrollmentform/services/enrollmentform'

const TrackApplication = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialNumber = searchParams.get('number') || searchParams.get('app') || ''

  const [trackingNumber, setTrackingNumber] = useState(initialNumber)
  const [loading, setLoading] = useState(false)
  const [applicationData, setApplicationData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (numToSearch) => {
    const queryNum = (numToSearch || trackingNumber).trim()
    if (!queryNum) {
      setErrorMsg('Please enter your application tracking number.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setApplicationData(null)
    setSearched(true)

    // Sync URL search params
    setSearchParams({ number: queryNum })

    try {
      const response = await trackApplication(queryNum)
      if (response && response.success) {
        setApplicationData(response.data)
      } else {
        setErrorMsg(response?.message || 'No application found with that tracking number.')
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No application found with that tracking number. Please verify and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialNumber) {
      handleSearch(initialNumber)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  // Get status color tokens and icons
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#34D399',
          icon: <CheckCircle2 size={16} className="text-emerald-400" />,
          label: 'Application Approved'
        }
      case 'Needs Revision':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#FBBF24',
          icon: <AlertTriangle size={16} className="text-amber-400" />,
          label: 'Needs Revision'
        }
      case 'Rejected':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#FCA5A5',
          icon: <XCircle size={16} className="text-red-400" />,
          label: 'Application Rejected'
        }
      case 'Pending':
      default:
        return {
          bg: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#818CF8',
          icon: <Clock size={16} className="text-indigo-400" />,
          label: 'Under Review'
        }
    }
  }

  return (
    <div style={{ background: '#090D16', color: '#F1F5F9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavHeader />

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        padding: '60px 24px 40px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#A5B4FC',
            padding: '5px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16
          }}>
            <FileText size={14} /> Student Admissions Portal
          </span>

          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: 12
          }}>
            Track Your Application Status
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Enter your unique application tracking number (e.g. APP-2026-XXXX) to view real-time processing updates and evaluation results.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} style={{
            maxWidth: 520,
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            gap: 8,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 6,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, color: '#64748B' }} />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Application Number (APP-2026-XXXX)..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F1F5F9',
                  paddingLeft: 42,
                  paddingRight: 12,
                  fontSize: 14,
                  fontFamily: 'Inter, monospace',
                  fontWeight: 500
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Track Status'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#FCA5A5',
              padding: '16px 20px',
              borderRadius: 16,
              marginBottom: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 14
            }}
          >
            <XCircle size={20} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Application Data Display */}
        {applicationData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Status Header Banner */}
            {(() => {
              const badge = getStatusBadge(applicationData.status)
              return (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 20,
                  padding: 24,
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Application Reference
                    </span>
                    <h2 style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '4px 0 0' }}>
                      {applicationData.applicationNumber}
                    </h2>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: badge.bg,
                    border: badge.border,
                    color: badge.color,
                    padding: '8px 16px',
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 14
                  }}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>
              )
            })()}

            {/* Special Notification Banners based on Status */}
            {applicationData.status === 'Approved' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 18,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16
              }}>
                <CheckCircle2 size={24} style={{ color: '#34D399', shrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontFamily: 'Sora, sans-serif', color: '#34D399', fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>
                    Congratulations! Your Admission has been Approved.
                  </h4>
                  <p style={{ color: '#CBD5E1', fontSize: 14, margin: '0 0 14px', lineHeight: 1.5 }}>
                    An official welcome email with your generated Student Number and temporary password has been dispatched to <strong>{applicationData.email}</strong>.
                  </p>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#10B981',
                      color: 'white',
                      padding: '8px 18px',
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: 'none',
                      boxShadow: '0 0 14px rgba(16,185,129,0.3)'
                    }}
                  >
                    Proceed to Student Login <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {applicationData.status === 'Needs Revision' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 18,
                padding: '20px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <AlertTriangle size={20} style={{ color: '#FBBF24' }} />
                  <h4 style={{ fontFamily: 'Sora, sans-serif', color: '#FBBF24', fontWeight: 700, fontSize: 15, margin: 0 }}>
                    Registrar Action Required: Revision Requested
                  </h4>
                </div>
                <p style={{ color: '#E2E8F0', fontSize: 14, margin: '0 0 12px', lineHeight: 1.5 }}>
                  The admissions committee reviewed your application and requested the following update:
                </p>
                {applicationData.remarks && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #FBBF24', padding: '10px 14px', borderRadius: 6, marginBottom: 14 }}>
                    <p style={{ color: '#FCD34D', fontSize: 13, margin: 0, fontStyle: 'italic' }}>
                      "{applicationData.remarks}"
                    </p>
                  </div>
                )}
                <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>
                  Please re-open the <Link to="/enrollmentform" style={{ color: '#FBBF24', fontWeight: 600 }}>Enrollment Form</Link> using your verified email address to submit the required corrections.
                </p>
              </div>
            )}

            {/* Application Progress Timeline */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 20,
              padding: 28
            }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 20 }}>
                Application Processing Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 12 }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: 'absolute',
                  left: 23,
                  top: 15,
                  bottom: 15,
                  width: 2,
                  background: 'rgba(255, 255, 255, 0.1)'
                }} />

                {/* Step 1: Submission */}
                <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#10B981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    shrink: 0
                  }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                      Application Submitted
                    </h4>
                    <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
                      Submitted on {new Date(applicationData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Step 2: Evaluation */}
                <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: applicationData.status !== 'Pending' ? '#10B981' : '#6366F1',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    shrink: 0
                  }}>
                    {applicationData.status !== 'Pending' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  </div>
                  <div>
                    <h4 style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                      Registrar Document Review & Evaluation
                    </h4>
                    <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
                      {applicationData.status === 'Pending'
                        ? 'In Progress — Application is queued for verification.'
                        : `Evaluated on ${applicationData.reviewedAt ? new Date(applicationData.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'recently'}`}
                    </p>
                  </div>
                </div>

                {/* Step 3: Final Status */}
                <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: applicationData.status === 'Approved' ? '#10B981' : applicationData.status === 'Rejected' ? '#EF4444' : applicationData.status === 'Needs Revision' ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    shrink: 0
                  }}>
                    {applicationData.status === 'Approved' ? <CheckCircle2 size={14} /> : applicationData.status === 'Rejected' ? <XCircle size={14} /> : applicationData.status === 'Needs Revision' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                  </div>
                  <div>
                    <h4 style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                      Final Admission Decision
                    </h4>
                    <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>
                      {applicationData.status === 'Approved'
                        ? 'Approved — Account initialized and credentials issued.'
                        : applicationData.status === 'Needs Revision'
                        ? 'Action Pending — Revision requested.'
                        : applicationData.status === 'Rejected'
                        ? 'Declined — Application rejected by admissions committee.'
                        : 'Pending final approval decision.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Information Details Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 20,
              padding: 28
            }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 20 }}>
                Applicant & Program Overview
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    <User size={14} /> Applicant Name
                  </div>
                  <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 600 }}>
                    {[applicationData.firstName, applicationData.middleName, applicationData.lastName].filter(Boolean).join(' ') || 'N/A'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    <Mail size={14} /> Email Address
                  </div>
                  <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500 }}>
                    {applicationData.email}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    <GraduationCap size={14} /> Degree Program
                  </div>
                  <div style={{ color: '#A5B4FC', fontSize: 14, fontWeight: 600 }}>
                    {applicationData.program?.programName || 'N/A'} ({applicationData.program?.programCode || ''})
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    <Calendar size={14} /> Academic Term
                  </div>
                  <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500 }}>
                    {applicationData.academicYear?.academicYearName || 'N/A'} ({applicationData.studentType || 'Regular'})
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!searched && !applicationData && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            borderRadius: 20
          }}>
            <Search size={40} style={{ color: 'rgba(99, 102, 241, 0.4)', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ color: '#E2E8F0', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Ready to Track</h3>
            <p style={{ color: '#64748B', fontSize: 13, maxWidth: 360, margin: '0 auto' }}>
              Enter your tracking code above to inspect your application status and evaluation timeline.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default TrackApplication
