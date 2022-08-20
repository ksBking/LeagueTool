import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      path: '/update/',
      name: 'update',
      component: () => import('@/views/UpdateView.vue'),
    },
    {
      path: '/main',
      component: () => import('@/views/MainView.vue'),
      children: [
        {
          path: '',
          redirect: '/main/overview',
        },
        {
          path: '/main/overview',
          name: 'mainOverview',
          component: () => import('@/views/main/OverView.vue'),
        },
        {
          path: '/main/test',
          name: 'test',
          component: () => import('@/views/main/TestView.vue'),
        },
        {
          path: '/main/autoMatch',
          name: 'mainAutoMatch',
          component: () => import('@/views/main/AutoMatch.vue'),
        },
        {
          path: '/main/pickAndBan',
          name: 'mainPickAndBan',
          component: () => import('@/views/main/PickAndBan.vue'),
        },
        {
          path: '/main/autoConfig',
          name: 'mainAutoConfig',
          component: () => import('@/views/main/AutoConfig.vue'),
        },
        {
          path: '/main/sponsorMe',
          name: 'mainSponsorMe',
          component: () => import('@/views/main/SponsorMe.vue'),
        },
        {
          path: '/main/feedBack',
          name: 'mainFeedBack',
          component: () => import('@/views/main/FeedBack.vue'),
        },
        {
          path: '/main/aboutMe',
          name: 'mainAboutMe',
          component: () => import('@/views/main/AboutMe.vue'),
        },
      ],
    },
    {
      path: '/display',
      component: () => import('@/views/DisplayView.vue'),
      children: [
        {
          path: '',
          redirect: '/display/None',
        },
        {
          path: '/display/None',
          name: 'displayNone',
          component: () => import('@/views/display/NoneView.vue'),
        },
        {
          path: '/display/Lobby',
          name: 'displayLobby',
          component: () => import('@/views/display/LobbyView.vue'),
        },
        {
          path: '/display/Matchmaking',
          name: 'displayMatchmaking',
          component: () => import('@/views/display/MatchmakingView.vue'),
        },
        {
          path: '/display/ReadyCheck',
          name: 'displayReadyCheck',
          component: () => import('@/views/display/ReadyCheckView.vue'),
        },
        {
          path: '/display/ChampSelect',
          name: 'displayChampSelect',
          component: () => import('@/views/display/ChampSelectView.vue'),
        },
        {
          path: '/display/EndOfGame',
          name: 'displayEndOfGame',
          component: () => import('@/views/display/EndOfGameView.vue'),
        },
      ],
    },
  ],
});

export default router;
