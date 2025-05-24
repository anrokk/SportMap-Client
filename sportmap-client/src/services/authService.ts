import axios from "axios";
import { type LoginInfo, type RegisterInfo, JwtResponse } from '@/types';

const API_BASE_URL = 'https://sportmap.akaver.com/api/v1/Account';

const authApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers:{
     'Content-Type': 'application/json',   
    }
});

export const authService = {

    login: async (credentials: LoginInfo): Promise<JwtResponse> => {
        try {
            const response = await authApiClient.post<JwtResponse>('/Login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            if (axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data.message || 'Login failed due to server error');
            }
            throw new Error('Login failed. Please check your credentials or network');
        }
    },


    register: async (userInfo: RegisterInfo): Promise<JwtResponse> => {
        try {
            const response = await authApiClient.post<JwtResponse>('/Register', userInfo);
            return response.data;
        } catch (error) {
            console.error('Register API error:', error);
            if (axios.isAxiosError(error) && error.response){
                const errorData = error.response.data;
                let errorMessage = 'Registrtion failed.';
                if (errorData && errorData.errors){
                    errorMessage = Object.values(errorData.errors).flat().join(' ');
                } else if (errorData && errorData.message){
                    errorMessage = errorData.message;
                }
                throw new Error(errorMessage);
            }
            throw new Error('Registration failed. Please check your information or network');
        }
    }
}
