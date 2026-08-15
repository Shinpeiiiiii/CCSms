import { Modal } from "@/components/modal"; 
import { PrimaryButton } from "@/components/buttons";

const CurriculumVersionDetailsModal = ({
    isOpen,
    onClose,
    curriculum,
    onCreateVersion,
}) => {
    if(!curriculum) return null

    return(
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Curriculum Version ${curriculum.version}`}
            size="md"
        >
             <div className="flex flex-col gap-3">
                <div>
                    <strong>Curriculum Code:</strong>{" "}
                    {curriculum.curriculumCode}
                </div>
                <div>
                    <strong>Curriculum Name:</strong>{" "}
                    {curriculum.curriculumName}
                </div>
                <div>
                    <strong>Program:</strong>{" "}
                    {curriculum.program?.programName}
                </div>
                <div>
                    <strong>Academic Year:</strong>{" "}
                    {curriculum.academicYear?.academicYearName}
                </div>
                <div>
                    <strong>Total Years:</strong>{" "}
                    {curriculum.totalYears}
                </div>
                <div>
                    <strong>Version:</strong>{" "}
                    {curriculum.version}
                </div>
                <div>
                    <strong>Status:</strong>{" "}
                    {curriculum.status}
                </div>
                <div>
                    <strong>Remarks:</strong>{" "}
                    {curriculum.remarks || "-"}
                </div>
                <div>
                    <strong>Created By:</strong>{" "}
                    {curriculum.createdBy
                        ? `${curriculum.createdBy.firstName} ${curriculum.createdBy.lastName}`
                        : "-"}
                </div>
                {curriculum.isCurrentVersion && (
                    <PrimaryButton
                        onClick={() => {
                            onClose();
                            onCreateVersion(curriculum);
                        }}
                    >
                        Create New Version
                    </PrimaryButton>
                )}
            </div>
        </Modal>
    )
}

export default CurriculumVersionDetailsModal;
