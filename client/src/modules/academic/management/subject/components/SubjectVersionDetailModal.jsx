import Modal from "../../../../../components/modal/Modal";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const SubjectVersionDetailsModal = ({
    isOpen,
    onClose,
    subject,
    onCreateVersion,
}) => {

    if (!subject) return null;

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Subject Version ${subject.version}`}
            size="md"
        >

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}
            >

                <p>
                    <strong>Subject Code:</strong> {subject.subjectCode}
                </p>

                <p>
                    <strong>Subject Name:</strong> {subject.subjectName}
                </p>

                <p>
                    <strong>Units:</strong> {subject.units}
                </p>

                <p>
                    <strong>Lecture Hours:</strong> {subject.lectureHours}
                </p>

                <p>
                    <strong>Laboratory Hours:</strong> {subject.laboratoryHours}
                </p>

                <p>
                    <strong>Category:</strong> {subject.subjectCategory}
                </p>

                <p>
                    <strong>Status:</strong> {subject.status}
                </p>

                <p>
                    <strong>Current Version:</strong>{" "}
                    {subject.isCurrentVersion ? "Yes" : "No"}
                </p>

                <p>
                    <strong>Created By:</strong>{" "}
                    {subject.createdBy
                        ? `${subject.createdBy.firstName} ${subject.createdBy.lastName}`
                        : "-"}
                </p>

                {
                    subject.isCurrentVersion && (

                        <PrimaryButton
                            onClick={() =>{
                                onClose();
                                onCreateVersion(subject)
                            }}
                        >
                            Create New Version
                        </PrimaryButton>

                    )
                }

            </div>

        </Modal>

    );

};

export default SubjectVersionDetailsModal;