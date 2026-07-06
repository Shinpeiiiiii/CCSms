import { useEffect, useState, useCallback } from "react";

import {
    getCurriculumSubject,
} from "../services/curriculumsubject.services";

const useCurriculumSubject = (curriculumId) => {

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadSubjects = useCallback(async () => {

        try {
            setLoading(true);

            const data =
                await getCurriculumSubject(curriculumId);

            const normalized = Array.isArray(data)
                ? data
                : data?.curriculumSubjects || data?.subjects || [];

            setSubjects(normalized);

        } catch (error) {

            console.error(error);
            setSubjects([]);

        } finally {

            setLoading(false);

        }

    }, [curriculumId]);

    useEffect(() => {

        if (!curriculumId) return;

        let isMounted = true;

        const fetchSubjects = async () => {
            await loadSubjects();
            if (!isMounted) return;
        };

        fetchSubjects();

        return () => {
            isMounted = false;
        };

    }, [curriculumId, loadSubjects]);

    return {

        subjects,

        loading,

        refreshSubjects: loadSubjects,

    };

};

export default useCurriculumSubject;