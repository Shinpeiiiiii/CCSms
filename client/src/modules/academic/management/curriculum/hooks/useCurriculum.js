import { useEffect, useState } from "react";

import { getCurriculum } from "../services/curriculum.services";

const useCurriculum = () => {

    const [curriculum, setCurriculum] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadCurriculums = async () => {

        try {

            const data = await getCurriculum();

            setCurriculum(data);

        }

        catch (error) {

            console.error(
                "Failed to load curriculums:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadCurriculums();

    }, []);

    return {

        curriculum,

        loading,

        refreshCurriculums: loadCurriculums,

    };

};

export default useCurriculum;