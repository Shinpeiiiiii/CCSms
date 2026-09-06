import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getCurriculumHistory } from "../services/curriculum.services";

const useCurriculumHistory = (curriculumId, isOpen) => {

    const queryClient = useQueryClient();

    const {
        data: history = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.CURRICULUM_HISTORY(curriculumId),
        queryFn: () => getCurriculumHistory(curriculumId),
        enabled: !!curriculumId && !!isOpen,
    });

    const referenceHistory = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRICULUM_HISTORY(curriculumId) }),
        [queryClient, curriculumId]
    );

    return {
        history,
        loading,
        referenceHistory,
    };
};

export default useCurriculumHistory;
