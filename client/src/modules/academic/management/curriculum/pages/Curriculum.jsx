import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
        publishCurriculum,
        archiveCurriculum,

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

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to create version."

            );

        }

        finally {

            setSaving(false);

        }

    };
    /*
    =====================================
    Search
    =====================================
    */

    const filteredCurriculums = useMemo(() => {

        const keyword = search.toLowerCase();

        return curriculum.filter((item) =>

            item.curriculumCode
                ?.toLowerCase()
                .includes(keyword)

            ||

            item.curriculumName
                ?.toLowerCase()
                .includes(keyword)

            ||

            item.program?.programName
                ?.toLowerCase()
                .includes(keyword)

            ||

            item.academicYear?.academicYearName
                ?.toLowerCase()
                .includes(keyword)

        );

    }, [curriculum, search]);

    /*
    =====================================
    Save
    =====================================
    */

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (selectedItem) {

                await updateCurriculum(
                    selectedItem._id,
                    formData
                );

            } else {

                await createCurriculum(
                    formData
                );

            }

            closeModal();

            await refreshCurriculums();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to save curriculum."
            );

        }

        finally {

            setSaving(false);

        }

    };

    /*
    =====================================
    Publish
    =====================================
    */

    const columns = CurriculumColumns({

        openEdit,
        openHistory,
        onPublish: (curriculum) => publishCurriculum(curriculum._id),
        onArchive: (curriculum) => archiveCurriculum(curriculum._id),
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

            {/* VERSION MODAL */}
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