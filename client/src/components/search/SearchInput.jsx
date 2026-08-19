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
            {/* Search Icon */}
            <Search
                size={18}
                style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#5F6368",
                    pointerEvents: "none",
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
                    padding: "12px 16px 12px 42px",
                    borderRadius: 100, // pill style for search is extremely google-like
                    border: focused
                        ? "1px solid #1A73E8"
                        : "1px solid #DADCE0",
                    background: "#FFFFFF",
                    color: "#202124",
                    fontSize: ".875rem",
                    outline: "none",
                    transition: "all .2s",
                    boxSizing: "border-box",
                    boxShadow: focused
                        ? "0 0 0 3px rgba(26,115,232,.12)"
                        : "none",
                    ...style,
                }}
            />
        </div>
    );
};

export default SearchInput;