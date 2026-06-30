function StatsCard({
    label,
    count,
    color,
    bg,
}) {
    return(
        <div className="rounded-2xl p-5 flex flex-col gap-1" style={{background: bg,border: `1px solid ${color}25`,}}>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                {label}
            </span>

            <span className="text-3xl font-bold" style={{color}}>
                {count}
            </span>
        </div>
    );
}

export default StatsCard;