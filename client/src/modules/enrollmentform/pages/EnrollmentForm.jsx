import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FormSkeleton } from '@/components/toast/Skeleton'


import {
  Loader2, AlertCircle, Mail, Key, CheckCircle2, ArrowRight, ArrowLeft, GraduationCap, User, Phone,
  MapPin, FileText, Clock, ArrowUpRight
} from 'lucide-react'
import {
  getAnnouncement, sendOtp, verifyOtp, startApplication, getPrograms, submitApplicationDetails
} from '../services/enrollmentform'

const EnrollmentForm = () => {
  // Stepper states: 'announcement', 'otp', 'form', 'success'
  const [step, setStep] = useState('announcement')
  const [announcement, setAnnouncement] = useState(null)
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true)

  // API interaction states
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  
  // Application details
  const [applicationId, setApplicationId] = useState('')
  const [applicationNumber, setApplicationNumber] = useState('')
  const [programs, setPrograms] = useState([])
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  // Form Section Step: 1 = Personal, 2 = Contact, 3 = Program
  const [formSection, setFormSection] = useState(1)
  const [submittingForm, setSubmittingForm] = useState(false)

  // Error/Success Notification
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)

  // Form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    birthDate: '',
    civilStatus: 'Single',
    nationality: 'Filipino',
    contactNumber: '',
    address: '',
    program: '',
    studentType: 'Regular'
  })

  // Timer for OTP resend
  const [countdown, setCountdown] = useState(0)

  // Fetch enrollment period announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await getAnnouncement()
        setAnnouncement(data)
      } catch (err) {
        console.error('Failed to load enrollment announcement', err)
      } finally {
        setLoadingAnnouncement(false)
      }
    }
    fetchAnnouncement()
  }, [])

  // Timer countdown handler
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Step 1: Send OTP code
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setSendingOtp(true)
    setError('')
    setSuccessMsg('')

    try {
      await sendOtp(email.trim())
      setCountdown(60) // Lock resend button for 60s
      setSuccessMsg(`A verification code has been sent to ${email}`)
      setStep('otp')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send verification code. Please try again.'
      if (message.includes('already registered')) {
        setIsAlreadyRegistered(true)
        setError('This email is already registered in the system.')
      } else {
        setError(message)
      }
    } finally {
      setSendingOtp(false)
    }
  }

  // Step 2: Verify OTP and start application
  const handleVerifyAndStart = async (e) => {
    e.preventDefault()
    if (!otpCode.trim()) return

    setVerifyingOtp(true)
    setError('')
    setSuccessMsg('')

    try {
      // Verify the code
      await verifyOtp(email.trim(), otpCode.trim())
      
      // Verification successful, initialize application
      const appData = await startApplication(email.trim())
      setApplicationId(appData.application?._id || appData.application?._id || appData._id)
      setApplicationNumber(appData.application?.applicationNumber || appData.applicationNumber)
      
      // If the application already has filled fields, preload them
      if (appData.application) {
        const appObj = appData.application;
        setFormData({
          firstName: appObj.firstName || '',
          middleName: appObj.middleName || '',
          lastName: appObj.lastName || '',
          sex: appObj.sex || '',
          birthDate: appObj.birthDate ? new Date(appObj.birthDate).toISOString().substring(0, 10) : '',
          civilStatus: appObj.civilStatus || 'Single',
          nationality: appObj.nationality || 'Filipino',
          contactNumber: appObj.contactNumber || '',
          address: appObj.address || '',
          program: appObj.program || '',
          studentType: appObj.studentType || 'Regular'
        })
      }

      // Fetch active academic programs
      setLoadingPrograms(true)
      try {
        const progList = await getPrograms()
        setPrograms(progList)
      } catch (pErr) {
        console.error('Failed to load programs', pErr)
      } finally {
        setLoadingPrograms(false)
      }

      setStep('form')
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired verification code.'
      if (message.includes('already registered')) {
        setIsAlreadyRegistered(true)
        setError('This email is already registered in the system.')
      } else {
        setError(message)
      }
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Submit form data
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    // Quick validation
    if (!formData.firstName || !formData.lastName || !formData.sex || !formData.birthDate || !formData.contactNumber || !formData.address || !formData.program) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmittingForm(true)
    setError('')

    try {
      await submitApplicationDetails(applicationId, formData)
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.')
    } finally {
      setSubmittingForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* ── Left branded panel ────────────────────────────────── */}
      <div className="lg:w-[42%] relative overflow-hidden items-center justify-center bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-8 lg:p-16 flex flex-col">
        {/* Background grids and decorations */}
        <div
          className="absolute"
          style={{
            top: '-5%',
            right: '-10%',
            width: 480,
            height: 480,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%',
            left: '-5%',
            width: 380,
            height: 380,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div className="relative z-10 w-full max-w-md my-auto">
          {/* Logo */}
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

          <h2 className="font-sora text-3xl font-extrabold tracking-tight leading-tight mb-4 text-slate-100">
            Start Your Academic{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
              }}
            >
              Journey
            </span>{' '}
            With Us.
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Complete our digital enrollment application in just minutes. Fast, transparent, and completely paperless.
          </p>

          {/* Guidelines / Info steps */}
          <div className="flex flex-col gap-5 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            {[
              { num: '01', title: 'Verify Email', desc: 'Secure verification using a one-time passcode.' },
              { num: '02', title: 'Fill Information', desc: 'Personal details, address, and course selections.' },
              { num: '03', title: 'Track Status', desc: 'Instant application tracking number generated on completion.' }
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

          <div className="mt-8 flex items-center justify-between text-xs text-slate-500">
            <span>Need support? portal@cebucollege.edu</span>
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold no-underline flex items-center gap-1">
              Member Sign In <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-xl">
          {/* Main Error Alert */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 py-3 px-4 rounded-xl text-xs flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span className="font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Stepper */}
          {loadingAnnouncement ? (
            <div className="p-6">
              <FormSkeleton fields={3} isDark={true} />
            </div>
          ) : step === 'announcement' ? (
            /* STEP 1: WELCOME & ANNOUNCEMENT & EMAIL INPUT */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {!announcement || announcement.status !== 'Open' ? (
                <div className="text-center py-10 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                  <Clock size={48} className="mx-auto text-amber-500/70 mb-4" />
                  <h3 className="font-sora font-bold text-xl text-slate-200 mb-2">Enrollment is Closed</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                    Online enrollment applications are currently suspended or ended. Please check back later or contact the registrar's office.
                  </p>
                  <div className="flex justify-center">
                    <Link
                      to="/"
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all no-underline"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold mb-6 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Enrollment Period Open
                  </span>

                  <h1 className="font-sora font-extrabold text-3xl tracking-tight text-white mb-2">
                    Begin Application
                  </h1>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Apply for <span className="text-indigo-300 font-bold">{announcement.academicYear?.academicYearName}</span>. Let's start by verifying your email address.
                  </p>

                  <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Applicant Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          disabled={sendingOtp}
                          className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
                        Important: Make sure you have access to this email. We will use this to send your credentials once approved.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={sendingOtp}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Proceed</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    {isAlreadyRegistered && (
                      <div className="mt-4 text-center">
                        <p className="text-slate-400 text-xs mb-3">
                          This email is already registered.
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all no-underline"
                        >
                          Go to Login
                        </Link>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </motion.div>
          ) : step === 'otp' ? (
            /* STEP 2: OTP VERIFICATION */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <button
                onClick={() => setStep('announcement')}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold mb-6 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Change Email Address
              </button>

              <h1 className="font-sora font-extrabold text-3xl tracking-tight text-white mb-2">
                Enter Verification Code
              </h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                We sent a 6-digit verification code to <span className="text-slate-200 font-medium">{email}</span>.
              </p>

              <form onSubmit={handleVerifyAndStart} className="flex flex-col gap-6">
                <div>
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                    6-Digit Verification OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      maxLength={6}
                      pattern="\d{6}"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      disabled={verifyingOtp}
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-100 text-sm outline-none tracking-widest font-mono text-center transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-slate-500 text-[11px]">Expires in 5 minutes</span>
                    {countdown > 0 ? (
                      <span className="text-slate-500 text-xs">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-indigo-400 hover:text-indigo-300 bg-transparent border-none text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={verifyingOtp || otpCode.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Application</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {isAlreadyRegistered && (
                  <div className="mt-4 text-center">
                    <p className="text-slate-400 text-xs mb-3">
                      This email is already registered.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all no-underline"
                    >
                      Go to Login
                    </Link>
                  </div>
                )}
              </form>
            </motion.div>
          ) : step === 'form' ? (
            /* STEP 3: ENROLLMENT FORM WITH SECTION STEPS */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {/* Stepper bar inside form */}
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-5">
                {[
                  { sectionNum: 1, title: 'Personal Info', icon: <User size={14} /> },
                  { sectionNum: 2, title: 'Contact & Addr', icon: <Phone size={14} /> },
                  { sectionNum: 3, title: 'Program & Type', icon: <GraduationCap size={14} /> }
                ].map((s) => (
                  <div
                    key={s.sectionNum}
                    className={`flex items-center gap-2 pb-1.5 transition-all relative ${
                      formSection === s.sectionNum
                        ? 'text-indigo-400 font-bold border-b border-indigo-500'
                        : formSection > s.sectionNum
                        ? 'text-emerald-400 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      formSection === s.sectionNum
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : formSection > s.sectionNum
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-600'
                    }`}>
                      {s.sectionNum}
                    </span>
                    <span className="text-xs hidden sm:inline">{s.title}</span>
                  </div>
                ))}
              </div>

              {/* Form container */}
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                
                {/* FORM SECTION 1: PERSONAL INFORMATION */}
                {formSection === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="font-sora font-semibold text-lg text-slate-100 mb-1 flex items-center gap-2">
                      <User size={18} className="text-indigo-400" /> Personal Information
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">First Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="e.g. John"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Middle Name (Optional)</label>
                        <input
                          type="text"
                          value={formData.middleName}
                          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                          placeholder="e.g. A."
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-2">Last Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Doe"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Sex <span className="text-red-400">*</span></label>
                        <select
                          required
                          value={formData.sex}
                          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Birth Date <span className="text-red-400">*</span></label>
                        <input
                          type="date"
                          required
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Civil Status</label>
                        <select
                          value={formData.civilStatus}
                          onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Nationality</label>
                        <input
                          type="text"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.firstName && formData.lastName && formData.sex && formData.birthDate) {
                            setError('')
                            setFormSection(2)
                          } else {
                            setError('Please fill in all required fields.')
                          }
                        }}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Next Step <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FORM SECTION 2: CONTACT & ADDRESS */}
                {formSection === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="font-sora font-semibold text-lg text-slate-100 mb-1 flex items-center gap-2">
                      <Phone size={18} className="text-indigo-400" /> Contact & Address
                    </h3>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-2">Contact Number <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                          type="tel"
                          required
                          value={formData.contactNumber}
                          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                          placeholder="e.g. 09123456789"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3.5 pl-11 pr-4 text-slate-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-2">Home Address <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-slate-500" size={16} />
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter your complete home address"
                          rows={4}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-100 text-sm outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormSection(1)}
                        className="px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-transparent text-slate-300 hover:text-slate-100 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.contactNumber && formData.address) {
                            setError('')
                            setFormSection(3)
                          } else {
                            setError('Please fill in all required fields.')
                          }
                        }}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Next Step <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FORM SECTION 3: ACADEMIC CHOICE & STUDENT TYPE */}
                {formSection === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="font-sora font-semibold text-lg text-slate-100 mb-1 flex items-center gap-2">
                      <GraduationCap size={18} className="text-indigo-400" /> Academic Choice
                    </h3>

                    {loadingPrograms ? (
                      <div className="text-center py-8 text-slate-500 flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-indigo-400" size={16} />
                        <span>Loading active programs...</span>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-2">Preferred Academic Program <span className="text-red-400">*</span></label>
                        <select
                          required
                          value={formData.program}
                          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                        >
                          <option value="">Select a Program</option>
                          {programs.filter(p => p.status === 'Active').map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.programName} ({p.programCode})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-2">Student Classification</label>
                      <select
                        value={formData.studentType}
                        onChange={(e) => setFormData({ ...formData, studentType: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 text-sm outline-none transition-all"
                      >
                        <option value="Regular">Regular (New Freshman)</option>
                        <option value="Irregular">Irregular</option>
                        <option value="Transferee">Transferee</option>
                        <option value="Returnee">Returnee</option>
                      </select>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormSection(2)}
                        className="px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-transparent text-slate-300 hover:text-slate-100 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submittingForm}
                        className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                      >
                        {submittingForm ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <CheckCircle2 size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          ) : (
            /* STEP 4: SUCCESS CONFIRMATION & STATUS TIMELINE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>

              <h1 className="font-sora font-extrabold text-3xl tracking-tight text-white mb-2">
                Application Submitted!
              </h1>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                Thank you. Your enrollment application has been logged. Please take note of your application details below.
              </p>

              {/* Application Details Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tracking Number</span>
                  <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">Active</span>
                </div>
                <div className="text-slate-100 font-mono font-extrabold text-2xl tracking-widest text-center select-all py-1 bg-slate-950/40 border border-slate-800 rounded-xl mb-4">
                  {applicationNumber}
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">Applicant Email:</span>
                  <span className="text-slate-300 font-medium">{email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Program Applied:</span>
                  <span className="text-slate-300 font-medium">
                    {programs.find(p => p._id === formData.program)?.programName || 'Preferred Program'}
                  </span>
                </div>
              </div>

              {/* Tracking Status Timeline */}
              <div className="max-w-md mx-auto text-left mb-10">
                <h4 className="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-5 pl-2">
                  Application Progress
                </h4>
                <div className="flex flex-col gap-6 pl-4 border-l border-slate-800 relative">
                  {[
                    { title: 'Email Verification', desc: 'Email address validated via OTP passcode.', done: true },
                    { title: 'Information Submitted', desc: 'Application form details successfully uploaded.', done: true },
                    { title: 'Registrar Review', desc: 'Registrar is checking academic capacity and prerequisites.', current: true },
                    { title: 'Admission Credentials', desc: 'Verification welcome email with user login sent.', future: true }
                  ].map((t, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <span className={`absolute -left-[25px] top-0 w-[17px] h-[17px] rounded-full border flex items-center justify-center ${
                        t.done
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : t.current
                          ? 'bg-indigo-600 border-indigo-400 text-slate-100 animate-pulse'
                          : 'bg-slate-950 border-slate-800'
                      }`}>
                        {t.done && <CheckCircle2 size={10} />}
                        {t.current && <Clock size={10} />}
                      </span>
                      <div className="pl-3">
                        <h5 className={`font-semibold text-xs uppercase tracking-wider m-0 mb-1 ${
                          t.done ? 'text-slate-300' : t.current ? 'text-indigo-400' : 'text-slate-500'
                        }`}>
                          {t.title}
                        </h5>
                        <p className="text-slate-500 text-xs m-0 leading-relaxed">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done and Track buttons */}
              <div className="flex justify-center gap-3 flex-wrap">
                <Link
                  to={`/track?number=${applicationNumber}`}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all no-underline inline-flex items-center gap-2 shadow-[0_0_16px_rgba(99,102,241,0.3)]"
                >
                  <span>Track Application Status</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-semibold text-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all no-underline inline-block"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnrollmentForm
