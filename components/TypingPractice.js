'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  PROFILES,
  SESSION_GOAL_SECONDS,
  MIN_ACCURACY_PCT,
  STORAGE_KEY,
} from '../lib/typingConfig'
import { passagesForTier } from '../lib/typingPassages'

const CATEGORY_LABEL = {
  trivia: '🌍 Did You Know',
  movies: '🎬 Movie & Book Moments',
  quotes: '💬 Quote',
}

function todayStr() {
  return new Date().toDateString()
}

function emptyProgress() {
  return {
    date: todayStr(),
    activeSeconds: 0,
    correctChars: 0,
    typedChars: 0,
    completed: false,
  }
}

function loadState() {
  if (typeof window === 'undefined') return { activeProfileId: null, progress: {} }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { activeProfileId: null, progress: {} }
    const parsed = JSON.parse(raw)
    return {
      activeProfileId: parsed.activeProfileId ?? null,
      progress: parsed.progress ?? {},
    }
  } catch {
    return { activeProfileId: null, progress: {} }
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** Today's progress for a profile — resets automatically if the stored date has passed. */
function todayProgressFor(state, profileId) {
  const stored = state.progress[profileId]
  if (stored && stored.date === todayStr()) return stored
  return emptyProgress()
}

// iOS smart-punctuation can swap straight quotes for curly ones as you type;
// normalize both sides so that doesn't register as a typo.
function normalize(str) {
  return str.replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
}

// Fire-and-forget: tell the eero API route to unpause this kid's WiFi
// profile. Must never block the celebratory completion screen, so failures
// are only logged for the owner to see in the console.
function notifyEeroUnlock(profileId) {
  const secret = process.env.NEXT_PUBLIC_INTERNAL_API_SECRET
  fetch('/api/eero/unpause', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-internal-secret': secret } : {}),
    },
    body: JSON.stringify({ profileId }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('[eero] WiFi unlock failed:', res.status, data.error ?? '')
      }
    })
    .catch((err) => {
      console.error('[eero] WiFi unlock request failed:', err.message)
    })
}

function pickPassage(tier, excludeId) {
  const pool = passagesForTier(tier)
  const choices = pool.filter((p) => p.id !== excludeId)
  const from = choices.length > 0 ? choices : pool
  return from[Math.floor(Math.random() * from.length)]
}

function ProfilePicker({ onPick }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div>
        <p className="text-5xl">⌨️✨</p>
        <h1 className="mt-3 text-3xl font-black text-white drop-shadow-sm sm:text-4xl">
          Typing Time!
        </h1>
        <p className="mt-2 text-base text-white/90 sm:text-lg">Who's typing today?</p>
      </div>
      <div className="grid w-full max-w-sm grid-cols-1 gap-5 sm:max-w-md sm:grid-cols-2">
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onPick(profile.id)}
            className="flex flex-col items-center gap-2 rounded-[28px] bg-white/95 px-6 py-8 shadow-[0_14px_0_0_rgba(0,0,0,0.15)] transition-transform active:translate-y-1 active:shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
            style={{ borderBottom: `6px solid ${profile.color}` }}
          >
            <span className="text-6xl">{profile.emoji}</span>
            <span className="mt-1 text-xl font-extrabold text-neutral-800">{profile.name}</span>
            <span className="text-sm font-medium text-neutral-500">age {profile.age}</span>
          </button>
        ))}
      </div>
      <p className="max-w-xs text-xs text-white/70">
        Click your name to start today's practice.
      </p>
    </div>
  )
}

