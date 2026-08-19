import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import { Menu, Bell } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/attendance': 'Attendance',
  '/departments': 'Department',
  '/grades': 'Grades',
  '/subjects': 'Subjects',
  '/accounts': 'Account Management',
}

const Topbar = ({ onToggleSidebar = () => {}, isMobile = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const pageTitle = PAGE_TITLES[location.pathname] || 'Portal'

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8EAED',
        padding: isMobile ? '0 16px' : '0 28px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Page title & Hamburger on Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            aria-label="Open Navigation Menu"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5F6368',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
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
            <Menu size={20} />
          </button>
        )}

        <div>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.0625rem',
              color: '#202124',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {pageTitle}
          </h2>

          <p style={{ color: '#5F6368', fontSize: 11, marginTop: 2, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5F6368',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
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
          <Bell size={20} />
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: '#E8EAED' }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <p style={{ color: '#202124', fontSize: 12, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <span
              style={{
                display: 'inline-block',
                background: '#E8F0FE',
                color: '#1A73E8',
                fontSize: 10,
                fontWeight: 600,
                padding: '1px 8px',
                borderRadius: 100,
                textTransform: 'capitalize',
                alignSelf: 'flex-start',
              }}
            >
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar