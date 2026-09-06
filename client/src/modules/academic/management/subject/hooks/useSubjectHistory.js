import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getSubjectHistory } from "../services/subject.services";

const useSubjectHistory = (subjectId, isOpen) => {

    const queryClient = useQueryClient();

    const {
        data: history = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.SUBJECT_HISTORY(subjectId),
        queryFn: () => getSubjectHistory(subjectId),
        enabled: !!subjectId && !!isOpen,
    });

    const referenceHistory = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECT_HISTORY(subjectId) }),
        [queryClient, subjectId]
    );

    return {
        history,
        loading,
        referenceHistory,
    };
};

export default useSubjectHistory;
