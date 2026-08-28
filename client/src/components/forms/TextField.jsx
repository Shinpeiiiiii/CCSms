import { forwardRef, useState } from "react";

const TextField = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      disabled = false,
      error,
      helperText,
      placeholder = "",
      required = false,
      type = "text",
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const floated = focused || hasValue;

    const borderColor = error ? "#DC2626" : focused ? "#111827" : "#E5E7EB";
    const labelColor = error ? "#DC2626" : focused ? "#111827" : "#6B7280";
    const fieldBg = disabled ? "#F9FAFB" : "#FFFFFF";

    const inputStyle = {
      width: "100%",
      background: fieldBg,
      border: `1px solid ${borderColor}`,
      padding: "12px 14px",
      color: disabled ? "#9CA3AF" : "#111827",
      fontSize: "0.8125rem",
      fontFamily: "inherit",
      outline: "none",
      transition: "border-color 0.15s ease",
      boxSizing: "border-box",
      cursor: disabled ? "not-allowed" : "text",
    };

    const labelStyle = {
      position: "absolute",
      left: 14,
      top: floated ? 0 : "50%",
      transform: floated ? "translateY(-50%) scale(0.8)" : "translateY(-50%) scale(1)",
      transformOrigin: "left center",
      background: floated ? fieldBg : "transparent",
      padding: floated ? "0 4px" : 0,
      color: labelColor,
      fontSize: "0.8125rem",
      fontWeight: 500,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      transition: "all 0.15s ease",
    };

    const helperStyle = {
      margin: "6px 2px 0",
      fontSize: "0.75rem",
      color: error ? "#DC2626" : "#6B7280",
    };

    return (
      <div>
        <div style={{ position: "relative" }}>
          <input
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={floated ? placeholder : ""}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-required={required}
            style={inputStyle}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {label && (
            <label style={labelStyle}>
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && <p style={helperStyle}>{error || helperText}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
