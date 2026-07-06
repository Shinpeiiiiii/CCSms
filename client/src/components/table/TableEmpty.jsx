import { Inbox } from "lucide-react";

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
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderRadius: 16,
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.05)',
            }}
        >
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: '#E8F0FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1A73E8',
                    marginBottom: 20,
                }}
            >
                <Inbox size={24} />
            </div>

            <h3
                style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#202124',
                    marginBottom: 6,
                    margin: '0 0 6px 0',
                }}
            >
                Nothing Found
            </h3>

            <p
                style={{
                    fontSize: '0.8125rem',
                    color: '#5F6368',
                    margin: 0,
                }}
            >
                {message}
            </p>
        </div>
    )
}

export default TableEmpty