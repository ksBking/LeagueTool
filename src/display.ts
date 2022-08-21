import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './DisplayApp.vue';
import router from './router/display';

import './assets/base.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
