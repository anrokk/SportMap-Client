<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userDisplayName = computed(() => authStore.userDisplayName);

onMounted(() => {
  authStore.InitializeAuthFromStorage();
});

const handleLogout = () => {
  authStore.Logout();
}
</script>

<template>
  <header class="app-header">
    <div class="logo-container">
      <RouterLink to="/" class="app-title">SportMap Client</RouterLink>
    </div>
    <nav class="navigation-links">
      <RouterLink to="/">Home</RouterLink>
      <template v-if="isAuthenticated">
        <RouterLink to="/map">Map View</RouterLink>
        <span class="user-greeting" v-if="authStore.user">Hi, {{ userDisplayName }}!</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </template>
    </nav>
  </header>

  <main class="main-content">
    <RouterView />
  </main>

  <footer class="app-footer">
    <p>&copy; {{ new Date().getFullYear() }} SportMap Client. Andreas Erich Rokk 233142IADB</p>
  </footer>  
</template>

<style scoped>
.app-header {
  background-color: #f8f9fa;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  line-height: 1.5;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.logo-container {
  /* Add styles if you have a logo image */
}

.navigation-links a,
.navigation-links button {
  margin-left: 1rem;
  text-decoration: none;
  color: #007bff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease-in-out;
}

.navigation-links a:hover,
.navigation-links button:hover {
  background-color: #e9ecef;
  color: #0056b3;
}

.navigation-links button.logout-button {
  background-color: transparent;
  border: 1px solid #007bff;
  cursor: pointer;
}

.navigation-links button.logout-button:hover {
  background-color: #007bff;
  color: white;
}

.user-greeting {
  margin-left: 1rem;
  color: #555;
}

.main-content {
  padding: 1rem 2rem; /* Add some padding around the main content area */
  min-height: calc(100vh - 120px); /* Example: Adjust based on header/footer height */
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e7e7e7;
  font-size: 0.9rem;
  color: #6c757d;
  position: relative; /* Or fixed/sticky depending on desired behavior */
  bottom: 0;
  width: 100%;
}
</style>
