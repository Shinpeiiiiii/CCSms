function StatusBadge({ status }) {
    const styles = {
        pending: {
            bg: "bg-yellow-50/10",
            text: "text-yellow-300",
            border: "border-yellow-500/20",
        },

        accepted: {

        },
        
        rejected: {
            bg: "bg-red-500/10",
            text: "text-red-300",
            border: "border-red-500/20",
        },
    };

    const current = styles[status] || styles.pending;

    return(
        <span className= {`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${current.bg}${current.text}${current.border}`}>
            {status}
        </span>
    )
}

export default StatusBadge;