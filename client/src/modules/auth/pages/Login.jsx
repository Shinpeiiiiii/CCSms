import { Navigate, Link } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import LoginForm from '../components/loginform'
import { motion } from 'framer-motion'

const Login = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)

  if (accessToken && user) {
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left branded panel ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #0B1A2E 0%, #0F2442 40%, #132E54 100%)',
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          className="absolute"
          style={{
            top: '-8%',
            right: '-12%',
            width: 560,
            height: 560,
            background: 'radial-gradient(circle, rgba(26, 115, 232, 0.18) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-5%',
            left: '-8%',
            width: 440,
            height: 440,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '40%',
            left: '30%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(52, 168, 83, 0.06) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 px-16 max-w-lg"
        >
          {/* Logo / Brand */}
          <Link to="/" className="no-underline inline-block mb-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-sora font-extrabold text-white text-lg"
                style={{
                  background: 'linear-gradient(135deg, #1A73E8, #5B9CF6)',
                  boxShadow: '0 4px 16px rgba(26, 115, 232, 0.3)',
                }}
              >
                SMS
              </div>
              <span className="text-white/90 font-sora font-bold text-xl tracking-tight">
                School Management System
              </span>
            </div>
          </Link>

          <h2
            className="font-sora text-white font-extrabold tracking-tight leading-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            Manage your academic{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5B9CF6 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              workspace
            </span>{' '}
            effortlessly.
          </h2>

          <p className="text-white/50 text-base leading-relaxed mb-14 max-w-sm">
            Enrollment, grades, attendance, and student records — all in one secure portal designed for Cebu's educators.
          </p>

          {/* Testimonial / trust signal */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="text-white/60 text-sm leading-relaxed italic mb-4">
              "CCSms streamlined our enrollment process and saved us countless hours every semester."
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #1A73E8, #8B5CF6)' }}
              >
                DR
              </div>
              <div>
                <div className="text-white/80 text-xs font-semibold">Dr. Reyes</div>
                <div className="text-white/35 text-[11px]">Department Head, CCS</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 bg-white relative">
        {/* Mobile-only logo */}
        <Link to="/" className="no-underline lg:hidden mb-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-sora font-extrabold text-white text-base"
              style={{
                background: 'linear-gradient(135deg, #1A73E8, #5B9CF6)',
              }}
            >
              T
            </div>
            <span className="text-slate-900 font-sora font-bold text-lg tracking-tight">
              TeacherPortal
            </span>
          </div>
        </Link>

        <LoginForm />
      </div>
    </div>
  )
}

export default Login