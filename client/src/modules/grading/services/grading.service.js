import api from '../../../services/api'

export const listSchemes = async () => {
    const response = await api.get('/grading/schemes')
    return response.data
}

export const createScheme = async (data) => {
    const response = await api.post('/grading/schemes', data)
    return response.data
}

export const updateScheme = async (id, data) => {
    const response = await api.put(`/grading/schemes/${id}`, data)
    return response.data
}

export const deleteScheme = async (id) => {
    const response = await api.delete(`/grading/schemes/${id}`)
    return response.data
}

export const getGradingConfig = async (sectionSubjectId) => {
    const response = await api.get(`/grading/config/${sectionSubjectId}`)
    return response.data
}

export const updateGradingConfig = async (sectionSubjectId, data) => {
    const response = await api.put(`/grading/config/${sectionSubjectId}`, data)
    return response.data
}

export const getClassEnrollments = async (sectionSubjectId) => {
    const response = await api.get(`/grading/${sectionSubjectId}/enrollments`)
    return response.data
}

export const getGradeItems = async (sectionSubjectId, term) => {
    const response = await api.get(`/grading/${sectionSubjectId}/items${term ? `?term=${term}` : ''}`)
    return response.data
}

export const createGradeItem = async (data) => {
    const response = await api.post('/grading/items', data)
    return response.data
}

export const updateGradeItem = async (id, data) => {
    const response = await api.put(`/grading/items/${id}`, data)
    return response.data
}

export const deleteGradeItem = async (id) => {
    const response = await api.delete(`/grading/items/${id}`)
    return response.data
}

export const saveScores = async (data) => {
    const response = await api.post('/grading/scores', data)
    return response.data
}

export const getItemScores = async (itemId) => {
    const response = await api.get(`/grading/items/${itemId}/scores`)
    return response.data
}

export const getClassStudents = async (sectionSubjectId) => {
    const response = await api.get(`/grading/${sectionSubjectId}/students`)
    return response.data
}

export const listGroups = async (sectionSubjectId) => {
    const response = await api.get(`/grading/${sectionSubjectId}/groups`)
    return response.data
}

export const createGroup = async (data) => {
    const response = await api.post('/grading/groups', data)
    return response.data
}

export const updateGroup = async (id, data) => {
    const response = await api.put(`/grading/groups/${id}`, data)
    return response.data
}

export const deleteGroup = async (id) => {
    const response = await api.delete(`/grading/groups/${id}`)
    return response.data
}

export const computeGrades = async (sectionSubjectId) => {
    const response = await api.get(`/grading/${sectionSubjectId}/compute`)
    return response.data
}

export const saveComputedGrades = async (sectionSubjectId) => {
    const response = await api.post(`/grading/${sectionSubjectId}/compute/save`)
    return response.data
}

export const importScores = async (data) => {
    const response = await api.post('/grading/import', data)
    return response.data
}
