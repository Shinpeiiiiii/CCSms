import api from '../../../services/api'

export const getApplications = async () => {
    const response = await api.get('/enrollment')
    return response.data
}

export const updateApplicationStatus = async (id, status) => {
    const response = await api.put(`/enrollment/${id}/status`, { status })
    return response.data
}
