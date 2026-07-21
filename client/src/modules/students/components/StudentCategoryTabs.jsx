import React from 'react'

const StudentCategoryTabs = ({ activeTab, setActiveTab, counts, setSelectedStudentIds }) => {
  const tabs = [
    ['ALL', `All Students (${counts.all})`],
    ['UNASSIGNED', `Unassigned Section (${counts.unassigned})`],
    ['RECENT', `Recently Approved (${counts.recent})`],
    ['ASSIGNED', `Assigned Section (${counts.assigned})`]
  ]

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
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
              background: isActive ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.03)',
              color: isActive ? '#FFFFFF' : '#94A3B8',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.07)',
              padding: '8px 16px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 0 12px rgba(99,102,241,0.3)' : 'none'
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
