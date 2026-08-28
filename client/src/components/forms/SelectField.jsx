import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

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
  const [menuVisible, setMenuVisible] = useState(false);

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedIndex = options.findIndex((item) => String(item[valueField]) === String(value));
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      const raf = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setMenuVisible(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const borderColor = focused || open ? "#111827" : "#E5E7EB";

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    color: "#6B7280",
    fontWeight: 500,
    fontSize: ".8125rem",
  };

  const buttonStyle = {
    width: "100%",
    background: disabled ? "#F9FAFB" : "#FFFFFF",
    border: `1px solid ${borderColor}`,
    padding: "10px 14px",
    color: disabled ? "#9CA3AF" : selectedOption ? "#111827" : "#6B7280",
    outline: "none",
    transition: "border-color 0.15s ease",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "0.8125rem",
    fontFamily: "inherit",
    textAlign: "left",
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: "#DC2626" }}> *</span>}
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
          size={16}
          strokeWidth={2}
          color={disabled ? "#9CA3AF" : "#6B7280"}
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
            top: "calc(100% + 2px)",
            left: 0,
            right: 0,
            margin: 0,
            padding: "4px",
            listStyle: "none",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            maxHeight: 240,
            overflowY: "auto",
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? "translateY(0)" : "translateY(-4px)",
            transformOrigin: "top center",
            transition: "opacity 0.12s ease, transform 0.12s ease",
          }}
        >
          {options.length === 0 && (
            <li style={{ padding: "8px 10px", color: "#9CA3AF", fontSize: "0.8125rem" }}>
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
                  padding: "8px 10px",
                  fontSize: "0.8125rem",
                  color: isSelected ? "#111827" : "#374151",
                  background: isHighlighted ? "#F3F4F6" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item[labelField]}
                </span>
                {isSelected && <Check size={14} strokeWidth={2.5} color="#111827" style={{ flexShrink: 0 }} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectField;
