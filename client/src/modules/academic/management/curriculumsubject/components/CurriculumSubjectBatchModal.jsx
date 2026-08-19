import { useState, useMemo } from "react";

import Modal from "../../../../../components/modal/Modal";
import MultiSelectCheckbox from "../../../../../components/forms/MultiSelectCheckbox";
import SelectField from "../../../../../components/forms/SelectField";
import FormActions from "../../../../../components/forms/FormActions";

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
        return subjects.filter(s => selected.has(s._id));
    }, [subjects, selectedSubjectIds]);

    const availableOptions = useMemo(() => {
        const existingIds = new Set(selectedSubjectIds);
        return subjects.filter(s => !existingIds.has(s._id));
    }, [subjects, selectedSubjectIds]);

    const handleRemoveSelected = (subjectId) => {
        setSelectedSubjectIds(prev => prev.filter(id => id !== subjectId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSubjectIds.length === 0) return;

        const payload = selectedSubjectIds.map(subjectId => ({
            subject: subjectId,
            yearLevel: Number(yearLevel),
            semester: Number(semester),
            isRequired,
        }));
        try{
            await onSubmit(payload);
            setSelectedSubjectIds([]);
        }catch(error){
            console.log("Submissino failed:",error);
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-[10px] text-sm font-medium">
                    Select multiple subjects to add to this curriculum in one batch.
                    Year level, semester, and type will apply to all selected subjects.
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-[10px] flex flex-col gap-2.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Selected Subjects ({selectedCount})
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedSubjects.map(item => (
                                <span
                                    key={item._id}
                                    className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20 flex items-center gap-2"
                                >
                                    {item.subjectCode} - {item.subjectName}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSelected(item._id)}
                                        className="border-none bg-transparent cursor-pointer font-bold text-indigo-400 text-base leading-none"
                                    >
                                        ✕
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

                <FormActions
                    loading={loading}
                    submitLabel={`Add ${selectedCount} Subject${selectedCount !== 1 ? 's' : ''}`}
                    cancelLabel="Cancel"
                    onCancel={handleClose}
                />
            </form>
        </Modal>
    );
};

export default CurriculumSubjectBatchModal;
