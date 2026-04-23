import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEV_ROLE = process.env.NEXT_PUBLIC_DEV_ROLE;

// ─── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// In dev mode: inject X-Dev-Role so backend can resolve user without Clerk JWT
api.interceptors.request.use((config) => {
  if (DEV_ROLE) {
    config.headers['X-Dev-Role'] = DEV_ROLE;
  }
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
export const getProgrammeSummary = () =>
  api.get('/programme/summary').then(r => r.data);

export default api;
