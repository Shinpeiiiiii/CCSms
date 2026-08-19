import {
    SelectField,
    TextField,
    FormActions,
} from "../../../../../components/forms";

const PrerequisiteRuleSection = ({
    form,
    handleChange,
    loading,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <SelectField
                label="Relationship"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={[
                    {
                        value: "Prerequisite",
                        label: "Prerequisite",
                    },
                    {
                        value: "Corequisite",
                        label: "Corequisite",
                    },
                ]}
                valueField="value"
                labelField="label"
            />

            <TextField
                label="Minimum Grade"
                name="minimumGrade"
                type="number"
                value={form.minimumGrade}
                onChange={handleChange}
                required
            />

            <FormActions
                loading={loading}
                submitLabel="Save Prerequisite"
            />
        </div>
    );
};

export default PrerequisiteRuleSection;
