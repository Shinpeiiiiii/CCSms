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
        `/curriculum/${id}/publish`
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
