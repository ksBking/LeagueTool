import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
    {
      path: '/overview',
      name: 'Overview',
      component: () => import('@/views/main/OverView.vue'),
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/main/TestView.vue'),
    },
    {
      path: '/autoMatch',
      name: 'AutoMatch',
      component: () => import('@/views/main/AutoMatch.vue'),
    },
    {
      path: '/pickAndBan',
      name: 'PickAndBan',
      component: () => import('@/views/main/PickAndBan.vue'),
    },
    {
      path: '/autoConfig',
      name: 'AutoConfig',
      component: () => import('@/views/main/AutoConfig.vue'),
    },
    {
      path: '/sponsorMe',
      name: 'SponsorMe',
      component: () => import('@/views/main/SponsorMe.vue'),
    },
    {
      path: '/feedBack',
      name: 'FeedBack',
      component: () => import('@/views/main/FeedBack.vue'),
    },
    {
      path: '/aboutMe',
      name: 'AboutMe',
      component: () => import('@/views/main/AboutMe.vue'),
    },
  ],
});

export default router;
