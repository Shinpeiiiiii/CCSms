const colors = {
    Draft: {
        bg: "#F1F3F4",
        color: "#5F6368",
    },

    Published: {
        bg: "#E6F4EA",
        color: "#188038",
    },

    Archived: {
        bg: "#FCE8E6",
        color: "#D93025",
    },
};

const StatusBadge = ({ status }) => {
    const style = colors[status] || colors.Draft;

    return (
        <span
            style={{
                padding: "4px 12px",
                borderRadius: 999,
                background: style.bg,
                color: style.color,
                fontWeight: 600,
                fontSize: 12,
            }}
        >
            {status}
        </span>
    );
};

export default StatusBadge;