import api from '../../../services/api'

export const getMySchedule = async () => {
    const response = await api.get('/section-subject/my-schedule')
    return response.data
}

export const getMyDashboard = async () => {
    const response = await api.get('/section-subject/my-dashboard')
    return response.data
}

export const getMyClasses = async () => {
    const response = await api.get('/section-subject/my-classes')
    return response.data
}

export const getClassStudents = async (sectionSubjectId) => {
    const response = await api.get(`/section-subject/${sectionSubjectId}/students`)
    return response.data
}

export const getClassGrades = async (sectionSubjectId) => {
    const response = await api.get(`/section-subject/${sectionSubjectId}/grades`)
    return response.data
}

export const updateGrades = async (sectionSubjectId, grades) => {
    const response = await api.patch(`/section-subject/${sectionSubjectId}/grades`, { grades })
    return response.data
}

export const getAttendanceByDate = async (sectionSubjectId, date) => {
    const response = await api.get(`/attendance/section-subject/${sectionSubjectId}/date/${date}`)
    return response.data
}

export const markAttendance = async ({ sectionSubjectId, date, records }) => {
    const response = await api.post('/attendance/mark', { sectionSubjectId, date, records })
    return response.data
}

export const getAttendanceSummary = async (sectionSubjectId) => {
    const response = await api.get(`/attendance/section-subject/${sectionSubjectId}/summary`)
    return response.data
}

export const getAttendanceCalendar = async (sectionSubjectId, year, month) => {
    const response = await api.get(`/attendance/section-subject/${sectionSubjectId}/calendar?year=${year}&month=${month}`)
    return response.data
}

export const getMyNotifications = async () => {
    const response = await api.get('/notifications')
    return response.data
}

export const getUnreadNotificationCount = async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
}

export const markNotificationRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`)
    return response.data
}

export const markAllNotificationsRead = async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data
}

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
}
