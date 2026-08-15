import Modal from "./Modal";

const ConfirmModal = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = "Confirmation",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
}) => {
    const handleDismiss = () => {
        if (typeof onClose === "function") {
            onClose();
            return;
        }

        if (typeof onCancel === "function") {
            onCancel();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleDismiss}
            title={title}
            size="sm"
        >
            <p className="text-zinc-600 text-base leading-relaxed m-0">
                {message}
            </p>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={handleDismiss}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 text-sm font-medium cursor-pointer transition-all hover:bg-zinc-100 disabled:opacity-50"
                >
                    {cancelText}
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full border-none bg-red-600 text-white text-sm font-semibold cursor-pointer transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 disabled:opacity-50"
                >
                    {loading ? "Please wait..." : confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
