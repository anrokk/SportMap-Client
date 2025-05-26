import { defineStore } from 'pinia';
import sportMapApiService from '@/services/sportMapApiService';
import type {
    GpsSession,
    GpsSessionView,
    GpsLocation,
    GpsSessionCreate,
    GpsSessionUpdate
} from '@/types';

export interface GpsDataStore {
    sessions: GpsSessionView[];
    selectedSession: GpsSession | null;
    selectedSessionLocations: GpsLocation[];
    isLoadingSessions: boolean;
    isLoadingLocations: boolean;
    error: string | null;
}

export const useGpsDataStore = defineStore('gpsData', {
    state: (): GpsDataStore => ({
        sessions: [],
        selectedSession: null,
        selectedSessionLocations: [],
        isLoadingSessions: false,
        isLoadingLocations: false,
        error: null
    }),

    getters: {
        selectedTrackCoordinates: (state): Array<[number, number]> => {
            return state.selectedSessionLocations
            .filter(loc => loc.latitude != null && loc.longitude != null)
            .map(loc => [loc.latitude!, loc.longitude!])
            
        },
    },

    actions: {
        async fetchGpsSessions(){
            this.isLoadingSessions = true;
            this.error = null;
            try {
                const response = await sportMapApiService.getGpsSessions();
                this.sessions = response.data;
            } catch (err: any){
                this.error = err.message || 'Failed to fetch GPS sessions';
                this.sessions = [];
            } finally {
                this.isLoadingSessions = false;
            }
        },

        async fetchGpsSessionDetails(sessionId: string){
            this.isLoadingSessions = true;
            this.error = null;
            try {
                const response = await sportMapApiService.getGpsSessionById(sessionId);
                this.selectedSession = response.data;
            } catch (err: any){
                this.error = err.message || `Failed to fetch GPS session with ID ${sessionId}`;
                this.selectedSession = null;
            } finally {
                this.isLoadingSessions = false;
            }
        },

        async fetchLocationsForSession(sessionId: string){
            this.isLoadingLocations = true;
            this.error = null;
            try {
                const response = await sportMapApiService.getLocationsForSession(sessionId);
                this.selectedSessionLocations = response.data;
            } catch (err: any){
                this.error = err.message || `Failed to fetch locations for session with id ${sessionId}`;
                this.selectedSessionLocations = [];
            } finally {
                this.isLoadingLocations = false;
            }
        },

        async createNewGpsSession(sessionData: GpsSessionCreate){
            this.isLoadingSessions = true;
            this.error = null;
            try {
                const response = await sportMapApiService.createGpsSession(sessionData);
                await this.fetchGpsSessions();
                return response.data;
            } catch (err: any){
                this.error = err.message || 'Failed to create GPS session';
                throw err;
            } finally {
                this.isLoadingSessions = false;
            }
        },

        async updateExistingGpsSession(sessionId: string, sessionData: GpsSessionUpdate){
            this.isLoadingSessions = true;
            this.error = null;
            try {
                const response = await sportMapApiService.updateGpsSession(sessionId, sessionData);
                await this.fetchGpsSessions();
                if (this.selectedSession?.id === sessionId){
                    await this.fetchGpsSessionDetails(sessionId);
                }
                return response.data;
            } catch (err: any){
                this.error = err.message || `Failed to update GPS session with ID ${sessionId}`;
                throw err;
            } finally {
                this.isLoadingSessions = false;
            }
        },

        async deleteExistingGpsSession(sessionId: string){
            this.isLoadingSessions = true;
            this.error = null;
            try {
                await sportMapApiService.deleteGpsSession(sessionId);
                this.sessions = this.sessions.filter(s => s.id !== sessionId);
                if (this.selectedSession?.id === sessionId){
                    this.selectedSession = null;
                    this.selectedSessionLocations = [];
                }
            } catch (err: any){
                this.error = err.message || `Failed to delete GPS session with ID ${sessionId}`;
                throw err;
            } finally {
                this.isLoadingSessions = false;
            }
        },

        clearSelectedTrackData() {
            this.selectedSession = null;
            this.selectedSessionLocations = [];
        }
    }
})