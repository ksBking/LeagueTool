import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './MainApp.vue';
import router from './router/main';

import './assets/base.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
