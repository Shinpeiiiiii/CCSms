import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";
import BulkActionBar from "../../../../../components/actions/BulkActionBar";
import CheckboxColumn from "../../../../../components/table/CheckboxColumn";
import useBatchSelection from "../../../../../hooks/useBatchSelection";

import CurriculumToolbar from "../components/CurriculumToolbar";
import CurriculumModal from "../components/CurriculumModal";
import CurriculumColumns from "../components/CurriculumColumn";
import CurriculumHistoryModal from "../components/CurriculumHistoryModal";
import TemplateSelectModal from "../components/TemplateSelectModal";
import ImportCurriculumModal from "../components/ImportCurriculumModal";

import useCrud from "../../../../../hooks/useCrud";
import useCurriculum from "../hooks/useCurriculum";

import {
    createCurriculum,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createCurriculumVersion,
    saveAsTemplate,
    getTemplates,
    createCurriculumFromTemplate,
    exportCurriculum,
    importCurriculum,
    deleteCurriculumsBatch,
} from "../services/curriculum.services";
import { QUERY_KEYS } from "../../../../../constants/queryKey";

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
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const { data: templates = [], isLoading: loadingTemplates } = useQuery({
        queryKey: QUERY_KEYS.CURRICULUM_TEMPLATES,
        queryFn: getTemplates,
        enabled: isTemplateOpen,
        select: (data) => data || [],
    });

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
        const filtered = curriculum.filter((item) =>
            item.curriculumCode?.toLowerCase().includes(keyword) ||
            item.curriculumName?.toLowerCase().includes(keyword) ||
            item.program?.programName?.toLowerCase().includes(keyword) ||
            item.academicYear?.academicYearName?.toLowerCase().includes(keyword)
        );

        const active = filtered.filter((item) => item.status !== "Archived");
        const archived = filtered.filter((item) => item.status === "Archived");

        if (archived.length === 0) return active;

        return [
            ...active,
            { _isSeparator: true, _separatorLabel: "Archived" },
            ...archived,
        ];
    }, [curriculum, search]);

    const {
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        clearSelection,
        isAllSelected,
        isIndeterminate,
        selectedCount,
    } = useBatchSelection(filteredCurriculums);

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
        console.log("Attempting to publish curriculum:", curriculum);
        try {
            const result = await publishCurriculum(curriculum._id);
            console.log("Publish result:", result);
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

    const handleArchive = async (curriculum) => {
        try {
            await archiveCurriculum(curriculum._id);
            toast.success("Curriculum archived successfully.");
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to archive curriculum."
            );
        }
    };

    const handleSaveAsTemplate = async (curriculum) => {
        const name = prompt("Template name:", `${curriculum.curriculumCode} Template`);
        if (!name) return;

        try {
            setSaving(true);
            await saveAsTemplate(curriculum._id, name);
            toast.success("Template saved successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save template."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleOpenFromTemplate = () => {
        setIsTemplateOpen(true);
    };

    const handleCreateFromTemplate = async (templateId, formData) => {
        try {
            setSaving(true);
            await createCurriculumFromTemplate(templateId, formData);
            setIsTemplateOpen(false);
            toast.success("Curriculum created from template successfully.");
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create curriculum from template."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async (curriculum) => {
        try {
            const data = await exportCurriculum(curriculum._id);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${curriculum.curriculumCode}-export.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Curriculum exported successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to export curriculum."
            );
        }
    };

    const handleImport = async (payload) => {
        try {
            setSaving(true);
            await importCurriculum(payload);
            setIsImportOpen(false);
            toast.success("Curriculum imported successfully.");
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to import curriculum."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleBulkDelete = async () => {
        try {
            setBulkDeleting(true);
            const result = await deleteCurriculumsBatch(selectedIds);
            toast.success(
                `${result.deletedCount} curriculum/curriculums deleted successfully.`
            );
            clearSelection();
            setIsBulkDeleteOpen(false);
            await refreshCurriculums();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete curriculums."
            );
        } finally {
            setBulkDeleting(false);
        }
    };

    const columns = [
        CheckboxColumn({
            selectedIds,
            toggleSelect,
            toggleSelectAll,
            isAllSelected,
            isIndeterminate,
        }),
        ...CurriculumColumns({
            openEdit,
            openHistory,
            onPublish: handlePublish,
            onArchive: handleArchive,
            navigate,
            onSaveAsTemplate: handleSaveAsTemplate,
            onExport: handleExport,
        }),
    ];

    return (
        <DashboardLayout>
            <Card
                title="Curriculums"
                subtitle="Manage academic curriculums"
                actions={
                    <CurriculumToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={() => openCreate()}
                        onFromTemplate={handleOpenFromTemplate}
                        onImport={() => setIsImportOpen(true)}
                    />
                }
            >
                <BulkActionBar
                    selectedCount={selectedCount}
                    onClear={clearSelection}
                    actions={[
                        {
                            label: "Delete Selected",
                            icon: null,
                            variant: "danger",
                            onClick: () => setIsBulkDeleteOpen(true),
                        },
                    ]}
                />
                <DataTable
                    columns={columns}
                    data={filteredCurriculums}
                    loading={loading}
                    emptyMessage="No curriculums found."
                    selectedIds={selectedIds}
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
            {isTemplateOpen && (
                <TemplateSelectModal
                    isOpen={isTemplateOpen}
                    onClose={() => setIsTemplateOpen(false)}
                    templates={templates}
                    loading={loadingTemplates}
                    onCreate={handleCreateFromTemplate}
                />
            )}
            {isImportOpen && (
                <ImportCurriculumModal
                    isOpen={isImportOpen}
                    onClose={() => setIsImportOpen(false)}
                    onSubmit={handleImport}
                    loading={saving}
                />
            )}
            <ConfirmModal
                isOpen={isBulkDeleteOpen}
                onClose={() => setIsBulkDeleteOpen(false)}
                onCancel={() => setIsBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                title="Delete Selected Curriculums"
                message={`Are you sure you want to delete ${selectedCount} selected curriculum/curriculums? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                loading={bulkDeleting}
            />
        </DashboardLayout>
    );
};

export default Curriculum;