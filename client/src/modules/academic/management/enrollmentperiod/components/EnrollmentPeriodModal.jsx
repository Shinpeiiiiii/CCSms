import Modal from "../../../../../components/modal/Modal";

import EnrollmentPeriodForm from "./EnrollmentPeriodForm";

const EnrollmentPeriodModal = ({
    isOpen,
    onClose,
    onSubmit,
    enrollmentPeriod = null,
    loading = false,
}) => {

    if (!isOpen) return null;

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                enrollmentPeriod
                    ? "Edit Enrollment Period"
                    : "Add Enrollment Period"
            }
        >

            <EnrollmentPeriodForm
                initialValues={enrollmentPeriod}
                onSubmit={onSubmit}
                loading={loading}
            />

        </Modal>

    );

};

export default EnrollmentPeriodModal;