import { useState } from "react";

const SecondaryButton = ({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 20px',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)',
                background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                color: '#94A3B8',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: disabled ? 0.5 : 1,
                outline: 'none',
            }}
            className={className}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;