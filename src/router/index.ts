import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      component: () => import('../views/AboutView.vue'),
      children: [
        {
          path: '/about/1',
          name: 'about1',
          component: () => import('../views/AboutView.vue'),
        },
      ],
    },
  ],
});

export default router;
