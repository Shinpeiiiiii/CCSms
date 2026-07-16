const statusStyles = {

    Draft: {
        background: "#FEF3C7",
        color: "#92400E",
    },

    Active: {
        background: "#DCFCE7",
        color: "#166534",
    },

    Archived: {
        background: "#E5E7EB",
        color: "#4B5563",
    },

};

const SectionStatusBadge = ({ status }) => {

    const style =
        statusStyles[status] ||
        statusStyles.Draft;

    return (

        <span
            style={{
                padding: "5px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                ...style,
            }}
        >
            {status}
        </span>

    );

};

export default SectionStatusBadge;