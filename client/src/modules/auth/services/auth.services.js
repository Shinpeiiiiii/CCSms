import api from '../../../services/api'

export const loginUser = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}

export const checkEmailExists = async (email) => {
    const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
};