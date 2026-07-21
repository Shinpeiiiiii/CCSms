import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import NAV_ITEMS from '../config/navigation'
import NavItem from './NavItem'
import { Layers, X, MoreVertical, LogOut, Loader2 } from 'lucide-react'

const Sidebar = ({ isOpen = false, onClose = () => {}, isMobile = false }) => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // Focus trap and Escape key listener when sidebar is open on mobile
  useEffect(() => {
    if (!isMobile || !isOpen || !sidebarRef.current) return

    const focusableElements = sidebarRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (firstElement) {
      firstElement.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, isOpen, onClose])

  const handleLogout = () => {
    if (isLoggingOut) return

    setShowMenu(false)
    setIsLoggingOut(true)

    setTimeout(() => {
      
      console.log('logout success');
      logout()
      navigate('/', { replace: true })
      onClose()
    }, 1200)
  }

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (!item.role) return true
    return Array.isArray(item.role)
      ? item.role.includes(user?.role)
      : item.role === user?.role
  })

  const sidebarStyles = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 240,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E8EAED',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isOpen ? '0 8px 30px rgba(0, 0, 0, 0.08)' : 'none',
      }
    : {
        width: 240,
        minHeight: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E8EAED',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        flexShrink: 0,
      }

  return (
    <aside ref={sidebarRef} style={sidebarStyles}>
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 36,
          padding: '0 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: '#1A73E8',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(26, 115, 232, 0.2)',
              flexShrink: 0,
              color: '#FFFFFF',
            }}
          >
            <Layers size={18} />
          </div>
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#202124',
              letterSpacing: '-0.01em',
            }}
          >
            SPMS
          </span>
        </div>

        {isMobile && (
          <button
            onClick={onClose}
            aria-label="Close Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5F6368',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F1F3F4'
              e.currentTarget.style.color = '#202124'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#5F6368'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav section label */}
      <p
        style={{
          color: '#5F6368',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0 12px',
          marginBottom: 8,
        }}
      >
        Main Menu
      </p>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {visibleNav.map(({ label, to, icon }) => (
          <NavItem
            key={label}
            label={label}
            to={to}
            icon={icon}
            isActive={location.pathname === to}
            onClick={onclose}
          />
        ))}
      </nav>
      {/* User role badge at bottom */}
      <div
        style={{
          borderTop: '1px solid #E8EAED',
          paddingTop: 16,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: '#F8F9FA',
            border: '1px solid #E8EAED',
            borderRadius: 12,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#E8F0FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A73E8',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                color: '#202124',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0,
              }}
            >
              {user?.email || 'user@portal.com'}
            </p>
            <span
              style={{
                display: 'inline-block',
                background: '#E8F0FE',
                color: '#1A73E8',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.02em',
                padding: '1px 8px',
                borderRadius: 100,
                textTransform: 'capitalize',
                marginTop: 2,
              }}
            >
              {user?.role || 'user'}
            </span>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5F6368',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F1F3F4'
              e.currentTarget.style.color = '#202124'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = '#5F6368'
            }}
          >
            <MoreVertical size={18} />
          </button>

          {/* Three dots dropdown menu */}
          {showMenu && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                right: 0,
                width: '100%',
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderRadius: 12,
                padding: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUp 0.15s ease-out',
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#D93025',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(217, 48, 37, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Signing Out Loader Overlay */}
      {isLoggingOut && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.84)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DADCE0',
              borderRadius: 20,
              padding: '40px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              width: '90%',
              maxWidth: '360px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
              textAlign: 'center',
              animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Spinning Loader icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#E8F0FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A73E8',
              }}
            >
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#202124',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Signing Out
              </h3>
              <p
                style={{
                  color: '#5F6368',
                  fontSize: '0.875rem',
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                Securing your session...
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </aside>
  )
}

export default Sidebar