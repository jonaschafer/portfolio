import { NextResponse } from 'next/server'
import { getFeed, spotifyConfigured } from '../../../lib/spotify'

export const dynamic = 'force-dynamic'

// The live feed for the About block and the footer. Cached at the edge for
// 30s so a busy page makes at most a couple of Spotify calls a minute.
export async function GET() {
  if (!spotifyConfigured()) return NextResponse.json({ configured: false, now: null, top: [] })
  try {
    const feed = await getFeed()
    return NextResponse.json(feed, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=300' } })
  } catch (e) {
    console.error('[spotify]', e.message)
    return NextResponse.json({ configured: true, now: null, top: [], error: true }, { status: 200 })
  }
}
