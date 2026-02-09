'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { songs as staticSongs } from './songs'

// Brutalist color palette for random hovers
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
  '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA',
  '#FF9A8B', '#88D8B0', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

// Helper to format date
function formatDate(dateString) {
  const [year, month, day] = dateString.split('.')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[parseInt(month) - 1]} ${day}, ${year}`
}

// Random color generator
function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

// Streaming service icons (simple SVG)
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.228-2.403-.936-.596-.7-.727-1.536-.455-2.4.254-.807.864-1.29 1.626-1.54.388-.13.79-.18 1.195-.22.387-.04.778-.036 1.165-.07.2-.018.392-.07.525-.238.094-.118.132-.26.132-.415V7.27c0-.27-.1-.412-.368-.44-.027 0-.054-.007-.08-.007l-4.668.89c-.012.002-.025.004-.037.01-.205.055-.296.17-.313.38v7.79c0 .396-.04.79-.2 1.157-.288.652-.79 1.064-1.46 1.26-.354.104-.72.164-1.088.184-.98.052-1.863-.207-2.506-.96-.616-.72-.765-1.57-.498-2.473.242-.82.833-1.323 1.596-1.59.388-.136.793-.2 1.2-.25.387-.05.778-.052 1.165-.096.3-.033.486-.188.543-.49.008-.04.013-.083.013-.125V5.024c0-.322.096-.497.41-.583.076-.02.155-.03.232-.044l6.537-1.238c.032-.006.064-.014.097-.016.37-.036.532.1.532.47v6.5z"/>
  </svg>
)

const TidalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004L8.008 8l4.004 4-4.004 4.004 4.004 4.004 4.004-4.004-4.004-4.004 4.004-4.004 4.004 4.004L24 7.996l-4.004-4.004-4.004 4.004-3.98-4.004z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

// Audio Player Component (YouTube audio-only)
function AudioPlayer({ youtubeId, onPlay, isActive }) {
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef(null)
  const hasYouTube = !!youtubeId

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isActive && isPlaying && playerRef.current) {
      try {
        playerRef.current.pauseVideo?.()
      } catch (e) {
        // Swallow YouTube iframe errors
      }
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPlaying])

  const initPlayer = () => {
    try {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(`player-${youtubeId}`, {
          height: '0',
          width: '0',
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1
          },
          events: {
            onReady: (event) => {
              try {
                setIsLoaded(true)
                const dur = event.target.getDuration?.()
                if (typeof dur === 'number' && !isNaN(dur)) setDuration(dur)
                event.target.playVideo?.()
                setIsPlaying(true)
                onPlay()
                startProgressTracking()
              } catch (e) {
                // YouTube API can throw cross-origin errors; catch to prevent React overlay
              }
            },
            onStateChange: (event) => {
              try {
                if (event.data === window.YT.PlayerState.ENDED) {
                  setIsPlaying(false)
                  setProgress(0)
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                  }
                }
              } catch (e) {
                // Swallow YouTube iframe errors
              }
            }
          }
        })
      } else {
        window.onYouTubeIframeAPIReady = () => initPlayer()
      }
    } catch (e) {
      // YouTube API throws cross-origin errors React can't serialize; prevent overlay
    }
  }

  const startProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      try {
        const player = playerRef.current
        if (player?.getCurrentTime && player?.getDuration) {
          const currentTime = player.getCurrentTime()
          const totalDuration = player.getDuration()
          if (typeof totalDuration === 'number' && totalDuration > 0) {
            setProgress((currentTime / totalDuration) * 100)
          }
        }
      } catch (e) {
        // YouTube iframe can throw; prevent cross-origin error overlay
      }
    }, 500)
  }

  const togglePlay = () => {
    if (!hasYouTube) return
    if (!isLoaded) {
      initPlayer()
      return
    }
    try {
      const player = playerRef.current
      if (!player) return
      if (isPlaying) {
        player.pauseVideo?.()
        setIsPlaying(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        player.playVideo?.()
        setIsPlaying(true)
        onPlay()
        startProgressTracking()
      }
    } catch (e) {
      // YouTube iframe can throw; prevent cross-origin error overlay
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        disabled={!hasYouTube}
        className={`w-12 h-12 border-2 flex items-center justify-center transition-colors ${
          hasYouTube
            ? 'border-black hover:bg-black hover:text-white'
            : 'border-black/30 text-black/30 cursor-not-allowed'
        }`}
        aria-label={hasYouTube ? (isPlaying ? 'Pause' : 'Play') : 'No YouTube — add a YouTube URL to enable playback'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="flex-1 h-2 bg-black/10 relative">
        <div
          className="absolute left-0 top-0 h-full bg-black transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {hasYouTube && <div id={`player-${youtubeId}`} className="hidden" />}
    </div>
  )
}

// Streaming Links Component
function StreamingLinks({ links }) {
  const services = [
    { key: 'spotify', icon: SpotifyIcon, label: 'Spotify' },
    { key: 'apple', icon: AppleIcon, label: 'Apple Music' },
    { key: 'tidal', icon: TidalIcon, label: 'Tidal' },
    { key: 'youtube', icon: YouTubeIcon, label: 'YouTube' }
  ]

  return (
    <div className="flex gap-2">
      {services.map(({ key, icon: Icon, label }) => (
        links[key] && (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            aria-label={`Listen on ${label}`}
            title={label}
          >
            <Icon />
          </a>
        )
      ))}
    </div>
  )
}

// Song Card Component
function SongCard({ song, isActive, onPlay }) {
  const [hoverColor, setHoverColor] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleMouseEnter = () => {
    setHoverColor(getRandomColor())
  }

  const handleMouseLeave = () => {
    setHoverColor(null)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/play/sounds#${song.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} by ${song.artist}`,
          text: song.note,
          url: url
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article
      id={song.id}
      className="border-2 border-black p-6 transition-colors duration-150"
      style={{ backgroundColor: hoverColor || 'white' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-['Mondwest',_sans-serif] text-[28px] md:text-[36px] leading-tight tracking-tight">
            {song.title}
          </h2>
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[18px] text-black/70 mt-1">
            {song.artist}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-black/50">
            {formatDate(song.date)}
          </span>
          <Link
            href={`/play/sounds/edit/${song.id}`}
            className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            aria-label="Edit"
            title="Edit"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </Link>
          <button
            onClick={handleShare}
            className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors relative"
            aria-label="Share"
          >
            <ShareIcon />
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-black text-white px-2 py-1 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Note */}
      <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] md:text-[15px] leading-relaxed mb-6 max-w-[600px]">
        {song.note}
      </p>

      {/* Player */}
      <div className="mb-4">
        <AudioPlayer
          youtubeId={song.youtubeId}
          isActive={isActive}
          onPlay={onPlay}
        />
      </div>

      {/* Streaming Links */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-black/50 uppercase tracking-wider">
          Listen on
        </span>
        <StreamingLinks links={song.links} />
      </div>
    </article>
  )
}

