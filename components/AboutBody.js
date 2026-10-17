'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navigation from './Navigation'
import { mixtape, useMixtape, useSpotifyFeed, SpeakerIcon } from './mixtape'
import Footer from './Footer'
import Asterisk from './Asterisk'
import useRandomTheme from './useRandomTheme'

const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"


const FAVES = [
  'Freshly-stirred peanut butter', 'Clever voicemails', 'Jon Stewart', 'Bartlett for America', 'Cherry Coke',
  'Darwinian gardening', 'Diligent note-taking', 'Chop busting', 'Taking fries with that', 'Bird dogging',
  'Moral support', 'Buzzword aversion', 'Jamming mixtapes', 'Bear hugs', 'Simpsons impressions',
  'Fine motor skills', 'Lance Wyman', 'Moving and/or shaking', 'Pinpoint mouse accuracy', 'Firm handshakes',
  'Taco eating', 'Wise cracks', 'Big Sky country', 'Breathing', 'Dumb cracks',
  'Milkshakes in those silver cups', 'Sage advice', 'New adventures',
]

const ROLES = [
  { org: 'ClassDojo', role: 'Head of Brand', years: '2025 to now' },
  { org: 'Work is Play', role: 'Creative Director', years: '2024 to 2025' },
  { org: 'Clockwise', role: 'Lead Brand Designer', years: '2022 to 2024' },
  { org: 'Zapier', role: 'Founding Brand Designer', years: '2017 to 2021' },
  { org: 'AKQA', role: 'Art Director', years: '2015' },
  { org: 'Razorfish', role: 'Art Director', years: '2012 to 2014' },
  { org: 'Freelance', role: 'Designer', years: '2004 to 2012' },
]

// Faves that open somewhere, in a new tab.
const FAVE_LINKS = {
  'Bartlett for America': 'https://www.partsnotincluded.com/wp-content/uploads/2025/01/TWW_S3E10_Napkin-Framed.jpg',
  'Jamming mixtapes': 'https://open.spotify.com/playlist/1em1loy0jdusVEwwryzu6f',
  'Lance Wyman': 'https://www.designboom.com/design/lance-wyman-interview-10-14-2014-2/',
  'Milkshakes in those silver cups': 'https://slate.com/culture/2020/05/why-leftover-milkshake-metal-container-lovebirds.html',
}

// Faves that play a sound instead of opening a link.
const FAVE_SOUNDS = {
  'Clever voicemails': '/audio/dan-fredman-voicemail.mp3',
}

function SoundFave({ label, src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.currentTime = 0
      a.play()
    } else {
      a.pause()
    }
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={playing} className="inline-flex items-center gap-[9px] text-left cursor-pointer">
      <span className="hl">{label}</span>
      <span className="inline-flex items-center gap-[5px] text-[14px] md:text-[16px] opacity-80">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" className={playing ? 'speaker-wave' : ''} />
          <path d="M19 5a10 10 0 0 1 0 14" className={playing ? 'speaker-wave speaker-wave-2' : ''} />
        </svg>
        {playing ? 'playing…' : 'play me!'}
      </span>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </button>
  )
}

const item = `${social} text-[18px] md:text-[21px] leading-[1.15]`
const heading = `${nichromeUltra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`

function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-[10px] md:gap-[12px]">
      {items.map((t) => (
        <li key={t} className={`${item} flex items-center gap-[9px]`}>
          <Asterisk />
          {FAVE_SOUNDS[t] ? (
            <SoundFave label={t} src={FAVE_SOUNDS[t]} />
          ) : FAVE_LINKS[t] ? (
            <a href={FAVE_LINKS[t]} target="_blank" rel="noopener noreferrer" className="hl">
              {t}
            </a>
          ) : (
            t
          )}
        </li>
      ))}
    </ul>
  )
}

