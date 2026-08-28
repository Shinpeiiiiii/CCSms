import { useState, useMemo } from "react";

import Modal from "../../../../../components/modal/Modal";
import MultiSelectCheckbox from "../../../../../components/forms/MultiSelectCheckbox";
import SelectField from "../../../../../components/forms/SelectField";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const CurriculumSubjectBatchModal = ({
    isOpen,
    onClose,
    onSubmit,
    subjects = [],
    loading = false,
}) => {
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [yearLevel, setYearLevel] = useState(1);
    const [semester, setSemester] = useState(1);
    const [isRequired, setIsRequired] = useState(true);

    const selectedCount = selectedSubjectIds.length;

    const selectedSubjects = useMemo(() => {
        const selected = new Set(selectedSubjectIds);
        return subjects.filter((s) => selected.has(s._id));
    }, [subjects, selectedSubjectIds]);

    const availableOptions = useMemo(() => {
        const existingIds = new Set(selectedSubjectIds);
        return subjects.filter((s) => !existingIds.has(s._id));
    }, [subjects, selectedSubjectIds]);

    const handleRemoveSelected = (subjectId) => {
        setSelectedSubjectIds((prev) => prev.filter((id) => id !== subjectId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSubjectIds.length === 0) return;

        const payload = selectedSubjectIds.map((subjectId) => ({
            subject: subjectId,
            yearLevel: Number(yearLevel),
            semester: Number(semester),
            isRequired,
        }));

        try {
            await onSubmit(payload);
            setSelectedSubjectIds([]);
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const handleClose = () => {
        setSelectedSubjectIds([]);
        setYearLevel(1);
        setSemester(1);
        setIsRequired(true);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Batch Add Subjects"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="px-3 py-2 border border-gray-200 bg-gray-50 text-xs text-gray-500 leading-relaxed">
                    Add multiple subjects at once. Year level, semester, and type apply to all selected.
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <SelectField
                        label="Year Level"
                        name="yearLevel"
                        value={yearLevel}
                        onChange={(e) => setYearLevel(Number(e.target.value))}
                        options={[
                            { value: 1, label: "1st Year" },
                            { value: 2, label: "2nd Year" },
                            { value: 3, label: "3rd Year" },
                            { value: 4, label: "4th Year" },
                        ]}
                        valueField="value"
                        labelField="label"
                        required
                    />

                    <SelectField
                        label="Semester"
                        name="semester"
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        options={[
                            { value: 1, label: "1st Semester" },
                            { value: 2, label: "2nd Semester" },
                            { value: 3, label: "Summer" },
                        ]}
                        valueField="value"
                        labelField="label"
                        required
                    />

                    <SelectField
                        label="Type"
                        name="isRequired"
                        value={String(isRequired)}
                        onChange={(e) => setIsRequired(e.target.value === "true")}
                        options={[
                            { value: "true", label: "Required" },
                            { value: "false", label: "Elective" },
                        ]}
                        valueField="value"
                        labelField="label"
                        required
                    />
                </div>

                {selectedSubjects.length > 0 && (
                    <div className="border border-gray-200 bg-gray-50 p-3">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Selected ({selectedCount})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedSubjects.map((item) => (
                                <span
                                    key={item._id}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 text-[12px] font-medium text-gray-700"
                                >
                                    {item.subjectCode}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSelected(item._id)}
                                        className="text-gray-300 hover:text-gray-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <MultiSelectCheckbox
                    label="Available Subjects"
                    options={availableOptions}
                    value={selectedSubjectIds}
                    onChange={setSelectedSubjectIds}
                    valueField="_id"
                    labelField="subjectName"
                    placeholder="Search subjects..."
                />

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-[12px] font-medium border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <PrimaryButton type="submit" loading={loading} size="sm">
                        {selectedCount > 0
                            ? `Add ${selectedCount} Subject${selectedCount !== 1 ? "s" : ""}`
                            : "Add Subjects"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default CurriculumSubjectBatchModal;
