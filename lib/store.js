// Persistence for reviews + submissions + feed.
//
// Vercel serverless runs on a READ-ONLY filesystem, so we cannot use
// fs.writeFile in production. We use an in-memory store here — it works
// for the demo but resets on cold starts. To upgrade to durable storage:
//   1. Provision Vercel KV (or Upstash Redis) in the Vercel dashboard
//   2. Add the KV_REST_API_URL + KV_REST_API_TOKEN env vars
//   3. The kv* functions below will pick them up automatically
//
// This module is server-side only. The client never sees it directly.

const globalForStore = globalThis;

function getKv() {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function kvGet(key) {
  const kv = getKv();
  if (!kv) return null;
  try {
    const r = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.result ? JSON.parse(d.result) : null;
  } catch {
    return null;
  }
}

async function kvSet(key, value) {
  const kv = getKv();
  if (!kv) return false;
  try {
    // Vercel KV (Upstash) REST: POST /set/<key> with body value
    await fetch(`${kv.url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
      cache: 'no-store',
    });
    return true;
  } catch {
    return false;
  }
}

// In-memory fallback. Lives on the global object so it survives
// module reloads inside the same serverless instance.
function memBucket(name) {
  if (!globalForStore.__quiverStore) globalForStore.__quiverStore = {};
  if (!globalForStore.__quiverStore[name]) globalForStore.__quiverStore[name] = [];
  return globalForStore.__quiverStore[name];
}

async function loadAll(name) {
  const kv = getKv();
  if (kv) {
    const v = await kvGet(`quiver:${name}`);
    if (v) return v;
  }
  return memBucket(name);
}

async function saveAll(name, list) {
  memBucket(name).splice(0, memBucket(name).length, ...list);
  if (getKv()) await kvSet(`quiver:${name}`, list);
}

// ── Reviews ────────────────────────────────────────────────────────

export async function getReviews(mcpSlug) {
  const all = await loadAll('reviews');
  return all.filter((r) => r.mcpSlug === mcpSlug);
}

export async function getAllReviews() {
  return loadAll('reviews');
}

export async function addReview(review) {
  const all = await loadAll('reviews');
  const id = all.length + '_' + Date.now().toString(36);
  const entry = { id, createdAt: Date.now(), ...review };
  all.push(entry);
  await saveAll('reviews', all);
  return entry;
}

// ── Submissions ────────────────────────────────────────────────────

export async function getSubmissions() {
  return loadAll('submissions');
}

export async function addSubmission(sub) {
  const all = await loadAll('submissions');
  const id = all.length + '_' + Date.now().toString(36);
  const entry = { id, createdAt: Date.now(), status: 'queued', ...sub };
  all.push(entry);
  await saveAll('submissions', all);
  return entry;
}

// ── Activity feed ──────────────────────────────────────────────────

export async function getFeed() {
  return loadAll('feed');
}

export async function pushActivity(item) {
  const all = await loadAll('feed');
  all.unshift({ ts: Date.now(), ...item });
  await saveAll('feed', all.slice(0, 200));
}
