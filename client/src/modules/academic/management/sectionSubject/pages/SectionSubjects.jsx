import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../../../../shared/layouts/DashboardLayout";
import Card from "../../../../../components/cards/Cards";
import ConfirmModal from "../../../../../components/modal/ConfirmModal";

import SectionSelector from "../components/SectionSelector";
import SectionSubjectTable from "../components/SectionSubjectTable";

import useCrud from "../../../../../hooks/useCrud";
import useSectionSubject from "../hooks/useSectionSubject";

import { getSection } from "../../section/services/section.services";
import { getTeachers } from "../../../../accounts/services/account.services";

import {
    generateSectionSubjects,
    updateSectionSubject,
    deleteSectionSubject,
} from "../services/sectionsubject.services";

const SectionSubjects = () => {

    const [sections, setSections] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [selectedSection, setSelectedSection] = useState("");

    const {
        subjects,
        loading,
        refreshSubjects,
    } = useSectionSubject(selectedSection);

    const [generating, setGenerating] = useState(false);

    const {
        search,
        selectedItem,
        isDeleteOpen,
        closeDelete,
    } = useCrud();

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {

        try {

            const [sectionsData, teachersData] = await Promise.all([
                getSection(),
                getTeachers(),
            ]);
            console.log('giatay:', teachersData);
            setSections(sectionsData);
            setTeachers(teachersData);

        } catch (error) {
            console.log({
                success: false,
                message: error.response?.data
            });
            toast.error(error.response?.data?.message || "Failed to load initial data.");

        }

    };

    const handleGenerate = async () => {

        if (!selectedSection) return;

        try {

            setGenerating(true);
            await generateSectionSubjects(selectedSection);
            toast.success("Section subjects generated.");
            await refreshSubjects();

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate section subjects.");
        } finally {
            setGenerating(false);
        }

    };

    const handleSave = async (id, payload) => {

        try {

            setSaving(true);

            await updateSectionSubject(id, payload);

            toast.success("Updated successfully.");

            await refreshSubjects();

        } catch (error) {

            toast.error(error.response?.data?.message || "Failed to update section subject.");

        } finally {

            setSaving(false);

        }

    };

    const handleDelete = async () => {

        try {

            setDeleting(true);

            await deleteSectionSubject(selectedItem._id);

            closeDelete();

            await refreshSubjects();

            toast.success("Deleted successfully.");

        } catch (error) {

            toast.error(error.response?.data?.message || "Failed to delete section subject.");

        } finally {

            setDeleting(false);

        }

    };

    const filteredSubjects = useMemo(() => {

        const keyword = search.toLowerCase();

        return subjects.filter((item) =>
            item.subject?.subjectCode?.toLowerCase().includes(keyword) ||
            item.subject?.subjectName?.toLowerCase().includes(keyword)
        );

    }, [subjects, search]);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                <SectionSelector
                    sections={sections}
                    selectedSection={selectedSection}
                    onSectionChange={setSelectedSection}
                    onGenerate={handleGenerate}
                    loading={generating}
                />

                <SectionSubjectTable
                    subjects={filteredSubjects}
                    teachers={teachers}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    loading={loading}
                />

            </div>

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Remove Section Subject"
                message={
                    selectedItem
                        ? `Remove "${selectedItem.subject?.subjectName || "this subject"}" from this section?`
                        : ""
                }
                onCancel={closeDelete}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </DashboardLayout>
    );

};

export default SectionSubjects;
