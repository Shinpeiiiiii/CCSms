import { useState } from "react";

const TextAreaField = ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
}) => {
    const [focused, setFocused] = useState(false);

    const inputStyle = {
        width: "100%",
        background: "#FFFFFF",
        border: focused ? "1px solid #111827" : "1px solid #E5E7EB",
        padding: "10px 14px",
        color: "#111827",
        fontSize: "0.8125rem",
        fontFamily: "inherit",
        minHeight: 120,
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 6,
        color: "#6B7280",
        fontWeight: 500,
        fontSize: ".8125rem",
    };

    return (
        <div>
            {label && (
                <label style={labelStyle}>
                    {label}
                </label>
            )}

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={inputStyle}
            />
        </div>
    );
};

export default TextAreaField;
