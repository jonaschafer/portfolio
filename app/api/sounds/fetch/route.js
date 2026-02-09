// POST: Fetch song metadata from any music URL
// Spotify URLs: use Spotify API (fast, reliable) + Odesli for cross-platform links
// Other URLs: use Odesli

// User-Agent required by MusicBrainz; helps Odesli treat us as a real client
const FETCH_HEADERS = {
  'User-Agent': 'SoundsPortfolio/1.0 (https://github.com)',
  Accept: 'application/json'
}

export async function POST(request) {
  const log = (msg, data) => {
    console.log('[Sounds fetch]', msg, data ?? '')
  }

  try {
    const { url } = await request.json()
    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 })
    }

    log('URL received:', url.slice(0, 60) + (url.length > 60 ? '...' : ''))

    const isSpotify = url.includes('spotify.com')
    const clientId = process.env.SPOTIFY_CLIENT_ID?.trim()
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim()
    const hasSpotifyCreds = !!(clientId && clientSecret)

    log('Detected:', { isSpotify, hasSpotifyCreds, clientIdPresent: !!clientId, clientSecretPresent: !!clientSecret })

    if (isSpotify && hasSpotifyCreds) {
      log('Trying Spotify API...')
      try {
        const spotifyResult = await fetchFromSpotify(url, clientId, clientSecret)
        if (spotifyResult) {
          log('Spotify success:', { title: spotifyResult.title, artist: spotifyResult.artist })
          return Response.json(spotifyResult)
        }
      } catch (spotifyErr) {
        log('Spotify FAILED:', spotifyErr.message)
        return Response.json(
          {
            error: 'Spotify fetch failed — check your Client ID and Secret at developers.spotify.com',
            detail: spotifyErr.message
          },
          { status: 502 }
        )
      }
    }

    if (isSpotify && !hasSpotifyCreds) {
      log('Spotify URL but no creds — falling through to Odesli')
    }

    log('Trying Odesli...')
    const result = await fetchFromOdesli(url)
    log('Odesli success:', { title: result.title, artist: result.artist })
    return Response.json(result)
  } catch (err) {
    const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout')
    log('FATAL:', err.message, err.detail ?? '')
    return Response.json(
      {
        error: isTimeout ? 'Request timed out — try again' : 'Failed to fetch song data',
        detail: err.detail || err.message
      },
      { status: 500 }
    )
  }
}

