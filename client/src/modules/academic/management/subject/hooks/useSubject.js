import { useEffect, useState } from "react";

import { getSubject } from "../services/subject.services";

const useSubject = () => {

    const [subject, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadSubjects = async () => {

        try {

            const data = await getSubject();

            setSubjects(data);

        }

        catch (error) {

            console.error(
                "Failed to load subjects:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSubjects();

    }, []);

    return {

        subject,

        loading,

        refreshSubjects: loadSubjects,

    };

};


export default useSubject;