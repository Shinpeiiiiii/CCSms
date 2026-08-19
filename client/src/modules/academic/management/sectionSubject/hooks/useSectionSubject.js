import { useEffect, useState, useCallback } from "react";

import { getSectionSubjects } from "../services/sectionsubject.services";

const useSectionSubject = (sectionId) => {

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadSubjects = useCallback(async () => {
        console.log('Triggered');
        if (!sectionId) {
            setSubjects([]);
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const data = await getSectionSubjects(sectionId);
            console.log("data:", data?.data);
            setSubjects(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error("Failed to load section subjects:", error);
            setSubjects([]);

        } finally {
            setLoading(false);
        }

    }, [sectionId]);

    useEffect(() => {

        loadSubjects();

    }, [loadSubjects]);

    return {

        subjects,

        loading,

        refreshSubjects: loadSubjects,

    };

};

export default useSectionSubject;
