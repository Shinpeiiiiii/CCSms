import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKey";
import { getSection } from "../../academic/management/section/services/section.services";
import api from "../../../services/api";

const useFilterMetadata = () => {

  const queryClient = useQueryClient();

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: QUERY_KEYS.DEPARTMENTS,
    queryFn: async () => {
      const res = await api.get("/department").catch(() => ({ data: [] }));
      return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    },
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: QUERY_KEYS.PROGRAMS,
    queryFn: async () => {
      const res = await api.get("/program").catch(() => ({ data: [] }));
      return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    },
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: QUERY_KEYS.SECTIONS,
    queryFn: async () => {
      const res = await getSection().catch(() => []);
      return Array.isArray(res) ? res : res?.data ?? [];
    },
  });

  const refreshSections = useCallback(
    () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECTIONS }),
    [queryClient]
  );

  const loading = {
    departments: departmentsLoading,
    programs: programsLoading,
    sections: sectionsLoading,
  };

  return { departments, programs, sections, loading, refreshSections };
};

export default useFilterMetadata;