import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../state/auth-store'
import { loginUser } from '../services/auth.services'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'
import ArrowBackUpIcon from '@/components/movingicons/arrowBackIcon'
import { motion, AnimatePresence } from 'framer-motion'

const LoginForm = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileError, setTurnstileError] = useState(false)
  const turnstileRef = useRef(null)
  const widgetIdRef = useRef(null)
  const iconRef = useRef(null)
  const ENABLE_TURNSTILE = import.meta.env.VITE_ENABLE_TURNSTILE !== 'false'

  // Helper to render the Cloudflare Turnstile widget
  const renderWidget = () => {
    if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      retry: 'auto',
      'retry-interval': 3000,
      'refresh-expired': 'auto',
      theme: 'light',
      callback: (token) => {
        setTurnstileToken(token)
        setTurnstileError(false)
      },
      'expired-callback': () => {
        setTurnstileToken('')
      },
      'error-callback': () => {
        setTurnstileError(true)
        return true // Retry automatically
      },
    })
  }

  useEffect(() => {
    if (!ENABLE_TURNSTILE) return

    let intervalId = null

    if (window.turnstile) {
      renderWidget()
    } else {
      intervalId = setInterval(() => {
        if (window.turnstile) {
          renderWidget()
          clearInterval(intervalId)
          intervalId = null
        }
      }, 100)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Widget may already be gone if the DOM node was removed
        }
        widgetIdRef.current = null
      }
    }
  }, [ENABLE_TURNSTILE])

  const handleRetryTurnstile = () => {
    if (!window.turnstile || !turnstileRef.current) return
    setTurnstileError(false)
    setTurnstileToken('')

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current)
      } catch {
        // Safe catch if widget is already removed
      }
      widgetIdRef.current = null
    }

    renderWidget()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return // guard against double-submit

    if (ENABLE_TURNSTILE && !turnstileToken) {
      setError('Please complete the verification challenge.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
        turnstileToken: ENABLE_TURNSTILE ? turnstileToken : undefined,
      })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')

      // Turnstile tokens are single use; reset on failure
      setTurnstileToken('')
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-[400px]"
    >
      {/* Back to Home */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-[13px] font-medium mb-10 group no-underline cursor-pointer w-fit"
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <ArrowBackUpIcon size={18} color="currentColor" ref={iconRef} className="transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Home</span>
      </Link>

      {/* Heading */}
      <h1 className="font-sora font-extrabold text-[28px] text-slate-900 tracking-tight mt-0 mb-2 leading-tight">
        Welcome back
      </h1>
      <p className="text-slate-400 text-[14px] mt-0 mb-8 leading-relaxed">
        Enter your credentials to access your portal.
      </p>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="mb-6 overflow-hidden"
          >
            <div className="bg-red-50 border border-red-100 text-red-700 py-3 px-4 rounded-xl text-[13px] flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email-input" className="block text-slate-700 text-[13px] font-semibold mb-2">
            Email address<span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            id="email-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl py-3 px-4 text-slate-900 text-[14px] outline-none box-border transition-all duration-200 focus:ring-[3px] focus:ring-slate-900/[0.06] disabled:opacity-50 placeholder:text-slate-300"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password-input" className="text-slate-700 text-[13px] font-semibold">
              Password<span className="text-red-400 ml-0.5">*</span>
            </label>
            <Link to="/forgot-password" className="text-slate-400 hover:text-slate-700 text-[12px] no-underline font-medium transition-colors cursor-pointer">
              Forgot Password?
            </Link>
          </div>
          <div className="relative group">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              disabled={loading}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl py-3 px-4 pr-12 text-slate-900 text-[14px] outline-none box-border transition-all duration-200 focus:ring-[3px] focus:ring-slate-900/[0.06] disabled:opacity-50 placeholder:text-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors p-1 cursor-pointer focus:outline-none disabled:opacity-50 rounded-md"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2.5 -mt-1">
          <input
            type="checkbox"
            id="remember-me"
            className="w-[15px] h-[15px] rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 cursor-pointer accent-slate-900"
          />
          <label htmlFor="remember-me" className="text-slate-500 text-[13px] font-medium cursor-pointer select-none">
            Remember Me
          </label>
        </div>

        {/* Cloudflare Turnstile Verification */}
        {ENABLE_TURNSTILE && (
          <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-4 flex flex-col items-center justify-center min-h-21.25 w-full">
            <div ref={turnstileRef} className="mx-auto" />
            {turnstileError && (
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full py-3 px-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
                <div className="flex items-center gap-2 flex-1">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <span className="font-medium">Verification failed to load.</span>
                </div>
                <button
                  type="button"
                  onClick={handleRetryTurnstile}
                  className="inline-flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 rounded-lg py-1.5 px-3 text-red-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          type="submit"
          disabled={loading}
          className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-none font-semibold text-[14px] cursor-pointer bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
          style={{
            boxShadow: loading ? 'none' : '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default LoginForm