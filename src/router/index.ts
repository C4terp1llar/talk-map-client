import {createRouter, createWebHistory} from 'vue-router'
import Welcome from '@/layouts/welcome.vue'
import Main from "@/layouts/main.vue";
import {checkTokenValidity} from "@/stores/sync";
import Login from '@/views/login.vue';
import Home from '@/views/home.vue';
import {setPendingEnd, setPendingStart} from "@/utils/refreshStore";

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
                    component: () => import('../views/settings.vue'),
                },
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.path.startsWith('/app')) {

        if (from.path.startsWith('/app')) {
            next();

            const isValid = await checkTokenValidity();

            if (!isValid) {
                await router.push('/login');
            }

        }else {
            setPendingStart()
            const isValid = await checkTokenValidity();

            if (isValid) {
                next();
                setPendingEnd()
            } else {
                next('/login')
                setPendingEnd()
            }
        }


    } else {
        if (localStorage.getItem('access_token') !== null) {
            const isValid = await checkTokenValidity();

            if (isValid) {
                next('/app');
            } else {
                localStorage.removeItem('access_token');
                next()
            }
        } else {
            next();
        }
    }
});

export default router
