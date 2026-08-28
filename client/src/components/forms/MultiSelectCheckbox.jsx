import { useState, useMemo } from "react";

const MultiSelectCheckbox = ({
    label,
    options = [],
    value = [],
    onChange,
    valueField = "_id",
    labelField = "name",
    placeholder = "Search...",
}) => {
    const [search, setSearch] = useState("");

    const handleToggle = (optionValue) => {
        const exists = value.includes(optionValue);
        if (exists) {
            onChange(value.filter((id) => id !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const selectedItems = useMemo(() => {
        return options.filter((option) => value.includes(option[valueField]));
    }, [options, value, valueField]);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const keyword = search.toLowerCase();
        return options.filter((option) => {
            const labelText = option[labelField]?.toLowerCase() || "";
            const codeText = option.subjectCode?.toLowerCase() || "";
            return labelText.includes(keyword) || codeText.includes(keyword);
        });
    }, [options, search, labelField]);

    return (
        <div className="flex flex-col gap-2.5">
            {label && (
                <label className="text-[13px] font-medium text-gray-600">
                    {label}
                </label>
            )}

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="px-3 py-2 border border-gray-200 text-[13px] text-gray-700 outline-none transition-colors focus:border-gray-900 placeholder:text-gray-400"
            />

            <div className="border border-gray-200 p-2 max-h-[220px] overflow-y-auto">
                {filteredOptions.length === 0 && (
                    <div className="py-3 text-center text-[12px] text-gray-400">
                        No subjects found.
                    </div>
                )}

                {filteredOptions.map((option) => {
                    const optionValue = option[valueField];
                    const checked = value.includes(optionValue);

                    return (
                        <label
                            key={optionValue}
                            className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggle(optionValue)}
                                className="accent-gray-900"
                            />
                            <span className="text-[13px] text-gray-700">
                                {option.subjectCode
                                    ? `${option.subjectCode} — ${option[labelField]}`
                                    : option[labelField]}
                            </span>
                        </label>
                    );
                })}
            </div>

            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedItems.map((item) => (
                        <span
                            key={item[valueField]}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-[12px] font-medium text-gray-600 border border-gray-200"
                        >
                            {item.subjectCode || item[labelField]}
                            <button
                                type="button"
                                onClick={() => handleToggle(item[valueField])}
                                className="text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectCheckbox;
