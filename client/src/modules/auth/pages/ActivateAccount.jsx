import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '@/services/api'
import DashboardLayout from '@/shared/layouts/DashboardLayout'

const ActivateAccount = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(token ? '' : 'Invalid activation link. Please request a new invitation.')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            await api.post('/accounts/activate', { token, password })
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Activation failed. The link may have expired.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <DashboardLayout>
                <div style={{
                    maxWidth: 480,
                    margin: '80px auto',
                    padding: 40,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'rgba(217,48,37,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D93025" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#F1F5F9',
                        marginBottom: 8,
                    }}>
                        Invalid Activation Link
                    </h2>
                    <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>
                        This activation link is invalid or has expired. Please contact your administrator for a new invitation.
                    </p>
                </div>
            </DashboardLayout>
        )
    }

    if (success) {
        return (
            <DashboardLayout>
                <div style={{
                    maxWidth: 480,
                    margin: '80px auto',
                    padding: 40,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'rgba(16,185,129,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#F1F5F9',
                        marginBottom: 8,
                    }}>
                        Account Activated!
                    </h2>
                    <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>
                        Your account has been activated successfully. You can now log in with your email and password.
                    </p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div style={{
                maxWidth: 480,
                margin: '80px auto',
                padding: 40,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#F1F5F9',
                        marginBottom: 8,
                    }}>
                        Activate Your Account
                    </h2>
                    <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>
                        Set your password to complete your account setup and access the portal.
                    </p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: 20,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'rgba(217,48,37,0.08)',
                        border: '1px solid rgba(217,48,37,0.2)',
                        color: '#FCA5A5',
                        fontSize: 13,
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            color: '#94A3B8',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.09)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#000000',
                                fontSize: 14,
                                outline: 'none',
                                fontFamily: 'Inter, sans-serif',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            color: '#94A3B8',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Confirm your password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.09)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#000000',
                                fontSize: 14,
                                outline: 'none',
                                fontFamily: 'Inter, sans-serif',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: 8,
                            background: loading
                                ? 'rgba(99,102,241,0.35)'
                                : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                            border: 'none',
                            padding: '14px',
                            borderRadius: 12,
                            fontWeight: 600,
                            fontSize: 15,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.25)',
                            fontFamily: 'Inter, sans-serif',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.25s ease',
                        }}
                    >
                        {loading ? (
                            <>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    style={{ animation: 'spin 1s linear infinite' }}
                                >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Activating...
                            </>
                        ) : (
                            'Activate Account'
                        )}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default ActivateAccount