function CompleteScreen({ profile, progress, onSwitchProfile }) {
  const accuracy = progress.typedChars > 0
    ? Math.round((progress.correctChars / progress.typedChars) * 100)
    : 100
  const minutes = Math.max(1, Math.round(progress.activeSeconds / 60))

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <p className="text-7xl">🎉</p>
      <h1 className="text-3xl font-black text-white drop-shadow-sm sm:text-4xl">
        Done for today!
      </h1>
      <p className="max-w-xs text-lg font-semibold text-white/95">
        Nice work, {profile.name} — your WiFi just unlocked! 📶
      </p>
      <div className="flex gap-4 rounded-3xl bg-white/95 px-6 py-4 shadow-lg">
        <div>
          <div className="text-2xl font-black text-neutral-800">{minutes}m</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            typed
          </div>
        </div>
        <div className="w-px bg-neutral-200" />
        <div>
          <div className="text-2xl font-black text-neutral-800">{accuracy}%</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            accuracy
          </div>
        </div>
      </div>
      <button
        onClick={onSwitchProfile}
        className="mt-2 text-sm font-semibold text-white/80 underline underline-offset-4"
      >
        Switch profile
      </button>
    </div>
  )
}

function TypingSession({ profile, initialProgress, onProgressUpdate, onSwitchProfile }) {
  const [progress, setProgress] = useState(initialProgress)
  const [passage, setPassage] = useState(() => pickPassage(profile.tier))
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [nowTick, setNowTick] = useState(() => Date.now())
  const inputRef = useRef(null)

  useEffect(() => {
    if (startedAt === null) return
    const id = setInterval(() => setNowTick(Date.now()), 250)
    return () => clearInterval(id)
  }, [startedAt])

  useEffect(() => {
    inputRef.current?.focus()
  }, [passage])

  const targetChars = useMemo(() => normalize(passage.text).split(''), [passage])
  const typedChars = useMemo(() => normalize(typed).split(''), [typed])

  const correctSoFar = useMemo(
    () => typedChars.reduce((acc, ch, i) => acc + (ch === targetChars[i] ? 1 : 0), 0),
    [typedChars, targetChars]
  )

  const elapsedThisPassageSec = startedAt ? (nowTick - startedAt) / 1000 : 0
  const liveWpm =
    startedAt && elapsedThisPassageSec > 2
      ? Math.round(correctSoFar / 5 / (elapsedThisPassageSec / 60))
      : 0
  const liveAccuracy = typed.length > 0 ? Math.round((correctSoFar / typed.length) * 100) : 100

  const sessionSeconds = progress.activeSeconds + elapsedThisPassageSec
  const sessionPct = Math.min(100, Math.round((sessionSeconds / SESSION_GOAL_SECONDS) * 100))
  const sessionAccuracy =
    progress.typedChars + typed.length > 0
      ? Math.round(
          ((progress.correctChars + correctSoFar) / (progress.typedChars + typed.length)) * 100
        )
      : 100

  const finishPassage = useCallback(() => {
    const passageElapsedSec = startedAt ? Math.max(1, (Date.now() - startedAt) / 1000) : 1
    const nextProgress = {
      date: todayStr(),
      activeSeconds: progress.activeSeconds + passageElapsedSec,
      correctChars: progress.correctChars + correctSoFar,
      typedChars: progress.typedChars + targetChars.length,
      completed: false,
    }
    nextProgress.completed =
      nextProgress.activeSeconds >= SESSION_GOAL_SECONDS &&
      (nextProgress.typedChars === 0 ||
        (nextProgress.correctChars / nextProgress.typedChars) * 100 >= MIN_ACCURACY_PCT)

    setProgress(nextProgress)
    onProgressUpdate(nextProgress)

    if (nextProgress.completed) {
      notifyEeroUnlock(profile.id)
      return
    }
    setTyped('')
    setStartedAt(null)
    setPassage(pickPassage(profile.tier, passage.id))
  }, [startedAt, progress, correctSoFar, targetChars.length, onProgressUpdate, profile.tier, passage.id])

  const handleChange = (e) => {
    const value = e.target.value.slice(0, targetChars.length)
    if (startedAt === null && value.length > 0) setStartedAt(Date.now())
    setTyped(value)
    if (value.length >= targetChars.length && targetChars.length > 0) {
      // Let the last character render as "correct/incorrect" before advancing.
      setTimeout(finishPassage, 120)
    }
  }

  const closeToGoal = sessionSeconds >= SESSION_GOAL_SECONDS && sessionAccuracy < MIN_ACCURACY_PCT

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">{profile.emoji}</span>
            <span className="font-bold">{profile.name}</span>
          </div>
          <button
            onClick={onSwitchProfile}
            className="text-xs font-semibold text-white/70 underline underline-offset-4"
          >
            switch
          </button>
        </div>

        {/* Progress toward today's goal */}
        <div className="mt-4">
          <div className="h-4 w-full overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${sessionPct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs font-semibold text-white/85">
            <span>{sessionPct}% to today's goal</span>
            <span>{sessionAccuracy}% accuracy</span>
          </div>
        </div>

        {closeToGoal && (
          <p className="mt-3 rounded-2xl bg-white/90 px-4 py-2 text-center text-sm font-semibold text-neutral-700">
            So close! Keep accuracy at {MIN_ACCURACY_PCT}%+ to finish up. 🎯
          </p>
        )}

        {/* Live stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/95 py-3 text-center shadow">
            <div className="text-2xl font-black text-neutral-800">{liveWpm}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">wpm</div>
          </div>
          <div className="rounded-2xl bg-white/95 py-3 text-center shadow">
            <div className="text-2xl font-black text-neutral-800">{liveAccuracy}%</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              accuracy
            </div>
          </div>
          <div className="rounded-2xl bg-white/95 py-3 text-center shadow">
            <div className="text-2xl font-black text-neutral-800">
              {Math.floor(elapsedThisPassageSec)}s
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              this one
            </div>
          </div>
        </div>

        {/* Passage */}
        <div className="mt-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-white/80">
            {CATEGORY_LABEL[passage.category] ?? passage.category}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="block w-full rounded-[28px] bg-white/95 p-6 text-left text-2xl leading-relaxed tracking-wide shadow-lg lg:text-3xl"
          >
            {targetChars.map((ch, i) => {
              let cls = 'text-neutral-300'
              if (i < typedChars.length) {
                cls = typedChars[i] === ch ? 'text-emerald-500' : 'bg-rose-200 text-rose-700 rounded'
              } else if (i === typedChars.length) {
                cls = 'text-neutral-800 border-b-4 border-fuchsia-400'
              }
              return (
                <span key={i} className={cls}>
                  {ch}
                </span>
              )
            })}
          </button>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleChange}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            inputMode="text"
            rows={2}
            aria-label="Type the passage above"
            className="mt-3 w-full resize-none rounded-2xl border-2 border-white/60 bg-white/20 p-4 text-lg text-white caret-white placeholder-white/60 outline-none focus:border-white"
            placeholder="Just start typing…"
          />
        </div>
      </div>
    </div>
  )
}

