import { Link } from 'react-router-dom'

const Hero = () => (
  <section
    style={{
      background:
        'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(99,102,241,0.28) 0%, rgba(139,92,246,0.12) 40%, transparent 65%), #0A0F1E',
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative orbs */}
    <div
      style={{
        position: 'absolute',
        top: '20%',
        right: '8%',
        width: 480,
        height: 480,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: 320,
        height: 320,
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />
    {/* Subtle grid */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }}
    />

    <div style={{ maxWidth: 780, textAlign: 'center', position: 'relative', zIndex: 1 }}>
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(99,102,241,0.13)',
          border: '1px solid rgba(99,102,241,0.28)',
          color: '#A5B4FC',
          padding: '7px 18px',
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 36,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: 7,
            height: 7,
            background: '#6EE7B7',
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        AY 2025–2026 Enrollment Now Open
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 'clamp(2.6rem, 6.5vw, 4.75rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          color: '#F1F5F9',
          marginBottom: 28,
          letterSpacing: '-0.03em',
        }}
      >
        Your{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #C084FC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Academic Journey
        </span>
        <br />
        Starts Here
      </h1>

      <p
        style={{
          color: '#64748B',
          fontSize: '1.125rem',
          lineHeight: 1.75,
          maxWidth: 540,
          margin: '0 auto 44px',
        }}
      >
        TeacherPortal simplifies online enrollment and student management for
        Cebu's future professionals — fast, secure, and fully online.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 72,
        }}
      >
        <Link
          to="/enrollmentform"
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white',
            padding: '15px 36px',
            borderRadius: 100,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 0 32px rgba(99,102,241,0.38)',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Enroll Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          to="/program"
          className="btn-ghost"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.11)',
            color: '#94A3B8',
            padding: '15px 36px',
            borderRadius: 100,
            fontWeight: 500,
            fontSize: 15,
            textDecoration: 'none',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          View Programs
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        {[
          ['4', 'Degree Programs'],
          ['2,400+', 'Students Enrolled'],
          ['100%', 'Online Process'],
        ].map(([num, label]) => (
          <div
            key={label}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '22px 12px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.875rem',
                fontWeight: 800,
                color: '#F1F5F9',
                lineHeight: 1,
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#475569',
                marginTop: 6,
                letterSpacing: '0.02em',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Hero