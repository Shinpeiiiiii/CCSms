import { useEffect, useState } from "react";

import { getSubjectHistory } from "../services/subject.services";

const useSubjectHistory = (subjectId, isOpen) => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);


    const loadHistory = async () => {
        if(!subjectId){
            setHistory([]);
            setLoading(false);
            return;
        }

        try {

            const data = await getSubjectHistory(subjectId);
            setHistory(data);
        }catch(error){
            console.error(error)
        }
        finally {
            setLoading(false);
        }

    };
    useEffect(() => {

        if (isOpen && subjectId) {
            loadHistory();

        }
    }, [subjectId, isOpen]);

    

    return {

        history,

        loading,

        referenceHistory: loadHistory,

    };

};

export default useSubjectHistory;