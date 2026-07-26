import { useEffect, useState } from "react";

import SectionSelector from "../components/SectionSelector";
import SectionSubjectTable from "../components/SectionSubjectTable";

import {getSection}  from "../../section/services/section.services";
import  {getTeachers}  from "../../../../accounts/services/account.services";

import {
    getSectionSubjects,
    generateSectionSubjects,
    updateSectionSubject,
    deleteSectionSubject,
} from "../services/sectionsubject.services";

import { toast } from "react-toastify";
import DashboardLayout from "@/shared/layouts/DashboardLayout";

const SectionSubjects = () => {

    const [sections, setSections] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [selectedSection, setSelectedSection] = useState("");

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedSection) {
            loadSectionSubjects(selectedSection);
        } else {
            setSubjects([]);
        }
    }, [selectedSection]);

    const loadInitialData = async () => {

        try {

            const [sectionsData, teachersData] =
                await Promise.all([
                    getSection(),
                    getTeachers(),
                ]);

            setSections(sectionsData);
            setTeachers(teachersData);

        } catch (error) {

            toast.error(error.message);

        }

    };

    const loadSectionSubjects = async (sectionId) => {

        try {

            const data =
                await getSectionSubjects(sectionId);

            setSubjects(data);

        } catch (error) {

            toast.error(error.message);

        }

    };

    const handleGenerate = async () => {

        if (!selectedSection) return;

        try {

            setLoading(true);

            await generateSectionSubjects(selectedSection);

            toast.success("Section subjects generated.");

            await loadSectionSubjects(selectedSection);

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    };

    const handleSave = async (id, payload) => {

        try {

            await updateSectionSubject(id, payload);

            toast.success("Updated successfully.");

            await loadSectionSubjects(selectedSection);

        } catch (error) {

            toast.error(error.message);

        }

    };

    const handleDelete = async (id) => {
        try {
            await deleteSectionSubject(id);
            toast.success("Deleted successfully.");
            await loadSectionSubjects(selectedSection);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <DashboardLayout>
        <div className="space-y-6">

            <SectionSelector
                sections={sections}
                selectedSection={selectedSection}
                onSectionChange={setSelectedSection}
                onGenerate={handleGenerate}
                loading={loading}
            />

            <SectionSubjectTable
                subjects={subjects}
                teachers={teachers}
                onSave={handleSave}
                onDelete={handleDelete}
            />

        </div>
        </DashboardLayout>
    );
}

export default SectionSubjects;