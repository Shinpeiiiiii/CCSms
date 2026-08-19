import { useState } from "react";

import useProgram from "../../program/hooks/useProgram";
import useAcademicYear from "../../academicyear/hooks/useAcademicyear";

import {
    TextField,
    TextAreaField,
    SelectField,
    FormActions,
} from "../../../../../components/forms";

const CurriculumForm = ({
    initialValues = null,
    onSubmit,
    loading = false,
}) => {
    const { programs = [] } = useProgram();
    const { academicYear = [] } = useAcademicYear();

    const getInitialForm = () => ({
        curriculumCode:
            initialValues?.curriculumCode || "",

        curriculumName:
            initialValues?.curriculumName || "",

        program:
            initialValues?.program?._id ||
            initialValues?.program ||
            "",

        academicYear:
            initialValues?.academicYear?._id ||
            initialValues?.academicYear ||
            "",

        totalYears:
            initialValues?.totalYears || 4,

        remarks:
            initialValues?.remarks || "",
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
            totalYears: Number(form.totalYears),
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
                label="Curriculum Code"
                name="curriculumCode"
                value={form.curriculumCode}
                onChange={handleChange}
                required
            />

            <TextField
                label="Curriculum Name"
                name="curriculumName"
                value={form.curriculumName}
                onChange={handleChange}
                required
            />

            <SelectField
                label="Program"
                name="program"
                value={form.program}
                onChange={handleChange}
                options={programs}
                valueField="_id"
                labelField="programName"
                required
                error="This field is required"
            />

            <SelectField
                label="Academic Year"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                options={academicYear}
                valueField="_id"
                labelField="academicYearName"
                required

            />

            <TextField
                label="Total Years"
                name="totalYears"
                type="number"
                value={form.totalYears}
                onChange={handleChange}
                required
            />

            <TextAreaField
                label="Remarks"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
            />

            <FormActions
                loading={loading}
                submitLabel={
                    initialValues
                        ? "Save Changes"
                        : "Create Curriculum"
                }
            />

        </form>

    );

};

export default CurriculumForm;