import Modal from "../../../../../components/modal/Modal";
import SubjectForm from "./SubjectForm";

const SubjectModal = ({
    isOpen,
    onClose,
    onSubmit,
    subject = null,
    loading = false,
}) => {

    const isEdit = Boolean(subject);

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEdit
                    ? "Edit Subject"
                    : "Add Subject"
            }
            size="md"
        >

            <SubjectForm
                key={subject?._id || "new"}
                initialValues={subject}
                loading={loading}
                onSubmit={onSubmit}
            />

        </Modal>

    );

};

export default SubjectModal;