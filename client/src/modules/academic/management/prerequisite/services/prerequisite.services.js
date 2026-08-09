import api from '../../../../../services/api';

/**
 * Get all prerequisites
 */
export const getPrerequisite = async (params = {}) => {
    const response = await api.get('/prerequisite', {
        params
    });

    return response.data;
};

/**
 * Get prerequisite by ID
 */
export const getPrerequisiteById = async (id) => {
    const response = await api.get(`/prerequisite/${id}`);

    return response.data;
};

/**
 * Get prerequisites for a specific subject
 */
export const getPrerequisitesBySubject = async (subjectId) => {
    const response = await api.get(
        `/prerequisite/subject/${subjectId}`
    );

    return response.data;
};

/**
 * Create prerequisite
 */
export const createPrerequisite = async (data) => {
    const response = await api.post(
        '/prerequisite',
        data
    );

    return response.data;
};

/**
 * Update prerequisite
 */
export const updatePrerequisite = async (
    id,
    data
) => {
    const response = await api.put(
        `/prerequisite/${id}`,
        data
    );

    return response.data;
};

/**
 * Deactivate prerequisite
 */
export const deactivatePrerequisite = async (
    id
) => {
    const response = await api.patch(
        `/prerequisite/${id}/deactivate`
    );

    return response.data;
};