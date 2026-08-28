import { useState, useEffect } from "react";
import Modal from "../../../../../components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const TemplateSelectModal = ({
    isOpen,
    onClose,
    templates,
    loading,
    onCreate,
}) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [curriculumCode, setCurriculumCode] = useState("");
    const [curriculumName, setCurriculumName] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [totalYears, setTotalYears] = useState(4);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setSelectedTemplateId("");
            setCurriculumCode("");
            setCurriculumName("");
            setAcademicYear("");
            setTotalYears(4);
            setRemarks("");
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTemplateId || !curriculumCode || !curriculumName || !academicYear) {
            return;
        }

        await onCreate(selectedTemplateId, {
            curriculumCode,
            curriculumName,
            academicYear,
            totalYears,
            remarks,
        });
    };

    const selectedTemplate = templates.find((t) => t._id === selectedTemplateId);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Curriculum from Template"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 text-sm font-medium cursor-pointer transition-all hover:bg-zinc-100"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        form="template-form"
                        disabled={!selectedTemplateId || !curriculumCode || !curriculumName || !academicYear}
                    >
                        Create Curriculum
                    </Button>
                </>
            }
        >
            <form id="template-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Template</label>
                    <Select
                        value={selectedTemplateId}
                        onValueChange={setSelectedTemplateId}
                        disabled={loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map((template) => (
                                <SelectItem key={template._id} value={template._id}>
                                    {template.name} ({template.program?.programCode || "—"})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedTemplate && (
                    <div className="p-3 rounded-lg bg-zinc-50 text-sm text-zinc-600">
                        <p><strong>Program:</strong> {selectedTemplate.program?.programName || "—"}</p>
                        <p><strong>Total Years:</strong> {selectedTemplate.totalYears}</p>
                        <p><strong>Subjects:</strong> {selectedTemplate.subjects?.length || 0}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Curriculum Code</label>
                    <Input
                        value={curriculumCode}
                        onChange={(e) => setCurriculumCode(e.target.value.toUpperCase())}
                        placeholder="e.g. BSIT-2024"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Curriculum Name</label>
                    <Input
                        value={curriculumName}
                        onChange={(e) => setCurriculumName(e.target.value)}
                        placeholder="e.g. BSIT Curriculum 2024"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Academic Year</label>
                    <Input
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="Academic Year ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Total Years</label>
                    <Input
                        type="number"
                        value={totalYears}
                        onChange={(e) => setTotalYears(Number(e.target.value))}
                        min={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Remarks</label>
                    <Input
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Optional remarks"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default TemplateSelectModal;
