import {createRouter, createWebHistory} from 'vue-router'
import Welcome from '@/layouts/welcome.vue'
import Main from "@/layouts/main.vue";
import {checkTokenValidity} from "@/stores/sync";
import Login from '@/views/login.vue';
import Home from '@/views/home.vue';


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
                    component: Login
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
                    redirect: '/app/home'
                },
                {
                    path: '/app/home',
                    name: 'home',
                    component: Home
                },
                {
                    path: '/app/map',
                    name: 'map',
                    component: () => import('../views/map.vue')
                },
                {
                    path: '/app/messenger',
                    name: 'messenger',
                    component: () => import('../views/messenger.vue')
                },
                {
                    path: '/app/friends',
                    name: 'friends',
                    component: () => import('../views/friends.vue')
                },
                {
                    path: '/app/settings',
                    name: 'settings',
                    component: () => import('../views/settings.vue')
                },
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {

    if (to.path.startsWith('/app')) {

        next(); // сразу перехожу на страницу чтьобы не было подвисаний и проверка токена на фоне, если проблемы с рефрешем - просто выкинет на логин

        const isValid = await checkTokenValidity();

        if (!isValid) {
            await router.replace('/login');
        }
    } else {
        next();
    }
});

export default router
