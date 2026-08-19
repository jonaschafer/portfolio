/**
 * Unpauses one kid's eero profile so their devices get WiFi for the rest of
 * the day. Called from the /typing completion flow once a profile finishes
 * its daily session. Daily re-pausing is handled by eero's own in-app
 * schedule, not by this route.
 *
 * Uses eero's unofficial REST API (api-user.e2ro.com) — there is no official
 * public API. EERO_SESSION_TOKEN comes from a one-time local login done with
 * scripts/eero-login.mjs; see docs/typing-eero-setup.md.
 */

const EERO_API_BASE = 'https://api-user.e2ro.com/2.2'

function profileEnvVar(profileId) {
  return `EERO_PROFILE_ID_${String(profileId).toUpperCase()}`
}

export async function POST(request) {
  const expectedSecret = process.env.NEXT_PUBLIC_INTERNAL_API_SECRET
  const providedSecret = request.headers.get('x-internal-secret')
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const profileId = body?.profileId
  if (!profileId) {
    return Response.json({ error: 'profileId is required' }, { status: 400 })
  }

  const sessionToken = process.env.EERO_SESSION_TOKEN
  const networkId = process.env.EERO_NETWORK_ID
  const eeroProfileId = process.env[profileEnvVar(profileId)]

  if (!sessionToken || !networkId || !eeroProfileId) {
    console.error(
      `[eero] Not configured for profile "${profileId}" — check EERO_SESSION_TOKEN, EERO_NETWORK_ID, and ${profileEnvVar(profileId)}.`
    )
    return Response.json({ error: 'Eero not configured for this profile' }, { status: 503 })
  }

  try {
    const res = await fetch(`${EERO_API_BASE}/networks/${networkId}/profiles/${eeroProfileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        's-token': sessionToken,
      },
      body: JSON.stringify({ paused: false }),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[eero] PUT profile ${eeroProfileId} -> ${res.status}: ${text.slice(0, 300)}`)
      return Response.json({ error: 'Eero API request failed' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[eero] unpause request threw:', err.message)
    return Response.json({ error: 'Eero API request failed' }, { status: 502 })
  }
}
