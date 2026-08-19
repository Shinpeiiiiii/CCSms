import { useState } from "react";

const DangerButton = ({
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
                border: 'none',
                background: hovered ? '#C5221F' : '#D93025',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: hovered ? '0 2px 6px rgba(217, 48, 37, 0.24)' : 'none',
                opacity: disabled ? 0.5 : 1,
                outline: 'none',
            }}
            className={className}
        >
            {children}
        </button>
    );
};

export default DangerButton;