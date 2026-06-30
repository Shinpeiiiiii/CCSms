import { Link } from 'react-router-dom'
import DashboardLayout from '../../../shared/layouts/DashboardLayout'

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: '24px',
    display: 'flex', flexDirection: 'column', gap: 16,
    transition: 'all 0.25s ease',
  }}
  onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
  onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#475569', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </p>
        <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>
          {value}
        </p>
        {sub && <p style={{ color: '#334155', fontSize: 12, marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: color || 'rgba(99,102,241,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </div>
)

const QuickLink = ({ to, label, desc, icon }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)' }}
    onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'rgba(99,102,241,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#818CF8', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 14, color: '#F1F5F9', marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#334155', fontSize: 12 }}>{desc}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
)

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Welcome to School Portal
        </h1>
        <p style={{ color: '#475569', fontSize: 14 }}>Here's a quick overview of your portal today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
        <StatCard
          label="Total Students" value="120" sub="+8 this month"
          color="rgba(99,102,241,0.12)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>}
        />
        <StatCard
          label="Attendance Rate" value="95%" sub="This academic week"
          color="rgba(16,185,129,0.12)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="1.75" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>}
        />
        <StatCard
          label="Active Subjects" value="8" sub="Across 4 programs"
          color="rgba(139,92,246,0.12)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>}
        />
        <StatCard
          label="Applications" value="34" sub="Pending review"
          color="rgba(245,158,11,0.1)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="1.75" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>}
        />
      </div>

      {/* Quick access */}
      <div>
        <p style={{ color: '#334155', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
          Quick Access
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <QuickLink to="/students" label="Manage Students" desc="View, add, or remove students"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>}
          />
          <QuickLink to="/grades" label="View Grades" desc="Track and update student grades"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>}
          />
          <QuickLink to="/subjects" label="Subjects" desc="Manage academic subject list"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard