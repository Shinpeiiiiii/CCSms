import { Link } from 'react-router-dom'
import { FileText, UserCheck, Calendar, Award, ArrowRight } from 'lucide-react'

const steps = [
  {
    label: 'Submit Application',
    desc: 'Fill out the online enrollment form and provide your basic academic information.',
    icon: <FileText size={18} />,
  },
  {
    label: 'Registrar Review',
    desc: 'The registrar team evaluates your application within 2–3 business days.',
    icon: <UserCheck size={18} />,
  },
  {
    label: 'Section Assignment',
    desc: 'Your program, schedule, and class section are officially assigned.',
    icon: <Calendar size={18} />,
  },
  {
    label: 'Official Enrollment',
    desc: "Confirmation email sent — you're officially enrolled and ready to start!",
    icon: <Award size={18} />,
  },
]

const Enrollment = () => (
  <section
    id="enrollment"
    style={{
      background: '#FFFFFF',
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
        background: 'radial-gradient(ellipse, rgba(26,115,232,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          style={{
            color: '#1A73E8',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 14,
            marginTop: 0,
          }}
        >
          Simple & Clear
        </p>
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#202124',
            marginBottom: 16,
            letterSpacing: '-0.02em',
            marginTop: 0,
          }}
        >
          Enrollment Process
        </h2>
        <p style={{ color: '#5F6368', fontSize: '1rem', margin: 0 }}>
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
              background: '#FFFFFF',
              border: '1px solid #DADCE0',
              borderRadius: 18,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 18,
              boxShadow: '0 1px 2px 0 rgba(60,64,67,0.05)',
              transition: 'border-color 0.2s ease',
            }}
          >
            {/* Step number ring */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#E8F0FE',
                border: '1px solid rgba(26, 115, 232, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#1A73E8',
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
                    color: '#1A73E8',
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
                  color: '#202124',
                  marginBottom: 6,
                  marginTop: 0,
                }}
              >
                {label}
              </h3>
              <p style={{ color: '#5F6368', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{desc}</p>
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
            background: '#1A73E8',
            color: 'white',
            padding: '15px 40px',
            borderRadius: 100,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(26, 115, 232, 0.24)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          Start Your Application
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </section>
)

export default Enrollment