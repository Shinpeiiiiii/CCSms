import {
    SelectField,
} from "../../../../../components/forms";
import MultiSelectCheckbox from "@/components/forms/MultiSelectCheckbox";

const PrerequisiteSubjectSection = ({
    form,
    setForm,
    filteredSubjects,
    filteredRequiredSubjects,
    handleChange,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <SelectField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                options={filteredSubjects}
                valueField="_id"
                labelField="subjectName"
                required
            />

            <MultiSelectCheckbox
                label="Required Subjects"
                options={filteredRequiredSubjects}
                value={form.requiredSubject}
                onChange={(selected) => setForm(previous => ({
                    ...previous, requiredSubject: selected,
                }))}
                valueField="_id"
                labelField="subjectName"
            />
        </div>
    );
};

export default PrerequisiteSubjectSection;
