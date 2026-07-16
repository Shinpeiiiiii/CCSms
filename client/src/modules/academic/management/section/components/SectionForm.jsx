import { useEffect, useState } from "react";

import TextField from "../../../../../components/forms/TextField";
import SelectField from "../../../../../components/forms/SelectField";
import FormActions from "../../../../../components/forms/FormActions";

import { getProgram } from "../../program/services/program.services";
import { getCurriculum } from "../../curriculum/services/curriculum.services";
import { getAcademicYear } from "../../academicyear/services/academicyear.services";

const SectionForm = ({

    initialValues = null,

    onSubmit,

    loading,

}) => {

    const [formData, setFormData] = useState({

        sectionCode: "",

        sectionName: "",

        program: "",

        curriculum: "",

        academicYear: "",

        yearLevel: 1,

        capacity: 40,

    });

    const [programs, setPrograms] = useState([]);

    const [curriculums, setCurriculums] = useState([]);

    const [academicYears, setAcademicYears] = useState([]);

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        if (!initialValues) return;

        setFormData({

            sectionCode:
                initialValues.sectionCode || "",

            sectionName:
                initialValues.sectionName || "",

            program:
                initialValues.program?._id ||

                initialValues.program ||

                "",

            curriculum:
                initialValues.curriculum?._id ||

                initialValues.curriculum ||

                "",

            academicYear:
                initialValues.academicYear?._id ||

                initialValues.academicYear ||

                "",

            yearLevel:
                initialValues.yearLevel || 1,

            capacity:
                initialValues.capacity || 40,

        });

    }, [initialValues]);

    const loadData = async () => {

        try {

            const [

                programData,

                curriculumData,

                academicYearData,

            ] = await Promise.all([

                getProgram(),

                getCurriculum(),

                getAcademicYear(),

            ]);

            setPrograms(programData);

            setCurriculums(curriculumData);

            setAcademicYears(academicYearData);

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleChange = (field, value) => {

        setFormData((previous) => ({

            ...previous,

            [field]: value,

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <form onSubmit={handleSubmit}>

            <TextField
                label="Section Code"
                value={formData.sectionCode}
                onChange={(e) =>
                    handleChange(
                        "sectionCode",
                        e.target.value
                    )
                }
                required
            />

            <TextField
                label="Section Name"
                value={formData.sectionName}
                onChange={(e) =>
                    handleChange(
                        "sectionName",
                        e.target.value
                    )
                }
                required
            />

            <SelectField
                label="Program"
                value={formData.program}
                onChange={(e) =>
                    handleChange(
                        "program",
                        e.target.value
                    )
                }
                options={programs.map((item) => ({
                    value: item._id,
                    label: item.programName,
                }))}
                required
            />

            <SelectField
                label="Curriculum"
                value={formData.curriculum}
                onChange={(e) =>
                    handleChange(
                        "curriculum",
                        e.target.value
                    )
                }
                options={curriculums.map((item) => ({
                    value: item._id,
                    label: item.curriculumName,
                }))}
                required
            />

            <SelectField
                label="Academic Year"
                value={formData.academicYear}
                onChange={(e) =>
                    handleChange(
                        "academicYear",
                        e.target.value
                    )
                }
                options={academicYears.map((item) => ({
                    value: item._id,
                    label: item.academicYearName,
                }))}
                required
            />

            <SelectField
                label="Year Level"
                value={formData.yearLevel}
                onChange={(e) =>
                    handleChange(
                        "yearLevel",
                        Number(e.target.value)
                    )
                }
                options={[
                    { value: 1, label: "1st Year" },
                    { value: 2, label: "2nd Year" },
                    { value: 3, label: "3rd Year" },
                    { value: 4, label: "4th Year" },
                ]}
                required
            />

            <TextField
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                    handleChange(
                        "capacity",
                        Number(e.target.value)
                    )
                }
                required
            />

            <FormActions

                loading={loading}

                submitLabel={
                    initialValues
                        ? "Update Section"
                        : "Create Section"
                }

            />

        </form>

    );

};

export default SectionForm;