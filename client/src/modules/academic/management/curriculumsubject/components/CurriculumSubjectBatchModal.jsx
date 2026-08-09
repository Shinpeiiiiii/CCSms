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
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{
                        padding: "12px 16px",
                        background: "#EFF6FF",
                        borderRadius: 10,
                        border: "1px solid #BFDBFE",
                        color: "#1E40AF",
                        fontSize: 13,
                        fontWeight: 500,
                    }}>
                        Select multiple subjects to add to this curriculum in one batch.
                        Year level, semester, and type will apply to all selected subjects.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
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
                        <div style={{
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Selected Subjects ({selectedCount})
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {selectedSubjects.map(item => (
                                    <span
                                        key={item._id}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 20,
                                            background: "rgba(99,102,241,0.1)",
                                            color: "#818CF8",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            border: "1px solid rgba(99,102,241,0.2)",
                                        }}
                                    >
                                        {item.subjectCode} - {item.subjectName}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSelected(item._id)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                color: "#818CF8",
                                                fontSize: 14,
                                                lineHeight: 1,
                                            }}
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
                </div>
            </form>
        </Modal>
    );
};

export default CurriculumSubjectBatchModal;
