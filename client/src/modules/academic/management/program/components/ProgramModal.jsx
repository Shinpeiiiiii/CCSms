import Modal from "../../../../../components/modal/Modal";
import ProgramForm from "./ProgramForm";

const ProgramModal = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    program,
    departments = [],
}) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                program
                    ? "Edit Program"
                    : "Add Program"
            }
        >

            <ProgramForm
                initialValues={program}
                department={departments}
                onSubmit={onSubmit}
                loading={loading}
            />

        </Modal>
    );

};

export default ProgramModal;

