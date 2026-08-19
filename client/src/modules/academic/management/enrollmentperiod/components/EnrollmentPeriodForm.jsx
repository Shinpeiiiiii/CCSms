import { useEffect, useState } from "react";

import TextField from "../../../../../components/forms/TextField";
import SelectField from "../../../../../components/forms/SelectField";
import FormActions from "../../../../../components/forms/FormActions";

import {
    getAcademicYear,
} from "../../academicyear/services/academicyear.services";

const EnrollmentPeriodForm = ({
    initialValues = null,
    onSubmit,
    loading = false,
}) => {

    const [academicYears, setAcademicYears] = useState([]);

    const [form, setForm] = useState({

        enrollmentPeriodName: "",
        academicYear: "",
        startDate: "",
        endDate: "",
    });

    /*
    =====================================
    Load Academic Years
    =====================================
    */

    useEffect(() => {

        const loadAcademicYears = async () => {

            try {

                const data =
                    await getAcademicYear();

                setAcademicYears(data);

            }

            catch (error) {

                console.error(error);

            }

        };

        loadAcademicYears();

    }, []);

    /*
    =====================================
    Populate Form
    =====================================
    */

    useEffect(() => {

        if (!initialValues) {

            setForm({
                enrollmentPeriodName: "",
                academicYear: "",
                startDate: "",
                endDate: "",
            });

            return;

        }

        setForm({
            enrollmentPeriodName:
                initialValues.enrollmentPeriodName || "",
            academicYear:
                initialValues.academicYear?._id || "",
            startDate:
                initialValues.startDate?.slice(0, 10) || "",
            endDate:
                initialValues.endDate?.slice(0, 10) || "",
        });

    }, [initialValues]);

    /*
    =====================================
    Handle Change
    =====================================
    */

    const handleChange = (field, value) => {

        setForm(previous => ({

            ...previous,

            [field]: value,

        }));

    };

    /*
    =====================================
    Submit
    =====================================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        await onSubmit(form);

    };

    return (

        <form onSubmit={handleSubmit}>

            <div
                style={{
                    display: "grid",
                    gap: 18,
                }}
            >
                <TextField
                    label="Enrollment Period Name"
                    value={form.enrollmentPeriodName}
                    onChange={(e) =>
                        handleChange(
                            "enrollmentPeriodName",
                            e.target.value
                        )
                    }
                    required
                />
                <SelectField
                    label="Academic Year"
                    value={form.academicYear}
                    onChange={(e) =>
                        handleChange(
                            "academicYear",
                            e.target.value
                        )
                    }
                    options={academicYears.map(year => ({
                        value: year._id,
                        label: year.academicYearName,
                    }))}
                    required
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                        handleChange(
                            "startDate",
                            e.target.value
                        )
                    }
                    required
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                        handleChange(
                            "endDate",
                            e.target.value
                        )
                    }
                    required
                />

            </div>
            <FormActions
                loading={loading}
            />

        </form>
    );
};

export default EnrollmentPeriodForm;