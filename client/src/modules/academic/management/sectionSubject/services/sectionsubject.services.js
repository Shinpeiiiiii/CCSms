import api from "@/services/api";


export const getSectionSubjects = async (sectionId) => {
    const data  = await api.get(
        `/section-subject/${sectionId}`
    );
    return data;
};

export const generateSectionSubjects = async (sectionId) => {
    const { data } = await api.post(
        `/section-subject/generate/${sectionId}`
    );
    return data;
};

export const deleteSectionSubject = async (id) => {
    const { data } = await api.delete(`/section-subject/${id}`);
    return data;
};

export const updateSectionSubject = async (
    id,
    payload
) => {
    const { data } = await api.patch(
        `/section-subject/${id}`,
        payload
    );

    return data;
};