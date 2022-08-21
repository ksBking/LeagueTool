import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/None',
    },
    {
      path: '/None',
      name: 'None',
      component: () => import('@/views/display/NoneView.vue'),
    },
    {
      path: '/Lobby',
      name: 'Lobby',
      component: () => import('@/views/display/LobbyView.vue'),
    },
    {
      path: '/Matchmaking',
      name: 'Matchmaking',
      component: () => import('@/views/display/MatchmakingView.vue'),
    },
    {
      path: '/ReadyCheck',
      name: 'ReadyCheck',
      component: () => import('@/views/display/ReadyCheckView.vue'),
    },
    {
      path: '/ChampSelect',
      name: 'ChampSelect',
      component: () => import('@/views/display/ChampSelectView.vue'),
    },
    {
      path: '/EndOfGame',
      name: 'EndOfGame',
      component: () => import('@/views/display/EndOfGameView.vue'),
    },
  ],
});

export default router;
