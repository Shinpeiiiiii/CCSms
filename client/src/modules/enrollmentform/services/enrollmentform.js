import api from '../../../services/api'

export const getAnnouncement = async () => {
    const response = await api.get('/enrollmentperiod/announcement')
    return response.data
}

export const sendOtp = async (email) => {
    const response = await api.post('/verification/send', {
        email,
        purpose: 'Enrollment Application',
    })
    return response.data
}

export const verifyOtp = async (email, code) => {
    const response = await api.post('/verification/verify', {
        email,
        code,
        purpose: 'Enrollment Application',
    })
    return response.data
}

export const startApplication = async (email) => {
    const response = await api.post('/student-applications/start', { email })
    return response.data
}

export const getPrograms = async () => {
    const response = await api.get('/program')
    return response.data
}

export const submitApplicationDetails = async (id, data) => {
    const response = await api.put(`/student-applications/${id}`, data)
    return response.data
}

export const trackApplication = async (trackingNumber) => {
    const response = await api.get(`/student-applications/track/${encodeURIComponent(trackingNumber)}`)
    return response.data
}
