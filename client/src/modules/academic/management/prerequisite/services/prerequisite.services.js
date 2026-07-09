import api from '../../../../../services/api';

/**
 * Get all prerequisites
 */
export const getPrerequisite = async (params = {}) => {
    const response = await api.get('/prerequisites', {
        params
    });

    return response.data;
};

/**
 * Get prerequisite by ID
 */
export const getPrerequisiteById = async (id) => {
    const response = await api.get(`/prerequisites/${id}`);

    return response.data;
};

/**
 * Get prerequisites for a specific subject
 */
export const getPrerequisitesBySubject = async (subjectId) => {
    const response = await api.get(
        `/prerequisites/subject/${subjectId}`
    );

    return response.data;
};

/**
 * Create prerequisite
 */
export const createPrerequisite = async (data) => {
    const response = await api.post(
        '/prerequisites',
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
        `/prerequisites/${id}`,
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
        `/prerequisites/${id}/deactivate`
    );

    return response.data;
};