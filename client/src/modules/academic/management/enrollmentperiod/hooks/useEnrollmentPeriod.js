import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getEnrollmentPeriods, createEnrollmentPeriod, updateEnrollmentPeriod, publishEnrollmentPeriod, openEnrollmentPeriod, closeEnrollmentPeriod, archiveEnrollmentPeriod } from "../services/enrollmentPeriodService";

const useEnrollmentPeriod = () => {

    const queryClient = useQueryClient();

    const {
        data: enrollmentPeriods = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.ENROLLMENT_PERIODS,
        queryFn: getEnrollmentPeriods,
    });

    const refreshEnrollmentPeriods = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENT_PERIODS }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createEnrollmentPeriod,
        onSuccess: refreshEnrollmentPeriods,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateEnrollmentPeriod(id, data),
        onSuccess: refreshEnrollmentPeriods,
    });

    const publish = useMutation({
        mutationFn: publishEnrollmentPeriod,
        onSuccess: refreshEnrollmentPeriods,
    });

    const open = useMutation({
        mutationFn: openEnrollmentPeriod,
        onSuccess: refreshEnrollmentPeriods,
    });

    const close = useMutation({
        mutationFn: closeEnrollmentPeriod,
        onSuccess: refreshEnrollmentPeriods,
    });

    const archive = useMutation({
        mutationFn: archiveEnrollmentPeriod,
        onSuccess: refreshEnrollmentPeriods,
    });

    return {
        enrollmentPeriods,
        loading,
        refreshEnrollmentPeriods,
        create,
        update,
        publish,
        open,
        close,
        archive,
    };
};

export default useEnrollmentPeriod;
