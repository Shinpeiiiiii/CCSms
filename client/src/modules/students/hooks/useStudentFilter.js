// hooks/useStudentFilters.js
import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useStudentFilters = (students) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedProgram, setSelectedProgram] = useState('ALL');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');

  const debouncedSearch = useDebounce(search, 250);

  const filteredStudents = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();

    return students.filter(s => {
      // Search
      if (q) {
        const fullName = `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''}`.toLowerCase();
        const email = (s.email || '').toLowerCase();
        if (!fullName.includes(q) && !email.includes(q)) return false;
      }

      // Department
      if (selectedDept !== 'ALL') {
        const deptId = s.program?.department?._id || s.program?.department;
        if (!deptId || deptId !== selectedDept) return false;
      }

      // Program
      if (selectedProgram !== 'ALL') {
        const progId = s.program?._id || s.program;
        const matchesId = progId === selectedProgram;
        const matchesName = s.degreeProgram === selectedProgram;
        if (!matchesId && !matchesName) return false;
      }

      // Section filter dropdown
      if (selectedSectionFilter === 'UNASSIGNED') {
        if (s.section) return false;
      } else if (selectedSectionFilter === 'ASSIGNED') {
        if (!s.section) return false;
      } else if (selectedSectionFilter !== 'ALL') {
        const secId = s.section?._id || s.section;
        if (secId !== selectedSectionFilter) return false;
      }

      // Tab filters
      if (activeTab === 'UNASSIGNED') {
        if (s.section) return false;
      } else if (activeTab === 'ASSIGNED') {
        if (!s.section) return false;
      } else if (activeTab === 'RECENT') {
        const dateVal = s.admittedAt || s.createdAt;
        if (!dateVal) return false;
        const days = (Date.now() - new Date(dateVal).getTime()) / (1000 * 60 * 60 * 24);
        if (isNaN(days) || days > 30) return false;
      }

      return true;
    });
  }, [students, debouncedSearch, selectedDept, selectedProgram, selectedSectionFilter, activeTab]);

  const counts = useMemo(() => ({
    all: students.length,
    unassigned: students.filter(s => !s.section).length,
    assigned: students.filter(s => !!s.section).length,
    recent: students.filter(s => {
      const d = s.admittedAt || s.createdAt;
      return d && (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24) <= 30;
    }).length
  }), [students]);

  const hasActiveFilters = selectedDept !== 'ALL' || selectedProgram !== 'ALL' || 
    selectedSectionFilter !== 'ALL' || activeTab !== 'ALL' || search.trim() !== '';

  const resetFilters = () => {
    setSelectedDept('ALL');
    setSelectedProgram('ALL');
    setSelectedSectionFilter('ALL');
    setActiveTab('ALL');
    setSearch('');
  };

  return {
    search, setSearch,
    selectedDept, setSelectedDept,
    selectedProgram, setSelectedProgram,
    selectedSectionFilter, setSelectedSectionFilter,
    activeTab, setActiveTab,
    filteredStudents,
    counts,
    hasActiveFilters,
    resetFilters
  };
};