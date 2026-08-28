import React from 'react'

const StudentCategoryTabs = ({ activeTab, setActiveTab, counts, setSelectedStudentIds }) => {
  const tabs = [
    ['ALL', `All Students (${counts.all})`],
    ['UNASSIGNED', `Unassigned Section (${counts.unassigned})`],
    ['RECENT', `Recently Approved (${counts.recent})`],
    ['ASSIGNED', `Assigned Section (${counts.assigned})`]
  ]

  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 20, flexWrap: 'wrap' }}>
      {tabs.map(([key, label]) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key)
              setSelectedStudentIds([])
            }}
            style={{
              background: isActive ? '#111827' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#6B7280',
              border: '1px solid #E5E7EB',
              borderRightWidth: 0,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default StudentCategoryTabs
