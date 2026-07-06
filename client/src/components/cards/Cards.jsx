const Card = ({
    title,
    subtitle,
    children,
    actions,
}) => {
    return (
        <div
            style={{
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.05)',
            }}
        >
            {(title || subtitle || actions) && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '24px 24px 20px',
                        borderBottom: '1px solid #E8EAED',
                    }}
                >
                    <div>
                        {title && (
                            <h2
                                style={{
                                    fontFamily: 'Sora, sans-serif',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: '#202124',
                                    letterSpacing: '-0.01em',
                                    margin: 0,
                                }}
                            >
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#5F6368',
                                    marginTop: 4,
                                    marginRight: 0,
                                    marginBottom: 0,
                                    marginLeft: 0,
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