import api from "../../../../../services/api";

/*
=====================================
Get All Subjects
=====================================
*/

export const getSubject = async () => {

    const { data } = await api.get("/subject");

    return data;

};  

/*
=====================================
Get Subject By Id
=====================================
*/

export const getSubjectById = async (id) => {

    const { data } = await api.get(`/subject/${id}`);

    return data;

};

/*
=====================================
Create Subject
=====================================
*/

export const createSubject = async (formData) => {

    const { data } = await api.post(
        "/subject",
        formData
    );

    return data;

};

/*
=====================================
Update Subject
=====================================
*/

export const updateSubject = async (
    id,
    formData
) => {

    const { data } = await api.put(
        `/subject/${id}`,
        formData
    );

    return data;

};

/*
=====================================
Delete Subject
=====================================
*/

export const deleteSubject = async (id) => {

    const { data } = await api.delete(
        `/subject/${id}`
    );

    return data;

};