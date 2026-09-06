import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getSectionSubjects, generateSectionSubjects, deleteSectionSubject, updateSectionSubject } from "../services/sectionsubject.services";

const useSectionSubject = (sectionId) => {

    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.SECTION_SUBJECTS_BY_SECTION(sectionId),
        queryFn: () => getSectionSubjects(sectionId),
        enabled: !!sectionId,
    });

    const subjects = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

    const refreshSubjects = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTION_SUBJECTS_BY_SECTION(sectionId) }),
        [queryClient, sectionId]
    );

    const generate = useMutation({
        mutationFn: generateSectionSubjects,
        onSuccess: refreshSubjects,
    });

    const remove = useMutation({
        mutationFn: deleteSectionSubject,
        onSuccess: refreshSubjects,
    });

    const update = useMutation({
        mutationFn: ({ id, payload }) => updateSectionSubject(id, payload),
        onSuccess: refreshSubjects,
    });

    return {
        subjects,
        loading,
        refreshSubjects,
        generate,
        remove,
        update,
    };
};

export default useSectionSubject;
