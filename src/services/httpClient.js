import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
});

httpClient.interceptors.request.use((config) => {
  config.headers['X-Correlation-Id'] = crypto.randomUUID();
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshSession() {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    useAuthStore.getState().clearSession();
    throw new Error('no_refresh');
  }
  const { data: envelope } = await axios.post(
    `${baseURL.replace(/\/$/, '')}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30_000,
    },
  );
  if (!envelope?.success || !envelope.data?.accessToken) {
    useAuthStore.getState().clearSession();
    throw new Error('refresh_failed');
  }
  useAuthStore.getState().setSession({
    accessToken: envelope.data.accessToken,
    refreshToken: envelope.data.refreshToken ?? refreshToken,
  });
}

httpClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status !== 401 || !original || original._authRetried) {
      return Promise.reject(error);
    }
    const url = String(original.url ?? '');
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    if (!useAuthStore.getState().refreshToken) {
      return Promise.reject(error);
    }
    original._authRetried = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      const token = useAuthStore.getState().accessToken;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
      }
      return httpClient(original);
    } catch {
      return Promise.reject(error);
    }
  },
);
