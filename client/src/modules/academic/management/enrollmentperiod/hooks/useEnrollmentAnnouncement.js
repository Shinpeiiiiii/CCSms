import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getEnrollmentAnnouncement } from "../services/enrollmentPeriodService";

const useEnrollmentAnnouncement = () => {
    const {
        data: announcement = null,
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.ENROLLMENT_ANNOUNCEMENT,
        queryFn: getEnrollmentAnnouncement,
    });

    return { announcement, loading };
};

export default useEnrollmentAnnouncement;
