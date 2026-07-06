import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";

import CurriculumToolbar from "../components/CurriculumToolbar";
import CurriculumModal from "../components/CurriculumModal";
import CurriculumColumns from "../components/CurriculumColumn";

import useCrud from "../../../../../hooks/useCrud";
import useCurriculum from "../hooks/useCurriculum";

import {
    createCurriculum,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
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
        isModalOpen,
        openCreate,
        openEdit,
        closeModal,
    } = useCrud();

    const [saving, setSaving] = useState(false);

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

    const handlePublish = async (curriculum) => {

        try {

            await publishCurriculum(
                curriculum._id
            );

            await refreshCurriculums();

        }

        catch (error) {

            alert(
                error.response?.data?.message
            );

        }

    };

    /*
    =====================================
    Archive
    =====================================
    */

    const handleArchive = async (curriculum) => {

        try {

            await archiveCurriculum(
                curriculum._id
            );

            await refreshCurriculums();

        }

        catch (error) {

            alert(
                error.response?.data?.message
            );

        }

    };

    const columns = CurriculumColumns({

        openEdit,

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

        </DashboardLayout>

    );

};

export default Curriculum;