function StatusBadge({ status }) {
    const cleanStatus = (status || "").toLowerCase();
    const styles = {
        pending: {
            bg: "bg-yellow-500/10",
            text: "text-yellow-400",
            border: "border-yellow-500/20",
        },
        approved: {
            bg: "bg-green-500/10",
            text: "text-green-400",
            border: "border-green-500/20",
        },
        accepted: {
            bg: "bg-green-500/10",
            text: "text-green-400",
            border: "border-green-500/20",
        },
        rejected: {
            bg: "bg-red-500/10",
            text: "text-red-400",
            border: "border-red-500/20",
        },
        "needs revision": {
            bg: "bg-orange-500/10",
            text: "text-orange-400",
            border: "border-orange-500/20",
        },
        "under review": {
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            border: "border-blue-500/20",
        }
    };

    const current = styles[cleanStatus] || styles.pending;

    return(
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${current.bg} ${current.text} ${current.border}`}>
            {status}
        </span>
    )
}

export default StatusBadge;