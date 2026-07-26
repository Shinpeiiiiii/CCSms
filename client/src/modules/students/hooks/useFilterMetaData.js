// hooks/useFilterMetadata.js
import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { getSection } from '../../academic/management/section/services/section.services';



const useFilterMetadata = () => {
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState({ departments: false, programs: false, sections: false });

  const fetchAll = useCallback(async () => {
    setLoading({ departments: true, programs: true, sections: true });
    
    try {
      const [deptRes, progRes, secRes] = await Promise.all([
        api.get('/department').catch(() => ({ data: [] })),
        api.get('/program').catch(() => ({ data: [] })),
        getSection().catch(() => [])
      ]);

      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.data ?? []);
      setPrograms(Array.isArray(progRes.data) ? progRes.data : progRes.data?.data ?? []);
      setSections(Array.isArray(secRes) ? secRes : secRes?.data ?? []);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    } finally {
      setLoading({ departments: false, programs: false, sections: false });
    }
  }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const refreshSections = useCallback(async () => {
        setLoading((prev) => ({ ...prev, sections: true }));
        try {
            const secRes = await getSection().catch(() => []);
            setSections(Array.isArray(secRes) ? secRes : secRes?.data ?? []);
        } catch (err) {
            console.error('Failed to refresh sections:', err);
        } finally {
            setLoading((prev) => ({ ...prev, sections: false }));
        }
    }, []);

    return { departments, programs, sections, loading, refreshSections };
};

export default useFilterMetadata;