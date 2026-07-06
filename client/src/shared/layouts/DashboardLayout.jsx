import { useState, useEffect } from 'react'
import Sidebar from '../../modules/auth/components/Sidebar'
import Topbar from '../../modules/auth/components/Topbar'

const DashboardLayout = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Check initial layout size
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false) // auto close sidebar when transitioning back to desktop
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    // Lock scrolling on mobile when sidebar is open
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isSidebarOpen])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Dark semi-transparent overlay visible only on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.24)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isMobile={isMobile} 
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          isMobile={isMobile} 
        />

        <main style={{
          flex: 1,
          padding: isMobile ? 16 : 24,
          overflowY: 'auto',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(26,115,232,0.03) 0%, transparent 60%), #F8F9FA',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout