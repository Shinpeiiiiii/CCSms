import Sidebar from '../../modules/auth/components/Sidebar'
import Topbar from '../../modules/auth/components/Topbar'

const DashboardLayout = ({
  children,
}) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1E' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <main style={{
          flex: 1,
          padding: 24,
          overflowY: 'auto',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%), #0A0F1E',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout