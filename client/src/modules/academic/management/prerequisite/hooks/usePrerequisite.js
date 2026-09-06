import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getPrerequisite, createPrerequisite, updatePrerequisite, deactivatePrerequisite } from "../services/prerequisite.services";

const usePrerequisite = () => {

    const queryClient = useQueryClient();

    const {
        data: prerequisites = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.PREREQUISITES,
        queryFn: getPrerequisite,
    });

    const refreshPrerequisites = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREREQUISITES }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createPrerequisite,
        onSuccess: refreshPrerequisites,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updatePrerequisite(id, data),
        onSuccess: refreshPrerequisites,
    });

    const deactivate = useMutation({
        mutationFn: deactivatePrerequisite,
        onSuccess: refreshPrerequisites,
    });

    return {
        prerequisites,
        loading,
        refreshPrerequisites,
        create,
        update,
        deactivate,
    };
};

export default usePrerequisite;
