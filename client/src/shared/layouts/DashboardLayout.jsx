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
    <div className="flex min-h-screen bg-slate-50">
      {/* Dark semi-transparent overlay visible only on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-[999] bg-slate-950/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isMobile={isMobile} 
      />

      <div className="flex flex-1 min-w-0 flex-col">
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
