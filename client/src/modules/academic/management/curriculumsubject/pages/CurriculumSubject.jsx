import { memo, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import CurriculumSubjectToolbar from "../components/CurriculumSubjectToolbar";
import CurriculumSubjectModal from "../components/CurriculumSubjectModal";
import CurriculumSubjectBatchModal from "../components/CurriculumSubjectBatchModal";
import CurriculumSubjectColumn from "../components/CurriculumSubjectColumn";

import useCrud from "../../../../../hooks/useCrud";
import useCurriculumSubject from "../hooks/useCurriculumSubject";
import useSubject from "../../subject/hooks/useSubject";

import {
  addCurriculumSubject,
  deleteCurriculumSubject,
  updateCurriculumSubject,
  autoStructureCurriculum,
  bulkAddCurriculumSubject,
} from "../services/curriculumsubject.services";

const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2];

const VIEW_MODE = {
  MATRIX: "matrix",
  LIST: "list",
};

const deriveStructure = (subjectList) => {
  const result = {};
  for (const item of subjectList) {
    const yearKey = `Year ${item.yearLevel}`;
    const semKey = `Semester ${item.semester}`;
    if (!result[yearKey]) result[yearKey] = {};
    if (!result[yearKey][semKey]) result[yearKey][semKey] = [];
    result[yearKey][semKey].push(item);
  }
  return result;
};


