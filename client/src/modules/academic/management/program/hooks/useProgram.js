import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getProgram } from "../services/program.services";

const useProgram = () => {

    const queryClient = useQueryClient();

    const {
        data: programs = [],
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: QUERY_KEYS.PROGRAMS,
        queryFn: getProgram,
    });

    const refreshPrograms = () =>
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROGRAMS });

    return {
        programs,
        loading,
        refreshPrograms,
        refetch,
    };
};

export default useProgram;
