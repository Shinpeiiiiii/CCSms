// hooks/useBatchSelection.js
import { useState, useMemo, useCallback } from 'react';

export const useBatchSelection = (filteredStudents) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = useCallback((checked) => {
    setSelectedIds(checked ? filteredStudents.map(s => s._id) : []);
  }, [filteredStudents]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const isAllSelected = useMemo(() => 
    filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.includes(s._id)),
    [filteredStudents, selectedIds]
  );

  return {
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    toggleSelect,
    clearSelection,
    isAllSelected
  };
};