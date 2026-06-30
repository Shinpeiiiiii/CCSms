const Card = ({
    title,
    subtitle,
    children,
    actions,
}) => {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18,
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
            }}
        >
            {(title || subtitle || actions) && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '24px 24px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <div>
                        {title && (
                            <h2
                                style={{
                                    fontFamily: 'Sora, sans-serif',
                                    fontSize: '1.375rem',
                                    fontWeight: 700,
                                    color: '#F1F5F9',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#475569',
                                    marginTop: 4,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div>
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div style={{ padding: 24 }}>
                {children}
            </div>
        </div>
    )
}

export default Card