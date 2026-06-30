import StatsCard from "../../../shared/components/StatsCard";

function EnrollmentStats({
    pending,
    accepted,
    rejected,
    total,
}) {
    return(
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard label= "Pending Review" count={pending} color= "#FBBF24" bg="rgba(251,191,36,0.06)" />
            <StatsCard label= "Accepted Students" count={accepted} color= "#34D399" bg="rgba(52,211,153,0.06)" />
            <StatsCard label= "Rejected Applications" count={rejected} color= "#F8771" bg="rgba(248,113,113,0.06)" />
            <StatsCard label= "Total Submitted" count={total} color= "#818CF8" bg="rgba(129,140,248,0.06)" />

        </div>
    )
}

export default EnrollmentStats;