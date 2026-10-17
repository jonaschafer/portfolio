'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

// The playlist behind the Mixtape nav pill: "Jamming mixtapes" from About's Faves.
export const MIXTAPE_URI = 'spotify:playlist:1em1loy0jdusVEwwryzu6f'

// Tiny shared store so the nav pill, About and the floating player agree on
// whether the player is open and whether music is playing.
let state = { open: false, playing: false }
const subs = new Set()
const emit = () => subs.forEach((f) => f())
export const mixtape = {
  get: () => state,
  set: (patch) => {
    state = { ...state, ...patch }
    emit()
  },
  subscribe: (f) => {
    subs.add(f)
    return () => subs.delete(f)
  },
}
const server = { open: false, playing: false }
export const useMixtape = () => useSyncExternalStore(mixtape.subscribe, mixtape.get, () => server)

// The speaker from About's "Clever voicemails"; the waves radiate while playing.
export function SpeakerIcon({ playing, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" className={playing ? 'speaker-wave' : ''} />
      <path d="M19 5a10 10 0 0 1 0 14" className={playing ? 'speaker-wave speaker-wave-2' : ''} />
    </svg>
  )
}

// Live feed from /api/spotify: what Jon is playing (or last played) and his
// top tracks from the last four weeks. One request shared by every caller,
// refreshed each minute while a page is open.
let feed = null
let inflight = null
const feedSubs = new Set()
const load = () => {
  inflight ??= fetch('/api/spotify')
    .then((r) => r.json())
    .catch(() => null)
    .then((d) => {
      feed = d
      inflight = null
      feedSubs.forEach((f) => f(d))
      return d
    })
  return inflight
}
export function useSpotifyFeed() {
  const [d, setD] = useState(feed)
  useEffect(() => {
    feedSubs.add(setD)
    if (!feed) load()
    const t = setInterval(load, 60000)
    return () => {
      feedSubs.delete(setD)
      clearInterval(t)
    }
  }, [])
  return d
}
