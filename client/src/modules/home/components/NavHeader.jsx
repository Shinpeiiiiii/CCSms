import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Home',       to: '/'           },
  { label: 'About',      to: '/#about'     },
  { label: 'Programs',   to: '/#programs'  },
  { label: 'Enrollment', to: '/#enrollment'},
  { label: 'Login',      to: '/login'      },
]

const NavHeader = () => {
  const location = useLocation()
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleMouseLeave = useCallback(() => {
    setPosition(prev => ({ ...prev, opacity: 0 }))
  }, [])

  const handleTabClick = (e, to) => {
    if (to.startsWith('/#')) {
      const hash = to.split('#')[1]
      if (location.pathname === '/') {
        e.preventDefault()
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMobileOpen(false)
      }
    } else if (to === '/') {
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIsMobileOpen(false)
      }
    } else {
      setIsMobileOpen(false)
    }
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={(e) => handleTabClick(e, '/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 17,
              color: '#F1F5F9',
              letterSpacing: '-0.01em',
            }}
          >
            TeacherPortal
          </span>
        </Link>

        {/* Desktop Navigation (hidden on mobile) */}
        <nav aria-label="Main navigation" className="desktop-nav">
          <ul
            className="relative flex"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 100,
              padding: '4px',
              gap: 0,
              listStyle: 'none',
            }}
            onMouseLeave={handleMouseLeave}
          >
            {TABS.map(({ label, to }) => {
              const hash = to.split('#')[1]
              const isActive = hash
                ? location.pathname === '/' && location.hash === `#${hash}`
                : location.pathname === to

              return (
                <Tab
                  key={label}
                  to={to}
                  isActive={isActive}
                  setPosition={setPosition}
                  onClick={(e) => handleTabClick(e, to)}
                >
                  {label}
                </Tab>
              )
            })}
            <Cursor position={position} />
          </ul>
        </nav>

        {/* Mobile Menu Button (hidden on desktop) */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#F1F5F9',
            outline: 'none',
            transition: 'background 0.2s',
          }}
        >
          {isMobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 68,
              left: 0,
              right: 0,
              background: 'rgba(10, 15, 30, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              zIndex: 49,
            }}
          >
            {TABS.map(({ label, to }) => {
              const hash = to.split('#')[1]
              const isActive = hash
                ? location.pathname === '/' && location.hash === `#${hash}`
                : location.pathname === to

              return (
                <Link
                  key={label}
                  to={to}
                  onClick={(e) => handleTabClick(e, to)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    color: isActive ? '#A5B4FC' : '#94A3B8',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

const Tab = ({ children, to, isActive, setPosition, onClick }) => {
  const ref = useRef(null)

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return
    const { width } = ref.current.getBoundingClientRect()
    setPosition({ width, opacity: 1, left: ref.current.offsetLeft })
  }, [setPosition])

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      style={{ position: 'relative', zIndex: 10, cursor: 'pointer' }}
    >
      <Link
        to={to}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        style={{
          display: 'block',
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#A5B4FC' : '#64748B',
          textDecoration: 'none',
          borderRadius: 100,
          transition: 'color 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Link>
    </li>
  )
}

const Cursor = ({ position }) => (
  <motion.li
    aria-hidden="true"
    animate={position}
    transition={{
      type: 'spring',
      stiffness: 380,
      damping: 28,
    }}
    style={{
      position: 'absolute',
      zIndex: 0,
      height: 36,
      top: 4,
      borderRadius: 100,
      background: 'rgba(99,102,241,0.2)',
      border: '1px solid rgba(99,102,241,0.25)',
      listStyle: 'none',
    }}
  />
)

export default NavHeader