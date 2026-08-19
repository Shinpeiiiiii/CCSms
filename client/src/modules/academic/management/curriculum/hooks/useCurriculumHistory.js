import { useEffect ,useState } from "react";

import { getCurriculumHistory } from "../services/curriculum.services";

const useCurriculumHistory = (curriculumId, isOpen) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        if(!curriculumId){
            setHistory([]);
            setLoading(false);
            return;
        }

        try{
            const data = await getCurriculumHistory(curriculumId);
            setHistory(data);
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        if(isOpen && curriculumId){
            loadHistory();

        }
    }, [curriculumId, isOpen]);

    return{
        history, loading, referenceHistory: loadHistory,
    };
       

    
};


export default useCurriculumHistory;