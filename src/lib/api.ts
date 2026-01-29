import axios from 'axios';

// In a real app, use env var. For now, defaulting to localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for easier error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
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
