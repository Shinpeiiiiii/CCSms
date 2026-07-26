import Modal from "@/components/modal/Modal";
import AccountForm from "./AccountForm";

const AccountModal = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    account,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={account ? "Edit Account" : "Create Account"}
        >
            <AccountForm
                initialValues={account}
                onSubmit={onSubmit}
                loading={loading}
            />
        </Modal>
    );
};

export default AccountModal
