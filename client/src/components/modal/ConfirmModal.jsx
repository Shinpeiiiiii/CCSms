import { useState } from "react";
import Modal from "./Modal";

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmation",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
}) => {
    const [cancelHovered, setCancelHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 100,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: cancelHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                            color: '#94A3B8',
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
                            background: confirmHovered ? '#DC2626' : '#EF4444',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: confirmHovered ? '0 0 16px rgba(239, 68, 68, 0.4)' : 'none',
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
            <p style={{ color: '#94A3B8', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {message}
            </p>
        </Modal>
    );
};

export default ConfirmModal;