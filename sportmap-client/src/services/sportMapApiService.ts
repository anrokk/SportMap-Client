import axios from "axios";
import type {
    GpsSession,
    GpsSessionView,
    GpsLocation,
    GpsSessionType,
    GpsLocationType,
    GpsSessionCreate,
    GpsSessionUpdate,
} from '@/types';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = 'https://sportmap.akaver.com/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.token && config.headers){
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleApiError = (error: any, defaultMessage: string) => {
    if (axios.isAxiosError(error) && error.response){
        const problemDetails = error.response.data;
        if (problemDetails && problemDetails.title){
            throw new Error(`${problemDetails.title} (Status: ${problemDetails.status}) ${problemDetails.detail || ''}`);
        }
        throw new Error(error.response.data.message || error.message || defaultMessage);
    }
    throw new Error(error.message || defaultMessage);
};

export default {

    getGpsSessions: async (): Promise<{ data: GpsSessionView[] }> => {
        try {
            return await apiClient.get<GpsSessionView[]>('/GpsSessions');
        } catch (error) {
            return handleApiError(error, 'Failed to fetch GPS sessions');
        }
    },

    getGpsSessionById: async (id: string): Promise<{ data: GpsSession }> => {
        try {
            return await apiClient.get<GpsSession>(`/GpsSessions/${id}`);
        } catch (error) {
            return handleApiError(error, `Failed to fetch GPS session with ID ${id}`);
        }
    },

    createGpsSession: async (data: GpsSessionCreate): Promise<{ data: GpsSession }> => {
        try {
            return await apiClient.post<GpsSession>('/GpsSessions', data);
        } catch (error) {
            return handleApiError(error, 'Failed to create GPS session');
        }
    },

    updateGpsSession: async (id: string, data: GpsSessionUpdate): Promise<{ data: GpsSession }> => {
        try {
            return await apiClient.put<GpsSession>(`/GpsSessions/${id}`, data);
        } catch (error) {
            return handleApiError(error, `Failed to update GPS session with ID ${id}`);
        }
    },

    deleteGpsSession: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/GpsSessions/${id}`);
        } catch (error) {
            return handleApiError(error, `Failed to delete GPS session with ID ${id}`);
        }
    },

    getLocationsForSession: async (sessionId: string): Promise<{ data: GpsLocation[] }> => {
        try {
            return await apiClient.get<GpsLocation[]>(`/GpsLocations/Session/${sessionId}`)
        } catch (error) {
            return handleApiError(error, `Failed to fetch locations for session with ID ${sessionId}`);
        } 
    },

    getGpsSessionTypes: async (): Promise< { data: GpsSessionType[] }> => {
        try {
            return await apiClient.get<GpsSessionType[]>('/GpsSessionTypes');
        } catch (error) {
            return handleApiError(error, 'Failed to fetch GPS session types');
        }
    },

    getGpsLocationTypes: async (): Promise< { data: GpsLocationType[] }> => {
        try {
            return await apiClient.get<GpsLocationType[]>('/GpsLocationTypes');
        } catch (error) {
            return handleApiError(error, 'Failed to fetch GPS location types');
        }
    },
}