// Server-only Strava client for /row. Runs on Jon's account through a refresh
// token, like lib/spotify.js. Strava rotates refresh tokens, so the newest one
// is kept in Supabase (row_state) and the env var only seeds it.
// Get the first token with `node scripts/strava-token.mjs`.
// Env: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN.
import { getState, setState } from './store'

const API = 'https://www.strava.com/api/v3'
const TOKEN_KEY = 'strava_refresh_token'
export const ROW_TYPES = ['Rowing', 'VirtualRow']

export const stravaConfigured = () =>
  Boolean(process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET && process.env.STRAVA_REFRESH_TOKEN)

let cached = null // { token, expires } for the life of a warm function

async function accessToken() {
  if (cached && cached.expires > Date.now() / 1000 + 60) return cached.token
  const refresh = (await getState(TOKEN_KEY).catch(() => null)) || process.env.STRAVA_REFRESH_TOKEN
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Strava token ${res.status}`)
  const j = await res.json()
  if (j.refresh_token && j.refresh_token !== refresh) await setState(TOKEN_KEY, j.refresh_token)
  cached = { token: j.access_token, expires: j.expires_at }
  return cached.token
}

async function get(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Strava ${path} ${res.status}`)
  return res.json()
}

// Rowing activities after a unix timestamp, for backfill.
export async function listRowIds(after = 0) {
  const ids = []
  for (let page = 1; page < 20; page++) {
    const batch = await get(`/athlete/activities?after=${after}&per_page=100&page=${page}`)
    if (!batch?.length) break
    for (const a of batch) if (ROW_TYPES.includes(a.sport_type)) ids.push(a.id)
    if (batch.length < 100) break
  }
  return ids
}

// One activity as a row_workouts record, or { skip } when it isn't a row.
export async function fetchRow(id) {
  const a = await get(`/activities/${id}`)
  if (!a) return { skip: 'missing' }
  if (!ROW_TYPES.includes(a.sport_type)) return { skip: a.sport_type }
  const [streams, laps] = await Promise.all([
    get(`/activities/${id}/streams?keys=time,distance,cadence,watts&key_by_type=true`),
    get(`/activities/${id}/laps`),
  ])
  const s = (k) => streams?.[k]?.data || []
  return {
    row: {
      id: a.id,
      name: a.name,
      start_local: a.start_date_local.replace('Z', ''),
      distance: a.distance,
      moving_time: a.moving_time,
      avg_watts: a.average_watts ?? null,
      avg_spm: a.average_cadence ?? null,
      calories: a.calories != null ? Math.round(a.calories) : null,
      laps: (laps || []).map((l) => ({
        time: l.moving_time,
        distance: l.distance,
        watts: l.average_watts ?? null,
        spm: l.average_cadence ?? null,
      })),
      stream: { t: s('time'), d: s('distance'), spm: s('cadence'), w: s('watts') },
      notes: a.description?.trim() || null,
    },
  }
}
