import { SelectField } from "@/components/forms";
import PrerequisiteToolbar from "./PrerequisiteToolbar";

const PrerequisiteFilterBar = ({
    curriculums,
    selectedCurriculumId,
    onCurriculumChange,
    search,
    onSearchChange,
    onAdd,
}) => {
    return (
        <div
            className="flex items-center justify-between flex-wrap gap-4"
            style={{ padding: "16px 20px", background: "#FFFFFF" }}
        >
            <div className="flex items-center gap-3">
                <SelectField
                    label="Curriculum"
                    value={selectedCurriculumId}
                    onChange={(e) => onCurriculumChange(e.target.value)}
                    options={[
                        { value: "", label: "All Curriculums" },
                        ...curriculums.map((c) => ({
                            value: c._id,
                            label: c.curriculumName,
                        })),
                    ]}
                />
            </div>

            <PrerequisiteToolbar
                search={search}
                setSearch={onSearchChange}
                onAdd={onAdd}
            />
        </div>
    );
};

export default PrerequisiteFilterBar;
