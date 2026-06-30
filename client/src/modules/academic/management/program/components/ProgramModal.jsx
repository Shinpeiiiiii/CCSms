import Modal from "../../../../../components/modal/Modal";
import ProgramForm from "./ProgramForm";

const ProgramModal = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    program,
    department = [],
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
                department={department}
                onSubmit={onSubmit}
                loading={loading}
            />

        </Modal>
    );

};

export default ProgramModal;

