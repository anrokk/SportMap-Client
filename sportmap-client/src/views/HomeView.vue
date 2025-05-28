<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userDisplayName = computed(() => authStore.userDisplayName);
</script>

<template>
  <div class="home-view">
    <div class="hero-section">
      <h1>SportMap</h1>
      <p class="lead" v-if="!isAuthenticated">
        Track GPS sessions by others & create your own. Please log in or register to get started.
      </p>
      <p class="lead" v-if="isAuthenticated">
        Hello, {{ userDisplayName }}! Ready to explore some tracks or create your own?
      </p>
    </div>

    <div class="actions-container" v-if="!isAuthenticated">
      <RouterLink :to="{ name: 'login' }" class="action-button primary-action">Login</RouterLink>
      <RouterLink :to="{ name: 'register' }" class="action-button secondary-action">Register</RouterLink>
    </div>

    <div class="actions-container" v-if="isAuthenticated">
      <RouterLink :to="{ name: 'map' }" class="action-button primary-action">View Map & Tracks</RouterLink>
      <RouterLink :to="{ name: 'createTrack' }" class="action-button">Create New Track</RouterLink>
    </div>

    <div class="features-overview" v-if="!isAuthenticated">
      <h2>Features</h2>
      <ul>
        <li>View detailed GPS tracks on an interactive map.</li>
        <li>Filter tracks by type.</li>
        <li>See track updates in near real-time.</li>
        <li>Register and log in to create your own track data.</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  text-align: center;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.hero-section .lead {
  font-size: 1.15rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions-container {
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem; 
}

.action-button {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  border: 1px solid transparent;
}

.action-button.primary-action {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.action-button.primary-action:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.action-button.secondary-action,
.action-button { 
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.action-button.secondary-action:hover,
.action-button:hover {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-1px);
}


.features-overview {
  margin-top: 2rem;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.features-overview h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.features-overview ul {
  list-style-type: disc;
  padding-left: 20px;
  color: #555;
}

.features-overview li {
  margin-bottom: 0.5rem;
}
</style>

