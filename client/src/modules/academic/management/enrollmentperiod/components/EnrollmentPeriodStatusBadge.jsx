const styles = {

    Draft: {
        background: "#FEF3C7",
        color: "#92400E",
    },

    Published: {
        background: "#DBEAFE",
        color: "#1D4ED8",
    },

    Open: {
        background: "#DCFCE7",
        color: "#166534",
    },

    Closed: {
        background: "#FEE2E2",
        color: "#991B1B",
    },

    Archived: {
        background: "#E5E7EB",
        color: "#4B5563",
    },

};

const EnrollmentPeriodStatusBadge = ({
    status,
}) => {

    const style =
        styles[status] ||
        styles.Draft;

    return (

        <span
            style={{
                padding: "5px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                display: "inline-flex",
                ...style,
            }}
        >
            {status}
        </span>

    );

};

export default EnrollmentPeriodStatusBadge;