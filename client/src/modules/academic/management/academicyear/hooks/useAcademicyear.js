import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getAcademicYear, createAcademicYear, updateAcademicYear, deleteAcademicYear } from "../services/academicyear.services";

const useAcademicYear = () => {

    const queryClient = useQueryClient();

    const {
        data: academicYear = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.ACADEMIC_YEARS,
        queryFn: getAcademicYear,
    });

    const refreshAcademicYears = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACADEMIC_YEARS }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createAcademicYear,
        onSuccess: refreshAcademicYears,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateAcademicYear(id, data),
        onSuccess: refreshAcademicYears,
    });

    const remove = useMutation({
        mutationFn: deleteAcademicYear,
        onSuccess: refreshAcademicYears,
    });

    return {
        academicYear,
        loading,
        refreshAcademicYears,
        create,
        update,
        remove,
    };
};

export default useAcademicYear;
