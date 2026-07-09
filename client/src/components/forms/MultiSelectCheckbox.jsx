import { useMemo } from "react";

const MultiSelectCheckbox = ({
    label,
    options = [],
    value = [],
    onChange,
    valueField = "_id",
    labelField = "name",
    placeholder = "Search...",
}) => {

    const handleToggle = (optionValue) => {

        const exists = value.includes(optionValue);

        if (exists) {

            onChange(
                value.filter(id => id !== optionValue)
            );

        } else {

            onChange([
                ...value,
                optionValue,
            ]);

        }

    };

    const selectedItems = useMemo(() => {

        return options.filter(option =>
            value.includes(option[valueField])
        );

    }, [options, value, valueField]);

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >

            {label && (

                <label
                    style={{
                        fontWeight: 600,
                    }}
                >
                    {label}
                </label>

            )}

            <div

                style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    maxHeight: 220,
                    overflowY: "auto",
                }}

            >

                {options.map(option => {

                    const optionValue =
                        option[valueField];

                    const checked =
                        value.includes(optionValue);

                    return (

                        <label

                            key={optionValue}

                            style={{

                                display: "flex",

                                alignItems: "center",

                                gap: 10,

                                padding: "6px 0",

                                cursor: "pointer",

                            }}

                        >

                            <input

                                type="checkbox"

                                checked={checked}

                                onChange={() =>
                                    handleToggle(optionValue)
                                }

                            />

                            {option.subjectCode
                                ? `${option.subjectCode} - ${option[labelField]}`
                                : option[labelField]
                            }

                        </label>

                    );

                })}

            </div>

            {

                selectedItems.length > 0 && (

                    <div

                        style={{

                            display: "flex",

                            flexWrap: "wrap",

                            gap: 8,

                        }}

                    >

                        {

                            selectedItems.map(item => (

                                <span

                                    key={item[valueField]}

                                    style={{

                                        padding: "5px 10px",

                                        borderRadius: 20,

                                        background: "#f1f5f9",

                                        fontSize: 13,

                                        display: "flex",

                                        alignItems: "center",

                                        gap: 6,

                                    }}

                                >

                                    {

                                        item.subjectCode

                                            ? `${item.subjectCode}`

                                            : item[labelField]

                                    }

                                    <button

                                        type="button"

                                        onClick={() =>
                                            handleToggle(
                                                item[valueField]
                                            )
                                        }

                                        style={{

                                            border: "none",

                                            background: "transparent",

                                            cursor: "pointer",

                                            fontWeight: "bold",

                                        }}

                                    >

                                        ✕

                                    </button>

                                </span>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default MultiSelectCheckbox;