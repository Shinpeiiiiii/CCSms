import { useMemo, useState } from "react";
import { Navigate ,useNavigate } from "react-router-dom";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import SubjectToolbar from "../components/SubjectToolbar";
import SubjectModal from "../components/SubjectModal";
import SubjectColumns from "../components/SubjectColumn";
import SubjectHistoryModal from "../components/SubjectHistoryModal";

import useCrud from "../../../../../hooks/useCrud";
import useSubject from "../hooks/useSubject";

import {
    createSubject,
    updateSubject,
    deleteSubject,
    createSubjectVersion,
} from "../services/subject.services";

const Subject = () => {
    const navigate = useNavigate();

    const {
        subject,
        loading,
        refreshSubjects,
    } = useSubject();

    const {
        search,
        setSearch,
        selectedItem,
        setSelectedItem,
        isModalOpen,
        isDeleteOpen,
        openCreate,
        openEdit,
        openDelete,
        closeModal,
        closeDelete,

    } = useCrud();

    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const openHistory = (subject) => {
        setSelectedItem(subject);
        setIsHistoryOpen(true);
    }
    const closeHistory = () => {
        setSelectedItem(null);
        setIsHistoryOpen(false);
    }

    const openVersionModal = (subject) => {
        setSelectedItem(subject);
        setIsHistoryOpen(false);
        setIsVersionModalOpen(true);
    };

    const closeVersionModal = () => {
        setSelectedItem(null);
        setIsVersionModalOpen(false);
    };

    const handleCreateVersion = async (formData) => {
        try{
            setSaving(true);

            await createSubjectVersion(selectedItem._id, formData);
            closeVersionModal();

            await refreshSubjects();
        }catch(error){
            alert(error.response?.data?.message || "Failed to create version.")
        }
    }

    const filteredSubjects = useMemo(() => {

        const keyword = search.toLowerCase();

        return subject.filter((item) =>

            item.subjectCode?.toLowerCase().includes(keyword)

            ||

            item.subjectName?.toLowerCase().includes(keyword)

            ||

            item.subjectCategory?.toLowerCase().includes(keyword)

            ||

            item.description?.toLowerCase().includes(keyword)

        );

    }, [subject, search]);

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (selectedItem) {

                await updateSubject(
                    selectedItem._id,
                    formData
                );

            } else {

                await createSubject(formData);

            }

            closeModal();

            await refreshSubjects();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to save subject."

            );

        }

        finally {

            setSaving(false);

        }

    };

    const handleDelete = async () => {

        try {

            setDeleting(true);

            await deleteSubject(
                selectedItem._id
            );

            closeDelete();

            await refreshSubjects();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to delete subject."

            );

        }

        finally {

            setDeleting(false);

        }

    };

    const columns = SubjectColumns({

        openEdit,
        openDelete,
        openHistory,
        navigate,

    });

    return (

        <DashboardLayout>

            <Card

                title="Subjects"

                subtitle="Manage school subjects"

                actions={

                    <SubjectToolbar

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
                    emptyMessage="No subjects found."
                />

            </Card>

            <SubjectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                subject={selectedItem}
                loading={saving}
            />

            {/* VERSION MODAL */}
            <SubjectModal
                isOpen={isVersionModalOpen}
                onClose={closeVersionModal}
                onSubmit={handleCreateVersion}
                subject={selectedItem}
                loading={saving}
                mode="version"
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Subject"
                message={
                    selectedItem
                        ? `Are you sure you want to delete "${selectedItem.subjectName}"?`
                        : ""
                }
                onCancel={closeDelete}
                onConfirm={handleDelete}
                loading={deleting}
            />
            <SubjectHistoryModal
                isOpen={isHistoryOpen}
                onClose={closeHistory}
                subject={selectedItem}
                onCreateVersion={openVersionModal}
            />

        </DashboardLayout>

    );

};

export default Subject;