import api from '../../../services/api';

export const uploadMaterial = async (formData) => {
    const response = await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const addLinkMaterial = async (data) => {
    const response = await api.post('/materials/link', data);
    return response.data;
};

export const getMyMaterials = async () => {
    const response = await api.get('/materials/my');
    return response.data;
};

export const getMaterialsBySubject = async (subjectId) => {
    const response = await api.get(`/materials/subject/${subjectId}`);
    return response.data;
};

export const getStudentMaterials = async () => {
    const response = await api.get('/materials/student');
    return response.data;
};

export const deleteMaterial = async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
};

export const downloadMaterial = async (id) => {
    const response = await api.get(`/materials/download/${id}`, {
        responseType: 'blob',
    });
    return response;
};
