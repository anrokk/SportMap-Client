<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from "@/stores/auth"
import router from '@/router';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const isLoading = computed(() => authStore.isLoading);
const loginError = computed(() => authStore.loginError);

const handleLogin = async () => {
    if (!email.value || !password.value){
        authStore.loginError = 'Email and password are required.';
        return;
    }
    await authStore.login({
        email: email.value,
        password: password.value
    });
};
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
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
        <div v-if="loginError" class="error-message">
          <p>{{ loginError }}</p>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <p class="register-link">
        Don't have an account? <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  padding-top: 5vh; 
  min-height: calc(100vh - 180px); 
  background-color: #f4f7f6;
}

.login-container {
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.login-form .form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.login-form input[type="email"],
.login-form input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
  transition: border-color 0.2s ease-in-out;
}

.login-form input[type="email"]:focus,
.login-form input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
}

.login-button:hover {
  background-color: #0056b3;
}

.login-button:disabled {
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

.register-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
