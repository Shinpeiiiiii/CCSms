import Modal from "../../../../../components/modal/Modal";
import DepartmentForm from "./DepartmentForm";

const DepartmentModal = ({
    isOpen,
    onClose,
    onSubmit,
    department = null,
    loading = false,
}) => {

    const isEdit = Boolean(department);

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                isEdit
                    ? "Edit Department"
                    : "Add Department"
            }
            size="md"
        >

            <DepartmentForm
                key={department?._id || "new"}
                initialValues={department}
                loading={loading}
                onSubmit={onSubmit}
            />

        </Modal>

    );

};

export default DepartmentModal;