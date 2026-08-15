import { useEffect, useState } from "react";

import PrerequisiteCurriculumSection from "./PrerequisiteCurriculumSection";
import PrerequisiteSubjectSection from "./PrerequisiteSubjectSection";
import PrerequisiteRuleSection from "./PrerequisiteRuleSection";

const PrerequisiteForm = ({
    initialValues = null,
    subjects = [],
    curriculums = [],
    curriculumSubjectMap = {},
    onSubmit,
    loading = false,
    defaultCurriculumId = "",
    hideCurriculum = false,
}) => {

    const getSubjectYearLevelSemester = (subjectId, curriculumId) => {
        if (!curriculumId || !subjectId || !curriculumSubjectMap[curriculumId]) return null
        const curriculumSubjects = curriculumSubjectMap[curriculumId]
        if (!Array.isArray(curriculumSubjects)) return null
        const match = curriculumSubjects.find(cs => String(cs.subjectId) === String(subjectId))
        if (!match) return null
        return { yearLevel: String(match.yearLevel), semester: String(match.semester) }
    }

    const getInitialForm = () => {

        const curriculum = initialValues?.curriculum?._id || initialValues?.curriculum || defaultCurriculumId || ""

        const subject = initialValues?.subject?._id || initialValues?.subject || ""

        const requiredSubject = initialValues?.requiredSubject?._id
            ? [initialValues.requiredSubject._id]
            : Array.isArray(initialValues?.requiredSubject)
                ? initialValues.requiredSubject
                : []

        let yearLevel = initialValues?.yearLevel || ""

        let semester = initialValues?.semester || ""

        if (initialValues && subject && curriculum) {
            const derived = getSubjectYearLevelSemester(subject, curriculum)

            if (derived) {
                yearLevel = derived.yearLevel

                semester = derived.semester
            }
        }

        return {

            curriculum,

            subject,

            requiredSubject,

            type:
                initialValues?.type || "Prerequisite",

            minimumGrade:
                initialValues?.minimumGrade || 75,

            yearLevel,

            semester,

        };

    };

    const [form, setForm] = useState(
        getInitialForm
    );

    useEffect(() => {

        setForm(getInitialForm());

    }, [initialValues]);

    useEffect(() => {
        if (!form.subject || !form.curriculum) return;

        const derived = getSubjectYearLevelSemester(form.subject, form.curriculum);

        if (!derived) return;

        setForm((prev) => ({
            ...prev,
            yearLevel: derived.yearLevel,
            semester: derived.semester,
        }));
    }, [form.subject, form.curriculum, curriculumSubjectMap]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const subjectInCurriculum = (subjectId, curriculumId, yearLevel = null, semester = null) => {
        if (!curriculumId || !curriculumSubjectMap[curriculumId]) return true
        const curriculumSubjects = curriculumSubjectMap[curriculumId]
        if (!Array.isArray(curriculumSubjects)) return true
        return curriculumSubjects.some(cs => {
            if (String(cs.subjectId) !== String(subjectId)) return false
            if (yearLevel && cs.yearLevel !== yearLevel) return false
            if (semester && cs.semester !== semester) return false
            return true
        })
    }

    const filteredSubjects = form.curriculum
        ? subjects.filter(item => subjectInCurriculum(item._id, form.curriculum, form.yearLevel ? Number(form.yearLevel) : null, form.semester ? Number(form.semester) : null))
        : subjects

    const filteredRequiredSubjects = form.curriculum
        ? subjects.filter(item =>
            item._id !== form.subject && subjectInCurriculum(item._id, form.curriculum)
        )
        : subjects.filter(item => item._id !== form.subject)

    const handleSubmit = (e) => {

        e.preventDefault();

        const { yearLevel, semester, ...rest } = form;

        const payload = {

            ...rest,

            minimumGrade: Number(form.minimumGrade),

        };

        if (payload.curriculum) {
            payload.curriculum = payload.curriculum
        } else {
            delete payload.curriculum
        }

        onSubmit(payload);

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >
            <PrerequisiteCurriculumSection
                hideCurriculum={hideCurriculum}
                form={form}
                curriculums={curriculums}
                handleChange={handleChange}
                initialValues={initialValues}
            />

            <PrerequisiteSubjectSection
                form={form}
                setForm={setForm}
                filteredSubjects={filteredSubjects}
                filteredRequiredSubjects={filteredRequiredSubjects}
                handleChange={handleChange}
            />

            <PrerequisiteRuleSection
                form={form}
                handleChange={handleChange}
                loading={loading}
            />
        </form>
    );

};

export default PrerequisiteForm;
