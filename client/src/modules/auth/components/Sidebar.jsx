import React, { Suspense, useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../state/auth-store';
import NAV_ITEMS from '../config/navigation';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { Layers, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const UserMenu = React.lazy(() => import('./UserMenu'));

const sidebarCollapseState = {};

const Sidebar = ({ isOpen = false, onClose = () => {}, isMobile = false, isCollapsed = false, onToggleCollapse = () => {} }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isMobile || !isOpen || !sidebarRef.current) return;

    const focusableElements = sidebarRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobile, isOpen, onClose]);

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (!item.role) return true;
    return Array.isArray(item.role)
      ? item.role.includes(user?.role)
      : item.role === user?.role;
  });

  const groupedNav = useMemo(() => {
    const groups = {};
    const ungrouped = [];

    visibleNav.forEach((item) => {
      if (item.group) {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item);
      } else {
        ungrouped.push(item);
      }
    });

    return { groups, ungrouped };
  }, [visibleNav]);

  const renderedUngrouped = useMemo(
    () =>
      groupedNav.ungrouped.map(({ label, to, icon }) => ({
        label,
        to,
        icon,
        isActive: location.pathname === to,
        onClick: onClose,
      })),
    [groupedNav.ungrouped, location.pathname, onClose]
  );

  const renderedGroups = useMemo(
    () =>
      Object.entries(groupedNav.groups).map(([groupLabel, items]) => ({
        groupLabel,
        items: items.map(({ label, to, icon }) => ({
          label,
          to,
          icon,
          isActive: location.pathname === to,
          onClick: onClose,
        })),
      })),
    [groupedNav.groups, location.pathname, onClose]
  );

  const [collapsedGroups, setCollapsedGroups] = useState(() => sidebarCollapseState);

  const isGroupOpen = useCallback(
    (groupLabel) => !(collapsedGroups[groupLabel] === true),
    [collapsedGroups]
  );

  const toggleGroup = useCallback((groupLabel) => {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [groupLabel]: !prev[groupLabel] };
      Object.assign(sidebarCollapseState, next);
      return next;
    });
  }, []);

  // Determine sidebar width
  const sidebarWidth = isMobile ? '100%' : isCollapsed ? '72px' : '275px';

  const sidebarBaseStyles = {
    width: sidebarWidth,
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
    contain: 'layout style',
  };

  const sidebarMobileStyles = isMobile
    ? {
        ...sidebarBaseStyles,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 1000,
        transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: isOpen ? '0 20px 25px -5px rgba(0,0,0,0.05)' : 'none',
      }
    : {
        ...sidebarBaseStyles,
        minHeight: '100vh',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        transition: 'width 250ms ease-in-out',
      };

  return (
    <aside ref={sidebarRef} style={sidebarMobileStyles}>
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '20px 0' : '20px',
          borderBottom: '1px solid #F1F5F9',
          flexShrink: 0,
        }}
      >
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              cursor: 'pointer',
              outline: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 0,
              transition: 'all 0.15s',
            }}
            className="sidebar-toggle-btn"
          >
            <PanelLeftOpen size={19} strokeWidth={1.75} />
          </button>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#111827',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#FFFFFF',
                }}
              >
                <Layers size={19} strokeWidth={1.75} />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Sora', 'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#111827',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SPMS
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#6B7280',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Teacher Portal
                </span>
              </div>
            </div>

            {isMobile ? (
              <button
                onClick={onClose}
                aria-label="Close Sidebar"
                style={{
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  transition: 'background-color 200ms ease-in-out, color 200ms ease-in-out',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                className="close-sidebar-btn focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            ) : (
              <button
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                className="sidebar-toggle-btn"
              >
                <PanelLeftClose size={18} strokeWidth={1.75} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav Sections */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: isCollapsed ? '16px 0' : '16px 18px',
          overflowY: 'auto',
          overflowX: 'hidden',
          alignItems: isCollapsed ? 'center' : 'stretch',
        }}
        aria-label="Main navigation"
      >
        {groupedNav.ungrouped.length > 0 && (
          <div
            style={{ marginBottom: '8px', width: '100%' }}
            role="group"
            aria-label="Main menu"
          >
            {renderedUngrouped.map(({ label, to, icon, isActive, onClick }) => (
              <NavItem
                key={label}
                label={label}
                to={to}
                icon={icon}
                isActive={isActive}
                onClick={onClick}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}

        {renderedGroups.map(({ groupLabel, items }, index) => (
          <NavGroup
            key={groupLabel}
            label={groupLabel}
            isFirst={index === 0}
            isOpen={isGroupOpen(groupLabel)}
            onToggle={() => toggleGroup(groupLabel)}
            items={items}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User Footer */}
      <Suspense fallback={null}>
        <UserMenu isMobile={isMobile} onClose={onClose} isCollapsed={isCollapsed} />
      </Suspense>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .nav-item-link:hover {
          background-color: #F8FAFC !important;
          color: #111827 !important;
        }
        .nav-item-link:hover span {
          color: #334155 !important;
        }

        .nav-group-header:hover {
          color: #111827 !important;
          background-color: #F8FAFC !important;
        }

        .close-sidebar-btn:hover {
          background-color: #F8FAFC !important;
          color: #374151 !important;
        }

        .sidebar-toggle-btn:hover {
          background-color: #F1F3F4 !important;
          color: #202124 !important;
        }

        .user-menu-trigger:hover {
          background-color: #F8FAFC !important;
          color: #374151 !important;
        }

        .logout-btn:hover {
          background-color: #FEF2F2 !important;
        }

        nav::-webkit-scrollbar {
          width: 4px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 4px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
