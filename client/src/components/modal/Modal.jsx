import { useEffect } from "react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}) => {
    
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

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
                backgroundColor: 'rgba(5, 8, 16, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: 16,
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: sizes[size] || sizes.md,
                    background: '#0D1225',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.25s ease-out',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        padding: '18px 24px',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'Sora, sans-serif',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#F1F5F9',
                        }}
                    >
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: '#94A3B8',
                            fontSize: '1.25rem',
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
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            borderTop: '1px solid rgba(255,255,255,0.06)',
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