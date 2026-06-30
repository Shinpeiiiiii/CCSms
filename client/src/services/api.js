import axios from 'axios';
import useAuthStore from '../modules/auth/state/auth-store';

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,

})


api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        //console.log("Current token:",token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },

    (error) => {
        return Promise.reject(error)
    }
)


api.interceptors.response.use(
    (response) => {
        return response
    },

    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized. Logging out...")
            useAuthStore.getState().logout()

            window.location.href = "/login"
        }

        return Promise.reject(error)
    }
)

export default api