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

const BatchAssignModal = ({
  showBatchAssignModal,
  onClose,
  selectedStudentsList,
  sections,
  loadingSections,
  batchTargetSectionId,
  setBatchTargetSectionId,
  batchAssigning,
  batchErrorMsg,
  batchSuccessMsg,
  handleBatchAssignSection
}) => {
  if (!showBatchAssignModal) return null

  // Find unique program IDs / Names from selected students to assist section filtering
  const programIds = Array.from(
    new Set(
      selectedStudentsList
        .map(st => st.program?._id || st.program || st.degreeProgram)
        .filter(Boolean)
    )
  )

  // Filter sections if all selected students share the same program
  const filteredBatchSections = sections.filter(sec => {
    if (programIds.length === 1) {
      const targetProg = programIds[0]
      const secProgId = sec.curriculum?.program?._id || sec.curriculum?.program
      const secProgName = sec.curriculum?.program?.programName || ''
      if (secProgId && secProgId === targetProg) return true
      if (secProgName && typeof targetProg === 'string' && secProgName.toLowerCase().includes(targetProg.toLowerCase())) return true
      return false
    }
    return true
  })

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
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
        maxWidth: 520,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: '#F1F5F9', marginBottom: 12 }}>
          Batch Section Assignment
        </h3>

        {/* Selected Students Preview */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>
              Selected Students ({selectedStudentsList.length})
            </p>
            {programIds.length > 1 && (
              <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600 }}>
                ⚠️ Multiple programs selected
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 110, overflowY: 'auto', paddingRight: 4 }}>
            {selectedStudentsList.map(st => (
              <span key={st._id} style={{
                background: 'rgba(99,102,241,0.12)',
                color: '#A5B4FC',
                border: '1px solid rgba(99,102,241,0.2)',
                padding: '3px 9px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500
              }}>
                {[st.firstName, st.lastName].filter(Boolean).join(' ')}
                {st.program?.programCode && <span style={{ opacity: 0.7, marginLeft: 4 }}>({st.program.programCode})</span>}
              </span>
            ))}
          </div>
        </div>

        {loadingSections ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748B' }}>
            Fetching available sections...
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', color: '#64748B', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              Target Section
            </label>
            <select
              value={batchTargetSectionId}
              onChange={e => setBatchTargetSectionId(e.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>-- Select Section for Batch Assignment --</option>
              {(filteredBatchSections.length > 0 ? filteredBatchSections : sections).map(sec => (
                <option key={sec._id} value={sec._id} style={{ background: '#0A0F1E', color: '#E2E8F0' }}>
                  {sec.sectionCode} - {sec.sectionName} (Program: {sec.curriculum?.program?.programCode || 'N/A'}, Yr: {sec.yearLevel})
                </option>
              ))}
            </select>

            {batchSuccessMsg && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '10px 14px', marginTop: 14 }}>
                <p style={{ color: '#34D399', fontSize: 13, margin: 0, fontWeight: 600 }}>✓ {batchSuccessMsg}</p>
              </div>
            )}

            {batchErrorMsg && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginTop: 14 }}>
                <p style={{ color: '#FCA5A5', fontSize: 12, margin: 0 }}>{batchErrorMsg}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={batchAssigning}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchAssignSection}
                disabled={!batchTargetSectionId || batchAssigning}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '9px 24px',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: (!batchTargetSectionId || batchAssigning) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 18px rgba(16,185,129,0.25)',
                  fontFamily: 'Inter, sans-serif',
                  opacity: (!batchTargetSectionId || batchAssigning) ? 0.55 : 1
                }}
              >
                {batchAssigning ? 'Assigning...' : `Assign Section to ${selectedStudentsList.length} Student(s)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchAssignModal
