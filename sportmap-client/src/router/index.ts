import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue'
import MapView from '@/views/MapView.vue' 

import { useAuthStore } from '@/stores/auth'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView 
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true } 
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView, 
    meta: { requiresGuest: true }
  },
  {
    path: '/map',
    name: 'map',
    component: MapView,
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && localStorage.getItem('sportMapToken')){
     authStore.initializeAuthFromStorage();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;

  if (requiresAuth && !authStore.isAuthenticated){
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiresGuest && authStore.isAuthenticated){
    next({ name: 'map' });
  } else {
    next();
  }
});

export default router
