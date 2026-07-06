import api from "../../../../../services/api";

export const getProgram = async () => {
    const { data } = await api.get("/program");
    return data;
};

export const getProgramById = async (id) => {
    const { data } = await api.get(`/program/${id}`);
    return data;
};

export const createProgram = async (formData) => {
    const { data } = await api.post("/program", formData);
    return data;
};

export const updateProgram = async (id, formData) => {
    const { data } = await api.put(`/program/${id}`, formData);
    return data;
};

export const deleteProgram = async (id) => {
    const { data } = await api.delete(`/program/${id}`);
    return data;
};