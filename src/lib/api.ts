import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Necessary for refresh token cookies
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for easier error handling and token refresh
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized and specifically TOKEN_EXPIRED
        if (error.response?.status === 401 && error.response?.data?.error === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                const { accessToken } = response.data;

                // Update store
                useAuthStore.getState().setAccessToken(accessToken);

                // Update header and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

// Wrapper to fix types since interceptor returns T directly, not AxiosResponse<T>
const apiWrapper = {
    get: <T>(url: string, config?: any) => api.get<any, T>(url, config),
    post: <T>(url: string, data?: any, config?: any) => api.post<any, T>(url, data, config),
    put: <T>(url: string, data?: any, config?: any) => api.put<any, T>(url, data, config),
    delete: <T>(url: string, config?: any) => api.delete<any, T>(url, config),
};

export default apiWrapper;
