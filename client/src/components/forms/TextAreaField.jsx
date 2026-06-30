const TextAreaField = ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
}) => {

    const inputStyle = {
        width: "100%",
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#F1F5F9",
        minHeight: 120,
        resize: "vertical",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 8,
        color: "#94A3B8",
        fontWeight: 600,
    };

    return (

        <div>

            <label style={labelStyle}>

                {label}

            </label>

            <textarea

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                style={inputStyle}

            />

        </div>

    );

};

export default TextAreaField;