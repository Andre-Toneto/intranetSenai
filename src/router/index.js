import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'HomePage',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/carometro',
    name: 'Carometro',
    component: () => import('@/views/carometro/index.vue')
  },
  {
    path: '/formularios',
    name: 'Formularios',
    component: () => import('@/views/formularios/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
