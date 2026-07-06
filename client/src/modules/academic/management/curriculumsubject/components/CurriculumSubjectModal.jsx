import Modal from "../../../../../components/modal/Modal";
import CurriculumSubjectForm from "./CurriculumSubjectForm";

const CurriculumSubjectModal = ({
    isOpen,
    onClose,
    onSubmit,
    curriculumSubject = null,
    subjects = [],
    loading = false,
}) => {
    const isEdit = Boolean(curriculumSubject);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Curriculum Subject" : "Add Subject"}
        >
            <CurriculumSubjectForm
                key={`${isOpen ? "open" : "closed"}-${curriculumSubject?._id || "new"}`}
                initialValues={curriculumSubject}
                subjects={subjects}
                onSubmit={onSubmit}
                loading={loading}
                isEdit={isEdit}
            />
        </Modal>
    );
};

export default CurriculumSubjectModal;
