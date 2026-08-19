# /typing → eero WiFi unlock setup

When a kid finishes their daily typing session on `/typing`, the site calls
an internal API route that unpauses their eero profile, giving their devices
WiFi back for the rest of the day. This doc covers the one-time setup. It
does **not** cover re-locking WiFi each day — that's the eero app's own
per-profile schedule, configured directly there.

## How it fits together

- `lib/typingConfig.js` — the two kid profiles (`kid1`, `kid2`) and the daily
  completion goal. Already existed before this change.
- `components/TypingPractice.js` — when a profile's session completes, it
  fires a one-shot request to unlock WiFi. This never blocks or delays the
  celebratory completion screen — if the unlock call fails, the screen still
  shows and the error is only logged to the browser console.
- `app/api/eero/unpause/route.js` — server-side route that actually talks to
  eero. Validates a shared secret, then calls eero's unofficial API to
  unpause the right kid's profile.
- `scripts/eero-login.mjs` — a one-time script *you* run locally to log in
  to eero and get the values the route above needs.

eero has no official public API. This uses the same unofficial REST API
(`api-user.e2ro.com`) that Home Assistant's eero integration and other
open-source eero clients rely on. It could change or break without notice.

## 1. Run the bootstrap script locally

On your own machine (not in any CI or sandbox — it needs a live OTP sent to
your phone/email):

```
node scripts/eero-login.mjs
```

It will:
1. Ask for your eero account phone or email, call eero's login endpoint.
2. Ask for the one-time code eero texts/emails you, and verify it.
3. Print your session token, your network's ID, and every profile on that
   network with its ID and name.

Everything prints to your terminal only — the script never writes to disk or
logs anywhere persistent.

## 2. Set Vercel environment variables

In the Vercel project's settings, add:

| Variable | Value |
|---|---|
| `EERO_SESSION_TOKEN` | the session token the script printed |
| `EERO_NETWORK_ID` | your network's ID |
| `EERO_PROFILE_ID_KID1` | the eero profile ID for whichever kid is `kid1` in `lib/typingConfig.js` |
| `EERO_PROFILE_ID_KID2` | same, for `kid2` |
| `NEXT_PUBLIC_INTERNAL_API_SECRET` | any random string you make up |

If you ever rename or add a profile in `lib/typingConfig.js` (the `id`
field), add a matching `EERO_PROFILE_ID_<ID>` env var (uppercased).

**Security note:** `NEXT_PUBLIC_INTERNAL_API_SECRET` ends up in the
browser's JS bundle, because the completion screen calls the unlock route
directly from the browser. Anyone who opens dev tools on the page could read
it and hit the route themselves. That's an accepted tradeoff for a small
family tool where the worst case is "WiFi unlocks a bit early" — don't reuse
this pattern anywhere the stakes are higher.

eero session tokens can expire or get invalidated. If unlocking stops
working, re-run `node scripts/eero-login.mjs` and update
`EERO_SESSION_TOKEN` in Vercel.

## 3. Set the daily pause schedule in the eero app

This repo only handles *unpausing* a profile when a kid finishes typing. The
daily re-lock — pausing each kid's profile again every morning — is
configured directly in the eero app, per profile, using eero's own schedule
feature. Nothing here does that automatically.
