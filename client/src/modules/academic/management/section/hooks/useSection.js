import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../constants/queryKey";
import { getSection, createSection, updateSection, openSection, closeSection, archiveSection } from "../services/section.services";

const useSection = () => {

    const queryClient = useQueryClient();

    const {
        data: sections = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.SECTIONS,
        queryFn: getSection,
        refetchOnWindowFocus: true,
    });

    const refreshSections = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTIONS }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createSection,
        onSuccess: refreshSections,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateSection(id, data),
        onSuccess: refreshSections,
    });

    const open = useMutation({
        mutationFn: openSection,
        onSuccess: refreshSections,
    });

    const close = useMutation({
        mutationFn: closeSection,
        onSuccess: refreshSections,
    });

    const archive = useMutation({
        mutationFn: archiveSection,
        onSuccess: refreshSections,
    });

    return {
        sections,
        loading,
        refreshSections,
        create,
        update,
        open,
        close,
        archive,
    };
};

export default useSection;
