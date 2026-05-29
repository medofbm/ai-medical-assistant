import { reactive } from 'vue';
import apiClient from '@/api/axios';

// ─── Singleton reactive state ──────────────────────────────────────────────────
// NOTE: state is NOT wrapped in `readonly()` — the OnboardingModal and ProfileView
// need to mutate `state.user` directly after a successful PATCH /profile call.
const state = reactive({
    user:  JSON.parse(localStorage.getItem('auth_user'))  ?? null,
    token: localStorage.getItem('auth_token') ?? null,
});

/**
 * Register a new user.
 * @param {object} payload - { name, email, password, password_confirmation }
 */
async function register(payload) {
    const { data } = await apiClient.post('/auth/register', payload);
    _persist(data.token, data.user);
    return data;
}

/**
 * Log in an existing user.
 * @param {object} payload - { email, password }
 */
async function login(payload) {
    const { data } = await apiClient.post('/auth/login', payload);
    _persist(data.token, data.user);
    return data;
}

/**
 * Log out the current user.
 * Always clears local state, even if the API call fails.
 */
async function logout() {
    try {
        await apiClient.post('/auth/logout');
    } finally {
        _clear();
    }
}

function isAuthenticated() {
    return !!state.token;
}

/**
 * Merge updated user fields into state and persist to localStorage.
 * Used by ProfileView and OnboardingModal after a successful PATCH /profile.
 * @param {object} updatedUser – the full user object returned by the API
 */
function updateUser(updatedUser) {
    // Replace the whole user object so all reactive consumers re-render
    state.user = { ...state.user, ...updatedUser };
    localStorage.setItem('auth_user', JSON.stringify(state.user));
}

function _persist(token, user) {
    state.token = token;
    state.user  = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
}

function _clear() {
    state.token = null;
    state.user  = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
}

export const authStore = {
    state, // mutable — intentional (see note above)
    register,
    login,
    logout,
    isAuthenticated,
    updateUser,
};
