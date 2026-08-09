import { useMemo, useState,useEffect } from "react";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import PrerequisiteToolbar from "../components/PrerequisiteToolbar";
import PrerequisiteModal from "../components/PrerequisiteModal";
import PrerequisiteColumns from "../components/PrerequisiteColumn";

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

    const [curriculums, setCurriculums] = useState([])
    const [curriculumSubjectMap, setCurriculumSubjectMap] = useState({})

    const {search,setSearch,selectedItem,isModalOpen,
        isDeleteOpen,openCreate,openEdit,openDelete,closeModal,closeDelete,
    } = useCrud();

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadCurriculums = async () => {
            try {
                const data = await getCurriculum()
                setCurriculums(data)
                const entries = await Promise.all(
                    data.map(async (c) => {
                        const subjects = await getCurriculumSubject(c._id)
                        const subjectIds = new Set(
                            (Array.isArray(subjects) ? subjects : []).map(
                                item => String(item.subject?._id || item.subject)
                            )
                        )
                        return [c._id, subjectIds]
                    })
                )
                setCurriculumSubjectMap(Object.fromEntries(entries))
            } catch (error) {
                console.error("Failed to load curriculums for prerequisite:", error)
            }
        }
        loadCurriculums()
    }, [])
    const filteredPrerequisites = useMemo(() => {

        const keyword = search.toLowerCase();

        return prerequisites.filter((item) =>

            item.subject?.subjectName
                ?.toLowerCase()
                .includes(keyword)
            ||
            item.requiredSubject?.subjectName
                ?.toLowerCase()
                .includes(keyword)
            ||
            item.type
                ?.toLowerCase()
                .includes(keyword)
        );
    }, [prerequisites, search]);

    const handleSave = async (formData) => {

        try {
            setSaving(true);
            if (selectedItem) {
                await updatePrerequisite(
                    selectedItem._id,
                    formData
                );
            } else {
                await createPrerequisite(
                    formData
                );
            }
            closeModal();
            await refreshPrerequisites();
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to save prerequisite."
            );
        }
        finally {
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
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete prerequisite."
            );
        }
        finally {
            setDeleting(false);
        }
    };

    const columns = PrerequisiteColumns({openEdit,openDelete,});

    return (
        <DashboardLayout>
            <Card
                title="Subject Prerequisites"
                subtitle="Manage prerequisite relationships"
                actions={
                    <PrerequisiteToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredPrerequisites}
                    loading={loading}
                    emptyMessage="No prerequisites found."
                />
            </Card>
            <PrerequisiteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                prerequisite={selectedItem}
                subjects={subject}
                curriculums={curriculums}
                curriculumSubjectMap={curriculumSubjectMap}
                loading={saving}
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Prerequisite"
                message={
                    selectedItem
                        ? `Remove prerequisite "${selectedItem.subject?.subjectName}"?`
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