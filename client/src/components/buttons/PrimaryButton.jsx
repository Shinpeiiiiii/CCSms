import { useState } from "react";
import { Loader2 } from "lucide-react";

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
                    ? '#F1F3F4' 
                    : active 
                        ? '#155CB3'
                        : hovered
                            ? '#1765CC'
                            : '#1A73E8',
                color: isButtonDisabled ? '#9AA0A6' : 'white',
                padding: '10px 24px',
                borderRadius: 100,
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hovered && !isButtonDisabled 
                    ? '0 2px 6px rgba(26, 115, 232, 0.24)' 
                    : 'none',
                transform: active && !isButtonDisabled 
                    ? 'scale(0.98)' 
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
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
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