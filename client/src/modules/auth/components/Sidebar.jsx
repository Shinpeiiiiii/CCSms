import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import NAV_ITEMS from '../config/navigation'


const Sidebar = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const visibleNav = NAV_ITEMS.filter(item => {
    if (!item.role) return true
    return Array.isArray(item.role)
      ? item.role.includes(user?.role)
      : item.role === user?.role
  })

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#060A16',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, padding: '0 8px' }}>
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(99,102,241,0.4)', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
          School Portal
        </span>
      </div>

      {/* Nav section label */}
      <p style={{ color: '#1E293B', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
        Main Menu
      </p>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {visibleNav.map(({ label, to, icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={label}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: isActive ? '#A5B4FC' : '#475569',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14, transition: 'all 0.2s',
                borderLeft: isActive ? '2px solid #6366F1' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' } }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User role badge at bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, marginTop: 16,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#A5B4FC', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#94A3B8', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'user@portal.com'}
            </p>
            <span style={{
              display: 'inline-block',
              background: 'rgba(99,102,241,0.2)', color: '#818CF8',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
              padding: '1px 7px', borderRadius: 100, textTransform: 'capitalize',
            }}>
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar