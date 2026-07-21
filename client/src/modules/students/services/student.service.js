import api from '../../../services/api'

console.log("Service file loaded")
export const getStudents = async () => {
    const response = await api.get('/students')
    console.log("raw response:", response.data) // check shape here too
    return response.data
}

export const createStudent = async (studentData) => {
        const response = await api.post('/students', studentData)
        console.log("full response:", response)        // ← add this
        console.log("response.data:", response.data)   // ← and this
        return response.data
    
}

export const deleteStudent = async (studentId) => {
        const response = await api.delete(`/students/${studentId}`)
        return response.data
}

export const updateStudent = async (studentId, studentData) => {
        const response = await api.put(`/students/${studentId}`, studentData)
        return response.data
}

export const assignSection = async (studentId, sectionId) => {
        const response = await api.patch(`/students/${studentId}/assign-section`, { sectionId })
        return response.data
}