// Music, between Lael's intro and History. The copy is static; the rows come
// from Jon's Spotify (top tracks, last four weeks) and refresh themselves.
function OnRepeat({ t }) {
  const feed = useSpotifyFeed()
  const { playing } = useMixtape()
  const top = feed?.top?.slice(0, 6) ?? []
  return (
    <div className="flex flex-col gap-[24px]">
      <h2 className={heading}>On repeat</h2>
      <p className={`${social} text-[18px] md:text-[21px] leading-[1.2] max-w-[640px]`}>
        I don&apos;t play music, but I love the crap outta it. It&apos;s on nearly nonstop, all kinds of genres.
        Here&apos;s what I&apos;m jammin&apos; to right now.
      </p>
      {feed?.now && (
        <p className={`${item} flex flex-wrap items-baseline gap-x-[10px]`}>
          <span className="opacity-70">{feed.now.playing ? 'Now playing' : 'Last played'}</span>
          <a href={feed.now.url} target="_blank" rel="noopener noreferrer" className="hl">
            {feed.now.title}
          </a>
          <span className="opacity-70">{feed.now.artist}</span>
        </p>
      )}
      {top.length > 0 && (
        <ol className="flex flex-col">
          {top.map((s, k) => (
            <li
              key={s.url ?? k}
              className={`${item} hl-row flex items-baseline gap-x-[24px] py-[14px] border-t last:border-b`}
              style={{ borderColor: `${t.ink}40` }}
            >
              <span className="tabular-nums w-[24px] shrink-0 opacity-70">{String(k + 1).padStart(2, '0')}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                {s.title}
              </a>
              <span className="text-right opacity-80">{s.artist}</span>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={() => mixtape.set({ open: true })}
        className={`${social} self-start inline-flex items-center gap-[8px] text-[18px] md:text-[21px] leading-none px-[14px] py-[9px] rounded-full border border-current active:scale-[0.97] transition`}
      >
        <SpeakerIcon playing={playing} />
        {playing ? 'Playing the mixtape…' : 'Play the mixtape'}
      </button>
    </div>
  )
}

export default function AboutBody() {
  const { theme: t, ready } = useRandomTheme()
  const photoRef = useRef(null)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  // The photo may finish before hydration attaches onLoad.
  useEffect(() => {
    const el = photoRef.current
    if (el?.complete && el.naturalWidth > 0) setPhotoLoaded(true)
  }, [])
  // Hold the color block for a beat after the page appears, then reveal.
  useEffect(() => {
    if (!ready || !photoLoaded) return
    const id = setTimeout(() => setShowPhoto(true), 450)
    return () => clearTimeout(id)
  }, [ready, photoLoaded])
  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      {/* Figma: Website — Oct 26, node 7:880 */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] desktop:px-[100px] pt-[20px] md:pt-[40px] pb-[80px] md:pb-[120px]">
        {/* Portrait: starts as a block of the theme's ink color, then the photo
            fades in over it. Tilts 2° on hover. */}
        <div
          className="relative w-[200px] md:w-[280px] aspect-[1162/990] overflow-hidden rounded-[6px] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:rotate-2 motion-reduce:transition-none"
          style={{ backgroundColor: t.ink }}
        >
          <Image
            ref={photoRef}
            src="/images/about/jon-portrait.webp"
            alt="Jon, grinning, in a striped shirt and clear glasses"
            fill
            priority
            sizes="(min-width: 768px) 280px, 200px"
            onLoad={() => setPhotoLoaded(true)}
            className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${showPhoto ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <p className={`${social} text-[18px] md:text-[21px] leading-[1.2] mt-[32px] md:mt-[48px]`}>
          Self promotion isn&apos;t my strong suit, so I&apos;ll have my friend{' '}
          <a href="https://www.linkedin.com/in/laeltyler/" target="_blank" rel="noopener noreferrer" className="hl">
            Lael
          </a>{' '}
          give a bit of an intro
        </p>

        <div className="mt-[28px] md:mt-[36px] grid grid-cols-1 desktop:grid-cols-[minmax(0,867px)_auto] gap-y-[56px] desktop:gap-x-[80px] desktop:justify-between items-start">
          <div className="flex flex-col gap-[56px] md:gap-[80px]">
            <blockquote className={`${nichrome} text-[24px] md:text-[36px] leading-[1.2] tracking-[0.36px] flex flex-col gap-[1.2em]`}>
              <p>
                <span className="-ml-[0.45em]">&ldquo;</span>Jon entered the world of design through the accident of obsession.
                Despite having no formal arts education, he found himself helplessly drawn to Joseph Mueller-Brockman&apos;s
                &lsquo;Grid Systems,&rsquo; clean Nordic design, and the tireless intricacies of Lance Wyman. His restless
                exuberance and appetite for knowledge spurred Jon on a self-taught path towards his future craft.
              </p>
              <p>
                Jon moved to Portland, Oregon in 2004 searching for further growth and creative opportunity. In the
                decades-plus since, he has worked on design projects of nearly every conceivable scale, method, and medium
                and he shows no signs of stopping anytime soon.&rdquo;
              </p>
            </blockquote>

            <OnRepeat t={t} />

            {/* History: rows take a random theme pair on hover, like links */}
            <div className="flex flex-col gap-[24px]">
              <h2 className={heading}>History</h2>
              <ul className="flex flex-col">
                {ROLES.map((r) => (
                  <li
                    key={r.org}
                    className={`${item} hl-row flex flex-wrap items-baseline gap-x-[24px] gap-y-[2px] py-[14px] border-t last:border-b`}
                    style={{ borderColor: `${t.ink}40` }}
                  >
                    <span className="w-full sm:w-[200px] shrink-0">{r.org}</span>
                    <span className="flex-1">{r.role}</span>
                    <span className="tabular-nums">{r.years}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <h2 className={heading}>Faves</h2>
            <Bullets items={FAVES} />
          </div>
        </div>
      </section>

      {/* One random color for the whole page, footer included */}
      <Footer colophon theme={t} />
    </main>
  )
}
