import { useEffect, useState } from "react";

import {
    SelectField,
    TextField,
    FormActions,
} from "../../../../../components/forms";
import MultiSelectCheckbox from "@/components/forms/MultiSelectCheckbox";

const PrerequisiteForm = ({
    initialValues = null,
    subjects = [],
    curriculums = [],
    curriculumSubjectMap = {},
    onSubmit,
    loading = false,
}) => {

    const getInitialForm = () => {

        const curriculum = initialValues?.curriculum?._id || initialValues?.curriculum || ""

        const subject = initialValues?.subject?._id || initialValues?.subject || ""

        const requiredSubject = initialValues?.requiredSubject?._id
            ? [initialValues.requiredSubject._id]
            : Array.isArray(initialValues?.requiredSubject)
                ? initialValues.requiredSubject
                : []

        return {

            curriculum,

            subject,

            requiredSubject,

            type:
                initialValues?.type || "Prerequisite",

            minimumGrade:
                initialValues?.minimumGrade || 75,

        };

    };

    const [form, setForm] = useState(
        getInitialForm
    );

    useEffect(() => {

        setForm(getInitialForm());

    }, [initialValues]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const subjectInCurriculum = (subjectId, curriculumId) => {
        if (!curriculumId || !curriculumSubjectMap[curriculumId]) return true
        return curriculumSubjectMap[curriculumId].has(String(subjectId))
    }

    const filteredSubjects = form.curriculum
        ? subjects.filter(item => subjectInCurriculum(item._id, form.curriculum))
        : subjects

    const filteredRequiredSubjects = form.curriculum
        ? subjects.filter(item =>
            item._id !== form.subject && subjectInCurriculum(item._id, form.curriculum)
        )
        : subjects.filter(item => item._id !== form.subject)

    const handleSubmit = (e) => {

        e.preventDefault();

        const payload = {

            ...form,

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

            style={{

                display: "flex",

                flexDirection: "column",

                gap: 20,

            }}

        >

            <SelectField

                label="Curriculum"

                name="curriculum"

                value={form.curriculum}

                onChange={handleChange}

                options={curriculums}

                valueField="_id"

                labelField="curriculumName"

                required={false}

            />

            <SelectField

                label="Subject"

                name="subject"

                value={form.subject}

                onChange={handleChange}

                options={filteredSubjects}

                valueField="_id"

                labelField="subjectName"

                required

            />

            <MultiSelectCheckbox
                label="Required Subjects"
                options={filteredRequiredSubjects}
                value={form.requiredSubject}
                onChange={(selected) => setForm(previous => ({
                    ...previous, requiredSubject: selected,
                }))}
                valueField="_id"
                labelField="subjectName"
            />

            <SelectField

                label="Relationship"

                name="type"

                value={form.type}

                onChange={handleChange}

                options={[

                    {

                        value: "Prerequisite",

                        label: "Prerequisite",

                    },

                    {

                        value: "Corequisite",

                        label: "Corequisite",

                    },

                ]}

                valueField="value"

                labelField="label"

            />

            <TextField

                label="Minimum Grade"

                name="minimumGrade"

                type="number"

                value={form.minimumGrade}

                onChange={handleChange}

                required

            />

            <FormActions

                loading={loading}

                submitLabel="Save Prerequisite"

            />

        </form>

    );

};

export default PrerequisiteForm;