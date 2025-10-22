import { createApp } from 'vue';
import App from './App.vue';
import Cuida from '@sysvale/cuida';
import '@sysvale/cuida/dist/style.css';
import '@/constants/citizenFormRules';

const app = createApp(App);
app.use(Cuida);
app.mount('#app');
