const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function get(path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined))
  ).toString();
  const url = `${BASE}${path}${qs ? "?" + qs : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

// ── Vehicles ────────────────────────────────────────────────────────────────
export const vehiclesApi = {
  list: (params) => get("/vehicles/", params),
  detail: (slug) => get(`/vehicles/${slug}/`),
  featured: () => get("/vehicles/featured/"),
  similar: (slug) => get(`/vehicles/${slug}/similar/`),
  stats: () => get("/vehicles/stats/"),
};

// ── Brands ──────────────────────────────────────────────────────────────────
export const brandsApi = {
  list: () => get("/brands/"),
  models: (slug) => get(`/brands/${slug}/models/`),
};

// ── Vehicle Models ───────────────────────────────────────────────────────────
export const modelsApi = {
  list: (brandSlug) => get("/vehicle-models/", brandSlug ? { brand__slug: brandSlug } : {}),
};

// ── FAQs ────────────────────────────────────────────────────────────────────
export const faqsApi = {
  list: (category) => get("/faqs/", category ? { category } : {}),
};

// ── Forms ───────────────────────────────────────────────────────────────────
export const formsApi = {
  enquire:    (body) => post("/enquiries/",     body),
  sellCar:    (body) => post("/sell-requests/", body),
  contact:    (body) => post("/contact/",       body),
};