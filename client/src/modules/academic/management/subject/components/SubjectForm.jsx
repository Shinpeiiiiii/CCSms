import { useEffect, useState } from "react";

import {
    TextField,
    TextAreaField,
    SelectField,
    FormActions,
} from "../../../../../components/forms";

const SubjectForm = ({
    initialValues = null,
    onSubmit,
    loading = false,
}) => {

    const getInitialForm = () => ({
        subjectCode: initialValues?.subjectCode || "",
        subjectName: initialValues?.subjectName || "",
        units: initialValues?.units || 3,
        lectureHours: initialValues?.lectureHours || 3,
        laboratoryHours: initialValues?.laboratoryHours || 0,
        subjectCategory:
            initialValues?.subjectCategory || "Core",
        description: initialValues?.description || "",
        status: initialValues?.status || "Active",
    });

    const [form, setForm] = useState(getInitialForm);

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

            units: Number(form.units),

            lectureHours: Number(form.lectureHours),

            laboratoryHours: Number(form.laboratoryHours),

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

            <TextField
                label="Subject Code"
                name="subjectCode"
                value={form.subjectCode}
                onChange={handleChange}
                required
            />

            <TextField
                label="Subject Name"
                name="subjectName"
                value={form.subjectName}
                onChange={handleChange}
                required
            />

            <TextField
                label="Units"
                name="units"
                type="number"
                value={form.units}
                onChange={handleChange}
                required
            />

            <TextField
                label="Lecture Hours"
                name="lectureHours"
                type="number"
                value={form.lectureHours}
                onChange={handleChange}
                required
            />

            <TextField
                label="Laboratory Hours"
                name="laboratoryHours"
                type="number"
                value={form.laboratoryHours}
                onChange={handleChange}
                required
            />

            <SelectField
                label="Subject Category"
                name="subjectCategory"
                value={form.subjectCategory}
                onChange={handleChange}
                options={[
                    {
                        value: "Core",
                        label: "Core",
                    },
                    {
                        value: "Major",
                        label: "Major",
                    },
                    {
                        value: "Elective",
                        label: "Elective",
                    },
                    {
                        value: "General Education",
                        label: "General Education",
                    },
                    {
                        value: "Specialization",
                        label: "Specialization",
                    },
                    {
                        value: "OJT",
                        label: "OJT",
                    },
                ]}
                valueField="value"
                labelField="label"
                required
            />

            <TextAreaField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
            />

            <SelectField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                    {
                        value: "Active",
                        label: "Active",
                    },
                    {
                        value: "Inactive",
                        label: "Inactive",
                    },
                ]}
                valueField="value"
                labelField="label"
            />

            <FormActions
                loading={loading}
                submitLabel={
                    initialValues
                        ? "Save Changes"
                        : "Create Subject"
                }
            />

        </form>

    );

};

export default SubjectForm;