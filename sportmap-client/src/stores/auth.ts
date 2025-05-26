import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import type { LoginCredentials, RegisterInfo, JwtResponse, UserProfile } from "@/types";
import router from "@/router";
import { jwtDecode } from "jwt-decode";


interface DecodedSportMapToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'?: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem('sportMapToken') || null as string | null,
        user: JSON.parse(localStorage.getItem('sportMapUser') || 'null') as UserProfile | null,
        isAuthenticated: !!localStorage.getItem('sportMapToken'),
        loginError: null as string | null,
        registerError: null as string | null,
        isLoading: false,
    }),

    getters: {
        userDisplayName: (state): string => {
            if (state.user) {
                if (state.user.firstName && state.user.lastName){
                    return `${state.user.firstName} ${state.user.lastName}`;
                }
                return state.user.email;
            }
            return "Guest";
        },
        bearerToken: (state): string | null => {
            return state.token ? `Bearer ${state.token}` : null;
        }
    },

    actions: {
        async login(credentials: LoginCredentials) {
            this.isLoading = true;
            this.loginError = null;

            try {
                const jwtResponse: JwtResponse = await authService.login(credentials);
                this.token = jwtResponse.token;
                this.isAuthenticated = true;

                let userIdFromToken = '';
                let emailFromToken = '';
                let firstNameToStore = jwtResponse.firstName;
                let lastNameToStore = jwtResponse.lastName;

                if (this.token){
                    try {
                        const decoded = jwtDecode<DecodedSportMapToken>(this.token);
                        userIdFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
                        emailFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || emailFromToken;
                        firstNameToStore = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || firstNameToStore;
                        lastNameToStore = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || lastNameToStore;

                        if (!userIdFromToken){
                            throw new Error("User ID not found in token");
                        }
                    } catch (e) {
                        throw new Error("Invalid token format or missing claims");
                    }
                } else {
                    throw new Error("Authentication failed");
                }

                this.user = {
                    id: userIdFromToken,
                    email: emailFromToken,
                    firstName: firstNameToStore,
                    lastName: lastNameToStore
                };

                localStorage.setItem('sportMapToken', this.token);
                localStorage.setItem('sportMapUser', JSON.stringify(this.user));

                await router.push({ name: 'map' });
                return true;
            } catch (error: any) {
                this.logoutCleanup();
                this.loginError = error.message || 'Login failed.';
                console.error('Login error:', this.loginError);
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async register(userInfo: RegisterInfo) {
            this.isLoading = true;
            this.registerError = null;
            try {
                const jwtResponse: JwtResponse = await authService.register(userInfo);
                this.token = jwtResponse.token;
                this.isAuthenticated = true;

                let userIdFromToken = '';
                let emailFromToken = userInfo.email; 
                let firstNameToStore = jwtResponse.firstName; 
                let lastNameToStore = jwtResponse.lastName;  


                if (this.token) {
                    try {
                        const decoded = jwtDecode<DecodedSportMapToken>(this.token);
                        userIdFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
                        emailFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || emailFromToken;
                        firstNameToStore = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || firstNameToStore;
                        lastNameToStore = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || lastNameToStore;

                        if (!userIdFromToken) {
                            console.error("CRITICAL: User ID (nameidentifier) not found in JWT token after registration.");
                            throw new Error("User identification failed after registration.");
                        }
                    } catch (e) {
                        console.error("Failed to decode JWT token after registration:", e);
                         throw new Error("Authentication process failed (token error after registration).");
                    }
                } else {
                    throw new Error("Authentication failed (no token received after registration).");
                }

                this.user = {
                    id: userIdFromToken,
                    email: emailFromToken,
                    firstName: firstNameToStore,
                    lastName: lastNameToStore,
                };

                localStorage.setItem('sportMapToken', this.token);
                localStorage.setItem('sportMapUser', JSON.stringify(this.user));

                await router.push({ name: 'map' });
                return true;
            } catch (error: any) { 
                this.logoutCleanup();
                this.registerError = error.message || 'Registration failed.';
                console.error('Register action error:', error);
                return false;
            } finally { 
                this.isLoading = false;
            }
        },

        logout(){
            this.logoutCleanup();
            router.push({ name: 'login' });
        },

        logoutCleanup() {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
            this.loginError = null;
            this.registerError = null;

            localStorage.removeItem('sportMapToken');
            localStorage.removeItem('sportMapUser');
        },

        initializeAuthFromStorage(){
            const token = localStorage.getItem('sportMapToken');
            const userString = localStorage.getItem('sportMapUser');

            if (token){
                try {
                    const decoded = jwtDecode<DecodedSportMapToken>(token);
                    const userIdFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
                    const emailFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
                    const firstNameFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || '';
                    const lastNameFromToken = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || '';

                    if (!userIdFromToken || !emailFromToken){
                        console.warn("Valid User ID or email not found in token");
                        this.logoutCleanup();
                        return;
                    }

                    this.user = {
                        id: userIdFromToken,
                        email: emailFromToken,
                        firstName: firstNameFromToken,
                        lastName: lastNameFromToken
                    };

                    this.token = token;
                    this.isAuthenticated = true;
                    localStorage.setItem('sportMapUser', JSON.stringify(this.user));
                } catch (e) {
                    console.error("Failed to initialize auth from storage:", e);
                    this.logoutCleanup();
                }
            } else {
                this.logoutCleanup();
            }
        }
    }
});