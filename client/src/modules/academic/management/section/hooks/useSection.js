import { useEffect, useState } from "react";

import { getSection } from "../services/section.services";

const useSection = () => {

    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadSections = async () => {

        try {

            const data = await getSection();

            setSections(data);

        }

        catch (error) {

            console.error(
                "Failed to load sections:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSections();

        const handleFocus = () => {
            loadSections()
        }

        window.addEventListener('focus', handleFocus)

        return () => {

            window.removeEventListener('focus', handleFocus)

        };

    }, []);

    return {

        sections,

        loading,

        refreshSections: loadSections,

    };

};

export default useSection;