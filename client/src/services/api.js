import axios from 'axios';
import useAuthStore from '../modules/auth/state/auth-store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})


api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        //console.log("Current token:",token);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
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

    async (error) => {

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){

            originalRequest._retry = true;

            try{
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                )

                const newAccessToken = response.data.accessToken;
                useAuthStore.setState({accessToken: newAccessToken,});

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            }catch{
                useAuthStore.getState().logout();
                window.location.href = "/";
            }
            
        }

        return Promise.reject(error)
    }
)

export default api