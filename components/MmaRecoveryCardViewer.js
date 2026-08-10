'use client'

import { useEffect, useRef, useState } from 'react'
import chaptersData from '../app/mma/data/chapters.json'
import milestonesData from '../app/mma/data/milestones.json'
import trainingData from '../app/mma/data/training-weeks.json'
import psychologyData from '../app/mma/data/psychology-checkpoints.json'
import MmaRecoveryChapterLayers from './MmaRecoveryChapterLayers'

const STATUS_WORD = { past: 'lived', current: 'now', upcoming: 'planned' }
const SWIPE_THRESHOLD = 50

function getStatus(startDate, endDate, today) {
  const s = new Date(startDate + 'T00:00:00Z')
  const e = new Date(endDate + 'T23:59:59Z')
  if (today < s) return 'upcoming'
  if (today > e) return 'past'
  return 'current'
}

export default function MmaRecoveryCardViewer() {
  const [today, setToday] = useState(null)
  // Read the incoming #anchor synchronously, before any effect gets a chance to overwrite
  // the URL hash — the index-sync effect below fires on mount too and would otherwise
  // stomp a real deep link with chapter 0's anchor first.
  const initialHash = useRef(typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '')
  const [index, setIndex] = useState(() => {
    const idx = chaptersData.chapters.findIndex((c) => c.anchor === initialHash.current)
    return idx >= 0 ? idx : 0
  })
  const [layer, setLayer] = useState('body')
  const [direction, setDirection] = useState('next')
  const touchStartX = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  const chapters = chaptersData.chapters.map((c) => ({
    ...c,
    status: today ? getStatus(c.startDate, c.endDate, today) : 'upcoming',
  }))

  // Only jump to today's current chapter if there was no deep link — a direct link to a
  // specific chapter should win over "open to today," not get silently overridden.
  useEffect(() => {
    if (!today || initialHash.current) return
    const current = chapters.find((c) => c.status === 'current')
    if (current) setIndex(chapters.findIndex((c) => c.anchor === current.anchor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(today)])

  const chapter = chapters[index]
  const partMeta = chaptersData.parts.find((p) => p.id === chapter.part)
  const phaseById = Object.fromEntries(trainingData.phases.map((p) => [p.id, p]))
  const phases = chapter.phaseIds.map((id) => phaseById[id]).filter(Boolean)
  const milestones = milestonesData.milestones.filter((m) => m.anchor === chapter.anchor)
  const checkpoints = psychologyData.checkpoints.filter((cp) => cp.anchor === chapter.anchor)

  // Functional updates so rapid repeated taps/swipes (before a re-render lands) each
  // advance from the true current index instead of all reading the same stale value.
  const goTo = (indexOrUpdater) => {
    setIndex((prev) => {
      const raw = typeof indexOrUpdater === 'function' ? indexOrUpdater(prev) : indexOrUpdater
      const clamped = Math.max(0, Math.min(chapters.length - 1, raw))
      if (clamped !== prev) setDirection(clamped > prev ? 'next' : 'prev')
      return clamped
    })
  }

  // Side effects of an index change (reset layer/scroll, sync the URL) live here so they
  // run once per actual change, regardless of how goTo was called.
  useEffect(() => {
    const current = chaptersData.chapters[index]
    if (!current) return
    setLayer(current.entries?.length > 0 ? 'story' : 'body')
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${current.anchor}`)
    }
  }, [index])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -SWIPE_THRESHOLD) goTo((i) => i + 1)
    else if (delta > SWIPE_THRESHOLD) goTo((i) => i - 1)
    touchStartX.current = null
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-[16px] md:p-[32px]"
      style={{ backgroundColor: '#FDFBF7' }}
    >
      <div
        className="w-full flex flex-col"
        style={{
          maxWidth: 480, height: 'min(88vh, 720px)', backgroundColor: '#FFFFFF', borderRadius: 20,
          boxShadow: '0 40px 80px -30px rgba(90, 70, 40, 0.28)', overflow: 'hidden',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Header chrome */}
        <div className="px-[24px] pt-[22px] pb-[14px] flex-shrink-0">
          <div className="flex items-center justify-between mb-[14px]">
            <span className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] tracking-[0.12em] uppercase" style={{ color: '#a99b7f' }}>
              {String(chapter.id).padStart(2, '0')} / 14 — {partMeta.title}
            </span>
            <div className="flex items-center gap-[10px]">
              {index > 0 && (
                <button onClick={() => goTo(0)} className="mma-btn-press text-[11px] underline" style={{ color: '#a99b7f' }}>
                  Start over
                </button>
              )}
              <button
                onClick={() => goTo((i) => i - 1)}
                disabled={index === 0}
                className="mma-btn-press text-[16px] w-[26px] h-[26px] flex items-center justify-center rounded-full"
                style={{ color: index === 0 ? '#e4dcc9' : '#4a3b2c' }}
                aria-label="Previous chapter"
              >
                ‹
              </button>
              <button
                onClick={() => goTo((i) => i + 1)}
                disabled={index === chapters.length - 1}
                className="mma-btn-press text-[16px] w-[26px] h-[26px] flex items-center justify-center rounded-full"
                style={{ color: index === chapters.length - 1 ? '#e4dcc9' : '#4a3b2c' }}
                aria-label="Next chapter"
              >
                ›
              </button>
            </div>
          </div>

          <h2 className="font-['Fraunces',_serif] text-[26px] leading-[1.15] mb-[6px]" style={{ color: '#2b2015' }}>
            {chapter.title}
          </h2>
          <p className="text-[13px] italic mb-[16px]" style={{ color: '#a99b7f' }}>
            {chapter.dateRange} — {STATUS_WORD[chapter.status]}
          </p>

          <div className="flex items-center gap-[18px]">
            {[
              ['story', 'Story'],
              ['body', 'Body'],
              ['head', 'Head'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLayer(key)}
                className="mma-btn-press text-[13px] pb-[6px]"
                style={{
                  color: layer === key ? '#2b2015' : '#a99b7f',
                  borderBottom: '1.5px solid ' + (layer === key ? '#7c8a6d' : 'transparent'),
                  transition: 'border-color 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-[24px] pb-[24px]" style={{ borderTop: '1px solid #f0e9d9' }}>
          <div
            key={index}
            className="pt-[18px]"
            style={{
              animation: `${direction === 'next' ? 'mmaFadeSlideInRight' : 'mmaFadeSlideInLeft'} 240ms cubic-bezier(0.23, 1, 0.32, 1)`,
            }}
          >
            <p className="text-[15px] leading-[1.6] mb-[18px]" style={{ color: '#4a3b2c' }}>
              {chapter.summary}
            </p>

            <MmaRecoveryChapterLayers chapter={chapter} phases={phases} milestones={milestones} checkpoints={checkpoints} layer={layer} />
          </div>
        </div>
      </div>
    </div>
  )
}
