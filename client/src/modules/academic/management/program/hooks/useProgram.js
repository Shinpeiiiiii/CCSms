import { useEffect, useState } from "react";
import { getProgram } from "../services/program.services";

const useProgram = () => {
    const [programs, setProgram] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProgram = async () => {
        try{
            const data = await getProgram();
            setProgram(data);
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }

    };

    useEffect(() => {
        loadProgram();
    }, []);

    return{
        programs, loading, refreshPrograms: loadProgram,
    };
};

export default useProgram;