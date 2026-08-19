import api from "../../../../../services/api";

export const getCurriculumSubject = async (curriculumId) => {
    const { data } = await api.get(`/curriculum/${curriculumId}/subjects`);
    return data;
};

export const getCurriculumStructure = async (curriculumId) => {
    const { data } = await api.get(`/curriculum/${curriculumId}/structure`);
    return data;
};

export const autoStructureCurriculum = async (curriculumId, subjectGroups) => {
    const { data } = await api.post(`/curriculum/${curriculumId}/structure`, subjectGroups);
    return data;
};

export const addCurriculumSubject = async (curriculumId, formData) => {
    const payload = { ...formData, curriculumId };
    const { data } = await api.post(`/curriculum/${curriculumId}/subjects`, payload);
    return data;
};

export const updateCurriculumSubject = async (id, formData) => {
    const { data } = await api.put(`/curriculum/subjects/${id}`, formData);
    return data;
};

export const deleteCurriculumSubject = async (id) => {
    const { data } = await api.delete(`/curriculumsubject/${id}`);
    return data;
};

export const bulkAddCurriculumSubject = async (curriculumId, payload) => {
    const { data } = await api.post(`/curriculum/${curriculumId}/bulk`, payload);
    return data;
};