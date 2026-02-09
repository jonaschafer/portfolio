'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddSoundPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [fetchingLinks, setFetchingLinks] = useState(false)

  // Read ?url= from query (for iOS Shortcut)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('url')
      if (q) setUrl(q)
    }
  }, [])

  const handleFetch = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch('/api/sounds/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })
      const json = await res.json()
      if (!res.ok) {
        const msg = json.detail ? `${json.error} — ${json.detail}` : (json.error || 'Failed to fetch')
        throw new Error(msg)
      }
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchLinksFromBrowser = async () => {
    if (!data?.links?.spotify && !url.trim()) return
    const musicUrl = data?.links?.spotify || url.trim()
    setFetchingLinks(true)
    try {
      const res = await fetch(
        `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(musicUrl)}`,
        { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) }
      )
      if (res.ok) {
        const json = await res.json()
        const platforms = json.linksByPlatform || {}
        setData((d) => {
          const links = { ...d.links }
          if (platforms.appleMusic?.url) links.apple = platforms.appleMusic.url
          if (platforms.tidal?.url) links.tidal = platforms.tidal.url
          if (platforms.youtube?.url) {
            links.youtube = platforms.youtube.url
            const m = platforms.youtube.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
            return { ...d, youtubeId: m ? m[1] : d.youtubeId, links }
          }
          return { ...d, links }
        })
      }
    } catch (e) {
      console.warn('Client Odesli fetch:', e.message)
    } finally {
      setFetchingLinks(false)
    }
  }

  const handleAdd = async () => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
      const links = { ...data.links }
      if (data.youtubeId && !links.youtube) {
        links.youtube = `https://www.youtube.com/watch?v=${data.youtubeId}`
      }
      const res = await fetch('/api/sounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          artist: data.artist,
          date: today,
          youtubeId: data.youtubeId || null,
          note: data.note || '',
          links
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to add')
      router.push('/play/sounds')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="font-mono bg-white text-black min-h-screen">
      <header className="border-b-2 border-black">
        <div className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8">
          <Link href="/play/sounds" className="text-black/60 hover:text-black text-sm mb-4 inline-block">
            ← Back to Sounds
          </Link>
          <h1 className="font-['Mondwest',_sans-serif] text-[32px] md:text-[48px] leading-none tracking-tight">
            Add a song
          </h1>
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-black/70 mt-2 max-w-[500px]">
            Paste any music link (Spotify, Apple Music, YouTube, Tidal). Fetch metadata, add a note, done.
          </p>
        </div>
      </header>

      <main className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8">
        <div className="flex flex-col gap-4 max-w-[600px]">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="flex-1 border-2 border-black px-4 py-3 font-mono text-[14px]"
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-3 border-2 border-black bg-black text-white font-mono hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? '…' : 'Fetch'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {data && (
            <div className="border-2 border-black p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Title</label>
                <input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full border border-black/30 px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Artist</label>
                <input
                  value={data.artist}
                  onChange={(e) => setData({ ...data, artist: e.target.value })}
                  className="w-full border border-black/30 px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Your note</label>
                <textarea
                  value={data.note ?? ''}
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                  placeholder="Why are you sharing this?"
                  rows={3}
                  className="w-full border border-black/30 px-3 py-2 font-['Haas_Grot_Disp',_sans-serif] resize-none"
                />
              </div>
              {(!data.links?.apple || !data.links?.tidal) && data.links?.spotify && (
                <button
                  type="button"
                  onClick={handleFetchLinksFromBrowser}
                  disabled={fetchingLinks}
                  className="text-sm text-black/60 hover:text-black underline disabled:opacity-50"
                >
                  {fetchingLinks ? 'Fetching…' : 'Try fetching Apple/Tidal from browser'}
                </button>
              )}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">YouTube URL (optional)</label>
                <input
                  type="url"
                  value={data.links?.youtube || (data.youtubeId ? `https://youtu.be/${data.youtubeId}` : '')}
                  onChange={(e) => {
                    const val = e.target.value.trim()
                    const m = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                    const id = m ? m[1] : null
                    setData(d => ({
                      ...d,
                      youtubeId: id,
                      links: { ...d.links, youtube: id ? `https://www.youtube.com/watch?v=${id}` : (val || undefined) }
                    }))
                  }}
                  placeholder="Paste when Odesli didn't find one — e.g. https://youtu.be/JlcewUhHvaA"
                  className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
                />
                <p className="text-black/50 text-[12px] mt-1">Add when auto-fetch misses it. Enables the play button.</p>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Apple Music URL (optional)</label>
                <input
                  type="url"
                  value={data.links?.apple || ''}
                  onChange={(e) => setData({ ...data, links: { ...data.links, apple: e.target.value.trim() || undefined } })}
                  placeholder="https://music.apple.com/..."
                  className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Tidal URL (optional)</label>
                <input
                  type="url"
                  value={data.links?.tidal || ''}
                  onChange={(e) => setData({ ...data, links: { ...data.links, tidal: e.target.value.trim() || undefined } })}
                  placeholder="https://tidal.com/..."
                  className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-6 py-3 border-2 border-black bg-black text-white font-mono hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              >
                {saving ? 'Adding…' : 'Add to Sounds'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-black/20">
          <h2 className="font-['Mondwest',_sans-serif] text-[20px] mb-4">iOS Shortcut</h2>
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-black/70 max-w-[500px] mb-4">
            Copy a song link on your phone, run a Shortcut to open this page with the URL pre-filled, then Fetch → Add.
          </p>
          <ol className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-black/80 space-y-2 list-decimal list-inside">
            <li>Shortcuts → New Shortcut</li>
            <li>Add <strong>Get Contents of Clipboard</strong></li>
            <li>Add <strong>Text</strong> → <code className="bg-black/5 px-1">https://YOUR-SITE.com/play/sounds/add?url=</code></li>
            <li>Add <strong>Combine Text</strong> → Text first, then Clipboard</li>
            <li>Add <strong>Open URL</strong> → use combined result</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
