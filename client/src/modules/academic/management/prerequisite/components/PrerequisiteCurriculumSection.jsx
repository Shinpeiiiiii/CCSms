import {
    SelectField,
} from "../../../../../components/forms";

const PrerequisiteCurriculumSection = ({
    hideCurriculum,
    form,
    curriculums,
    handleChange,
    initialValues,
}) => {
    return (
        <div className="flex flex-col gap-4">
            {!hideCurriculum && (
                <SelectField
                    label="Curriculum"
                    name="curriculum"
                    value={form.curriculum}
                    onChange={handleChange}
                    options={curriculums}
                    valueField="_id"
                    labelField="curriculumName"
                    required={false}
                />
            )}

            {hideCurriculum && form.curriculum && (
                <div className="px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-700">
                    Curriculum: {curriculums.find((c) => String(c._id) === String(form.curriculum))?.curriculumName || form.curriculum}
                </div>
            )}

            <div className="flex gap-3">
                <SelectField
                    label="Year Level"
                    name="yearLevel"
                    value={form.yearLevel}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "All Years" },
                        { value: "1", label: "Year 1" },
                        { value: "2", label: "Year 2" },
                        { value: "3", label: "Year 3" },
                        { value: "4", label: "Year 4" },
                    ]}
                    required={false}
                    disabled={Boolean(initialValues)}
                />

                <SelectField
                    label="Semester"
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "All Semesters" },
                        { value: "1", label: "1st Semester" },
                        { value: "2", label: "2nd Semester" },
                        { value: "3", label: "Summer" },
                    ]}
                    required={false}
                    disabled={Boolean(initialValues)}
                />
            </div>
        </div>
    );
};

export default PrerequisiteCurriculumSection;
