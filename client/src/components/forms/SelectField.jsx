import { useState } from "react";

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options = [],
    valueField = "value",
    labelField = "label",
    placeholder,
    required = false,
}) => {
    const [focused, setFocused] = useState(false);

    const inputStyle = {
        width: "100%",
        background: "#FFFFFF",
        border: focused ? "1px solid #1A73E8" : "1px solid #DADCE0",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#202124",
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

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={inputStyle}
            >
                <option value="" style={{ color: '#5F6368', background: '#FFFFFF' }}>
                    {placeholder || `Select ${label}`}
                </option>
                {options.map((item) => (
                    <option
                        key={item[valueField]}
                        value={item[valueField]}
                        style={{ color: '#202124', background: '#FFFFFF' }}
                    >
                        {item[labelField]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;