// Main Page Component
export default function MusicBlogPage() {
  const [activeTrack, setActiveTrack] = useState(null)
  const [songs, setSongs] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // Client-side Supabase fetch bypasses broken server API on Vercel
    if (url && anonKey) {
      fetch(`${url.replace(/\/$/, '')}/rest/v1/sounds?select=*&order=created_at.desc`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' }
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) =>
          setSongs(
            (data || []).map((row) => ({
              id: row.id,
              title: row.title,
              artist: row.artist,
              date: row.date,
              youtubeId: row.youtube_id,
              note: row.note || '',
              links: row.links || {}
            }))
          )
        )
        .catch(() => setSongs(staticSongs))
        .finally(() => setLoading(false))
      return
    }
    fetch('/api/sounds')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setSongs(Array.isArray(data) ? data : []))
      .catch(() => setSongs(staticSongs))
      .finally(() => setLoading(false))
  }, [])

  const displaySongs = songs ?? staticSongs

  return (
    <div className="font-mono bg-white text-black min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-black">
        <div className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8 md:py-12">
          <div className="flex justify-between items-start">
            <h1 className="font-['Mondwest',_sans-serif] text-[40px] md:text-[56px] lg:text-[72px] leading-none tracking-tight">
              Sounds
            </h1>
            <a
              href="/play/sounds/add"
              className="font-mono text-[12px] border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors shrink-0"
            >
              + Add
            </a>
          </div>
        </div>
      </header>

      {/* Songs Grid */}
      <main className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-8 md:py-12">
        {loading ? (
          <p className="font-mono text-black/50">Loading…</p>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displaySongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isActive={activeTrack === song.id}
              onPlay={() => setActiveTrack(song.id)}
            />
          ))}
        </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12">
        <div className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] py-6">
          <p className="font-mono text-[11px] text-black/50">
            Audio plays via YouTube. Support artists by streaming on your favorite service.
          </p>
        </div>
      </footer>
    </div>
  )
}