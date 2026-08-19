import React from 'react'

const StudentBatchActionBar = ({ selectedStudentIds, setSelectedStudentIds, openBatchModal }) => {
  if (!selectedStudentIds || selectedStudentIds.length === 0) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
      border: '1px solid rgba(99,102,241,0.4)',
      backdropFilter: 'blur(12px)',
      borderRadius: 14,
      padding: '12px 20px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      gap: 14,
      flexWrap: 'wrap',
      boxShadow: '0 8px 20px rgba(99,102,241,0.15)',
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          background: '#6366F1',
          color: 'white',
          padding: '4px 10px',
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 700
        }}>
          ⚡ {selectedStudentIds.length} Selected
        </span>
        <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 500 }}>
          Students marked for batch section assignment
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => setSelectedStudentIds([])}
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#CBD5E1',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Clear Selection
        </button>

        <button
          onClick={openBatchModal}
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            border: 'none',
            padding: '7px 18px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 0 14px rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
          Assign Section to Selected ({selectedStudentIds.length})
        </button>
      </div>
    </div>
  )
}

export default StudentBatchActionBar