const SubjectChip = memo(({ item }) => {
  const { subjectCode, subjectName, units: subjectUnits } = item.subject ?? {};
  const units = item.units ?? subjectUnits ?? 0;
  const isRequired = !!item.isRequired;

  return (
    <div className="border border-gray-200 bg-white p-5 transition-colors hover:border-gray-400">
      <div>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {subjectCode || "—"}
        </p>
        <p className="text-sm text-gray-500 truncate mt-1.5 leading-relaxed">
          {subjectName || "—"}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span
          className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            isRequired
              ? "bg-gray-900 text-white"
              : "border border-gray-300 text-gray-500"
          }`}
        >
          {isRequired ? "Required" : "Elective"}
        </span>
        <span className="text-xs text-gray-400 font-medium tabular-nums">
          {units} {units === 1 ? "unit" : "units"}
        </span>
      </div>
    </div>
  );
});

SubjectChip.displayName = "SubjectChip";

const EmptySlot = memo(() => (
  <div className="border border-dashed border-gray-200 p-4 text-center text-[11px] text-gray-300">
    Empty
  </div>
));

const MatrixCell = memo(({ subjects }) => {
  if (subjects.length === 0) return <EmptySlot />;
  return (
    <div className="flex flex-col gap-2">
      {subjects.map((item) => (
        <SubjectChip key={item._id} item={item} />
      ))}
    </div>
  );
});

const CurriculumMatrix = memo(({ structure }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-160">
      <thead>
        <tr>
          <th className="w-28 px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            Year
          </th>
          {SEMESTERS.map((sem) => (
            <th
              key={sem}
              className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100"
            >
              Semester {sem}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {YEARS.map((year) => (
          <tr key={year}>
            <td className="px-4 py-4 align-top text-xs font-semibold text-gray-900 border-b border-gray-50">
              Year {year}
            </td>
            {SEMESTERS.map((sem) => {
              const cellSubjects =
                structure[`Year ${year}`]?.[`Semester ${sem}`] || [];
              return (
                <td
                  key={sem}
                  className="px-3 py-3 align-top border-b border-gray-50"
                >
                  <MatrixCell subjects={cellSubjects} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const CurriculumSubject = () => {
  const { curriculumId } = useParams();

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState(VIEW_MODE.MATRIX);
  const [structuring, setStructuring] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);

  const { subjects, loading, refreshSubjects } = useCurriculumSubject(curriculumId);
  const { subject: availableSubjects = [] } = useSubject();
  const {
    search,
    setSearch,
    selectedItem,
    isModalOpen,
    isDeleteOpen,
    openCreate,
    openEdit,
    openDelete,
    closeModal,
    closeDelete,
  } = useCrud();

  const derivedStructure = useMemo(() => deriveStructure(subjects), [subjects]);

  const filteredSubjects = useMemo(() => {
    const keyword = search.toLowerCase();
    return subjects.filter(
      (item) =>
        item.subject?.subjectCode?.toLowerCase().includes(keyword) ||
        item.subject?.subjectName?.toLowerCase().includes(keyword)
    );
  }, [subjects, search]);

  const subjectCount = subjects.length;
  const requiredCount = useMemo(
    () => subjects.filter((s) => s.isRequired).length,
    [subjects]
  );
  const electiveCount = subjectCount - requiredCount;

  const handleAutoStructure = useCallback(async () => {
    setStructuring(true);
    try {
      const groups = [];
      for (const year of YEARS) {
        const yearSubjects = Array.isArray(subjects)
          ? subjects.filter((s) => s.yearLevel === year)
          : [];
        if (yearSubjects.length === 0) continue;

        const sem1 = yearSubjects.filter((s) => s.semester === 1);
        const sem2 = yearSubjects.filter((s) => s.semester === 2);

        if (sem1.length > 0) {
          groups.push({
            yearLevel: year,
            semester: 1,
            subjects: sem1.map((s) => ({
              subjectId: s.subject?._id,
              isRequired: s.isRequired,
            })),
          });
        }
        if (sem2.length > 0) {
          groups.push({
            yearLevel: year,
            semester: 2,
            subjects: sem2.map((s) => ({
              subjectId: s.subject?._id,
              isRequired: s.isRequired,
            })),
          });
        }
      }

      if (groups.length === 0) {
        toast.info("No subjects to structure. Add subjects first.");
        return;
      }

      await autoStructureCurriculum(curriculumId, groups);
      toast.success("Curriculum structure organized.");
      await refreshSubjects();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to structure curriculum."
      );
    } finally {
      setStructuring(false);
    }
  }, [curriculumId, subjects, refreshSubjects]);

  const handleSave = useCallback(
    async (formData) => {
      try {
        setSaving(true);
        if (selectedItem) {
          await updateCurriculumSubject(selectedItem._id, formData);
          toast.success("Subject updated.");
        } else {
          await addCurriculumSubject(curriculumId, formData);
          toast.success("Subject added.");
        }
        closeModal();
        await refreshSubjects();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to save."
        );
      } finally {
        setSaving(false);
      }
    },
    [selectedItem, curriculumId, closeModal, refreshSubjects]
  );

  const handleBatchSave = useCallback(
    async (payload) => {
      try {
        setBatchSaving(true);
        await bulkAddCurriculumSubject(curriculumId, payload);
        toast.success("Subjects added.");
        setIsBatchModalOpen(false);
        await refreshSubjects();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to batch add."
        );
      } finally {
        setBatchSaving(false);
      }
    },
    [curriculumId, refreshSubjects]
  );

  const handleDelete = useCallback(async () => {
    if (!selectedItem) return;
    try {
      setDeleting(true);
      await deleteCurriculumSubject(selectedItem._id);
      closeDelete();
      await refreshSubjects();
      toast.success("Subject removed.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove."
      );
    } finally {
      setDeleting(false);
    }
  }, [selectedItem, closeDelete, refreshSubjects]);

  const columns = useMemo(
    () =>
      CurriculumSubjectColumn({
        onEdit: openEdit,
        onDelete: openDelete,
      }),
    [openEdit, openDelete]
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-900" />
            {subjectCount} subjects
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400" />
            {requiredCount} required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-300" />
            {electiveCount} elective
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <CurriculumSubjectToolbar
            search={search}
            setSearch={setSearch}
            onAdd={() => openCreate()}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onAutoStructure={handleAutoStructure}
            structuring={structuring}
            onBatchAdd={() => setIsBatchModalOpen(true)}
          />
        </div>

        <div>
          {viewMode === VIEW_MODE.MATRIX ? (
            <CurriculumMatrix structure={derivedStructure} />
          ) : (
            <DataTable
              columns={columns}
              data={filteredSubjects}
              loading={loading}
              emptyMessage="No subjects found."
            />
          )}
        </div>
      </div>

      <CurriculumSubjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        curriculumSubject={selectedItem}
        subjects={availableSubjects}
        loading={saving}
      />

      <CurriculumSubjectBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSubmit={handleBatchSave}
        subjects={availableSubjects}
        loading={batchSaving}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Remove Subject"
        message={
          selectedItem
            ? `Remove "${selectedItem.subject?.subjectName || "this subject"}" from this curriculum?`
            : ""
        }
        onCancel={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default CurriculumSubject;
