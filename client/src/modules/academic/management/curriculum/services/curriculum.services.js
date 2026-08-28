import api from "../../../../../services/api";

/*
=====================================
Get Curriculums
=====================================
*/

export const getCurriculum = async () => {

    const { data } = await api.get("/curriculum");

    return data;

};

/*
=====================================
Get Curriculum By Id
=====================================
*/

export const getCurriculumById = async (id) => {

    const { data } = await api.get(`/curriculum/${id}`);

    return data;

};

/*
=====================================
Create Curriculum
=====================================
*/

export const createCurriculum = async (formData) => {

    const { data } = await api.post(
        "/curriculum",
        formData
    );

    return data;

};

/*
=====================================
Update Curriculum
=====================================
*/

export const updateCurriculum = async (
    id,
    formData
) => {

    const { data } = await api.put(
        `/curriculum/${id}`,
        formData
    );

    return data;

};

/*
=====================================
Publish Curriculum
=====================================
*/

export const publishCurriculum = async (id) => {

    const { data } = await api.patch(
        `/curriculum/${id}/publish`,
        {},
        { timeout: 60000 }
    );

    return data;

};  

/*
=====================================
Archive Curriculum
=====================================
*/

export const archiveCurriculum = async (id) => {

    const { data } = await api.patch(
        `/curriculum/${id}/archive`
    );

    return data;

};

export const createCurriculumVersion = async (id,data) => {
    const response = await api.post(`/curriculum/${id}/version`, data)

    return response.data.curriculum;
};

export const getCurriculumHistory = async (id) => {
    const response = await api.get(`/curriculum/${id}/history`);
    return response.data;
}

/*
=====================================
Templates
=====================================
*/

export const getTemplates = async () => {
    const { data } = await api.get('/curriculum/templates')
    return data;
}

export const saveAsTemplate = async (curriculumId, name) => {
    const { data } = await api.post(`/curriculum/${curriculumId}/template`, { name })
    return data;
}

export const createCurriculumFromTemplate = async (templateId, formData) => {
    const { data } = await api.post(`/curriculum/from-template/${templateId}`, formData)
    return data;
}

export const exportCurriculum = async (id) => {
    const { data } = await api.get(`/curriculum/${id}/export`)
    return data;
}

export const importCurriculum = async (payload) => {
    const { data } = await api.post('/curriculum/import', payload)
    return data;
}

export const deleteCurriculumsBatch = async (ids) => {
    const { data } = await api.post('/curriculum/batch', { ids })
    return data;
}
