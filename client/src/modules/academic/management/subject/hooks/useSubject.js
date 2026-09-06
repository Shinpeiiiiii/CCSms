import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getSubject, createSubject, updateSubject, deleteSubject } from "../services/subject.services";

const useSubject = () => {

    const queryClient = useQueryClient();

    const {
        data: subject = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.SUBJECTS,
        queryFn: getSubject,
    });

    const refreshSubjects = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBJECTS }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createSubject,
        onSuccess: refreshSubjects,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateSubject(id, data),
        onSuccess: refreshSubjects,
    });

    const remove = useMutation({
        mutationFn: deleteSubject,
        onSuccess: refreshSubjects,
    });

    return {
        subject,
        loading,
        refreshSubjects,
        create,
        update,
        remove,
    };
};

export default useSubject;
