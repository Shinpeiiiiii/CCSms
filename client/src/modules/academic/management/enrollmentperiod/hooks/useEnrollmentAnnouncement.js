import { useEffect, useState } from "react";
import { getEnrollmentAnnouncement } from "../services/enrollmentPeriodService";

const useEnrollmentAnnouncement = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const load = async () => {
            try{
                const data = await getEnrollmentAnnouncement();
                setAnnouncement(data);
            }finally{
                setLoading(false);
            }
        };

        load();
    }, [])
    return{announcement, loading};
};

export default useEnrollmentAnnouncement;