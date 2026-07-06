import api from "../../../../../services/api";

export const getCurriculumSubject = async (curriculumId) => {
    const { data } = await api.get(`/curriculum/${curriculumId}/subjects`);
    return data;
};

export const getCurriculumSubjectById = async (curriculumId) => {
    const { data } = await api.get(`/curriculum/${curriculumId}`);
    return data;
};

export const addCurriculumSubject = async (curriculumId, formData) => {
    const payload = {
        ...formData,
        curriculumId,
    };
    console.log("Service curriculumID:",curriculumId);
    const { data } = await api.post(
        `/curriculum/${curriculumId}/subjects`,
        payload
    );

    return data;
};

export const updateCurriculumSubject = async (id, formData) => {
    const { data } = await api.put(
        `/curriculum/subjects/${id}`,
        formData
    );

    return data;
};

export const deleteCurriculumSubject = async (id) => {
    const { data } = await api.delete(
        `/curriculum/subjects/${id}`
    );

    return data;
};