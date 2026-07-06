import Modal from "../../../../../components/modal/Modal";

import CurriculumForm from "./CurriculumForm";

const CurriculumModal = ({
    isOpen,
    onClose,
    onSubmit,
    curriculum = null,
    loading = false,
}) => {

    if (!isOpen) return null;

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                curriculum
                    ? "Edit Curriculum"
                    : "Add Curriculum"
            }
        >

            <CurriculumForm
                initialValues={curriculum}
                onSubmit={onSubmit}
                loading={loading}
            />

        </Modal>

    );

};

export default CurriculumModal;