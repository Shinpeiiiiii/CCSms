import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * SelectField — Google Material-style select.
 *
 * Drop-in compatible with the native <select> version:
 * onChange still receives an event-shaped object: { target: { name, value } }
 *
 * New optional prop (safe to ignore if you don't need it):
 *   - disabled
 */
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
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuVisible, setMenuVisible] = useState(false); // controls enter animation

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedIndex = options.findIndex((item) => String(item[valueField]) === String(value));
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mount animation — flip visibility a tick after `open` so the transition runs
  useEffect(() => {
    if (open) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      const raf = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setMenuVisible(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep highlighted option scrolled into view
  useEffect(() => {
    if (!open || !menuRef.current) return;
    const el = menuRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  const commitValue = useCallback(
    (item) => {
      onChange?.({ target: { name, value: item[valueField] } });
      setOpen(false);
      buttonRef.current?.focus();
    },
    [onChange, name, valueField]
  );

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[highlightedIndex]) commitValue(options[highlightedIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const borderColor = focused || open ? "#1A73E8" : "#DADCE0";
  const ringColor = "rgba(26,115,232,0.12)";

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    color: "#5F6368",
    fontWeight: 600,
    fontSize: ".8125rem",
    letterSpacing: ".01em",
  };

  const buttonStyle = {
    width: "100%",
    background: disabled ? "#F1F3F4" : "#FFFFFF",
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    padding: "12px 16px",
    color: disabled ? "#9AA0A6" : selectedOption ? "#202124" : "#5F6368",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxSizing: "border-box",
    boxShadow: focused || open ? `0 0 0 3px ${ringColor}` : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    textAlign: "left",
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: "#D93025" }}> *</span>}
        </label>
      )}

      <button
        type="button"
        ref={buttonRef}
        name={name}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required}
        onClick={() => !disabled && setOpen((o) => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        style={buttonStyle}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedOption ? selectedOption[labelField] : placeholder || `Select ${label || "an option"}`}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2.25}
          color={disabled ? "#9AA0A6" : "#5F6368"}
          style={{
            flexShrink: 0,
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <ul
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            margin: 0,
            padding: "6px",
            listStyle: "none",
            background: "#FFFFFF",
            borderRadius: 12,
            maxHeight: 280,
            overflowY: "auto",
            zIndex: 50,
            boxShadow:
              "0 1px 3px rgba(60,64,67,0.30), 0 4px 12px 2px rgba(60,64,67,0.15)",
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.98)",
            transformOrigin: "top center",
            transition: "opacity 0.14s ease, transform 0.14s ease",
          }}
        >
          {options.length === 0 && (
            <li style={{ padding: "10px 12px", color: "#9AA0A6", fontSize: "0.875rem" }}>
              No options available
            </li>
          )}

          {options.map((item, index) => {
            const isSelected = String(item[valueField]) === String(value);
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={item[valueField]}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitValue(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: "0.9375rem",
                  color: isSelected ? "#1A73E8" : "#202124",
                  background: isSelected
                    ? "#E8F0FE"
                    : isHighlighted
                    ? "#F1F3F4"
                    : "transparent",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  {item[labelField]}
                </span>
                {isSelected && <Check size={16} strokeWidth={2.5} color="#1A73E8" style={{ flexShrink: 0 }} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectField;