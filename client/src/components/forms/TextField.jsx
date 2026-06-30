const TextField = ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    type = "text",
}) => {
    const inputStyle = {
        width: "100%",
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#F1F5F9",
        fontSize: ".875rem",
        outline: "none",
        transition: ".2s",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 8,
        color: "#94A3B8",
        fontWeight: 600,
        fontSize: ".8125rem",
    };

    return (

        <div>

            <label style={labelStyle}>

                {label}

            </label>

            <input

                type={type}

                name={name}

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                required={required}

                style={inputStyle}

                onFocus={(e) => {

                    e.target.style.borderColor = "rgba(99,102,241,.6)";

                    e.target.style.boxShadow =
                        "0 0 0 3px rgba(99,102,241,.12)";

                }}

                onBlur={(e) => {

                    e.target.style.borderColor =
                        "rgba(255,255,255,.08)";

                    e.target.style.boxShadow = "none";

                }}

            />

        </div>

    );

};

export default TextField;