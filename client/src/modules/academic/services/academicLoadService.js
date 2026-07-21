import api from '@/services/api';

export const generateAcademicLoad = async (studentId) => {
    const response = await api.post(
        "/student-subject/generate",
        { studentId }
    );

    return response.data;
}

export const getStudentLoad = async (
    studentId
) => {

    const response = await api.get(
        `/student-subject/student/${studentId}`
    );

    return response.data.data;
};