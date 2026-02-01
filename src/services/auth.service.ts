import api from '../lib/api';
import { LoginCredentials, RegisterCredentials, AuthResponse, UserProfile } from '../types';

export const authService = {
    login: (credentials: LoginCredentials) =>
        api.post<AuthResponse>('/auth/login', credentials),

    register: (credentials: RegisterCredentials) =>
        api.post<AuthResponse>('/auth/register', credentials),

    logout: () =>
        api.post<{ message: string }>('/auth/logout'),

    refresh: () =>
        api.post<{ accessToken: string }>('/auth/refresh'),

    me: () =>
        api.get<{ user: UserProfile }>('/auth/me'),
};
