import { createClient } from '@supabase/supabase-js'
import fetchRetry from 'fetch-retry'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const fetchWithRetry = fetchRetry(fetch, {
  retries: 3,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  retryOn: (attempt, error) => attempt < 3 && error?.message?.includes('fetch failed')
})

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        global: { fetch: fetchWithRetry }
      })
    : null

// GET: List all sounds — use direct PostgREST fetch (avoids supabase-js fetch issues on Vercel)
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/sounds?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(15000)
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Sounds GET PostgREST:', res.status, text.slice(0, 200))
      return Response.json({ error: `Supabase ${res.status}`, detail: text.slice(0, 100) }, { status: 500 })
    }

    const data = await res.json()
    const songs = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      date: row.date,
      youtubeId: row.youtube_id,
      note: row.note || '',
      links: row.links || {}
    }))

    return Response.json(songs)
  } catch (err) {
    console.error('Sounds GET throw:', err.message, 'cause:', err.cause?.message ?? err.cause)
    return Response.json({
      error: err.message,
      cause: err.cause?.message ?? err.cause
    }, { status: 500 })
  }
}

// POST: Add a new sound
export async function POST(request) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const body = await request.json()
  const { title, artist, date, youtubeId, note, links } = body

  if (!title || !artist) {
    return Response.json({ error: 'Title and artist required' }, { status: 400 })
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
  const row = {
    title: String(title),
    artist: String(artist),
    date: date || today,
    youtube_id: youtubeId || null,
    note: note || '',
    links: links || {}
  }

  const { data, error } = await supabaseAdmin
    .from('sounds')
    .insert([row])
    .select()
    .single()

  if (error) {
    console.error('Sounds POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({
    id: data.id,
    title: data.title,
    artist: data.artist,
    date: data.date,
    youtubeId: data.youtube_id,
    note: data.note,
    links: data.links || {}
  })
}
