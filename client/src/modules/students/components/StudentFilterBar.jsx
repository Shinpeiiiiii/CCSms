import React, { useMemo } from 'react'
import SelectField from '../../../components/forms/SelectField'
import SearchInput from '../../../components/search/SearchInput'

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
  const availablePrograms = useMemo(() => {
    return programs.filter(p => {
      if (selectedDept === 'ALL') return true
      const deptId = p.department?._id || p.department
      return deptId === selectedDept
    })
  }, [programs, selectedDept])

  const deptOptions = useMemo(() => {
    const all = [{ value: 'ALL', label: 'All Departments' }]
    departments.forEach(d => {
      all.push({
        value: d._id,
        label: d.departmentCode ? `[${d.departmentCode}] ${d.departmentName}` : d.departmentName,
      })
    })
    return all
  }, [departments])

  const programOptions = useMemo(() => {
    const all = [{ value: 'ALL', label: 'All Programs' }]
    availablePrograms.forEach(p => {
      all.push({
        value: p._id,
        label: p.programCode ? `[${p.programCode}] ${p.programName}` : p.programName,
      })
    })
    return all
  }, [availablePrograms])

  const sectionOptions = useMemo(() => {
    const all = [
      { value: 'ALL', label: 'All Sections' },
      { value: 'UNASSIGNED', label: 'Unassigned Section' },
      { value: 'ASSIGNED', label: 'Assigned Section' },
    ]
    if (sections.length > 0) {
      sections.forEach(sec => {
        all.push({
          value: sec._id,
          label: `${sec.sectionCode} - ${sec.sectionName}`,
        })
      })
    }
    return all
  }, [sections])

  const hasActiveFilters = selectedDept !== 'ALL' || selectedProgram !== 'ALL' || selectedSectionFilter !== 'ALL' || search.trim() !== ''

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      padding: '14px 18px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', flex: 1 }}>
        {/* Department Filter */}
        <div style={{ minWidth: 170, flex: 1 }}>
          <SelectField
            name="department"
            value={selectedDept}
            onChange={e => {
              setSelectedDept(e.target.value)
              setSelectedProgram('ALL')
            }}
            options={deptOptions}
            placeholder="All Departments"
          />
        </div>

        {/* Academic Program Filter */}
        <div style={{ minWidth: 190, flex: 1 }}>
          <SelectField
            name="program"
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
            options={programOptions}
            placeholder="All Programs"
          />
        </div>

        {/* Section / Section Status Filter */}
        <div style={{ minWidth: 180, flex: 1 }}>
          <SelectField
            name="sectionFilter"
            value={selectedSectionFilter}
            onChange={e => setSelectedSectionFilter(e.target.value)}
            options={sectionOptions}
            placeholder="All Sections"
          />
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#374151',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 8,
              textDecoration: 'underline',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: 240 }}>
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
        />
      </div>
    </div>
  )
}

export default StudentFilterBar
