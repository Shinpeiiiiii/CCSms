import { useState } from "react";

import {
    TextField,
    SelectField,
} from "../../../../../components/forms";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

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
        setForm((prev) => ({ ...prev, [name]: value }));
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <div className="px-3 py-2 border border-gray-200 bg-gray-50 text-sm text-gray-700 font-medium">
                    {initialValues?.subject?.subjectCode} — {initialValues?.subject?.subjectName}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <SelectField
                    label="Year Level"
                    name="yearLevel"
                    value={form.yearLevel}
                    onChange={handleChange}
                    options={[
                        { value: 1, label: "1st Year" },
                        { value: 2, label: "2nd Year" },
                        { value: 3, label: "3rd Year" },
                        { value: 4, label: "4th Year" },
                    ]}
                    valueField="value"
                    labelField="label"
                    required
                />

                <SelectField
                    label="Semester"
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    options={[
                        { value: 1, label: "1st Semester" },
                        { value: 2, label: "2nd Semester" },
                        { value: 3, label: "Summer" },
                    ]}
                    valueField="value"
                    labelField="label"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <TextField
                    label="Display Order"
                    name="displayOrder"
                    type="number"
                    value={form.displayOrder}
                    onChange={handleChange}
                    helperText="Position within year/semester"
                    required
                />

                <SelectField
                    label="Type"
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
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
                <PrimaryButton type="submit" loading={loading} size="sm">
                    {isEdit ? "Save Changes" : "Add Subject"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default CurriculumSubjectForm;
