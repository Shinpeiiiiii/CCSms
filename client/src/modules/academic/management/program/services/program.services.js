import api from "../../../../../services/api";

export const getProgram = async () => {
    const response = await api.get("/program")
    return response.data;
};

export const createProgram = async (data) => {
    const response = await api.post("/program",data);
    return response.data;
}

export const updateProgram = async (id, data) => {
    const response = await api.put(`/program/${id}`,data);
    return response.data;
}

export const deleteProgram = async (id) => {
    const response = await api.delete(`/program/${id}`);
    return response.data;
}