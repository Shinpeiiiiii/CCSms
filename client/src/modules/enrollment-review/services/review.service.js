import api from '../../../services/api'

export const getApplications = async () => {
    const response = await api.get('/student-applications')
    return response.data
}

export const updateApplicationStatus = async (id, status, remarks = "") => {
    if (status === 'accepted' || status === 'Approved') {
        const response = await api.patch(`/student-applications/${id}/approve`)
        return response.data
    } else if (status === 'rejected' || status === 'Rejected') {
        const response = await api.patch(`/student-applications/${id}/reject`, { remarks })
        return response.data
    } else {
        const response = await api.patch(`/student-applications/${id}/request-revision`, { remarks })
        return response.data
    }
}
