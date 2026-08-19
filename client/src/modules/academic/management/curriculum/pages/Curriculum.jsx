import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";

import CurriculumToolbar from "../components/CurriculumToolbar";
import CurriculumModal from "../components/CurriculumModal";
import CurriculumColumns from "../components/CurriculumColumn";
import CurriculumHistoryModal from "../components/CurriculumHistoryModal";

import useCrud from "../../../../../hooks/useCrud";
import useCurriculum from "../hooks/useCurriculum";

import {
    createCurriculum,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createCurriculumVersion,
} from "../services/curriculum.services";

const Curriculum = () => {
    const navigate = useNavigate();

    const {
        curriculum,
        loading,
        refreshCurriculums,
    } = useCurriculum();

    const {
        search,
        setSearch,
        selectedItem,
        setSelectedItem,
        isModalOpen,
        openCreate,
        openEdit,
        closeModal,
    } = useCrud();

    const [saving, setSaving] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isVersionOpen, setIsVersionOpen] = useState(false);

    const openHistory = (curriculum) => {
        setSelectedItem(curriculum);
        setIsHistoryOpen(true);
    };

    const closeHistory = () => {
        setSelectedItem(null);
        setIsHistoryOpen(false);
    };

    const openVersion = (curriculum) => {
        setSelectedItem(curriculum);
        setIsHistoryOpen(false);
        setIsVersionOpen(true);
    };

    const closeVersion = () => {
        setSelectedItem(null);
        setIsVersionOpen(false);
    };

    const handleCreateVersion = async (formData) => {
        try {
            setSaving(true);
            await createCurriculumVersion(
                selectedItem._id,
                formData
            );
            closeVersion();
            await refreshCurriculums();
            toast.success("New version created successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create version."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredCurriculums = useMemo(() => {
        const keyword = search.toLowerCase();
        return curriculum.filter((item) =>
            item.curriculumCode?.toLowerCase().includes(keyword) ||
            item.curriculumName?.toLowerCase().includes(keyword) ||
            item.program?.programName?.toLowerCase().includes(keyword) ||
            item.academicYear?.academicYearName?.toLowerCase().includes(keyword)
        );
    }, [curriculum, search]);

    const handleSave = async (formData) => {
        try {
            setSaving(true);
            if (selectedItem) {
                await updateCurriculum(
                    selectedItem._id,
                    formData
                );
                toast.success("Curriculum updated successfully.");
            } else {
                await createCurriculum(formData);
                toast.success("Curriculum created successfully.");
            }
            closeModal();
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save curriculum."
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async (curriculum) => {
        console.log('data',curriculum);
        console.log('curriculum id:',curriculum._id);
        try {
            const result = await publishCurriculum(curriculum._id);
            if (result?.errors?.length) {
                toast.error(
                    <div>
                        <strong>Validation failed</strong>
                        <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                            {result.errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>,
                    { autoClose: 10000 }
                );
            } else {
                toast.success("Curriculum published successfully.");
            }
            await refreshCurriculums();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to publish curriculum";
            const errors = error.response?.data?.errors;
            if (errors?.length) {
                toast.error(
                    <div>
                        <strong>{message}</strong>
                        <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                            {errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>,
                    { autoClose: 10000 }
                );
            } else {
                toast.error(message);
            }
        }
    };

    const handleArchive = async (id) => {
        try {
            await archiveCurriculum(id);
            toast.success("Curriculum archived successfully.");
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to archive curriculum."
            );
        }
    };

    const columns = CurriculumColumns({
        openEdit,
        openHistory,
        onPublish: handlePublish,
        onArchive: handleArchive,
        navigate,
    });

    return (
        <DashboardLayout>
            <Card
                title="Curriculums"
                subtitle="Manage academic curriculums"
                actions={
                    <CurriculumToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredCurriculums}
                    loading={loading}
                    emptyMessage="No curriculums found."
                />
            </Card>
            <CurriculumModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                curriculum={selectedItem}
                loading={saving}
            />
            <CurriculumModal
                isOpen={isVersionOpen}
                onClose={closeVersion}
                onSubmit={handleCreateVersion}
                curriculum={selectedItem}
                loading={saving}
                mode="version"
            />
            <CurriculumHistoryModal
                isOpen={isHistoryOpen}
                onClose={closeHistory}
                curriculum={selectedItem}
                onCreateVersion={openVersion}
            />
        </DashboardLayout>
    );
};

export default Curriculum;