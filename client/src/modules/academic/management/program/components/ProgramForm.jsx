import { useEffect, useState } from "react";

import{
    TextField,
    TextAreaField,
    SelectField,
    FormActions,
} from "../../../../../components/forms"


const ProgramForm = ({
    initialValues,
    department = [],
    onSubmit,
    loading = false,
}) => {

    const getInitialForm = () => ({
        programCode: initialValues?.programCode || "",
        programName: initialValues?.programName || "",
        description: initialValues?.description || "",
        department:
            initialValues?.department?._id ||
            initialValues?.department ||
            "",
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

        onSubmit(form);

    };
    console.log("Departments received:", department);
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
                label="Program Code"
                name="programCode"
                value={form.programCode}
                onChange={handleChange}
                required
            />

            <TextField
                label="Program Name"
                name="programName"
                value={form.programName}
                onChange={handleChange}
                required
            />

            <SelectField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                options={department}
                valueField="_id"
                labelField="departmentName"
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
            />

            <FormActions
                loading={loading}
                submitLabel="Save Program"
            />

        </form>

    );

};

export default ProgramForm;