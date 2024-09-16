import './assets/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.fullPath); // Logs every route change
  next();
});

const app = createApp(App)

app.use(router)

app.mount('#app')
