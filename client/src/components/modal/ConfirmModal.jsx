import { useState } from "react";
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
    const [cancelHovered, setCancelHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

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
            footer={
                <>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 100,
                            border: '1px solid #DADCE0',
                            background: cancelHovered ? '#F1F3F4' : '#FFFFFF',
                            color: '#5F6368',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: loading ? 0.5 : 1,
                        }}
                        onMouseEnter={() => setCancelHovered(true)}
                        onMouseLeave={() => setCancelHovered(false)}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 100,
                            border: 'none',
                            background: confirmHovered ? '#C5221F' : '#D93025',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: confirmHovered ? '0 2px 6px rgba(217, 48, 37, 0.24)' : 'none',
                            opacity: loading ? 0.5 : 1,
                        }}
                        onMouseEnter={() => setConfirmHovered(true)}
                        onMouseLeave={() => setConfirmHovered(false)}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </>
            }
        >
            <p style={{ color: '#5F6368', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {message}
            </p>
        </Modal>
    );
};

export default ConfirmModal;