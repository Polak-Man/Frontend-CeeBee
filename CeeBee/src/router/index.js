import { createRouter, createWebHistory } from 'vue-router';
import Callback from '@/components/Callback.vue';  // Créez ce composant

const routes = [
  // ... autres routes
  {
    path: '/',
    redirect: '/callback',
  },
  {
    path: '/callback',
    component: Callback,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
