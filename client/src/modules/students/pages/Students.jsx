import React, { useState, useMemo, useCallback } from 'react';
import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import { ToastProvider, useToast } from '../../../components/toast/ToastContainer';
import { TableSkeleton } from '../../../components/toast/Skeleton';

import useStudents from '../hooks/useStudents';
import useFilterMetadata from '../hooks/useFilterMetaData';
import { useStudentFilters } from '../hooks/useStudentFilter';
import { useBatchSelection } from '../hooks/useBatchSelection';

import StudentCategoryTabs from '../components/StudentCategoryTabs';
import StudentFilterBar from '../components/StudentFilterBar';
import StudentBatchActionBar from '../components/StudentBatchActionBar';
import SingleAssignModal from '../components/SingleAssignModal';
import BatchAssignModal from '../components/BatchAssignModal';
import NewStudentForm from '../components/NewStudentForm';
import DataTable from '../../../components/table/DataTable';
import StudentColumn from '../components/StudentColumn';
import Card from '../../../components/cards/Cards';

const PageHeader = ({ showForm, onToggleForm }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
        Students Directory
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage student records, program assignments, and class section allocations.
      </p>
    </div>
    <button
      onClick={onToggleForm}
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm
        transition-colors border
        ${showForm 
          ? 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
          : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'}
      `}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {showForm ? (
          <path d="M18 6L6 18M6 6l12 12" />
        ) : (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </>
        )}
      </svg>
      {showForm ? 'Cancel' : 'Add Student'}
    </button>
  </div>
);

const StudentsContent = () => {
  const { addToast } = useToast();
  
  const {
    students,
    loading,
    submitting,
    addStudent,
    removeStudent,
    updateStudentSection,
    batchUpdateSections
  } = useStudents();

  const { departments, programs, sections, refreshSections } = useFilterMetadata();

  const {
    search, setSearch,
    selectedDept, setSelectedDept,
    selectedProgram, setSelectedProgram,
    selectedSectionFilter, setSelectedSectionFilter,
    activeTab, setActiveTab,
    filteredStudents,
    counts,
    hasActiveFilters,
    resetFilters
  } = useStudentFilters(students);

  const {
    selectedIds,
    handleSelectAll,
    toggleSelect,
    clearSelection,
    isAllSelected
  } = useBatchSelection(filteredStudents);

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    degreeProgram: '',
    yearLevel: ''
  });

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const [showBatchAssignModal, setShowBatchAssignModal] = useState(false);
  const [batchTargetSectionId, setBatchTargetSectionId] = useState('');
  const [batchAssigning, setBatchAssigning] = useState(false);

  const selectedStudentsList = useMemo(() => 
    students.filter(s => selectedIds.includes(s._id)),
    [students, selectedIds]
  );

  const filteredSections = useMemo(() => {
    if (!selectedStudent) return [];
    return sections.filter(sec => {
      if (selectedStudent.program?._id) {
        const progId = sec.curriculum?.program?._id || sec.curriculum?.program;
        return progId === selectedStudent.program._id;
      }
      if (selectedStudent.degreeProgram) {
        const progName = sec.curriculum?.program?.programName || '';
        const query = selectedStudent.degreeProgram.toLowerCase();
        return progName.toLowerCase().includes(query) || query.includes(progName.toLowerCase());
      }
      return true;
    });
  }, [sections, selectedStudent]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await addStudent(form);
    if (result.success) {
      addToast('Student added successfully', 'success');
      setForm({ firstName: '', middleName: '', lastName: '', email: '', degreeProgram: '', yearLevel: '' });
      setShowForm(false);
    } else {
      addToast(result.error, 'error');
    }
  }, [form, addStudent, addToast]);

  const handleDelete = useCallback(async (id) => {
    setDeleteId(id);
    const result = await removeStudent(id);
    if (result.success) {
      addToast('Student removed successfully', 'success');
      clearSelection();
    } else {
      addToast(result.error, 'error');
    }
    setDeleteId(null);
  }, [removeStudent, addToast, clearSelection]);

  const openAssignModal = useCallback((student) => {
    setSelectedStudent(student);
    setTargetSectionId(student.section?._id || '');
    setShowAssignModal(true);
    refreshSections();
  }, [refreshSections]);

  const handleAssignSection = useCallback(async () => {
    if (!targetSectionId || !selectedStudent) return;
    setAssigning(true);
    
    const result = await updateStudentSection(selectedStudent._id, targetSectionId);
    
    if (result.success) {
      addToast('Section assigned successfully', 'success');
      setShowAssignModal(false);
      setTargetSectionId('');
      refreshSections();
    } else {
      addToast(result.error, 'error');
    }
    setAssigning(false);
  }, [targetSectionId, selectedStudent, updateStudentSection, addToast, refreshSections]);

  const handleBatchAssignSection = useCallback(async () => {
    if (!batchTargetSectionId || selectedIds.length === 0) return;
    setBatchAssigning(true);

    const { successful, failed } = await batchUpdateSections(selectedIds, batchTargetSectionId);

    if (failed.length === 0) {
      addToast(`Successfully assigned ${successful.length} student(s)`, 'success');
      setShowBatchAssignModal(false);
      clearSelection();
      setBatchTargetSectionId('');
      refreshSections();
    } else {
      addToast(
        `Assigned ${successful.length}, failed ${failed.length}: ${failed[0]?.error}`,
        'error'
      );
    }
    setBatchAssigning(false);
  }, [batchTargetSectionId, selectedIds, batchUpdateSections, addToast, clearSelection, refreshSections]);

  const openBatchModal = useCallback(() => {
    setBatchTargetSectionId('');
    setShowBatchAssignModal(true);
    refreshSections();
  }, [refreshSections]);

  return (
    <div className="space-y-5">
      <PageHeader showForm={showForm} onToggleForm={() => setShowForm(v => !v)} />

      <StudentCategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        setSelectedStudentIds={clearSelection}
      />

      <StudentFilterBar
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        selectedSectionFilter={selectedSectionFilter}
        setSelectedSectionFilter={setSelectedSectionFilter}
        search={search}
        setSearch={setSearch}
        departments={departments}
        programs={programs}
        sections={sections}
        resetFilters={resetFilters}
      />

      <StudentBatchActionBar
        selectedStudentIds={selectedIds}
        setSelectedStudentIds={clearSelection}
        openBatchModal={openBatchModal}
      />

      {showForm && (
        <NewStudentForm
          showForm={showForm}
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          submitting={submitting}
        />
      )}

      <Card>
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={7} isDark={false} />
          </div>
        ) : (
          <DataTable
            columns={StudentColumn({
              openAssignModal,
              handleDelete,
              selectedStudentIds: selectedIds,
              handleSelectAll,
              toggleSelectStudent: toggleSelect,
              isAllSelected,
              deleteId,
            })}
            data={filteredStudents}
            emptyMessage={hasActiveFilters ? "No students match your filter parameters." : "No students registered yet."}
          />
        )}
      </Card>

      <SingleAssignModal
        showAssignModal={showAssignModal}
        selectedStudent={selectedStudent}
        onClose={() => {
          setShowAssignModal(false);
          setTargetSectionId('');
        }}
        targetSectionId={targetSectionId}
        setTargetSectionId={setTargetSectionId}
        filteredSections={filteredSections}
        assigning={assigning}
        handleAssignSection={handleAssignSection}
      />

      <BatchAssignModal
        showBatchAssignModal={showBatchAssignModal}
        onClose={() => {
          setShowBatchAssignModal(false);
          setBatchTargetSectionId('');
        }}
        selectedStudentsList={selectedStudentsList}
        sections={sections}
        batchTargetSectionId={batchTargetSectionId}
        setBatchTargetSectionId={setBatchTargetSectionId}
        batchAssigning={batchAssigning}
        handleBatchAssignSection={handleBatchAssignSection}
      />
    </div>
  );
};

const Students = () => (
  <DashboardLayout>
    <ToastProvider>
      <StudentsContent />
    </ToastProvider>
  </DashboardLayout>
);

export default Students;
