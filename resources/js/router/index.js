import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '@/stores/auth';
import { isDemo } from '@/demo/preview';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/ChatView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/chat/:sessionId',
        name: 'chat-session',
        component: () => import('@/views/ChatView.vue'),
        meta: { requiresAuth: true },
    },
    {
        // Redirect root to /chat if authenticated, else to /login.
        path: '/',
        redirect: () => (authStore.isAuthenticated() ? '/chat' : '/login'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Global navigation guard
router.beforeEach((to, _from) => {
    if (isDemo && to.query.demo !== '1') {
        return { path: to.path, query: { ...to.query, demo: '1' }, hash: to.hash };
    }
    const isAuth = authStore.isAuthenticated();

    if (to.meta.requiresAuth && !isAuth) {
        return { name: 'login' };
    }

    if (to.meta.requiresGuest && isAuth) {
        return { name: 'chat' };
    }
});

export default router;
