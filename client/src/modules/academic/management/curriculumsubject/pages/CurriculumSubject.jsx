import { memo, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";
import Card from "../../../../../components/cards/Cards";
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

/* ─── Constants ─── */
const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2];

const VIEW_MODE = {
  MATRIX: "matrix",
  LIST: "list",
};

/* ─── Helpers ─── */
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

/* ─── Presentational Components ───
    Google-style monochrome theme:
    - Base surfaces: white / #DADCE0 borders
    - "Required" = solid black pill, "Elective" = outlined black pill
    - Units = neutral gray pill
    - Hover states lift with a subtle border-darken + shadow, no color noise
 */
const SubjectBadge = memo(({ isRequired, units }) => (
   <div className="mt-1.5 flex items-center gap-1.5">
       <span
           className={`px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
               isRequired
                   ? "bg-black text-white"
                   : "border border-black/70 text-black"
           }`}
       >
           {isRequired ? "Required" : "Elective"}
       </span>
       <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
           {units || 0} units
       </span>
   </div>
));

const SubjectCard = memo(({ item }) => (
   <div className="group flex items-center justify-between gap-2 border border-gray-200 bg-white p-3 transition-colors hover:border-black/60 hover:shadow-sm">
       <div className="min-w-0 flex-1">
           <div className="truncate text-[13px] font-semibold text-black">
               {item.subject?.subjectCode || "-"}
           </div>
           <div className="truncate text-[11px] text-gray-500">
               {item.subject?.subjectName || "-"}
           </div>
           <SubjectBadge
               isRequired={item.isRequired}
               units={item.units || item.subject?.units}
           />
       </div>
   </div>
));

const EmptyCell = memo(() => (
   <div className="border border-dashed border-gray-300 p-4 text-center text-[13px] text-gray-400">
       No subjects
   </div>
));

const MatrixCell = memo(({ subjects }) => {
   if (subjects.length === 0) return <EmptyCell />;

   return (
       <div className="flex flex-col gap-2">
           {subjects.map((item) => (
               <SubjectCard key={item._id} item={item} />
           ))}
       </div>
   );
});

const CurriculumMatrix = memo(({ structure, title }) => {
   return (
       <div className="overflow-x-auto">
           {title && (
               <div className="mb-4 flex items-center justify-center border-b-2 border-black pb-3">
                   <p className="w-fit text-center text-sm font-semibold uppercase tracking-wide text-black">
                       {title}
                   </p>
               </div>
           )}
           <table className="w-full min-w-190 border border-gray-200 bg-white">
               <thead>
                   <tr>
                       <th className="min-w-30 border-b-2 border-black bg-gray-50 p-4 text-left text-xs font-semibold uppercase tracking-wide text-black">
                           Year
                       </th>
                       {SEMESTERS.map((sem) => (
                           <th
                               key={sem}
                               className="min-w-50 border-b-2 border-black bg-gray-50 p-4 text-center text-xs font-semibold uppercase tracking-wide text-black"
                           >
                               Semester {sem}
                           </th>
                       ))}
                   </tr>
               </thead>
               <tbody>
                   {YEARS.map((year) => (
                       <tr key={year}>
                           <td className="border-b border-gray-100 border-r border-r-gray-200 p-4 align-top font-bold text-black">
                               Year {year}
                           </td>
                           {SEMESTERS.map((sem) => {
                               const cellSubjects =
                                   structure[`Year ${year}`]?.[`Semester ${sem}`] || [];
                               return (
                                   <td
                                       key={sem}
                                       className="min-w-50 border-b border-gray-100 p-3 align-top"
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
   );
});

/* ─── Main Component ─── */
const CurriculumSubject = () => {
  const { curriculumId } = useParams();

  /* State */
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState(VIEW_MODE.MATRIX);
  const [structuring, setStructuring] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);

  /* Hooks */
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

  /* Derived */
  const derivedStructure = useMemo(() => deriveStructure(subjects), [subjects]);

  const filteredSubjects = useMemo(() => {
    const keyword = search.toLowerCase();
    return subjects.filter(
      (item) =>
        item.subject?.subjectCode?.toLowerCase().includes(keyword) ||
        item.subject?.subjectName?.toLowerCase().includes(keyword)
    );
  }, [subjects, search]);

  /* Handlers */
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
      toast.success("Curriculum structure organized successfully.");
      await refreshSubjects();
      // NOTE: loadStructure was referenced in the original file but was not
      // defined in scope. If you have this helper, import/call it here.
      // await loadStructure();
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
          toast.success("Subject updated successfully.");
        } else {
          await addCurriculumSubject(curriculumId, formData);
          toast.success("Subject added to curriculum.");
        }
        closeModal();
        await refreshSubjects();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to save curriculum subject."
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
        toast.success("Subjects added to curriculum successfully.");
        setIsBatchModalOpen(false);
        await refreshSubjects();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to batch add subjects."
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
      toast.success("Subject removed from curriculum.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove curriculum subject."
      );
    } finally {
      setDeleting(false);
    }
  }, [selectedItem, closeDelete, refreshSubjects]);

  const handleBatchAddOpen = useCallback(() => setIsBatchModalOpen(true), []);
  const handleBatchAddClose = useCallback(
    () => setIsBatchModalOpen(false),
    []
  );

  /* Columns memoized so DataTable doesn't recompute unless handlers change */
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
      <Card
        title="Curriculum Subjects"
        subtitle="Manage curriculum subjects by year and semester"
        actions={
          <CurriculumSubjectToolbar
            search={search}
            setSearch={setSearch}
            onAdd={openCreate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onAutoStructure={handleAutoStructure}
            structuring={structuring}
            onBatchAdd={handleBatchAddOpen}
          />
        }
        padding={0}
      >
        {viewMode === VIEW_MODE.MATRIX ? (
          <CurriculumMatrix structure={derivedStructure} title="Bachelor of Science on Information and Technology Curriculum" />
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubjects}
            loading={loading}
            emptyMessage="No curriculum subjects found."
          />
        )}
      </Card>

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
        onClose={handleBatchAddClose}
        onSubmit={handleBatchSave}
        subjects={availableSubjects}
        loading={batchSaving}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Remove Curriculum Subject"
        message={
          selectedItem
            ? `Remove "${
                selectedItem.subject?.subjectName || "this subject"
              }" from this curriculum?`
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