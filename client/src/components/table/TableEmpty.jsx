const TableEmpty = ({
    message = "No records found.",
}) => {

    return (

        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18,
            }}
        >

            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366F1',
                    marginBottom: 20,
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 7h18M6 11h12M8 15h8" />
                </svg>
            </div>

            <h3
                style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#F1F5F9',
                    marginBottom: 6,
                }}
            >
                Nothing Found
            </h3>

            <p
                style={{
                    fontSize: '0.8125rem',
                    color: '#475569',
                }}
            >
                {message}
            </p>

        </div>

    )

}

export default TableEmpty