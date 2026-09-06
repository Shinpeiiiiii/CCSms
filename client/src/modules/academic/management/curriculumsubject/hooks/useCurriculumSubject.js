import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getCurriculumSubject, addCurriculumSubject, updateCurriculumSubject, deleteCurriculumSubject, autoStructureCurriculum, bulkAddCurriculumSubject, renumberDisplayOrders } from "../services/curriculumsubject.services";

const useCurriculumSubject = (curriculumId) => {

    const queryClient = useQueryClient();

    const {
        data: subjects = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.CURRICULUM_SUBJECTS(curriculumId),
        queryFn: () => getCurriculumSubject(curriculumId),
        enabled: !!curriculumId,
    });

    const refreshSubjects = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRICULUM_SUBJECTS(curriculumId) }),
        [queryClient, curriculumId]
    );

    const add = useMutation({
        mutationFn: (formData) => addCurriculumSubject(curriculumId, formData),
        onSuccess: refreshSubjects,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateCurriculumSubject(id, data),
        onSuccess: refreshSubjects,
    });

    const remove = useMutation({
        mutationFn: deleteCurriculumSubject,
        onSuccess: refreshSubjects,
    });

    const structure = useMutation({
        mutationFn: (subjectGroups) => autoStructureCurriculum(curriculumId, subjectGroups),
        onSuccess: refreshSubjects,
    });

    const bulkAdd = useMutation({
        mutationFn: (payload) => bulkAddCurriculumSubject(curriculumId, payload),
        onSuccess: refreshSubjects,
    });

    const renumber = useMutation({
        mutationFn: () => renumberDisplayOrders(curriculumId),
        onSuccess: refreshSubjects,
    });

    return {
        subjects,
        loading,
        refreshSubjects,
        add,
        update,
        remove,
        structure,
        bulkAdd,
        renumber,
    };
};

export default useCurriculumSubject;
