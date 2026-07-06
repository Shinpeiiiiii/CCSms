import { useState } from "react";

import {
    TextField,
    SelectField,
    FormActions,
} from "../../../../../components/forms";

const CurriculumSubjectForm = ({
    initialValues = null,
    subjects = [],
    onSubmit,
    loading = false,
    isEdit = false,
}) => {

    const getInitialForm = () => ({
        subject: initialValues?.subject?._id || initialValues?.subject || "",
        yearLevel: initialValues?.yearLevel || 1,
        semester: initialValues?.semester || 1,
        displayOrder: initialValues?.displayOrder || 1,
        isRequired: initialValues?.isRequired ?? true,
    });

    const [form, setForm] = useState(getInitialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            ...form,
            yearLevel: Number(form.yearLevel),
            semester: Number(form.semester),
            displayOrder: Number(form.displayOrder),
            isRequired: form.isRequired === true || form.isRequired === "true",
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
            {!isEdit && (
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
            )}

            {isEdit && (
                <TextField
                    label="Subject"
                    name="subjectReadOnly"
                    value={initialValues?.subject?.subjectCode || initialValues?.subject?.subjectName || ""}
                    onChange={() => {}}
                    required
                />
            )}

            <TextField
                label="Year Level"
                name="yearLevel"
                type="number"
                value={form.yearLevel}
                onChange={handleChange}
                required
            />

            <SelectField
                label="Semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                options={[
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" },
                ]}
                valueField="value"
                labelField="label"
                required
            />

            <TextField
                label="Display Order"
                name="displayOrder"
                type="number"
                value={form.displayOrder}
                onChange={handleChange}
                required
            />

            <SelectField
                label="Required / Elective"
                name="isRequired"
                value={String(form.isRequired)}
                onChange={handleChange}
                options={[
                    { value: "true", label: "Required" },
                    { value: "false", label: "Elective" },
                ]}
                valueField="value"
                labelField="label"
                required
            />

            <FormActions
                loading={loading}
                submitLabel={isEdit ? "Save Changes" : "Add Subject"}
            />
        </form>
    );
};

export default CurriculumSubjectForm;
