<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userDisplayName = computed(() => authStore.userDisplayName);

onMounted(() => {
  authStore.initializeAuthFromStorage();
});

const handleLogout = () => {
  authStore.logout();
};
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
#app-container {
  display: flex;
  flex-direction: column; 
  min-height: 100vh;
}

.app-header {
  background-color: #343a40; 
  padding: 0.75rem 2rem;   
  display: flex;           
  justify-content: space-between; 
  align-items: center;    
  color: #f8f9fa;         
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff; 
  text-decoration: none;
}

.navigation-links a,
.navigation-links button,
.navigation-links .user-greeting {
  margin-left: 1rem;
  text-decoration: none;
  color: #adb5bd; 
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  font-size: 0.95rem;
}

.navigation-links a:hover,
.navigation-links button:hover {
  color: #ffffff; 
  background-color: #495057; 
}

.navigation-links .router-link-exact-active { 
  color: #ffffff;
  font-weight: bold;
  background-color: #007bff; 
}


.navigation-links button.logout-button {
  background-color: #dc3545; 
  border: none;
  color: white;
  cursor: pointer;
}

.navigation-links button.logout-button:hover {
  background-color: #c82333; 
}

.user-greeting {
  color: #e9ecef; 
  padding-right: 0; 
}

.main-content {
  flex-grow: 1; 
  padding: 1.5rem 2rem; 
  width: 100%;
  box-sizing: border-box;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e7e7e7;
  font-size: 0.9rem;
  color: #6c757d;
  width: 100%;
  box-sizing: border-box;
  margin-top: auto; 
  flex-shrink: 0;
}
</style>
