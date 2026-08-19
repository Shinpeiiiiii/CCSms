import { useMemo, useState, useEffect } from "react";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";
import Card from "../../../../../components/cards/Cards";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import PrerequisiteHeader from "../components/PrerequisiteHeader";
import PrerequisiteFilterBar from "../components/PrerequisiteFilterBar";
import PrerequisiteLoadingSkeleton from "../components/PrerequisiteLoadingSkeleton";
import PrerequisiteEmptyState from "../components/PrerequisiteEmptyState";
import PrerequisiteCurriculumCard from "../components/PrerequisiteCurriculumCard";
import PrerequisiteModal from "../components/PrerequisiteModal";
import PrerequisiteSplitModal from "../components/PrerequisiteSplitModal";

import useCrud from "../../../../../hooks/useCrud";
import usePrerequisite from "../hooks/usePrerequisite";
import useSubject from "../../subject/hooks/useSubject";

import {
    createPrerequisite,
    updatePrerequisite,
    deactivatePrerequisite,
} from "../services/prerequisite.services";
import { getCurriculum } from "../../curriculum/services/curriculum.services";
import { getCurriculumSubject } from "../../curriculumsubject/services/curriculumsubject.services";

const Prerequisite = () => {
    const {
        prerequisites,
        loading,
        refreshPrerequisites,
    } = usePrerequisite();

    const {
        subject,
        loading: subjectLoading
    } = useSubject();

    const [curriculums, setCurriculums] = useState([]);
    const [curriculumSubjectMap, setCurriculumSubjectMap] = useState({});
    const [selectedCurriculumId, setSelectedCurriculumId] = useState("");

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

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activeCurriculumId, setActiveCurriculumId] = useState("");
    const [useSplitModal, setUseSplitModal] = useState(false);

    useEffect(() => {
        const loadCurriculums = async () => {
            try {
                const data = await getCurriculum();
                setCurriculums(data);
                const entries = await Promise.all(
                    data.map(async (c) => {
                        const curriculumSubjects = await getCurriculumSubject(c._id);
                        const subjectData = (Array.isArray(curriculumSubjects) ? curriculumSubjects : []).map(item => ({
                            subjectId: String(item.subject?._id || item.subject),
                            yearLevel: item.yearLevel,
                            semester: item.semester,
                        }));
                        return [c._id, subjectData];
                    })
                );
                setCurriculumSubjectMap(Object.fromEntries(entries));
            } catch (error) {
                console.error("Failed to load curriculums for prerequisite:", error);
            }
        };
        loadCurriculums();
    }, []);

    const groupedPrerequisites = useMemo(() => {
        const keyword = search.toLowerCase();

        const filtered = prerequisites.filter((item) => {
            if (!keyword) return true;
            return (
                item.subject?.subjectName?.toLowerCase().includes(keyword) ||
                item.subject?.subjectCode?.toLowerCase().includes(keyword) ||
                item.requiredSubject?.subjectName?.toLowerCase().includes(keyword) ||
                item.requiredSubject?.subjectCode?.toLowerCase().includes(keyword) ||
                item.type?.toLowerCase().includes(keyword)
            );
        });

        const groups = {};

        filtered.forEach((item) => {
            const rawCurriculumId = item.curriculum?._id || item.curriculum;
            const rawSubjectId = item.subject?._id || item.subject;

            if (!rawCurriculumId || !rawSubjectId) return;

            const curriculumId = String(rawCurriculumId);
            const subjectId = String(rawSubjectId);
            const curriculumSubjects = curriculumSubjectMap[curriculumId];

            let yearLevel = null;
            let semester = null;

            if (Array.isArray(curriculumSubjects)) {
                const match = curriculumSubjects.find(
                    (cs) => cs.subjectId === subjectId
                );
                if (match) {
                    yearLevel = match.yearLevel;
                    semester = match.semester;
                }
            }

            if (selectedCurriculumId && curriculumId !== selectedCurriculumId) {
                return;
            }

            if (!groups[curriculumId]) {
                groups[curriculumId] = {
                    curriculum: item.curriculum,
                    years: {},
                };
            }

            const yearKey = yearLevel ? `Year ${yearLevel}` : "Unassigned Year";
            if (!groups[curriculumId].years[yearKey]) {
                groups[curriculumId].years[yearKey] = {
                    semester: {},
                };
            }

            const semKey = semester
                ? (semester === 1 ? "1st Semester" : semester === 2 ? "2nd Semester" : "Summer Semester")
                : "Unassigned Semester";

            if (!groups[curriculumId].years[yearKey].semester[semKey]) {
                groups[curriculumId].years[yearKey].semester[semKey] = [];
            }

            groups[curriculumId].years[yearKey].semester[semKey].push(item);
        });

        return groups;
    }, [prerequisites, curriculumSubjectMap, search, selectedCurriculumId]);

    const handleSave = async (formData) => {
        try {
            setSaving(true);
            if (selectedItem) {
                const updateData = {
                    ...formData,
                    requiredSubject: Array.isArray(formData.requiredSubject)
                        ? formData.requiredSubject[0]
                        : formData.requiredSubject,
                };
                await updatePrerequisite(
                    selectedItem._id,
                    updateData
                );
            } else {
                await createPrerequisite({
                    ...formData,
                    requiredSubject: requiredSubjects,
                });
            }
            if (!useSplitModal) {
                closeModal();
            }
            await refreshPrerequisites();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to save prerequisite."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deactivatePrerequisite(
                selectedItem._id
            );
            closeDelete();
            await refreshPrerequisites();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete prerequisite."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleOpenCreateForCurriculum = (curriculumId) => {
        setActiveCurriculumId(curriculumId);
        setUseSplitModal(true);
        openCreate();
    };

    const handleCloseModal = () => {
        closeModal();
        setActiveCurriculumId("");
        setUseSplitModal(false);
    };

    const handleEditFromSplitList = (item) => {
        setUseSplitModal(false);
        openEdit(item);
    };

    const handleDeleteFromSplitList = (item) => {
        setUseSplitModal(false);
        openDelete(item);
    };

    const curriculumPrerequisitesForActiveCurriculum = useMemo(() => {
        if (!activeCurriculumId) return [];
        return prerequisites.filter((item) => {
            const rawCurriculumId = item.curriculum?._id || item.curriculum;
            return String(rawCurriculumId) === String(activeCurriculumId);
        });
    }, [prerequisites, activeCurriculumId]);

    const curriculumEntries = Object.entries(groupedPrerequisites);

    return (
        <DashboardLayout>
            <PrerequisiteHeader />

            <Card padding={0} className="mb-6">
                <PrerequisiteFilterBar
                    curriculums={curriculums}
                    selectedCurriculumId={selectedCurriculumId}
                    onCurriculumChange={setSelectedCurriculumId}
                    search={search}
                    onSearchChange={setSearch}
                    onAdd={openCreate}
                />
            </Card>

            {loading ? (
                <PrerequisiteLoadingSkeleton />
            ) : curriculumEntries.length === 0 ? (
                <PrerequisiteEmptyState search={search} onAdd={openCreate} />
            ) : (
                <div className="flex flex-col gap-6">
                    {curriculumEntries.map(([curriculumId, curriculumGroup]) => (
                        <PrerequisiteCurriculumCard
                            key={curriculumId}
                            curriculumId={curriculumId}
                            curriculumGroup={curriculumGroup}
                            onOpenCreateForCurriculum={handleOpenCreateForCurriculum}
                            onEditItem={openEdit}
                            onDeleteItem={openDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {useSplitModal ? (
                <PrerequisiteSplitModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSave}
                    prerequisite={selectedItem}
                    subjects={subject}
                    curriculums={curriculums}
                    curriculumSubjectMap={curriculumSubjectMap}
                    loading={saving}
                    defaultCurriculumId={activeCurriculumId}
                    curriculumPrerequisites={curriculumPrerequisitesForActiveCurriculum}
                    onEditFromList={handleEditFromSplitList}
                    onDeleteFromSplitList={handleDeleteFromSplitList}
                    refreshAfterAction={refreshPrerequisites}
                />
            ) : (
                <PrerequisiteModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSave}
                    prerequisite={selectedItem}
                    subjects={subject}
                    curriculums={curriculums}
                    curriculumSubjectMap={curriculumSubjectMap}
                    loading={saving}
                    defaultCurriculumId={activeCurriculumId}
                />
            )}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Prerequisite"
                message={
                    selectedItem
                        ? `Are you sure you want to remove the prerequisite requirement for "${selectedItem.subject?.subjectName}"?`
                        : ""
                }
                onCancel={closeDelete}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </DashboardLayout>
    );
};

export default Prerequisite;
