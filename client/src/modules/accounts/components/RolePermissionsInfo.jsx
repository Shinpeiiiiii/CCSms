const RolePermissionsInfo = () => {
    const roles = [
        { role: 'Teacher', color: '#6EE7B7', bg: 'rgba(16,185,129,0.1)', desc: 'View students, manage attendance, update grades' },
        { role: 'Registrar', color: '#93C5FD', bg: 'rgba(59,130,246,0.1)', desc: 'Review enrollment applications, manage student records' },
        { role: 'Admin', color: '#FCD34D', bg: 'rgba(245,158,11,0.1)', desc: 'Full access: all features + account management' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18,
                    padding: '24px',
                }}
            >
                <h3
                    style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#F1F5F9',
                        marginBottom: 16,
                    }}
                >
                    Role Permissions
                </h3>
                {roles.map(({ role, color, bg, desc }) => (
                    <div
                        key={role}
                        style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                            padding: '12px',
                            borderRadius: 12,
                            marginBottom: 8,
                            background: bg,
                        }}
                    >
                        <span
                            style={{
                                flexShrink: 0,
                                padding: '2px 10px',
                                borderRadius: 100,
                                background: `${color}20`,
                                color,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                marginTop: 1,
                            }}
                        >
                            {role}
                        </span>
                        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
                    </div>
                ))}
            </div>

            <div
                style={{
                    background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 16,
                    padding: '18px 20px',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                }}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ flexShrink: 0, marginTop: 2 }}
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>
                    Created accounts will receive an email invitation to activate their account and set
                    their password. The account cannot be used until activation is complete.
                </p>
            </div>
        </div>
    )
}

export default RolePermissionsInfo
