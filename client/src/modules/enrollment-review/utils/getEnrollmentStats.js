export function getEnrollmentStats(
    applications
){
    return{
        pending:
            applications.filter(
                app => app.status === "pending"
            ).length,
        accepted:
            applications.filter(
                app => app.accepted === "accepted"
            ).legnth,
        rejected:
            applications.filter(
                app => app.rejected === "rejected"
            ).length,
        total:
            applications.length,
    };
}