import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../state/auth-store'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/attendance': 'Attendance',
  '/departments': 'Department',
  '/grades': 'Grades',
  '/subjects': 'Subjects',
  '/accounts': 'Account Management',
}

const Topbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const pageTitle = PAGE_TITLES[location.pathname] || 'Portal'

  return (
    <header
      style={{
        background: 'rgba(6, 10, 22, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 28px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Page title */}
      <div>
        <h2 style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '1.0625rem',
          color: '#F1F5F9',
          letterSpacing: '-0.01em',
        }}>
          {pageTitle}
        </h2>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 1 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notification bell (decorative) */}
        <button
          aria-label="Notifications"
          style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#475569', cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818CF8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#475569' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

        {/* User info + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#A5B4FC', fontSize: 12, fontWeight: 700,
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ color: '#94A3B8', fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <span style={{
              display: 'inline-block',
              background: 'rgba(99,102,241,0.15)', color: '#818CF8',
              fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 100,
              textTransform: 'capitalize',
            }}>
              {user?.role || 'user'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              color: '#475569', background: 'none', border: 'none',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              padding: '6px 10px', borderRadius: 8, transition: 'all 0.2s',
              marginLeft: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#FCA5A5' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#475569' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar