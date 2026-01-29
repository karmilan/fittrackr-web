import { create } from 'zustand';
import { UserProfile } from '../types';
import { profileService } from '../services';

interface AppState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,
    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await profileService.getProfile();
            // @ts-ignore - axios interceptor returns data directly
            set({ profile, isLoading: false });
        } catch (error: any) {
            // If 404, it just means no profile yet
            if (error.status === 404 || error.response?.status === 404) {
                set({ profile: null, isLoading: false });
            } else {
                set({ error: error.message || 'Failed to fetch profile', isLoading: false });
            }
        }
    },
    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const profile = await profileService.updateProfile(data);
            // @ts-ignore
            set({ profile, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to update profile', isLoading: false });
        }
    },
}));
