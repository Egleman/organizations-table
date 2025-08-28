import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './assets/scss/style.scss'
import { vDebounce, vMask } from "./plugins";
import Toast, { POSITION } from 'vue-toastification';
import "vue-toastification/dist/index.css";

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(Toast, {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.TOP_LEFT,
    timeout: 5000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
})
app.directive('debounce', vDebounce)
app.directive('mask', vMask)
app.mount('#app')

