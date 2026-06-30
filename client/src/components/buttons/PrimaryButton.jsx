import { useState } from "react";

const PrimaryButton = ({
    children,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    className = "",
    style = {},
}) => {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    const isButtonDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isButtonDisabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setActive(false);
            }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            style={{
                background: isButtonDisabled 
                    ? '#334155' 
                    : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: isButtonDisabled ? '#64748B' : 'white',
                padding: '10px 24px',
                borderRadius: 100,
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: hovered && !isButtonDisabled 
                    ? '0 0 24px rgba(99, 102, 241, 0.45)' 
                    : 'none',
                transform: active && !isButtonDisabled 
                    ? 'scale(0.96)' 
                    : hovered && !isButtonDisabled 
                        ? 'translateY(-1px)' 
                        : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                outline: 'none',
                ...style,
            }}
            className={className}
        >
            {loading ? (
                <>
                    <svg
                        style={{
                            animation: 'spin 1s linear infinite',
                            marginRight: 4,
                            width: 16,
                            height: 16,
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            style={{ opacity: 0.25 }}
                        />
                        <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </button>
    );
};

export default PrimaryButton;