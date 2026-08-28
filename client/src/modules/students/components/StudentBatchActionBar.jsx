import React from 'react'

const StudentBatchActionBar = ({ selectedStudentIds, setSelectedStudentIds, openBatchModal }) => {
  if (!selectedStudentIds || selectedStudentIds.length === 0) return null

  return (
    <div style={{
      background: '#F9FAFB',
      border: '1px solid #E5E7EB',
      padding: '12px 20px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          background: '#111827',
          color: 'white',
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 700,
        }}>
          {selectedStudentIds.length} Selected
        </span>
        <span style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>
          Students marked for batch section assignment
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => setSelectedStudentIds([])}
          style={{
            background: '#FFFFFF',
            color: '#6B7280',
            border: '1px solid #E5E7EB',
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Clear Selection
        </button>

        <button
          onClick={openBatchModal}
          style={{
            background: '#111827',
            color: 'white',
            border: '1px solid #111827',
            padding: '7px 18px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
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
