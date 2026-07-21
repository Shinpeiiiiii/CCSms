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
}

const SingleAssignModal = ({
  showAssignModal,
  selectedStudent,
  onClose,
  targetSectionId,
  setTargetSectionId,
  loadingSections,
  filteredSections,
  errorMsg,
  assigning,
  handleAssignSection
}) => {
  if (!showAssignModal || !selectedStudent) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: 'rgba(10, 15, 30, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: '#F1F5F9', marginBottom: 12 }}>
          Assign Class Section
        </h3>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <p style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>Student</p>
          <p style={{ color: '#F1F5F9', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            {[selectedStudent.firstName, selectedStudent.middleName, selectedStudent.lastName].filter(Boolean).join(' ')}
          </p>
          <p style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>Academic Program</p>
          <p style={{ color: '#A5B4FC', fontSize: 14, fontWeight: 500 }}>
            {selectedStudent.program?.programName || selectedStudent.degreeProgram || 'No Program Assigned'}
          </p>
        </div>

        {loadingSections ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748B' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"
              style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Fetching active sections...
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              Select Section
            </label>
            <select
              value={targetSectionId}
              onChange={e => setTargetSectionId(e.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>-- Choose a Section --</option>
              {filteredSections.map(sec => (
                <option key={sec._id} value={sec._id} style={{ background: '#0A0F1E', color: '#E2E8F0' }}>
                  {sec.sectionCode} - {sec.sectionName} (Year Level: {sec.yearLevel})
                </option>
              ))}
            </select>

            {filteredSections.length === 0 && (
              <div style={{ display: 'flex', gap: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 12, marginTop: 14 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ color: '#F87171', fontSize: 12, margin: 0, lineHeight: '1.4' }}>
                  No active sections exist for this student's program ({selectedStudent.program?.programName || selectedStudent.degreeProgram}).
                  Please verify curriculum sections.
                </p>
              </div>
            )}

            {errorMsg && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginTop: 14 }}>
                <p style={{ color: '#FCA5A5', fontSize: 12, margin: 0 }}>{errorMsg}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 28 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSection}
                disabled={!targetSectionId || assigning}
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: 'white',
                  border: 'none',
                  padding: '9px 24px',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: (!targetSectionId || assigning) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 18px rgba(99,102,241,0.2)',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  opacity: (!targetSectionId || assigning) ? 0.55 : 1
                }}
              >
                {assigning ? 'Assigning...' : 'Assign Section'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleAssignModal
