import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKey";
import { getStudents, createStudent, deleteStudent, assignSection } from "../services/student.service";

const useStudents = () => {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: QUERY_KEYS.STUDENTS,
    queryFn: getStudents,
  });

  const students = Array.isArray(data) ? data : data?.data ?? [];

  const invalidateStudents = useCallback(
    () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS }),
    [queryClient]
  );

  const addStudentMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: invalidateStudents,
  });

  const removeStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: invalidateStudents,
  });

  const assignSectionMutation = useMutation({
    mutationFn: ({ studentId, sectionId }) => assignSection(studentId, sectionId),
    onSuccess: invalidateStudents,
  });

  const addStudent = useCallback(async (formData) => {
    try {
      const newStudent = await addStudentMutation.mutateAsync(formData);
      return { success: true, data: newStudent };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, [addStudentMutation]);

  const removeStudent = useCallback(async (id) => {
    try {
      await removeStudentMutation.mutateAsync(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, [removeStudentMutation]);

  const updateStudentSection = useCallback(async (studentId, sectionId) => {
    try {
      const response = await assignSectionMutation.mutateAsync({ studentId, sectionId });
      return { success: true, data: response?.data || response };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, [assignSectionMutation]);

  const batchUpdateSections = useCallback(async (studentIds, sectionId) => {
    const promises = studentIds.map(id =>
      assignSection(id, sectionId)
        .then(res => ({ studentId: id, success: true, data: res.data }))
        .catch(err => ({ studentId: id, success: false, error: err.response?.data?.message || err.message }))
    );

    const results = await Promise.allSettled(promises);

    const successful = [];
    const failed = [];

    results.forEach((result, idx) => {
      if (result.status === "fulfilled" && result.value.success) {
        successful.push(result.value);
      } else {
        failed.push({ studentId: studentIds[idx], error: result.value?.error || "Unknown error" });
      }
    });

    if (successful.length > 0) {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS });
    }

    return { successful, failed };
  }, [queryClient]);

  const submitting =
    addStudentMutation.isPending ||
    removeStudentMutation.isPending ||
    assignSectionMutation.isPending;

  return {
    students,
    loading,
    submitting,
    addStudent,
    removeStudent,
    updateStudentSection,
    batchUpdateSections,
  };
};

export default useStudents;