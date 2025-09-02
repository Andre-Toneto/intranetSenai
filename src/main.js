import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'senaiTheme',
    themes: {
      senaiTheme: {
        dark: false,
        colors: {
          primary: '#e53e3e', // SENAI Red como primária
          secondary: '#1e3a8a', // Navy Blue como secundária
          accent: '#f59e0b', // Amber
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          success: '#10b981',
          surface: '#ffffff',
          background: '#f8fafc',
          'on-surface': '#1f2937',
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'senai-red': '#e53e3e',
          'senai-navy': '#1e3a8a',
          'senai-light-red': '#fee2e2',
          'senai-gray': '#f1f5f9'
        }
      }
    }
  },
  defaults: {
    global: {
      ripple: false
    },
    VSheet: {
      elevation: 0
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
