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

    const inputStyle = {

        width: "100%",

        background: "rgba(255,255,255,.03)",

        border: "1px solid rgba(255,255,255,.08)",

        borderRadius: 12,

        padding: "12px 16px",

        color: "#F1F5F9",

    };

    return (

        <div>

            <label>

                {label}

            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                style={inputStyle}
            >

                <option value="">
                    {placeholder || `Select ${label}`}
                </option>

                {options.map(item => (

                    <option
                        key={item[valueField]}
                        value={item[valueField]}
                    >
                        {item[labelField]}
                    </option>

                ))}

            </select>

        </div>

    );

};

export default SelectField;