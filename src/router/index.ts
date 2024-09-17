import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '@/layouts/welcome.vue'
import Main from "@/layouts/main.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
      children: [
        {
          path: '',
          name: 'default-welcome',
          redirect: '/login'
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/login.vue')
        },
        {
          path: '/registration',
          name: 'registration',
          component: () => import('../views/registration.vue')
        },
        {
          path: '/recovery',
          name: 'recovery',
          component: () => import('../views/recovery.vue')
        }
      ]
    },
    {
      path: '/app',
      name: 'app',
      component: Main,
      children: [
        {
          path: '',
          name: 'default-app',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home.vue')
        }
      ]
    }
  ]
})

export default router
