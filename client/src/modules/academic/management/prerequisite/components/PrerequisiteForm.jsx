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
    onSubmit,
    loading = false,
}) => {

    const getInitialForm = () => ({

        subject:
            initialValues?.subject?._id || "",

        requiredSubject:
            initialValues?.requiredSubject?._id || [],

        type:
            initialValues?.type || "Prerequisite",

        minimumGrade:
            initialValues?.minimumGrade || 75,

    });

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

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            ...form,

            minimumGrade: Number(form.minimumGrade),

        });

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

                label="Subject"

                name="subject"

                value={form.subject}

                onChange={handleChange}

                options={subjects}

                valueField="_id"

                labelField="subjectName"

                required

            />

            <MultiSelectCheckbox
                label="Required Subjects"
                options={
                    subjects.filter(
                        item=> item._id !== form.subject
                    )
                }

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