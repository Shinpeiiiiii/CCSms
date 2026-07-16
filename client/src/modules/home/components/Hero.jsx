import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import useEnrollmentAnnouncement from '@/modules/academic/management/enrollmentperiod/hooks/useEnrollmentAnnouncement';

const Hero = () => {
  const { announcement, loading } = useEnrollmentAnnouncement();

  const badgeText = loading
    ? 'Checking Enrollment Status'
    : announcement
        ? `Enrollment Open · ${new Date(announcement.startDate).toLocaleDateString()} – ${new Date(announcement.endDate).toLocaleDateString()}`
        : 'Enrollment Currently Closed';

  return (
    <section
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(26, 115, 232, 0.12) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 65%), #FFFFFF',
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
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(26, 115, 232, 0.04) 0%, transparent 70%)',
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
            'linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 780, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge / Marquee */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#E8F0FE',
            border: '1px solid rgba(26, 115, 232, 0.16)',
            color: '#1A73E8',
            borderRadius: 100,
            marginBottom: 36,
            maxWidth: '100%',
            width: 360,
            overflow: 'hidden',
            padding: '7px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              whiteSpace: 'nowrap',
              animation: 'hero-marquee 12s linear infinite',
              willChange: 'transform',
            }}
          >
            {[0, 1].map((copy) => (
              <span
                key={copy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  paddingLeft: 18,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: '#34A853',
                    borderRadius: '50%',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {badgeText}
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(2.6rem, 6.5vw, 4.75rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            color: '#202124',
            marginBottom: 28,
            letterSpacing: '-0.03em',
          }}
        >
          Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #1A73E8 0%, #8B5CF6 100%)',
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
            color: '#5F6368',
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
              background: '#1A73E8',
              color: 'white',
              padding: '15px 36px',
              borderRadius: 100,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(26, 115, 232, 0.24)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Enroll Now
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/program"
            className="btn-ghost"
            style={{
              background: '#FFFFFF',
              border: '1px solid #DADCE0',
              color: '#5F6368',
              padding: '15px 36px',
              borderRadius: 100,
              fontWeight: 500,
              fontSize: 15,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8F9FA';
              e.currentTarget.style.color = '#202124';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#5F6368';
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
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderRadius: 18,
                padding: '22px 12px',
                textAlign: 'center',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.05)',
              }}
            >
              <div
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.875rem',
                  fontWeight: 800,
                  color: '#202124',
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#5F6368',
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

      <style>{`
        @keyframes hero-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;