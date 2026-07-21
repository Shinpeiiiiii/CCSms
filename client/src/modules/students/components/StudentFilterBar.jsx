import React from 'react'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  padding: '7px 12px',
  color: '#F1F5F9',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const StudentFilterBar = ({
  selectedDept,
  setSelectedDept,
  selectedProgram,
  setSelectedProgram,
  selectedSectionFilter,
  setSelectedSectionFilter,
  search,
  setSearch,
  departments,
  programs,
  sections,
  resetFilters
}) => {
  // Filter programs based on selected department
  const availablePrograms = programs.filter(p => {
    if (selectedDept === 'ALL') return true
    const deptId = p.department?._id || p.department
    return deptId === selectedDept
  })

  const hasActiveFilters = selectedDept !== 'ALL' || selectedProgram !== 'ALL' || selectedSectionFilter !== 'ALL' || search.trim() !== ''

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(99,102,241,0.6)'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
  }
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: '14px 18px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      gap: 14,
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        {/* Department Filter */}
        <div style={{ minWidth: 170, flex: 1 }}>
          <label style={{ display: 'block', color: '#64748B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Department
          </label>
          <select
            value={selectedDept}
            onChange={e => {
              setSelectedDept(e.target.value)
              setSelectedProgram('ALL')
            }}
            style={inputStyle}
          >
            <option value="ALL" style={{ background: '#0A0F1E' }}>All Departments</option>
            {departments.map(d => (
              <option key={d._id} value={d._id} style={{ background: '#0A0F1E' }}>
                {d.departmentCode ? `[${d.departmentCode}] ${d.departmentName}` : d.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Academic Program Filter */}
        <div style={{ minWidth: 190, flex: 1 }}>
          <label style={{ display: 'block', color: '#64748B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Academic Program
          </label>
          <select
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
            style={inputStyle}
          >
            <option value="ALL" style={{ background: '#0A0F1E' }}>All Programs</option>
            {availablePrograms.map(p => (
              <option key={p._id} value={p._id} style={{ background: '#0A0F1E' }}>
                {p.programCode ? `[${p.programCode}] ${p.programName}` : p.programName}
              </option>
            ))}
          </select>
        </div>

        {/* Section / Section Status Filter */}
        <div style={{ minWidth: 180, flex: 1 }}>
          <label style={{ display: 'block', color: '#64748B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Section Status
          </label>
          <select
            value={selectedSectionFilter}
            onChange={e => setSelectedSectionFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="ALL" style={{ background: '#0A0F1E' }}>All Sections</option>
            <option value="UNASSIGNED" style={{ background: '#0A0F1E', color: '#F87171' }}>⚠️ Unassigned Section</option>
            <option value="ASSIGNED" style={{ background: '#0A0F1E', color: '#34D399' }}>✓ Assigned Section</option>
            {sections.length > 0 && (
              <optgroup label="Specific Sections" style={{ background: '#0A0F1E', color: '#818CF8' }}>
                {sections.map(sec => (
                  <option key={sec._id} value={sec._id} style={{ background: '#0A0F1E', color: '#E2E8F0' }}>
                    {sec.sectionCode} - {sec.sectionName}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              alignSelf: 'flex-end',
              background: 'none',
              border: 'none',
              color: '#818CF8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 6,
              textDecoration: 'underline'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: 240 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}

export default StudentFilterBar
