import {createRouter, createWebHistory} from 'vue-router'
import Welcome from '@/layouts/welcome.vue'
import Main from "@/layouts/main.vue";
import {checkTokenValidity} from "@/stores/sync";
import Login from '@/views/login.vue';
import Home from '@/views/home.vue';
import NotFound from "@/views/notFound.vue";
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
                    path: '/app/communications',
                    name: 'communications',
                    component: () => import('../views/communications.vue')
                },
                {
                    path: '/app/photos',
                    name: 'photos',
                    component: () => import('../views/photos.vue')
                },
                {
                    path: '/app/photos/:uid',
                    name: 'photos-user',
                    component: () => import('../views/photosUser.vue')
                },
                {
                    path: '/app/friends',
                    name: 'friends',
                    component: () => import('../views/friends.vue')
                },
                {
                    path: '/app/friends/:id',
                    name: 'friends-user',
                    component: () => import('../views/friendsUser.vue'),
                },
                {
                    path: '/app/settings',
                    name: 'settings',
                    component: () => import('../views/settings.vue'),
                },
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFound,
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
