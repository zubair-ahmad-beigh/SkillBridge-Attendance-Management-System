import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Inject Clerk JWT on every request
api.interceptors.request.use(async (config) => {
  try {
    // Dynamic import to avoid SSR issues
    const { getToken } = await import('@clerk/nextjs/server').catch(() => ({ getToken: null }));
    // On client side, use window.__clerk_session
    if (typeof window !== 'undefined' && (window as any).__clerk_session) {
      const token = await (window as any).__clerk_session.getToken();
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// ─── User ────────────────────────────────────────────────────────────────────
export const syncUser = (data: {
  clerkUserId: string;
  name: string;
  email: string;
  role: string;
  institutionId?: string;
}) => api.post('/users/sync', data).then(r => r.data);

export const getMe = () => api.get('/users/me').then(r => r.data);

// ─── Batches ─────────────────────────────────────────────────────────────────
export const getBatches = () => api.get('/batches').then(r => r.data);
export const createBatch = (data: { name: string; institutionId: string }) =>
  api.post('/batches', data).then(r => r.data);
export const generateInvite = (batchId: string) =>
  api.post(`/batches/${batchId}/invite`).then(r => r.data);
export const joinBatch = (batchId: string, inviteToken: string) =>
  api.post(`/batches/${batchId}/join`, { inviteToken }).then(r => r.data);
export const getBatchSummary = (batchId: string) =>
  api.get(`/batches/${batchId}/summary`).then(r => r.data);

// ─── Sessions ────────────────────────────────────────────────────────────────
export const getSessions = () => api.get('/sessions').then(r => r.data);
export const createSession = (data: {
  batchId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) => api.post('/sessions', data).then(r => r.data);
export const getSessionAttendance = (sessionId: string) =>
  api.get(`/attendance/session/${sessionId}`).then(r => r.data);

// ─── Attendance ──────────────────────────────────────────────────────────────
export const markAttendance = (data: { sessionId: string; status: string }) =>
  api.post('/attendance/mark', data).then(r => r.data);
export const getMyAttendance = () => api.get('/attendance/me').then(r => r.data);

// ─── Summaries ───────────────────────────────────────────────────────────────
export const getInstitutionSummary = (institutionId: string) =>
  api.get(`/institutions/${institutionId}/summary`).then(r => r.data);
export const getProgrammeSummary = () =>
  api.get('/programme/summary').then(r => r.data);

export default api;
