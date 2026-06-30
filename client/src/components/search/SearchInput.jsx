import { useState } from "react";

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
            <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="11" cy="11" r="7" />
                <line
                    x1="20"
                    y1="20"
                    x2="16.65"
                    y2="16.65"
                />
            </svg>

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
                    borderRadius: 12,
                    border: focused
                        ? "1px solid rgba(99,102,241,.6)"
                        : "1px solid rgba(255,255,255,.08)",
                    background: "rgba(255,255,255,.03)",
                    color: "#F1F5F9",
                    fontSize: ".875rem",
                    outline: "none",
                    transition: "all .2s",
                    boxSizing: "border-box",
                    boxShadow: focused
                        ? "0 0 0 3px rgba(99,102,241,.12)"
                        : "none",
                    ...style,
                }}
            />

        </div>

    );

};

export default SearchInput;