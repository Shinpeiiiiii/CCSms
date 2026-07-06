import { useEffect, useState } from "react";
import { getProgram } from "../services/program.services";

const useProgram = () => {

    const [programs, setPrograms] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadPrograms = async () => {

        try {

            const data = await getProgram();

            setPrograms(data);

        } catch (error) {

            console.error("Failed to load programs:", error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPrograms();

    }, []);

    return {

        programs,

        loading,

        refreshPrograms: loadPrograms,

    };

};

export default useProgram;