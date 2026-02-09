'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function EditSoundPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/sounds/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Song not found')
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      const links = { ...data.links }
      if (data.youtubeId && !links.youtube) {
        links.youtube = `https://www.youtube.com/watch?v=${data.youtubeId}`
      }
      const res = await fetch(`/api/sounds/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          artist: data.artist,
          date: data.date,
          youtubeId: data.youtubeId || null,
          note: data.note || '',
          links
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      router.push('/play/sounds')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="font-mono bg-white text-black min-h-screen flex items-center justify-center">
        <p className="text-black/50">Loading…</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="font-mono bg-white text-black min-h-screen p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/play/sounds" className="text-black underline">
          ← Back to Sounds
        </Link>
      </div>
    )
  }

  return (
    <div className="font-mono bg-white text-black min-h-screen">
      <header className="border-b-2 border-black">
        <div className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8">
          <Link href="/play/sounds" className="text-black/60 hover:text-black text-sm mb-4 inline-block">
            ← Back to Sounds
          </Link>
          <h1 className="font-['Mondwest',_sans-serif] text-[32px] md:text-[48px] leading-none tracking-tight">
            Edit song
          </h1>
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] text-black/70 mt-2 max-w-[500px]">
            Update title, artist, note, YouTube URL, or streaming links.
          </p>
        </div>
      </header>

      <main className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8">
        <div className="flex flex-col gap-4 max-w-[600px]">
          {error && <p className="text-red-600 text-sm">{error}</p>}

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
              <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Date</label>
              <input
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                placeholder="2026.02.07"
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
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">YouTube URL</label>
              <input
                type="url"
                value={data.links?.youtube || (data.youtubeId ? `https://youtu.be/${data.youtubeId}` : '')}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  const m = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                  const vid = m ? m[1] : null
                  setData(d => ({
                    ...d,
                    youtubeId: vid,
                    links: { ...d.links, youtube: vid ? `https://www.youtube.com/watch?v=${vid}` : (val || undefined) }
                  }))
                }}
                placeholder="https://youtu.be/..."
                className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Spotify URL</label>
              <input
                type="url"
                value={data.links?.spotify || ''}
                onChange={(e) => setData({ ...data, links: { ...data.links, spotify: e.target.value.trim() || undefined } })}
                placeholder="https://open.spotify.com/track/..."
                className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Apple Music URL</label>
              <input
                type="url"
                value={data.links?.apple || ''}
                onChange={(e) => setData({ ...data, links: { ...data.links, apple: e.target.value.trim() || undefined } })}
                placeholder="https://music.apple.com/..."
                className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-black/50 mb-1">Tidal URL</label>
              <input
                type="url"
                value={data.links?.tidal || ''}
                onChange={(e) => setData({ ...data, links: { ...data.links, tidal: e.target.value.trim() || undefined } })}
                placeholder="https://tidal.com/..."
                className="w-full border border-black/30 px-3 py-2 font-mono text-[14px]"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 border-2 border-black bg-black text-white font-mono hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
