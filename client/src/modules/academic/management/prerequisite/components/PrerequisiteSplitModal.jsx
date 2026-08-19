import { useMemo } from "react";
import Modal from "../../../../../components/modal/Modal";
import PrerequisiteForm from "./PrerequisiteForm";
import ActionButtons from "../../../../../components/actions/ActionButton";
import { cn } from "@/lib/utils";

const PrerequisiteSplitModal = ({
    isOpen,
    onClose,
    onSubmit,
    prerequisite = null,
    subjects = [],
    curriculums = [],
    curriculumSubjectMap = {},
    loading = false,
    defaultCurriculumId = "",
    curriculumPrerequisites = [],
    onEditFromList,
    onDeleteFromList,
    refreshAfterAction,
}) => {
    const isEdit = Boolean(prerequisite);

    const curriculumName = useMemo(() => {
        if (!defaultCurriculumId) return "";
        const curriculum = curriculums.find(
            (c) => String(c._id) === String(defaultCurriculumId)
        );
        return curriculum?.curriculumName || "";
    }, [curriculums, defaultCurriculumId]);

    const grouped = useMemo(() => {
        const groups = {};
        curriculumPrerequisites.forEach((item) => {
            const subjectCode = item.subject?.subjectCode || "—";
            const subjectName = item.subject?.subjectName || "Unknown Subject";
            const requiredCode = item.requiredSubject?.subjectCode || "—";
            const requiredName = item.requiredSubject?.subjectName || "Unknown Subject";
            const key = item._id;
            groups[key] = {
                ...item,
                subjectCode,
                subjectName,
                requiredCode,
                requiredName,
            };
        });
        return Object.values(groups);
    }, [curriculumPrerequisites]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEdit
                    ? "Edit Subject Prerequisite"
                    : curriculumName
                        ? `Add Prerequisite - ${curriculumName}`
                        : "Add Subject Prerequisite"
            }
            size="xl"
        >
            <div className="flex gap-6 min-h-[420px]">
                {/* Left: Existing prerequisites list */}
                <div className="w-[45%] border-r border-zinc-200 pr-5 flex flex-col gap-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Existing Prerequisites
                        {curriculumName && (
                            <span className="font-medium text-zinc-400 text-xs normal-case tracking-normal ml-2">
                                in {curriculumName}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
                        {grouped.length === 0 ? (
                            <div className="p-6 text-center text-zinc-500 text-sm border border-dashed border-zinc-200 rounded-[10px]">
                                No prerequisites yet for this curriculum.
                            </div>
                        ) : (
                            grouped.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between gap-3 p-3.5 border border-zinc-200 rounded-[10px] bg-white"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-xs text-zinc-900 truncate">
                                            {item.subjectCode} - {item.subjectName}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-0.5 truncate">
                                            Requires: {item.requiredCode} - {item.requiredName}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className={cn(
                                                "text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                                                item.type === "Corequisite"
                                                    ? "bg-zinc-900 text-white border border-zinc-900"
                                                    : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                                            )}
                                        >
                                            {item.type || "Prerequisite"}
                                        </span>
                                        <ActionButtons
                                            onEdit={() => onEditFromList?.(item)}
                                            onDelete={() => onDeleteFromList?.(item)}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Add form */}
                <div className="flex-1 pl-1 flex flex-col">
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                        {isEdit ? "Edit Prerequisite" : "New Prerequisite"}
                    </div>

                    <PrerequisiteForm
                        kee={prerequisite?.id || "new"}
                        initialValues={prerequisite}
                        subjects={subjects}
                        curriculums={curriculums}
                        curriculumSubjectMap={curriculumSubjectMap}
                        onSubmit={onSubmit}
                        loading={loading}
                        defaultCurriculumId={defaultCurriculumId}
                        hideCurriculum={!!defaultCurriculumId}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default PrerequisiteSplitModal;
