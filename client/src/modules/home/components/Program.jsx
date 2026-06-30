const programs = [
  {
    name: 'BS Information Technology',
    desc: 'Systems, networks, databases, and IT infrastructure for the modern enterprise.',
    color: '#6366F1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    name: 'BS Computer Science',
    desc: 'Algorithms, software engineering, AI foundations, and computational theory.',
    color: '#8B5CF6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: 'BS Computer Engineering',
    desc: 'Hardware-software integration, embedded systems, and digital circuit design.',
    color: '#6366F1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="9" width="6" height="6" rx="1" />
        <rect x="2" y="9" width="6" height="6" rx="1" />
        <path d="M12 8v1M12 15v1M6 12h3M15 12h3" />
      </svg>
    ),
  },
  {
    name: 'BS Education',
    desc: 'Pedagogy, curriculum design, learning theories, and classroom innovation.',
    color: '#A78BFA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
]

const Program = () => (
  <section
    id="programs"
    style={{
      background: '#0A0F1E',
      padding: '100px 24px',
    }}
  >

    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
          Academic Excellence
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
          Academic Programs
        </h2>
        <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: 460, margin: '0 auto' }}>
          Four degrees designed for the digital economy and the classrooms of tomorrow.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {programs.map(({ name, icon, desc, color }) => (
          <div
            key={name}
            className="program-card"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '28px 24px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 13,
                background: `rgba(${color === '#6366F1' ? '99,102,241' : color === '#8B5CF6' ? '139,92,246' : '167,139,250'}, 0.12)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              {icon}
            </div>
            <h3
              style={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: '1.0625rem',
                color: '#F1F5F9',
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              {name}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Program