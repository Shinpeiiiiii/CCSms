import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import useAuthStore from '../state/auth-store'
import { requestPasswordReset, confirmPasswordReset } from '../services/auth.services'

const ForgotPassword = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)

  if (accessToken && user) {
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isPasswordValid = newPassword.length >= 8
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword !== ''

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setSending(true)
    try {
      await requestPasswordReset(email.trim())
      toast.success('If an account exists, a verification code has been sent.')
      setCountdown(60)
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code.')
    } finally {
      setSending(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!code.trim() || !newPassword) return

    setResetting(true)
    try {
      await confirmPasswordReset(email.trim(), code.trim(), newPassword)
      setSuccess(true)
      toast.success('Password has been reset successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #0B1A2E 0%, #0F2442 40%, #132E54 100%)',
        }}
      >
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

        <div className="relative z-10 w-full max-w-md px-8">
          <Link to="/" className="no-underline inline-block mb-10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-sora font-extrabold text-white text-lg"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                }}
              >
                CCS
              </div>
              <span className="text-white font-sora font-bold text-xl tracking-tight">
                CCSms
              </span>
            </div>
          </Link>

          <h2 className="font-sora text-white font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            Reset your{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
              }}
            >
              password
            </span>
          </h2>

          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-sm">
            Enter your registered email address and we'll send you a verification code to reset your password.
          </p>

          <div className="flex flex-col gap-5 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            {[
              { num: '01', title: 'Verify Email', desc: 'Enter your email and receive a one-time code.' },
              { num: '02', title: 'Reset Password', desc: 'Enter the code and set a new password.' },
            ].map((s, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span className="font-sora text-xs font-bold text-indigo-400 bg-indigo-500/10 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                  {s.num}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider m-0 mb-1">{s.title}</h4>
                  <p className="text-slate-400 text-xs m-0 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/login" className="text-slate-400 hover:text-slate-200 text-sm font-medium no-underline inline-flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h1 className="font-sora font-extrabold text-2xl text-white mb-3">
                Password Reset Successful
              </h1>
              <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                Your password has been updated. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all no-underline"
              >
                Go to Login <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="lg:hidden mb-8">
                <Link to="/" className="no-underline inline-block">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-sora font-extrabold text-white text-base"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      }}
                    >
                      CCS
                    </div>
                    <span className="text-slate-900 font-sora font-bold text-lg tracking-tight">
                      CCSms
                    </span>
                  </div>
                </Link>
              </div>

              <h1 className="font-sora font-extrabold text-2xl text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-sm mb-8">
                Enter your registered email and we'll send you a verification code.
              </p>

              <form onSubmit={handleSendCode} className="flex flex-col gap-6">
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={sending}
                      className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 text-sm outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium no-underline inline-flex items-center gap-1">
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="lg:hidden mb-8">
                <Link to="/" className="no-underline inline-block">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-sora font-extrabold text-white text-base"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      }}
                    >
                      CCS
                    </div>
                    <span className="text-slate-900 font-sora font-bold text-lg tracking-tight">
                      CCSms
                    </span>
                  </div>
                </Link>
              </div>

              <h1 className="font-sora font-extrabold text-2xl text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-sm mb-8">
                Enter the 6-digit code sent to <span className="font-semibold text-gray-900">{email}</span>.
              </p>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      disabled={resetting}
                      className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 text-sm outline-none tracking-widest font-mono text-center transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      disabled={resetting}
                      className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-10 text-gray-900 text-sm outline-none transition-all placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && newPassword.length < 8 && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">Password must be at least 8 characters long.</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      disabled={resetting}
                      className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-10 text-gray-900 text-sm outline-none transition-all placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !doPasswordsMatch && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords do not match.</p>
                  )}
                  {confirmPassword.length > 0 && doPasswordsMatch && (
                    <p className="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1">
                      ✓ Passwords match!
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetting || !isPasswordValid || !doPasswordsMatch || !code.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
                >
                  {resetting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Resetting password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium bg-transparent border-none cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Change email
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
