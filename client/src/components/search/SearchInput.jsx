import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    style = {},
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                width: 320,
                maxWidth: "100%",
            }}
        >
            <Search
                size={16}
                style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focused ? "#111827" : "#9CA3AF",
                    pointerEvents: "none",
                    transition: "color 0.2s",
                }}
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    border: focused
                        ? "1px solid #111827"
                        : "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    color: "#111827",
                    fontSize: "0.8125rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    ...style,
                }}
            />
        </div>
    );
};

export default SearchInput;
