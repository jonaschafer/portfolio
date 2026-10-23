// One-time helper: points Strava's webhook at /api/row/strava. Run it after
// the route is deployed with STRAVA_VERIFY_TOKEN set, because Strava calls the
// route to verify before it saves the subscription. One subscription per app.
//
//   STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... STRAVA_VERIFY_TOKEN=... node scripts/strava-subscribe.mjs
//   ... node scripts/strava-subscribe.mjs --list      show the current one
//   ... node scripts/strava-subscribe.mjs --delete    remove it
const id = process.env.STRAVA_CLIENT_ID
const secret = process.env.STRAVA_CLIENT_SECRET
const verify = process.env.STRAVA_VERIFY_TOKEN
const callback = process.env.ROW_WEBHOOK_URL || 'https://www.jonschafer.com/api/row/strava'
if (!id || !secret) {
  console.error('Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET first.')
  process.exit(1)
}
const API = 'https://www.strava.com/api/v3/push_subscriptions'
const list = async () => (await fetch(`${API}?${new URLSearchParams({ client_id: id, client_secret: secret })}`)).json()

const arg = process.argv[2]
if (arg === '--list') {
  console.log(await list())
} else if (arg === '--delete') {
  for (const s of await list()) {
    const r = await fetch(`${API}/${s.id}?${new URLSearchParams({ client_id: id, client_secret: secret })}`, { method: 'DELETE' })
    console.log(`Deleted ${s.id}: ${r.status}`)
  }
} else {
  if (!verify) {
    console.error('Set STRAVA_VERIFY_TOKEN (any random string, same as in Vercel).')
    process.exit(1)
  }
  const r = await fetch(API, {
    method: 'POST',
    body: new URLSearchParams({ client_id: id, client_secret: secret, callback_url: callback, verify_token: verify }),
  })
  console.log(r.status, await r.json())
}
