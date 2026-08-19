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
                padding: '48px 24px',
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderTop: 'none',
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#E8F0FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1A73E8',
                    marginBottom: 16,
                }}
            >
                <Inbox size={22} />
            </div>

            <h3
                style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#202124',
                    marginBottom: 4,
                    margin: '0 0 4px 0',
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