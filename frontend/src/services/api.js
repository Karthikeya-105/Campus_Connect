import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Attaches JWT to every outgoing request.
// Also records the start time (used to detect slow requests).
// ─────────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.metadata = { startTime: Date.now() };
        return config;
    },
    (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Logs slow responses (helpful for diagnosing cold starts).
// Handles expired/invalid tokens by clearing localStorage.
// ─────────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);
        if (duration > 5000) {
            console.warn(
                `[API] Slow response: ${duration}ms for ${response.config.method?.toUpperCase()} ${response.config.url}`
            );
        }
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        // Auto-logout on expired/invalid token
        if (status === 401 && !url.includes('/auth/')) {
            localStorage.clear();
            // Only redirect if not already on the login page
            if (!window.location.pathname.startsWith('/login') &&
                !window.location.pathname.startsWith('/company/login') &&
                !window.location.pathname.startsWith('/admin/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;