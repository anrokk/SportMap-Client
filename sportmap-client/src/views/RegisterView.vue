<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { RegisterInfo } from '@/types';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = computed(() => authStore.isLoading);
const registerError = computed(() => authStore.registerError);

const handleRegister = async () => {
    if (password.value !== confirmPassword.value){
        authStore.registerError = 'Passwords do not match.';
        return;
    }
    if (!firstName.value || !lastName.value || !email.value || !password.value){
        authStore.registerError = 'All fields are required.';
        return;
    }

    const userInfo: RegisterInfo = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    };

    await authStore.register(userInfo);
};
</script>

<template>
    <div class="register-view">
        <div class="register-container">
            <h2>Register</h2>
            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        v-model="firstName"
                        required
                        placeholder="Enter your first name"
                        :disabled="isLoading"
                    />
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        v-model="lastName"
                        required
                        placeholder="Enter your last name"
                        :disabled="isLoading"
                     />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        required
                        placeholder="Enter your email"
                        :disabled="isLoading"
                    />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        required
                        placeholder="Enter your password"
                        :disabled="isLoading"
                    />
                </div>
                <div class ="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        v-model="confirmPassword"
                        required
                        placeholder="Confirm your password"
                        :disabled="isLoading"
                    />
                </div>

                <div v-if="registerError" class="error-message">
                    <p>{{ registerError }}</p>
                </div>

                <button type="submit" class="register-button" :disabled="isLoading">
                    <span v-if="isLoading">Registering...</span>
                    <span v-else>Register</span>
                </button>            
            </form>

            <p class="login-link">
                Already have an account? <RouterLink to="/login">Login here</RouterLink>
            </p> 
        </div>
    </div>
</template>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: white;
  box-sizing: border-box;
}

.register-container {
  background-color: white;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px; 
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.register-form .form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

.register-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.register-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;
}

.register-form input:focus {
  border-color: #007bff; 
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); 
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
}

.register-button:hover {
  background-color: #218838; 
}

.register-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.error-message p {
  margin: 0;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #007bff; 
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>