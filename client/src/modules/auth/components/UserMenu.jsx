import { useState, useRef, useEffect } from 'react';
import { MoreVertical, LogOut } from 'lucide-react';
import useAuthStore from '../state/auth-store';
import { useNavigate } from 'react-router-dom';
import LogoutOverlay from './LogoutOverlay';

const UserMenu = ({ onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    if (isLoggingOut) return;

    setShowMenu(false);
    setIsLoggingOut(true);

    setTimeout(() => {
      console.log('logout success');
      logout();
      navigate('/', { replace: true });
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        borderTop: '1px solid #E5E7EB',
        padding: '16px',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              fontSize: '14px',
              fontWeight: 500,
              flexShrink: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>

          {/* User info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                color: '#111827',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0,
                lineHeight: 1.4,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {user?.email || 'user@portal.com'}
            </p>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                padding: '2px 10px',
                borderRadius: '9999px',
                textTransform: 'capitalize',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {user?.role || 'user'}
            </span>
          </div>

          {/* Menu trigger */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-expanded={showMenu}
            aria-haspopup="true"
            aria-label="User menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              flexShrink: 0,
              transition: 'background-color 200ms ease-in-out, color 200ms ease-in-out',
              minWidth: '36px',
              minHeight: '36px',
            }}
            className="user-menu-trigger focus-visible:ring-2 focus-visible:ring-slate-900/20"
          >
            <MoreVertical size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Dropdown */}
        {showMenu && (
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.2s ease-in-out',
            }}
          >
            <button
              role="menuitem"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 200ms ease-in-out',
                outline: 'none',
                minHeight: '40px',
                fontFamily: "'Inter', sans-serif",
              }}
              className="logout-btn focus-visible:ring-2 focus-visible:ring-red-500/20"
            >
              <LogOut size={15} strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        )}
      </div>

      {isLoggingOut && <LogoutOverlay />}
    </div>
  );
};

export default UserMenu;