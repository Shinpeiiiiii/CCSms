// hooks/useStudents.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getStudents, createStudent, deleteStudent, assignSection } from '../services/student.service';
import { getSection } from '../../academic/management/section/services/section.services';
import api from '../../../services/api';

const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const abortRef = useRef(new AbortController());

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents({ signal: abortRef.current.signal });
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setStudents(list);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch students:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = useCallback(async (formData) => {
    setSubmitting(true);
    try {
      const newStudent = await createStudent(formData);
      if (newStudent) {
        setStudents(prev => [newStudent, ...prev]);
        return { success: true, data: newStudent };
      }
      return { success: false, error: 'No data returned' };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setSubmitting(false);
    }
  }, []);

  const removeStudent = useCallback(async (id) => {
    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, []);

  const updateStudentSection = useCallback(async (studentId, sectionId) => {
    try {
      const response = await assignSection(studentId, sectionId);
      if (response?.success) {
        setStudents(prev => prev.map(item => 
          item._id === studentId 
            ? { ...item, section: response.data?.section, yearLevel: response.data?.yearLevel }
            : item
        ));
        return { success: true, data: response.data };
      }
      return { success: false, error: response?.message || 'Failed to assign section' };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }, []);

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
      if (result.status === 'fulfilled' && result.value.success) {
        successful.push(result.value);
      } else {
        failed.push({ studentId: studentIds[idx], error: result.value?.error || 'Unknown error' });
      }
    });

    // Optimistic update for successful ones
    if (successful.length > 0) {
      const updateMap = new Map(successful.map(r => [r.studentId, r.data]));
      setStudents(prev => prev.map(item => {
        if (updateMap.has(item._id)) {
          const updated = updateMap.get(item._id);
          return { ...item, section: updated.section, yearLevel: updated.yearLevel };
        }
        return item;
      }));
    }

    return { successful, failed };
  }, []);

  useEffect(() => {
    fetchStudents();
    return () => abortRef.current.abort();
  }, [fetchStudents]);

  return {
    students,
    loading,
    submitting,
    fetchStudents,
    addStudent,
    removeStudent,
    updateStudentSection,
    batchUpdateSections
  };
};

export default useStudents;