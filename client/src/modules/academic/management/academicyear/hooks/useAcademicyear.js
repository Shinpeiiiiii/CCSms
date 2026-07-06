import { useEffect, useState } from "react";

import { getAcademicYear } from "../services/academicyear.services";

const useAcademicYear = () => {

    const [academicYear, setAcademicYears] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadAcademicYears = async () => {

        try {

            const data = await getAcademicYear();

            setAcademicYears(data);

        }

        catch (error) {

            console.error(
                "Failed to load academic years:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAcademicYears();

    }, []);

    return {

        academicYear,

        loading,

        refreshAcademicYears: loadAcademicYears,

    };

};

export default useAcademicYear;