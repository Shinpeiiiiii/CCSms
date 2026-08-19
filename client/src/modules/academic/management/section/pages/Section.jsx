import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";

import Card from "../../../../../components/cards/Cards";
import DataTable from "../../../../../components/table/DataTable";

import SectionToolbar from "../components/SectionToolbar";
import SectionModal from "../components/SectionModal";
import SectionColumns from "../components/SectionColumn";

import useCrud from "../../../../../hooks/useCrud";
import useSection from "../hooks/useSection";

import {
    createSection,
    updateSection,
    openSection,
    closeSection,
    archiveSection,

} from "../services/section.services";

const Section = () => {

    const {
        sections,
        loading,
        refreshSections,
    } = useSection();

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

    const filteredSections = useMemo(() => {

        const keyword = search.toLowerCase();

        return sections.filter((section) =>

            section.sectionCode
                ?.toLowerCase()
                .includes(keyword)

            ||

            section.sectionName
                ?.toLowerCase()
                .includes(keyword)

            ||

            section.program?.programName
                ?.toLowerCase()
                .includes(keyword)

            ||

            section.curriculum?.curriculumName
                ?.toLowerCase()
                .includes(keyword)

            ||

            section.academicYear?.academicYearName
                ?.toLowerCase()
                .includes(keyword)
        );

    }, [sections, search]);

    /*
    =====================================
    Save
    =====================================
    */

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (selectedItem) {

                await updateSection(
                    selectedItem._id,
                    formData
                );
                toast.success("Section updated successfully.");
            }
            else {
                await createSection(formData);
                toast.success("Section created successfully.");
            }
            closeModal();
            await refreshSections();
        }
        catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save section."
            );
        }
        finally {
            setSaving(false);
        }
    };

    /*
    =====================================
    Activate
    =====================================
    */

    const handleOpenSection = async (section) => {

        try {

            const result = await openSection(section._id);
            await refreshSections();

            if (result?.generatedSubjects > 0) {
                toast.success(
                    `Section opened and ${result.generatedSubjects} subject(s) generated.`
                );
            } else {
                toast.success("Section opened successfully.");
            }
        }
        catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to open section."
            );
        }
    };
    const handleCloseSection = async (section) => {
        try{
            await closeSection(section._id);
            await refreshSections();
            toast.success("Section closed successfully.");
        }
        catch(error){
            toast.error(
                error.response?.data?.message || "Failed to close section."
            );
        }
    };
    /*
    =====================================
    Archive
    =====================================
    */
    const handleArchive = async (section) => {

        try {
            await archiveSection(section._id);
            await refreshSections();
            toast.success("Section archived successfully.");
        }
        catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to archive section."
            );
        }
    };

    const columns = SectionColumns({
        openEdit,
        onOpen: handleOpenSection,
        onClose: handleCloseSection,
        onArchive: handleArchive,
    });

    return (

        <DashboardLayout>
            <Card
                title="Sections"
                subtitle="Manage class sections"
                actions={
                    <SectionToolbar
                        search={search}
                        setSearch={setSearch}
                        onAdd={openCreate}
                    />
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredSections}
                    loading={loading}
                    emptyMessage="No sections found."
                />
            </Card>
            <SectionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                section={selectedItem}
                loading={saving}
            />
        </DashboardLayout>
    );
};

export default Section;