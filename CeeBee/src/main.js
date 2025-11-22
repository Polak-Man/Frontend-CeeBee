import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Import du routeur

const app = createApp(App)
app.use(router)  // Utilisation du routeur dans l'app Vue
app.mount('#app')
