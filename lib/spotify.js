// Server-only Spotify client for the live "what I'm jammin' to" feed.
// Uses Jon's account through a long-lived refresh token, so visitors never
// log in. Get the token once with `node scripts/spotify-token.mjs`.
// Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API = 'https://api.spotify.com/v1'

export const spotifyConfigured = () =>
  Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN)

async function accessToken() {
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: process.env.SPOTIFY_REFRESH_TOKEN }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Spotify token ${res.status}`)
  return (await res.json()).access_token
}

const track = (t) =>
  t && {
    title: t.name,
    artist: t.artists?.map((a) => a.name).join(', '),
    url: t.external_urls?.spotify,
    art: t.album?.images?.at(-1)?.url,
  }

async function get(token, path) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (res.status === 204) return null // nothing playing
  if (!res.ok) throw new Error(`Spotify ${path} ${res.status}`)
  return res.json()
}

// What's playing now (or the most recent track), plus the last four weeks'
// top tracks. One token, three calls in parallel.
export async function getFeed() {
  const token = await accessToken()
  const [now, recent, top] = await Promise.all([
    get(token, '/me/player/currently-playing').catch(() => null),
    get(token, '/me/player/recently-played?limit=1').catch(() => null),
    get(token, '/me/top/tracks?time_range=short_term&limit=8').catch(() => null),
  ])
  const playing = Boolean(now?.is_playing && now?.item?.type === 'track')
  return {
    configured: true,
    now: playing ? { ...track(now.item), playing: true } : recent?.items?.[0] ? { ...track(recent.items[0].track), playing: false } : null,
    top: (top?.items ?? []).map(track),
  }
}
