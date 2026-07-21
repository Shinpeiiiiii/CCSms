// NavItem.jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const NavItem = ({ label, to, icon: Icon, isActive, onClick }) => {
  const iconRef = useRef(null)

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={(e) => {
        iconRef.current?.startAnimation?.()
        if (!isActive) {
          e.currentTarget.style.background = '#F1F3F4'
          e.currentTarget.style.color = '#202124'
        }
      }}
      onMouseLeave={(e) => {
        iconRef.current?.stopAnimation?.()
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#5F6368'
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 100,
        textDecoration: 'none',
        background: isActive ? '#E8F0FE' : 'transparent',
        color: isActive ? '#1A73E8' : '#5F6368',
        fontWeight: isActive ? 600 : 500,
        fontSize: 14,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          color: isActive ? '#1A73E8' : '#5F6368',
        }}
      >
        {Icon && <Icon ref={iconRef} size={18} />}
      </span>
      {label}
    </Link>
  )
}

export default NavItem