/**
 * Supabase keepalive for portfolio.
 * Supabase free tier pauses projects after 7 days of inactivity.
 * Vercel Cron hits this route periodically so the project stays active.
 *
 * Optional: set CRON_SECRET in Vercel and send Authorization: Bearer <CRON_SECRET>.
 */
export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/sounds?select=id&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!res.ok) throw new Error(`Supabase ${res.status}`)
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[keepalive]', e)
    return Response.json({ error: 'Keepalive failed' }, { status: 500 })
  }
}
