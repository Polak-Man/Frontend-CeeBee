import { createRouter, createWebHistory } from 'vue-router';
import Callback from '@/components/Callback.vue';  // Créez ce composant

const routes = [
  // ... autres routes
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
