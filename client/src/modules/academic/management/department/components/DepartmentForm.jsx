import { useEffect, useState } from "react";
import { TextField, TextAreaField, SelectField, FormActions } from "../../../../../components/forms"


const DepartmentForm = ({
    initialValues = null,
    onSubmit,
    loading = false,
}) => {

    const getInitialForm = () => ({
        departmentCode: initialValues?.departmentCode || "",
        departmentName: initialValues?.departmentName || "",
        head: initialValues?.head || "",
        status: initialValues?.status || "Active",
    });

    const [form, setForm] = useState(getInitialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
            <TextField
                label="Department Code"
                name="departmentCode"
                value={form.departmentCode}
                onChange={handleChange}
            />

            <TextField
                label="Department Name"
                name="departmentName"
                value={form.departmentName}
                onChange={handleChange}
            />

            <TextAreaField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
            />

            <TextField
                label="Department Head"
                name="departmentHead"
                value={form.departmentHead}
                onChange={handleChange}
            />

            <SelectField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                ]}
                valueField="value"
                labelField="label"
            />

            <FormActions
                loading={loading}
                submitLabel="Save Department"
            />
        </form>
    );
};

export default DepartmentForm;