import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event?.data === 'componentsLoaded') {
      document.body.style.visibility = 'visible'
    }
  })

  if (!globalThis.GetParentResourceName) {
    document.body.style.visibility = 'visible'
  }
}

createApp(App).mount('#app')

if (typeof document !== 'undefined' && document.body) {
  document.body.style.visibility = 'visible'
}
