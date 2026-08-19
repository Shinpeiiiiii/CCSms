import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Layers, Menu, X } from 'lucide-react'

const TABS = [
  { label: 'Home',       to: '/'           },
  { label: 'About',      to: '/#about'     },
  { label: 'Programs',   to: '/#programs'  },
  { label: 'Enrollment', to: '/#enrollment'},
  { label: 'Track Status', to: '/track'    },
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
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8EAED',
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
              background: '#1A73E8',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(26,115,232,0.2)',
              color: '#FFFFFF',
            }}
          >
            <Layers size={20} />
          </div>
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 17,
              color: '#202124',
              letterSpacing: '-0.01em',
            }}
          >
            School Management System
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="desktop-nav">
          <ul
            className="relative flex"
            style={{
              background: '#F1F3F4',
              border: '1px solid #DADCE0',
              borderRadius: 100,
              padding: '4px',
              gap: 0,
              listStyle: 'none',
              margin: 0,
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#5F6368',
            outline: 'none',
            transition: 'background 0.2s',
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
          {isMobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
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
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid #E8EAED',
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
                    color: isActive ? '#1A73E8' : '#5F6368',
                    background: isActive ? '#E8F0FE' : 'transparent',
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
          fontWeight: isActive ? 600 : 500,
          color: isActive ? '#1A73E8' : '#5F6368',
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
      background: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.24)',
      listStyle: 'none',
    }}
  />
)

export default NavHeader