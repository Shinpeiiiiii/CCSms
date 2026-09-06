import {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getApplications,
  updateApplicationStatus,
} from "../services/review.service";

import {
  getEnrollmentStats,
} from "../utils/getEnrollmentStats";

import {
  filterApplications,
} from "../utils/filterApplications";

import {
  QUERY_KEYS,
} from "@/constants/queryKey";

export default function
useEnrollmentReview() {

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] = useState("all");

  const queryClient =
    useQueryClient();

  const {
    data: applications = [],
    isLoading: loading,
  } = useQuery({
    queryKey: QUERY_KEYS.ENROLLMENT_APPLICATIONS,
    queryFn: getApplications,
    select: (data) =>
      Array.isArray(data) ? data : [],
  });

  const statusMutation =
    useMutation({
      mutationFn: ({
        id,
        status,
      }) => updateApplicationStatus(
        id,
        status
      ),
      onSuccess: (
        _res,
        {
          id,
          status,
        }
      ) => {
        queryClient.setQueryData(
          QUERY_KEYS.ENROLLMENT_APPLICATIONS,
          (old) =>
            Array.isArray(old)
              ? old.map((app) =>
                  app._id === id
                    ? {
                        ...app,
                        status,
                      }
                    : app
                )
              : old
        );
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ENROLLMENT_APPLICATIONS,
        });
      },
      onError: (err) => {
        console.error(err);
      },
    });

  function
  handleStatusUpdate(
    id,
    status
  ) {
    statusMutation.mutate({
      id,
      status,
    });
  }

  const filtered =
    useMemo(() => {
      return filterApplications(
        applications,
        search,
        activeTab
      );
    }, [
      applications,
      search,
      activeTab,
    ]);

  const stats =
    useMemo(() => {
      return getEnrollmentStats(
        applications
      );
    }, [applications]);

  return {
    applications,
    filtered,
    stats,
    loading,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    handleStatusUpdate,
  };
}