import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../../modules/auth/components/Sidebar'
import Topbar from '../../modules/auth/components/Topbar'

const SIDEBAR_WIDTH = 275
const SIDEBAR_COLLAPSED_WIDTH = 72

const DashboardLayout = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isSidebarOpen])

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }, [])

  const effectiveCollapsed = isMobile ? false : isCollapsed

  const sidebarWidth = effectiveCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Dark semi-transparent overlay visible only on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-999 bg-slate-950/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isMobile={isMobile}
        isCollapsed={effectiveCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div
        className="flex flex-1 min-w-0 flex-col"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 250ms ease-in-out',
        }}
      >
        <Topbar 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          isMobile={isMobile}
        />

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent_60%),#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
