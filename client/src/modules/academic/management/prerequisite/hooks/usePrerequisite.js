import { useEffect, useState } from "react";

import {
    getPrerequisite,
} from "../services/prerequisite.services";

const usePrerequisite = () => {

    const [prerequisites, setPrerequisites] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadPrerequisites = async () => {

        try {

            const data = await getPrerequisite();

            setPrerequisites(data);

        }

        catch (error) {

            console.error(
                "Failed to load prerequisites:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPrerequisites();

    }, []);

    return {

        prerequisites,

        loading,

        refreshPrerequisites: loadPrerequisites,

    };

};

export default usePrerequisite;