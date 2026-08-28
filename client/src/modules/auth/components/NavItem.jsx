import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NavItem = ({ label, to, icon: Icon, isActive, onClick, isCollapsed = false }) => {
  const iconRef = useRef(null)

  return (
    <Link
      to={to}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingLeft: isCollapsed ? '0' : '14px',
        paddingRight: isCollapsed ? '0' : '14px',
        height: '44px',
        minHeight: '44px',
        borderRadius: '10px',
        textDecoration: 'none',
        userSelect: 'none',
        transition: 'background-color 200ms ease-in-out, color 200ms ease-in-out',
        backgroundColor: isActive ? '#F1F5F9' : 'transparent',
        color: isActive ? '#111827' : '#475569',
        fontWeight: isActive ? 600 : 500,
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        letterSpacing: '0.01em',
        outline: 'none',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        width: isCollapsed ? '44px' : 'auto',
        marginLeft: isCollapsed ? 'auto' : undefined,
        marginRight: isCollapsed ? 'auto' : undefined,
      }}
      className={`
        nav-item-link
        focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-1
      `}
    >
      {/* Active indicator - left bar */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active-indicator"
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            bottom: '0',
            margin: 'auto 0',
            width: '3.5px',
            height: '22px',
            backgroundColor: '#334155',
            borderRadius: '0 4px 4px 0',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'color 200ms ease-in-out',
          color: isActive ? '#111827' : '#64748B',
        }}
      >
        {Icon ? (
          <Icon ref={iconRef} size={19} strokeWidth={1.75} />
        ) : (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              transition: 'background-color 200ms ease-in-out',
              backgroundColor: isActive ? '#334155' : '#94a3b8',
            }}
          />
        )}
      </span>

      {/* Label */}
      {!isCollapsed && (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </span>
      )}
    </Link>
  )
}

export default NavItem
