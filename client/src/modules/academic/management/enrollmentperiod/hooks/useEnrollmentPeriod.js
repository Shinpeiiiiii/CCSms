import { useEffect, useState } from "react";

import {
    getEnrollmentPeriods,
} from "../services/enrollmentPeriodService";

const useEnrollmentPeriod = () => {

    const [enrollmentPeriods, setEnrollmentPeriods] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadEnrollmentPeriods = async () => {

        try {
            const data = await getEnrollmentPeriods();
            console.log("Enrollment Period API:", data);
            setEnrollmentPeriods(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadEnrollmentPeriods();
    }, []);
    return {

        enrollmentPeriods,

        loading,

        refreshEnrollmentPeriods:
            loadEnrollmentPeriods,

    };

};

export default useEnrollmentPeriod;