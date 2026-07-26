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

export const requestPasswordReset = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const confirmPasswordReset = async (email, code, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
};