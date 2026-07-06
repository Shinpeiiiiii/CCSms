import { Link } from 'react-router-dom'
import { Layers, MapPin, Mail } from 'lucide-react'

const LINKS = [
  ['Home', '/'],
  ['Programs', '/program'],
  ['Enrollment', '/enrollment'],
  ['Login', '/login'],
]

const Footer = () => (
  <footer
    style={{
      background: '#F1F3F4',
      borderTop: '1px solid #E8EAED',
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
              }}
            >
              TeacherPortal
            </span>
          </div>
          <p
            style={{
              color: '#5F6368',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              maxWidth: 240,
              margin: 0,
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
              color: '#5F6368',
              marginBottom: 20,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 0,
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
                  color: '#5F6368',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  width: 'fit-content',
                }}
                onMouseEnter={e => (e.target.style.color = '#1A73E8')}
                onMouseLeave={e => (e.target.style.color = '#5F6368')}
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
              color: '#5F6368',
              marginBottom: 20,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 0,
            }}
          >
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={14} style={{ color: '#5F6368', flexShrink: 0 }} />
              <span style={{ color: '#5F6368', fontSize: '0.875rem' }}>Cebu City, Philippines</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Mail size={14} style={{ color: '#5F6368', flexShrink: 0 }} />
              <a
                href="mailto:SHportal@email.com"
                style={{ color: '#1A73E8', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}
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
          borderTop: '1px solid #DADCE0',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ color: '#5F6368', fontSize: '0.8125rem', margin: 0 }}>
          © 2025 TeacherPortal. All rights reserved.
        </p>
        <p style={{ color: '#5F6368', fontSize: '0.8125rem', margin: 0 }}>
          Built for Cebu's future professionals.
        </p>
      </div>
    </div>
  </footer>
)

export default Footer