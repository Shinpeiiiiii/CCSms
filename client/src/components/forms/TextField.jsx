import { forwardRef } from "react";

const TextField = forwardRef(({
    label,
    name,
    value,
    onChange,
    disabled = false,
    error,
    placeholder = "",
    required = false,
    type = "text",
    ...props
}, ref) => {

    const inputStyle = {
        width: "100%",
        background: "#FFFFFF",
        border: error
            ? "1px solid #D93025"
            : "1px solid #DADCE0",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#202124",
        fontSize: ".875rem",
        outline: "none",
        transition: ".2s",
        boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 8,
        color: "#5F6368",
        fontWeight: 600,
        fontSize: ".8125rem",
    };

    const errorStyle = {
        color: "#D93025",
        fontSize: ".75rem",
        marginTop: 6,
    };

    return (
        <div>
            {label && (
                <label style={labelStyle}>
                    {label}
                </label>
            )}

            <input
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
                type={type}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                style={inputStyle}
                {...props}
                onFocus={(e) => {
                    e.target.style.borderColor = "#1A73E8";
                    e.target.style.boxShadow =
                        "0 0 0 3px rgba(26, 115, 232, 0.12)";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error
                        ? "#D93025"
                        : "#DADCE0";
                    e.target.style.boxShadow = "none";
                    props.onBlur?.(e);
                }}
            />

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}
        </div>
    );
});

export default TextField;