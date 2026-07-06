import { Loader2 } from "lucide-react";

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
            <Loader2 
                size={36} 
                style={{ 
                    color: '#1A73E8',
                    animation: 'spin 1s linear infinite',
                }} 
            />

            <p
                style={{
                    marginTop: 16,
                    fontSize: '0.8125rem',
                    color: '#5F6368',
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