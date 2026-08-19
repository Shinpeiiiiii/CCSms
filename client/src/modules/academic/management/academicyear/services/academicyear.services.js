import api from "../../../../../services/api";

/*
=====================================
Get Academic Years
=====================================
*/

export const getAcademicYear = async () => {

    const { data } = await api.get("/academicyear");

    return data.data;

};

/*
=====================================
Get Academic Year By Id
=====================================
*/

export const getAcademicYearById = async (id) => {

    const { data } = await api.get(`/academicyear/${id}`);

    return data.data;

};

/*
=====================================
Create Academic Year
=====================================
*/

export const createAcademicYear = async (formData) => {

    const { data } = await api.post(
        "/academicyear",
        formData
    );

    return data;

};

/*
=====================================
Update Academic Year
=====================================
*/

export const updateAcademicYear = async (
    id,
    formData
) => {

    const { data } = await api.put(
        `/academicyear/${id}`,
        formData
    );

    return data;

};

/*
=====================================
Delete Academic Year
=====================================
*/

export const deleteAcademicYear = async (id) => {

    const { data } = await api.delete(
        `/academicyear/${id}`
    );

    return data;

};