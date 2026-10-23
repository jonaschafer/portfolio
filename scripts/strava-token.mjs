// One-time helper: gets the refresh token the /row Strava sync runs on.
//
// 1. Create an app at https://www.strava.com/settings/api
//    Authorization Callback Domain: 127.0.0.1
// 2. STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... node scripts/strava-token.mjs
// 3. Open the printed link, approve, and copy the lines it prints into
//    .env.local and into Vercel (Production + Preview).
import http from 'node:http'

const id = process.env.STRAVA_CLIENT_ID
const secret = process.env.STRAVA_CLIENT_SECRET
if (!id || !secret) {
  console.error('Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET first.')
  process.exit(1)
}
const redirect = 'http://127.0.0.1:8889/callback'
const auth = `https://www.strava.com/oauth/authorize?${new URLSearchParams({
  client_id: id,
  response_type: 'code',
  redirect_uri: redirect,
  approval_prompt: 'force',
  scope: 'read,activity:read_all',
})}`

http
  .createServer(async (req, res) => {
    const code = new URL(req.url, redirect).searchParams.get('code')
    if (!code) return res.end('No code.')
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: id, client_secret: secret, code, grant_type: 'authorization_code' }),
    })
    const j = await r.json()
    res.end(j.refresh_token ? 'Done. Back to the terminal.' : `Failed: ${JSON.stringify(j)}`)
    if (j.refresh_token) {
      console.log(
        `\nSTRAVA_CLIENT_ID=${id}\nSTRAVA_CLIENT_SECRET=${secret}\nSTRAVA_REFRESH_TOKEN=${j.refresh_token}\nSTRAVA_ATHLETE_ID=${j.athlete?.id ?? ''}\n`
      )
    } else console.error(j)
    process.exit(j.refresh_token ? 0 : 1)
  })
  .listen(8889, '127.0.0.1', () => console.log(`Open this link and approve:\n\n${auth}\n`))
