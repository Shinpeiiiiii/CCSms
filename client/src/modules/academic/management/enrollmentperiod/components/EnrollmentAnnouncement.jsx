import useEnrollmentAnnouncement from "../hooks/useEnrollmentAnnouncement";

const EnrollmentAnnouncement = () => {
    const {
        announcement, loading,
    } = useEnrollmentAnnouncement();

    if(loading)
        return null;
    if(!announcement)
        return null;

    return(
        <div className="bg-blue-600 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold">
                {announcement.status === "Open"
                    ? "🎉 Enrollment is Now Open!"
                    : "📢 Enrollment Opens Soon"}
            </h2>
            <p className="mt-2">
                {announcement.enrollmentPeriodName}
            </p>
            <p>
                Academic Year
                {" "}
                {announcement.academicYear?.academicYearName}
            </p>
            <p>
                {announcement.startDate}
                {" - "}
                {announcement.endDate}
            </p>
        </div>
    );
}
export default EnrollmentAnnouncement;