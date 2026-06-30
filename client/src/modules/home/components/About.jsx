import React from 'react'

const About = () => (
  <section
    id="about"
    style={{
      background: 'linear-gradient(180deg, #0A0F1E 0%, #080C16 100%)',
      padding: '100px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Background orb decoration */}
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '-10%',
        width: 380,
        height: 380,
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />

    <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 56,
          alignItems: 'center',
        }}
      >
        {/* Left column - Content */}
        <div>
          <p
            style={{
              color: '#6366F1',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Who We Are
          </p>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#F1F5F9',
              marginBottom: 20,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Shaping the Future of Cebu's{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tech Professionals
            </span>
          </h2>
          <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: 20 }}>
            TeacherPortal is Cebu's premier academic management gateway. Founded to address the challenges of digital-first education, we bridge student potential with industry-ready technology curriculum.
          </p>
          <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.75 }}>
            Our online enrollment system makes accessing computer education seamless, fast, and structured, so future developers and educators can start learning without administrative friction.
          </p>
        </div>

        {/* Right column - Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              title: 'Industry-Aligned Curriculum',
              desc: 'Degree programs structured in collaboration with Cebu’s leading tech companies and startup hubs.',
              color: '#6366F1',
            },
            {
              title: 'Student-First Management',
              desc: 'Seamless registrar updates, instant section assignments, and clear academic tracking tools.',
              color: '#8B5CF6',
            },
            {
              title: 'Cebu-Focused Opportunities',
              desc: 'Direct pipeline to internships and job opportunities in local and regional technology sectors.',
              color: '#A78BFA',
            },
          ].map(({ title, desc, color }) => (
            <div
              key={title}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '24px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#F1F5F9',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: color,
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                {title}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.8125rem', lineHeight: 1.6, paddingLeft: 16 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default About
