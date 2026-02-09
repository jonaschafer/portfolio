import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null

function toFrontend(row) {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    date: row.date,
    youtubeId: row.youtube_id,
    note: row.note || '',
    links: row.links || {}
  }
}

// GET: Fetch a single sound
export async function GET(request, { params }) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { id } = params

  const { data, error } = await supabaseAdmin
    .from('sounds')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Song not found' }, { status: 404 })
  }

  return Response.json(toFrontend(data))
}

// PATCH: Update a sound
export async function PATCH(request, { params }) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { id } = params
  const body = await request.json()
  const { title, artist, date, youtubeId, note, links } = body

  if (!title || !artist) {
    return Response.json({ error: 'Title and artist required' }, { status: 400 })
  }

  const row = {
    title: String(title),
    artist: String(artist),
    date: date || null,
    youtube_id: youtubeId || null,
    note: note || '',
    links: links || {}
  }

  const { data, error } = await supabaseAdmin
    .from('sounds')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Sounds PATCH error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(toFrontend(data))
}
