import { useEffect, useState } from "react";
import {
    TextField,
    SelectField,
    FormActions,
} from "@/components/forms";

const AccountForm = ({ initialValues = null, onSubmit, loading = false }) => {
    const getInitialForm = () => ({
        firstName: initialValues?.firstName || "",
        middleName: initialValues?.middleName || "",
        lastName: initialValues?.lastName || "",
        email: initialValues?.email || "",
        role: initialValues?.role || "teacher",
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
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
            />

            <TextField
                label="Middle Name"
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
            />

            <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
            />

            <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                helperText="The user will receive an activation link at this email."
            />

            <SelectField
                label="Account Type"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                    { value: "teacher", label: "Teacher" },
                    { value: "registrar", label: "Registrar" },
                    { value: "admin", label: "Admin" },
                ]}
                valueField="value"
                labelField="label"
                required
            />

            <FormActions
                loading={loading}
                submitLabel={initialValues ? "Save Changes" : "Send Invite"}
                onCancel={initialValues ? undefined : undefined}
            />
        </form>
    );
};

export default AccountForm
