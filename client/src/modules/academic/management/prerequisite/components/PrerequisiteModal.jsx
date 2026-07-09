import Modal from "../../../../../components/modal/Modal";
import PrerequisiteForm from "./PrerequisiteForm";

const PrerequisiteModal = ({
    isOpen,
    onClose,
    onSubmit,
    prerequisite = null,
    subjects = [],
    loading = false,
}) => {

    const isEdit = Boolean(prerequisite);

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEdit
                    ? "Edit Subject Prerequisite"
                    : "Add Subject Prerequisite"
            }
            size="md"
        >
            <PrerequisiteForm
                kee={prerequisite?.id || "new"}
                initialValues={prerequisite}
                subjects={subjects}
                onSubmit={onSubmit}
                loading={loading}
            />
        </Modal>
    );

};

export default PrerequisiteModal;