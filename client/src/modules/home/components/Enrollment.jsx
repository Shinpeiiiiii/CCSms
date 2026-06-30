import { Link } from 'react-router-dom'

const steps = [
  {
    label: 'Submit Application',
    desc: 'Fill out the online enrollment form and provide your basic academic information.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Registrar Review',
    desc: 'The registrar team evaluates your application within 2–3 business days.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Section Assignment',
    desc: 'Your program, schedule, and class section are officially assigned.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Official Enrollment',
    desc: "Confirmation email sent — you're officially enrolled and ready to start!",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

const Enrollment = () => (
  <section
    id="enrollment"
    style={{
      background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1229 50%, #0A0F1E 100%)',
      padding: '100px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >

    {/* Decorative blur */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          style={{
            color: '#8B5CF6',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Simple & Clear
        </p>
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#F1F5F9',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Enrollment Process
        </h2>
        <p style={{ color: '#475569', fontSize: '1rem' }}>
          Four straightforward steps from application to official enrollment.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 52 }}>
        {steps.map(({ label, desc, icon }, i) => (
          <div
            key={i}
            className="step-card"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 18,
              backdropFilter: 'blur(8px)',
              transition: 'border-color 0.25s ease',
            }}
          >
            {/* Step number ring */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.22))',
                border: '1px solid rgba(99,102,241,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#A5B4FC',
              }}
            >
              {icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#6366F1',
                    letterSpacing: '0.08em',
                  }}
                >
                  STEP {i + 1}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#F1F5F9',
                  marginBottom: 6,
                }}
              >
                {label}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/enrollmentform"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: 100,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 0 32px rgba(99,102,241,0.35)',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          Start Your Application
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  </section>
)

export default Enrollment