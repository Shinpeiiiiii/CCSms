import { forwardRef, useState } from "react";

/**
 * TextField — MUI "outlined" style: floating label that starts centered
 * inside the field and animates up onto the border line on focus or
 * once there's a value, with a background "notch" so the border doesn't
 * cut through the label text.
 *
 * Same API as before, plus:
 *   - helperText   (grey helper text shown under the field when there's no error)
 *
 * Fixes vs. the previous version:
 *   - Focus/error state is now driven by React state, not direct DOM
 *     mutation — so if `error` changes while the field is still focused,
 *     the border updates immediately instead of waiting for blur.
 *   - Focus ring now turns red (not blue) when there's an error, matching
 *     MUI's own outlined field behavior.
 *   - `onFocus` passed in via props is no longer silently dropped
 *     (previously only `onBlur` was forwarded).
 */
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

    const borderColor = error ? "#D93025" : focused ? "#1A73E8" : "#DADCE0";
    const ringColor = error ? "rgba(217,48,37,0.12)" : "rgba(26,115,232,0.12)";
    const labelColor = error ? "#D93025" : focused ? "#1A73E8" : "#5F6368";
    const fieldBg = disabled ? "#F1F3F4" : "#FFFFFF";

    const inputStyle = {
      width: "100%",
      background: fieldBg,
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      padding: "12px 16px",
      color: disabled ? "#9AA0A6" : "#202124",
      fontSize: "0.9375rem",
      fontFamily: "inherit",
      outline: "none",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      boxSizing: "border-box",
      boxShadow: focused ? `0 0 0 3px ${ringColor}` : "none",
      cursor: disabled ? "not-allowed" : "text",
    };

    const labelStyle = {
      position: "absolute",
      left: 16,
      top: floated ? 0 : "50%",
      transform: floated ? "translateY(-50%) scale(0.8)" : "translateY(-50%) scale(1)",
      transformOrigin: "left center",
      background: floated ? fieldBg : "transparent",
      padding: floated ? "0 6px" : 0,
      color: labelColor,
      fontSize: "0.9375rem",
      fontWeight: 500,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      transition: "all 0.15s ease",
    };

    const helperStyle = {
      margin: "6px 2px 0",
      fontSize: "0.75rem",
      color: error ? "#D93025" : "#5F6368",
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