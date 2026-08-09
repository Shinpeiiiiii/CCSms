import api from '../../../services/api';

export const getTeachers = async () => {
    const response = await api.get('/accounts/teachers');
    return response.data;
};

export const createAccount = async (data) => {
    const response = await api.post('/accounts/create', data);
    return response.data;
};

export const activateAccount = async (token, password) => {
    const response = await api.post('/accounts/activate', { token, password });
    return response.data;
};

export const getAccounts = async () => {
    const response = await api.get('/accounts');
    return response.data;
};

export const getAccountById = async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
};

export const updateAccount = async (id, data) => {
    const response = await api.patch(`/accounts/${id}`, data);
    return response.data;
};

export const deleteAccount = async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
};
