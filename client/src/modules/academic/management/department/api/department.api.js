import api from "../../../../../services/api";

export const getDepartments = async () => {
    const { data } = await api.get("/department");
    return data;
};

export const createDepartment = async (payload) => {
    const { data } = await api.post("/department", payload);
    return data;
};

export const updateDepartment = async (id, payload) => {
    const { data } = await api.put(`/department/${id}`, payload);
    return data;
};

export const deleteDepartment = async (id) => {
    const { data } = await api.delete(`/department/${id}`);
    return data;
};