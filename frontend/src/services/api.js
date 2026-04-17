import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Interceptor de respuesta para manejo global de errores
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const enriched = new Error(data?.message || error.message);
    enriched.status = status;
    enriched.code = data?.error;
    enriched.details = data?.details;
    enriched.retryAfter = error.response?.headers?.['retry-after'];
    return Promise.reject(enriched);
  }
);

// ──────────────────────────── AI ────────────────────────────

export const generateText = async (prompt, userId = 'default-user') => {
  const { data } = await apiClient.post('/api/ai/generate', { prompt, userId });
  return data;
};

export const estimateTokens = async (prompt) => {
  const { data } = await apiClient.get('/api/ai/estimate', { params: { prompt } });
  return data;
};

// ──────────────────────────── Quota ────────────────────────────

export const getQuotaStatus = async (userId = 'default-user') => {
  const { data } = await apiClient.get('/api/quota/status', { params: { userId } });
  return data;
};

export const getQuotaHistory = async (userId = 'default-user') => {
  const { data } = await apiClient.get('/api/quota/history', { params: { userId } });
  return data;
};

export const upgradePlan = async (userId = 'default-user', targetPlan) => {
  const { data } = await apiClient.post('/api/quota/upgrade', { userId, targetPlan });
  return data;
};
