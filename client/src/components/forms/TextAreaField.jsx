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
        border: focused ? "1px solid #1A73E8" : "1px solid #DADCE0",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#202124",
        minHeight: 120,
        resize: "vertical",
        outline: "none",
        transition: "all 0.2s",
        boxSizing: "border-box",
        boxShadow: focused ? "0 0 0 3px rgba(26, 115, 232, 0.12)" : "none",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 8,
        color: "#5F6368",
        fontWeight: 600,
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