export default function TypingPractice() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState({ activeProfileId: null, progress: {} })

  useEffect(() => {
    setState(loadState())
    setMounted(true)
  }, [])

  const pickProfile = (profileId) => {
    const next = { ...state, activeProfileId: profileId }
    setState(next)
    saveState(next)
  }

  const switchProfile = () => {
    const next = { ...state, activeProfileId: null }
    setState(next)
    saveState(next)
  }

  const updateProgress = (profileId, nextProgress) => {
    setState((prev) => {
      const next = {
        ...prev,
        progress: { ...prev.progress, [profileId]: nextProgress },
      }
      saveState(next)
      return next
    })
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#ff5d8f] via-[#ff9a5a] to-[#3aa0ff]" />
  }

  const activeProfile = PROFILES.find((p) => p.id === state.activeProfileId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff5d8f] via-[#ff9a5a] to-[#3aa0ff] font-sans">
      {!activeProfile && <ProfilePicker onPick={pickProfile} />}
      {activeProfile &&
        (() => {
          const progress = todayProgressFor(state, activeProfile.id)
          if (progress.completed) {
            return (
              <CompleteScreen
                profile={activeProfile}
                progress={progress}
                onSwitchProfile={switchProfile}
              />
            )
          }
          return (
            <TypingSession
              key={activeProfile.id}
              profile={activeProfile}
              initialProgress={progress}
              onProgressUpdate={(next) => updateProgress(activeProfile.id, next)}
              onSwitchProfile={switchProfile}
            />
          )
        })()}
    </div>
  )
}
