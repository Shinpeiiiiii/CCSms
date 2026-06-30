import { Link } from 'react-router-dom'

const LINKS = [
  ['Home', '/'],
  ['Programs', '/program'],
  ['Enrollment', '/enrollment'],
  ['Login', '/login'],
]

const Footer = () => (
  <footer
    style={{
      background: '#060A16',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '64px 24px 32px',
    }}
  >
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Top section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48,
          marginBottom: 56,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(99,102,241,0.35)',
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
              }}
            >
              TeacherPortal
            </span>
          </div>
          <p
            style={{
              color: '#334155',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              maxWidth: 240,
            }}
          >
            Online enrollment and student management system for Cebu's future professionals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '0.8125rem',
              color: '#475569',
              marginBottom: 20,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Navigation
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LINKS.map(([label, to]) => (
              <Link
                key={label}
                to={to}
                style={{
                  color: '#334155',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  width: 'fit-content',
                }}
                onMouseEnter={e => (e.target.style.color = '#818CF8')}
                onMouseLeave={e => (e.target.style.color = '#334155')}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '0.8125rem',
              color: '#475569',
              marginBottom: 20,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ color: '#334155', fontSize: '0.875rem' }}>Cebu City, Philippines</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a
                href="mailto:SHportal@email.com"
                style={{ color: '#6366F1', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                SHportal@email.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ color: '#1E293B', fontSize: '0.8125rem' }}>
          © 2025 TeacherPortal. All rights reserved.
        </p>
        <p style={{ color: '#1E293B', fontSize: '0.8125rem' }}>
          Built for Cebu's future professionals.
        </p>
      </div>
    </div>
  </footer>
)

export default Footer