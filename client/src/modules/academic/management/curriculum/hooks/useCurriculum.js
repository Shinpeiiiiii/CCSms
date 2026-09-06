import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getCurriculum, publishCurriculum as publishCurriculumService, archiveCurriculum as archiveCurriculumService } from "../services/curriculum.services";

const useCurriculum = () => {

    const queryClient = useQueryClient();

    const {
        data: curriculum = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.CURRICULUMS,
        queryFn: getCurriculum,
    });

    const refreshCurriculums = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRICULUMS }),
        [queryClient]
    );

    const publishCurriculum = useMutation({
        mutationFn: publishCurriculumService,
        onSuccess: refreshCurriculums,
    });

    const archiveCurriculum = useMutation({
        mutationFn: archiveCurriculumService,
        onSuccess: refreshCurriculums,
    });

    return {
        curriculum,
        loading,
        refreshCurriculums,
        publishCurriculum,
        archiveCurriculum,
    };
};

export default useCurriculum;
