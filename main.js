// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from '/router/index.js'  // <-- MAKE SURE this path exists

createApp(App)
  .use(router)
  .mount('#app')
