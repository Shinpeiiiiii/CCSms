import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";
import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import CurriculumSubjectToolbar from "../components/CurriculumSubjectToolbar";
import CurriculumSubjectColumn from "../components/CurriculumSubjectColumn";
import CurriculumSubjectModal from "../components/CurriculumSubjectModal";

import useCrud from "../../../../../hooks/useCrud";
import useCurriculumSubject from "../hooks/useCurriculumSubject";
import useSubject from "../../subject/hooks/useSubject";
import {
    addCurriculumSubject,
    deleteCurriculumSubject,
    updateCurriculumSubject,
} from "../services/curriculumsubject.services";

const CurriculumSubject = () => {
    const { curriculumId } = useParams();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const {
        subjects,
        loading,
        refreshSubjects,
    } = useCurriculumSubject(curriculumId);

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

    const filteredSubjects = useMemo(() => {
        const keyword = search.toLowerCase();

        return subjects.filter((item) =>
            item.subject?.subjectCode?.toLowerCase().includes(keyword) ||
            item.subject?.subjectName?.toLowerCase().includes(keyword)
        );
    }, [subjects, search]);

    const handleSave = async (formData) => {
        try {
            setSaving(true);

            if (selectedItem) {
                await updateCurriculumSubject(selectedItem._id, formData);
            } else {
                await addCurriculumSubject(curriculumId, formData);
            }

            closeModal();
            await refreshSubjects();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save curriculum subject");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteCurriculumSubject(selectedItem._id);
            closeDelete();
            await refreshSubjects();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to remove curriculum subject");
        } finally {
            setDeleting(false);
        }
    };

    const columns = CurriculumSubjectColumn({
        onEdit: openEdit,
        onDelete: openDelete,
    });

    return (
        <DashboardLayout>
            <Card
                title="Curriculum Subjects"
                subtitle="Manage curriculum subjects"
                actions={
                    <CurriculumSubjectToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredSubjects}
                    loading={loading}
                    emptyMessage="No curriculum subjects found."
                />
            </Card>

            <CurriculumSubjectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                curriculumSubject={selectedItem}
                subjects={availableSubjects}
                loading={saving}
            />

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Remove Curriculum Subject"
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