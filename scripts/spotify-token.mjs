// One-time helper: gets the refresh token the /api/spotify feed runs on.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    Redirect URI: http://127.0.0.1:8888/callback  (API: Web API)
// 2. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-token.mjs
// 3. Open the printed link, approve, and copy the three lines it prints into
//    .env.local and into Vercel (Production + Preview).
import http from 'node:http'

const id = process.env.SPOTIFY_CLIENT_ID
const secret = process.env.SPOTIFY_CLIENT_SECRET
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.')
  process.exit(1)
}
const redirect = 'http://127.0.0.1:8888/callback'
const scope = 'user-read-currently-playing user-read-recently-played user-top-read'
const auth = `https://accounts.spotify.com/authorize?${new URLSearchParams({ client_id: id, response_type: 'code', redirect_uri: redirect, scope })}`

http
  .createServer(async (req, res) => {
    const code = new URL(req.url, redirect).searchParams.get('code')
    if (!code) return res.end('No code.')
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirect }),
    })
    const j = await r.json()
    res.end(j.refresh_token ? 'Done. Back to the terminal.' : `Failed: ${JSON.stringify(j)}`)
    if (j.refresh_token) {
      console.log(`\nSPOTIFY_CLIENT_ID=${id}\nSPOTIFY_CLIENT_SECRET=${secret}\nSPOTIFY_REFRESH_TOKEN=${j.refresh_token}\n`)
    } else console.error(j)
    process.exit(j.refresh_token ? 0 : 1)
  })
  .listen(8888, '127.0.0.1', () => console.log(`Open this link and approve:\n\n${auth}\n`))
