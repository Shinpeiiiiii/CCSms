import api from "../../../../../services/api";
/*
=====================================
Get All Sections
=====================================
*/
export const getSection = async () => {
    const { data } = await api.get(
        "/section"
    );
    return data;
};
/*
=====================================
Get Section By Id
=====================================
*/
export const getSectionById = async (id) => {
    const { data } = await api.get(
        `/section/${id}`
    );
    return data;
};
/*
=====================================
Create Section
=====================================
*/
export const createSection = async (formData) => {
    const { data } = await api.post(
        "/section",
        formData
    );
    return data;
};
/*
=====================================
Update Section
=====================================
*/
export const updateSection = async (
    id,
    formData,
) => {
    const { data } = await api.put(
        `/section/${id}`,
        formData
    );
    return data;
};
/*
=====================================
Activate Section
=====================================
*/
export const openSection = async (id) => {

    const data = await api.patch(
        `/section/${id}/open`,
    );
    return data;
};
export const closeSection = async (id) => {
    const {data} = await api.patch(`/section/${id}/close`)
    return data;
}
/*
=====================================
Archive Section
=====================================
*/
export const archiveSection = async (id) => {

    const { data } = await api.patch(
        `/section/${id}/archive`
    );

    return data;

};