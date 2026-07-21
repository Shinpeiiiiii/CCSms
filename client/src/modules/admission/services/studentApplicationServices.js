import api from "@/services/api";

export const getPendingApplications = async () => {
    const response = await api.get('/student-applications?status=pending');
    console.log(response);
    return response.data;
};

export const approveApplication = async (id) => {
    const response = await api.patch(
        `/student-applications/${id}/approve`
    );
    console.log(response);
    return response.data;
};

export const rejectApplication = async (
    id,
    remarks
) => {
    const response = await api.patch(
        `/student-applications/${id}/reject`,
        { remarks }
    );
    console.log(response);
    return response.data;
};

export const requestRevision = async (
    id,
    remarks
) => {
    const response = await api.patch(
        `/student-applications/${id}/request-revision`,
        { remarks }
    );
    console.log(response);
    return response.data;
};