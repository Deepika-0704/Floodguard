import axios from "axios";

// Backend base URL. In dev, Vite proxies /api -> http://localhost:8000 (see vite.config.js)
// but we call the backend directly here for simplicity in the prototype.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL, timeout: 8000 });

// Small helper: if the backend is unreachable, callers can catch and fall
// back to bundled demo data (see src/data/fallback.js) so the UI never crashes.
async function safeCall(promiseFn, fallbackValue) {
  try {
    const res = await promiseFn();
    return res.data;
  } catch (err) {
    console.warn("[FloodGuard] API call failed, using fallback demo data.", err?.message);
    return fallbackValue;
  }
}

export const api = {
  health: () => safeCall(() => client.get("/health"), { status: "offline" }),
  locations: (fallback) => safeCall(() => client.get("/locations"), fallback),
  predictRisk: (payload) => safeCall(() => client.post("/predict-risk", payload), null),
  floodZones: (time, fallback) => safeCall(() => client.get(`/flood-zones?time=${encodeURIComponent(time)}`), fallback),
  roads: (time, fallback) => safeCall(() => client.get(`/roads?time=${encodeURIComponent(time)}`), fallback),
  impact: (time, fallback) => safeCall(() => client.get(`/impact?time=${encodeURIComponent(time)}`), fallback),
  shelters: (fallback) => safeCall(() => client.get("/shelters"), fallback),
  hospitals: (fallback) => safeCall(() => client.get("/hospitals"), fallback),
  schools: (fallback) => safeCall(() => client.get("/schools"), fallback),
  route: (payload, fallback) => safeCall(() => client.post("/route", payload), fallback),
  citizenReport: (payload) => safeCall(() => client.post("/citizen-report", payload), null),
  citizenReports: (fallback) => safeCall(() => client.get("/citizen-reports"), fallback),
  sos: (payload) => safeCall(() => client.post("/sos", payload), null),
  sosList: (fallback) => safeCall(() => client.get("/sos"), fallback),
  resources: (fallback) => safeCall(() => client.get("/resources"), fallback),
  resourceRecommend: (fallback) => safeCall(() => client.get("/resources/recommend"), fallback),
  simulate: (payload, fallback) => safeCall(() => client.post("/simulate", payload), fallback),
  vulnerability: (fallback) => safeCall(() => client.get("/vulnerability"), fallback),
  assistant: (payload, fallback) => safeCall(() => client.post("/assistant", payload), fallback),
};

export default api;
