import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './DisplayApp.vue';
import router from './router/display';

import './assets/base.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
