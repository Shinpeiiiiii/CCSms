const TableLoading = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 24px',
            }}
        >

            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '3px solid rgba(99,102,241,0.2)',
                    borderTopColor: '#6366F1',
                    animation: 'spin 0.8s linear infinite',
                }}
            />

            <p
                style={{
                    marginTop: 16,
                    fontSize: '0.8125rem',
                    color: '#475569',
                }}
            >
                Loading data...
            </p>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

        </div>
    )
}

export default TableLoading