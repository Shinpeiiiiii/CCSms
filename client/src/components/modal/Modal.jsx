import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose = () => {},
    title,
    children,
    footer,
    size = "md",
}) => {
    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "440px",
        md: "680px",
        lg: "900px",
        xl: "1140px",
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.32)',
                backdropFilter: 'blur(4px)',
                padding: 16,
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: sizes[size] || sizes.md,
                    background: '#FFFFFF',
                    border: '1px solid #DADCE0',
                    borderRadius: 16,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #E8EAED',
                        padding: '18px 24px',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'Sora, sans-serif',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: '#202124',
                            margin: 0,
                        }}
                    >
                        {title}
                    </h2>

                    <button
                        onClick={handleClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#5F6368',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F1F3F4';
                            e.currentTarget.style.color = '#202124';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#5F6368';
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', color: '#3C4043' }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            borderTop: '1px solid #E8EAED',
                            padding: '16px 24px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: 12,
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Modal;