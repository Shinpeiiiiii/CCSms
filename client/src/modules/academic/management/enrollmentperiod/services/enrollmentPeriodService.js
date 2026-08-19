import api from "../../../../../services/api";

export const getEnrollmentPeriods = async () => {
    const { data } = await api.get("/enrollmentperiod");
    return data;
};

export const getEnrollmentAnnouncement = async () => {
    const {data} = await api.get("/enrollmentperiod/announcement");
    return data;
}
export const createEnrollmentPeriod = async (formData) => {
    const { data } = await api.post(
        "/enrollmentperiod",
        formData
    );

    return data;
};

export const updateEnrollmentPeriod = async (
    id,
    formData
) => {
    const { data } = await api.put(
        `/enrollmentperiod/${id}`,
        formData
    );

    return data;
};

export const publishEnrollmentPeriod = async (id) => {
    const { data } = await api.patch(
        `/enrollmentperiod/${id}/publish`
    );

    return data;
};

export const openEnrollmentPeriod = async (id) => {
    const { data } = await api.patch(`/enrollmentperiod/${id}/open`)
    return data;
}

export const closeEnrollmentPeriod = async (id) => {
    const { data } = await api.patch(
        `/enrollmentperiod/${id}/close`
    );

    return data;
};

export const archiveEnrollmentPeriod = async (id) => {
    const { data } = await api.patch(
        `/enrollmentperiod/${id}/archive`
    );

    return data;
};