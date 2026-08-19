import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import NavItem from './NavItem';

const NavGroup = ({ label, items, isFirst = false, isOpen = true, onToggle }) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(() => (isOpen ? 'auto' : '0px'));
  const previousOpenRef = useRef(isOpen);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!contentRef.current) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
      previousOpenRef.current = isOpen;
      return;
    }

    if (previousOpenRef.current !== isOpen) {
      previousOpenRef.current = isOpen;
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div role="group" aria-label={label}>
      {/* Divider above group (except first) */}
      {!isFirst && (
        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            marginTop: '24px',
            marginBottom: '16px',
          }}
        />
      )}

      {/* Group Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`nav-group-${label.replace(/\s+/g, '-')}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: '14px',
          paddingRight: '14px',
          paddingTop: '6px',
          paddingBottom: '6px',
          marginBottom: '10px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: '#374151',
          borderRadius: '8px',
          transition: 'color 200ms ease-in-out, background-color 200ms ease-in-out',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          userSelect: 'none',
          fontFamily: "'Inter', sans-serif",
        }}
        className="nav-group-header focus-visible:ring-2 focus-visible:ring-slate-900/20"
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingRight: '8px',
          }}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          style={{
            flexShrink: 0,
            color: '#94a3b8',
            transition: 'transform 200ms ease-in-out',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Collapsible Content */}
      <div
        id={`nav-group-${label.replace(/\s+/g, '-')}`}
        role="region"
        aria-labelledby={`nav-group-label-${label.replace(/\s+/g, '-')}`}
        ref={contentRef}
        style={{
          overflow: 'hidden',
          transition: 'max-height 200ms ease-in-out',
          maxHeight: contentHeight,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {items.map(({ label: itemLabel, to, icon, isActive, onClick }) => (
            <NavItem
              key={itemLabel}
              label={itemLabel}
              to={to}
              icon={icon}
              isActive={isActive}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavGroup;