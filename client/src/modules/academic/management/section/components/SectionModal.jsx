import Modal from "../../../../../components/modal/Modal";

import SectionForm from "./SectionForm";

const SectionModal = ({

    isOpen,

    onClose,

    onSubmit,

    section = null,

    loading = false,

}) => {

    if (!isOpen) return null;

    return (

        <Modal

            isOpen={isOpen}

            onClose={onClose}

            title={
                section
                    ? "Edit Section"
                    : "Add Section"
            }

        >

            <SectionForm

                initialValues={section}

                onSubmit={onSubmit}

                loading={loading}

            />

        </Modal>

    );

};

export default SectionModal;