async function fetchFromSpotify(spotifyUrl, clientId, clientSecret) {
  const trackId = spotifyUrl.split('/track/')[1]?.split('?')[0]
  if (!trackId) throw new Error('Invalid Spotify URL — use a track link like open.spotify.com/track/...')

  console.log('[Sounds fetch] Spotify step 1: Getting token...')
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(5000)
  })
  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    console.error('[Sounds fetch] Spotify token FAILED:', tokenRes.status, errText.slice(0, 200))
    throw new Error(`Spotify auth failed (${tokenRes.status}): ${errText.slice(0, 100)}`)
  }

  console.log('[Sounds fetch] Spotify step 2: Fetching track...')
  const { access_token } = await tokenRes.json()
  const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
    signal: AbortSignal.timeout(5000)
  })
  if (!trackRes.ok) {
    const errBody = await trackRes.json().catch(() => ({}))
    console.error('[Sounds fetch] Spotify track FAILED:', trackRes.status, errBody)
    throw new Error(`Spotify track fetch failed (${trackRes.status}): ${errBody?.error?.message || trackRes.statusText}`)
  }

  const track = await trackRes.json()
  const title = track.name
  const artist = track.artists.map((a) => a.name).join(', ')

  let links = { spotify: spotifyUrl }
  let youtubeId = null

  // Run Odesli (6s timeout, retry once on timeout) and YouTube search in parallel
  const odesliPromise = (async () => {
    const parseOdesli = (data) => {
      const platforms = data?.linksByPlatform || {}
      if (platforms.appleMusic?.url) links.apple = platforms.appleMusic.url
      if (platforms.tidal?.url) links.tidal = platforms.tidal.url
      if (platforms.youtube?.url) {
        links.youtube = platforms.youtube.url
        const m = platforms.youtube.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return m ? m[1] : null
      }
      return null
    }
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(
          `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}`,
          { headers: FETCH_HEADERS, signal: AbortSignal.timeout(6000) }
        )
        if (res.ok) return parseOdesli(await res.json())
      } catch (e) {
        console.warn(`[Sounds fetch] Odesli attempt ${attempt}:`, e.message)
      }
    }
    return null
  })()

  const youtubePromise = process.env.YOUTUBE_API_KEY
    ? (async () => {
        try {
          const query = encodeURIComponent(`${artist} ${title} official`)
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`,
            { signal: AbortSignal.timeout(4000) }
          )
          if (res.ok) {
            const data = await res.json()
            return data?.items?.[0]?.id?.videoId || null
          }
        } catch (e) {
          console.warn('[Sounds fetch] YouTube search:', e.message)
        }
        return null
      })()
    : Promise.resolve(null)

  const musicbrainzPromise = (async () => {
    try {
      console.log('[Sounds fetch] MusicBrainz: Searching...')
      const q = encodeURIComponent(`"${title}" AND artist:"${artist.split(',')[0].trim()}"`)
      const mbRes = await fetch(
        `https://musicbrainz.org/ws/2/recording/?query=${q}&fmt=json&limit=1`,
        { headers: FETCH_HEADERS, signal: AbortSignal.timeout(2500) }
      )
      if (!mbRes.ok) {
        console.warn('[Sounds fetch] MusicBrainz: Search returned', mbRes.status)
        return {}
      }
      const mbData = await mbRes.json()
      const mbid = mbData?.recordings?.[0]?.id
      if (!mbid) {
        console.warn('[Sounds fetch] MusicBrainz: No recording found')
        return {}
      }
      console.log('[Sounds fetch] MusicBrainz: Found recording, fetching url-rels...')
      await new Promise((r) => setTimeout(r, 1100))
      const recRes = await fetch(
        `https://musicbrainz.org/ws/2/recording/${mbid}?inc=url-rels&fmt=json`,
        { headers: FETCH_HEADERS, signal: AbortSignal.timeout(2500) }
      )
      if (!recRes.ok) {
        console.warn('[Sounds fetch] MusicBrainz: Lookup returned', recRes.status)
        return {}
      }
      const recData = await recRes.json()
      const extra = {}
      for (const rel of recData.relations || []) {
        const u = rel?.url?.resource || ''
        if (u.includes('music.apple.com')) extra.apple = u
        if (u.includes('tidal.com')) extra.tidal = u
      }
      if (Object.keys(extra).length) {
        console.log('[Sounds fetch] MusicBrainz: Found', Object.keys(extra).join(', '))
      } else {
        console.warn('[Sounds fetch] MusicBrainz: No Apple/Tidal links in relations')
      }
      return extra
    } catch (e) {
      console.warn('[Sounds fetch] MusicBrainz:', e.message)
      return {}
    }
  })()

  const [odesliYt, searchYt, mbLinks] = await Promise.all([odesliPromise, youtubePromise, musicbrainzPromise])
  youtubeId = odesliYt || searchYt
  if (youtubeId && !links.youtube) {
    links.youtube = `https://www.youtube.com/watch?v=${youtubeId}`
  }
  if (mbLinks?.apple && !links.apple) links.apple = mbLinks.apple
  if (mbLinks?.tidal && !links.tidal) links.tidal = mbLinks.tidal

  return { title, artist, youtubeId, links }
}

async function fetchFromOdesli(url) {
  const response = await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`,
    { headers: FETCH_HEADERS, signal: AbortSignal.timeout(15000) }
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error('[Sounds fetch] Odesli FAILED:', response.status, body.slice(0, 300))
    const err = new Error(response.status === 429 ? 'Rate limited — try again in a minute' : 'Odesli unavailable — try again')
    err.detail = `HTTP ${response.status}: ${body.slice(0, 150)}`
    throw err
  }

  const data = await response.json()
  const platforms = data.linksByPlatform || {}
  console.log('[Sounds fetch] Odesli direct platforms:', Object.keys(platforms || {}))

  let title = 'Unknown Track'
  let artist = 'Unknown Artist'
  if (data.entity) {
    title = data.entity.title || data.entity.name || title
    artist = data.entity.artistName || data.entity.artist || artist
  }
  if (title === 'Unknown Track') title = data.title || data.name || title
  if (artist === 'Unknown Artist') artist = data.artistName || data.artist || artist

  const links = {}
  if (platforms.spotify?.url) links.spotify = platforms.spotify.url
  if (platforms.appleMusic?.url) links.apple = platforms.appleMusic.url
  if (platforms.tidal?.url) links.tidal = platforms.tidal.url
  if (platforms.youtube?.url) links.youtube = platforms.youtube.url

  let youtubeId = null
  const ytUrl = links.youtube || platforms.youtube?.url || url
  const ytMatch = ytUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) youtubeId = ytMatch[1]
  if (!youtubeId && (url.includes('youtube.com') || url.includes('youtu.be'))) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (m) youtubeId = m[1]
  }

  // Fallback: YouTube search when Odesli didn't return YouTube
  if (!youtubeId && process.env.YOUTUBE_API_KEY && title !== 'Unknown Track') {
    try {
      const query = encodeURIComponent(`${artist} ${title} official`)
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (ytRes.ok) {
        const ytData = await ytRes.json()
        const videoId = ytData?.items?.[0]?.id?.videoId
        if (videoId) {
          youtubeId = videoId
          links.youtube = `https://www.youtube.com/watch?v=${videoId}`
        }
      }
    } catch (e) {
      console.warn('[Sounds fetch] YouTube search fallback failed:', e.message)
    }
  }

  return {
    title,
    artist,
    youtubeId,
    links
  }
}
