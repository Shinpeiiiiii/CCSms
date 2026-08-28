const STATUS_STYLES = {
    Active:   { backgroundColor: '#dcfce7', color: '#15803d' },
    Inactive: { backgroundColor: '#f3f4f6', color: '#6b7280' },
    Present:  { backgroundColor: '#dcfce7', color: '#15803d' },
    Absent:   { backgroundColor: '#fee2e2', color: '#dc2626' },
    Late:     { backgroundColor: '#fef3c7', color: '#d97706' },
    Excused:  { backgroundColor: '#dbeafe', color: '#2563eb' },
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || { backgroundColor: '#f3f4f6', color: '#6b7280' };

    return (
        <span style={{
            flexShrink: 0,
            fontSize: '0.75rem',
            fontWeight: '500',
            padding: '4px 10px',
            borderRadius: '9999px',
            ...style,
        }}>
            {status}
        </span>
    );
};

export default StatusBadge;
