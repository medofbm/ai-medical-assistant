import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor: attach the stored auth token automatically.
apiClient.interceptors.request.use((config) => {
    if (import.meta.env.MODE === 'netlify' && !import.meta.env.VITE_API_BASE_URL) {
        return Promise.reject(new axios.AxiosError(
            'Backend connection is not configured.',
            'ERR_BACKEND_NOT_CONFIGURED',
            config,
            undefined,
            { data: { message: 'الخدمة غير متاحة حالياً: لم يتم ربط الخادم بعد. / The backend is not connected yet.' } },
        ));
    }
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 globally (token expired / unauthenticated).
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            // Redirect to login without importing the router to avoid circular deps.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
