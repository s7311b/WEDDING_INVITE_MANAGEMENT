import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import { updateFavicon } from './config'

// Favicon 초기화
updateFavicon()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
