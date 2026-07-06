import { Monitor, Code, Cpu, GraduationCap } from 'lucide-react'

const programs = [
  {
    name: 'BS Information Technology',
    desc: 'Systems, networks, databases, and IT infrastructure for the modern enterprise.',
    color: '#1A73E8',
    icon: <Monitor size={22} style={{ color: '#1A73E8' }} />,
  },
  {
    name: 'BS Computer Science',
    desc: 'Algorithms, software engineering, AI foundations, and computational theory.',
    color: '#8B5CF6',
    icon: <Code size={22} style={{ color: '#8B5CF6' }} />,
  },
  {
    name: 'BS Computer Engineering',
    desc: 'Hardware-software integration, embedded systems, and digital circuit design.',
    color: '#34A853',
    icon: <Cpu size={22} style={{ color: '#34A853' }} />,
  },
  {
    name: 'BS Education',
    desc: 'Pedagogy, curriculum design, learning theories, and classroom innovation.',
    color: '#FBBC04',
    icon: <GraduationCap size={22} style={{ color: '#FBBC04' }} />,
  },
]

const Program = () => (
  <section
    id="programs"
    style={{
      background: '#FFFFFF',
      padding: '100px 24px',
    }}
  >
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
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
          Academic Excellence
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
          Academic Programs
        </h2>
        <p style={{ color: '#5F6368', fontSize: '1.0625rem', maxWidth: 460, margin: '0 auto' }}>
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
              background: '#FFFFFF',
              border: '1px solid #DADCE0',
              borderRadius: 20,
              padding: '28px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 2px 0 rgba(60,64,67,0.05)',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 13,
                background: `${
                  color === '#1A73E8' 
                    ? 'rgba(26,115,232,0.08)' 
                    : color === '#8B5CF6' 
                      ? 'rgba(139,92,246,0.08)' 
                      : color === '#34A853' 
                        ? 'rgba(52,168,83,0.08)' 
                        : 'rgba(251,188,4,0.08)'
                }`,
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
                color: '#202124',
                marginBottom: 10,
                lineHeight: 1.3,
                marginTop: 0,
              }}
            >
              {name}
            </h3>
            <p style={{ color: '#5F6368', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Program