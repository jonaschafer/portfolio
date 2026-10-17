'use client'

import { useEffect, useRef } from 'react'
import { MIXTAPE_URI, mixtape, useMixtape } from './mixtape'

// Floating Spotify player, bottom right. Lives in the root layout so the music
// keeps going across pages. The embed only loads the first time someone opens
// it. Visitors signed in to Spotify hear full tracks; others get previews.
export default function MixtapePlayer() {
  const { open } = useMixtape()
  const host = useRef(null)
  const controller = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (!open || started.current) return
    started.current = true
    const make = (API) =>
      API.createController(host.current, { uri: MIXTAPE_URI, width: '100%', height: 152 }, (c) => {
        controller.current = c
        c.addListener('playback_update', (e) => mixtape.set({ playing: !e.data.isPaused }))
        c.addListener('ready', () => c.play())
      })
    if (window.SpotifyIframeApi) return make(window.SpotifyIframeApi)
    window.onSpotifyIframeApiReady = (API) => {
      window.SpotifyIframeApi = API
      make(API)
    }
    const s = document.createElement('script')
    s.src = 'https://open.spotify.com/embed/iframe-api/v1'
    s.async = true
    document.body.appendChild(s)
  }, [open])

  const close = () => {
    controller.current?.pause()
    mixtape.set({ open: false, playing: false })
  }

  return (
    <div
      role="region"
      aria-label="Mixtape player"
      aria-hidden={!open}
      className={`fixed z-[60] right-[12px] bottom-[12px] md:right-[26px] md:bottom-[26px] w-[calc(100%-24px)] max-w-[380px] transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[12px] pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={close}
        tabIndex={open ? 0 : -1}
        aria-label="Close the mixtape"
        className="absolute -top-[12px] -right-[8px] z-10 w-[28px] h-[28px] rounded-full flex items-center justify-center shadow-md active:scale-[0.97] transition"
        style={{ backgroundColor: 'var(--page-ink, #2E2E2E)', color: 'var(--page-bg, #FFFFFF)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <div className="rounded-[12px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] h-[152px] bg-[#282828]">
        <div ref={host} />
      </div>
    </div>
  )
}
