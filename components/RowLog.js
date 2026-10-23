'use client'

import { useEffect, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'
import { DISTANCES, TIMES, fmtTime, fmtPace, fmtMeters, fmtRecord, recordPace, fmtGain, metersPerStroke } from '../lib/row/records'

// /row, in the site register: one dealt theme for the page, the statement in
// Nichrome, everything else in Social Condensed with tabular figures. Records
// up top, then every row newest first with its splits, Jon's Strava notes and
// the advice written from them.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const ORDER = [...DISTANCES.map((r) => r.key), ...TIMES.map((r) => r.key), 'longest', 'mps']

function day(startLocal, opts = { weekday: 'short', month: 'short', day: 'numeric' }) {
  const [y, m, d] = startLocal.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', opts)
}

// Strava's medals: gold PR, silver 2nd, bronze 3rd best ever at the time.
const MEDALS = { 1: ['pr', 'PR'], 2: ['2nd', '2nd best'], 3: ['3rd', '3rd best'] }
function Medal({ rank, size = 18 }) {
  const [file, label] = MEDALS[rank]
  return <img src={`/row/${file}.svg`} alt={label} title={label} width={size} height={Math.round(size * 1.15)} className="inline-block shrink-0" />
}

// Goals and Records fold up so the log is closer on a phone: closed by
// default under md, open from md up, and either way a tap on the heading.
const useFold = () => {
  const [open, setOpen] = useState(true)
  useEffect(() => setOpen(window.matchMedia('(min-width: 768px)').matches), [])
  return [open, setOpen]
}

function Fold({ title, t, children }) {
  const [open, setOpen] = useFold()
  return (
    <section className={`px-[20px] md:px-[26px] ${open ? 'pb-[56px] md:pb-[120px]' : 'pb-[40px] md:pb-[48px]'}`}>
      {/* Closed, it gets the same rule under the heading that Log's first row gives it. */}
      <h2
        className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] ${open ? 'mb-[24px] md:mb-[32px]' : 'pb-[24px] md:pb-[32px] border-b'}`}
        style={open ? undefined : { borderColor: `${t.ink}40` }}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-baseline justify-between text-left hover:opacity-80 transition-opacity"
        >
          {title}
          <span aria-hidden className={`${social} font-normal w-[24px] text-right`}>
            {open ? '–' : '+'}
          </span>
        </button>
      </h2>
      {open && children}
    </section>
  )
}

function Heading({ children }) {
  return <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>{children}</h2>
}

// What I'm chasing. Benchmarks are rough reads of Concept2's logbook for men
// 40 to 49; the per-stroke and pace goals assume steady pieces at about 20 spm.
// "Now" is the standing record and the day it was set.
const GOALS = [
  { key: 'mps', label: 'Meters per stroke', note: 'Steady pieces at 20 spm', goal: '11.5m', now: (r) => `${r.value.toFixed(2)}m` },
  { key: 'd2000', label: '2k', note: '8:00 is fit, under 7:30 is strong', goal: '8:00', now: (r) => fmtTime(r.value) },
  { key: 't1200', label: '20 min pace', note: 'Per 500m, at 20 spm', goal: '2:10', now: (r) => fmtPace(1200, r.value) },
]

function Goals({ bests, t }) {
  return (
    <Fold title="Goals" t={t}>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-[48px] gap-y-[40px]">
        {GOALS.map((g) => {
          const r = bests[g.key]
          return (
            <li key={g.key} className="flex flex-col gap-[20px] md:gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <span className="uppercase tracking-[0.3px]">{g.label}</span>
                <span className="opacity-70">{g.note}</span>
              </div>
              <div className="flex items-end gap-[32px] md:gap-[40px] tabular-nums">
                <span className="text-[56px] md:text-[72px] leading-[0.8] tracking-[0.3px]">{g.goal}</span>
                {r && (
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[15px] md:text-[16px] leading-[1.2] opacity-70">
                      As of {day(r.start_local, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[26px] md:text-[30px] leading-none">{g.now(r)}</span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Fold>
  )
}

function Records({ bests, latestId, t }) {
  const list = ORDER.map((k) => bests[k]).filter(Boolean)
  if (!list.length) return null
  return (
    <Fold title="Records" t={t}>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-5 gap-x-[24px] md:gap-x-[48px] gap-y-[32px] md:gap-y-[48px]">
        {list.map((r) => {
          const fresh = r.id === latestId && r.prev
          const p = recordPace(r)
          return (
            <li key={r.key} className="border-t pt-[16px] md:pt-[20px] flex flex-col gap-[6px]" style={{ borderColor: `${t.ink}40` }}>
              <div className="flex items-baseline justify-between gap-[8px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]">
                <span className="opacity-70">{r.label}</span>
                {fresh && <Medal rank={1} size={19} />}
              </div>
              <span className="text-[34px] md:text-[44px] leading-none tracking-[0.3px] tabular-nums">{fmtRecord(r)}</span>
              <span className="text-[15px] md:text-[16px] leading-[1.3] opacity-70 tabular-nums">
                {p && <>{p} · </>}
                {day(r.start_local, { month: 'short', day: 'numeric' })}
                {r.prev && <> · {fmtGain(r)}</>}
              </span>
            </li>
          )
        })}
      </ul>
    </Fold>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <dt className="text-[15px] md:text-[16px] leading-[1.2] opacity-70">{label}</dt>
      <dd className="text-[24px] md:text-[28px] leading-none tabular-nums">{value}</dd>
    </div>
  )
}

function Splits({ laps, t }) {
  if (!laps?.length) return null
  return (
    <table className="w-full text-left align-top tabular-nums text-[16px] md:text-[17px] leading-[1.3]">
      <thead>
        <tr className="border-b" style={{ borderColor: t.ink }}>
          {['Split', 'Distance', 'Time', 'Pace', 'Rate', 'Watts'].map((h) => (
            <th key={h} className="font-normal opacity-70 pb-[6px] pr-[12px] text-[14px] md:text-[15px]">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {laps.map((l, i) => (
          <tr key={i} className="border-b" style={{ borderColor: `${t.ink}26` }}>
            <td className="py-[6px] pr-[12px]">{i + 1}</td>
            <td className="py-[6px] pr-[12px]">{fmtMeters(l.distance)}</td>
            <td className="py-[6px] pr-[12px]">{fmtTime(l.time)}</td>
            <td className="py-[6px] pr-[12px]">{fmtPace(l.time, l.distance)}</td>
            <td className="py-[6px] pr-[12px]">{l.spm ? l.spm.toFixed(1) : '–'}</td>
            <td className="py-[6px]">{l.watts ? Math.round(l.watts) : '–'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Label({ children }) {
  return <h4 className="text-[15px] md:text-[16px] leading-[1.2] opacity-70 mb-[8px]">{children}</h4>
}

// Each workout's advice folds the same way as Goals and Records, one size down.
function Advice({ advice, t }) {
  const [open, setOpen] = useFold()
  const rule = { borderColor: `${t.ink}40` }
  return (
    <div>
      <h4 className="border-b pb-[10px]" style={rule}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-baseline justify-between text-left text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px] hover:opacity-80 transition-opacity"
        >
          Advice
          <span aria-hidden className="w-[24px] text-right">{open ? '–' : '+'}</span>
        </button>
      </h4>
      {open && (
        <div className="flex flex-col gap-[32px] pt-[16px] max-w-[640px]">
          <p className="text-[19px] md:text-[21px] leading-[1.4] tracking-[0.21px]">{advice.summary}</p>

          {advice.soreness?.length > 0 && (
            <div>
              <Label>Where it hurts, and why</Label>
              <ul className="flex flex-col">
                {advice.soreness.map((s) => (
                  <li key={s.area} className="border-t py-[12px] grid md:grid-cols-[140px_1fr] gap-x-[24px] gap-y-[6px]" style={rule}>
                    <span>{s.area}</span>
                    <div className="flex flex-col gap-[6px]">
                      <p>{s.fix}</p>
                      <p className="text-[15px] md:text-[16px] opacity-70">{s.why}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {advice.strength && (
            <div>
              <Label>Strength</Label>
              <p className="mb-[10px]">{advice.strength.cadence}</p>
              {advice.strength.moves?.length > 0 && (
                <div className="tabular-nums">
                  <div className="hidden md:grid grid-cols-[170px_150px_1fr] gap-x-[20px] border-b pb-[6px] text-[14px] md:text-[15px] opacity-70" style={{ borderColor: t.ink }}>
                    <span>Move</span>
                    <span>Dose</span>
                    <span>Why</span>
                  </div>
                  <ol>
                    {advice.strength.moves.map((m) => (
                      <li key={m.name} className="border-b py-[10px] grid md:grid-cols-[170px_150px_1fr] gap-x-[20px] gap-y-[2px]" style={{ borderColor: `${t.ink}26` }}>
                        <span>{m.name}</span>
                        <span>{m.dose}</span>
                        <span className="text-[15px] md:text-[16px] opacity-70">{m.why}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          <div>
            <Label>Next row</Label>
            <p>{advice.next}</p>
          </div>
          <div>
            <Label>Back off if</Label>
            <p>{advice.watch}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Workout({ w, t }) {
  const mps = metersPerStroke(w)
  return (
    <article className="border-t pt-[16px] md:pt-[20px] grid lg:grid-cols-12 gap-x-[48px] gap-y-[32px]" style={{ borderColor: `${t.ink}40` }}>
      <div className="lg:col-span-5 lg:sticky lg:top-[88px] lg:self-start flex flex-col gap-[24px]">
        <header className="flex flex-col gap-[4px]">
          <span className="text-[16px] md:text-[17px] opacity-70 tabular-nums">{day(w.start_local)}</span>
          <h3 className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">{w.name}</h3>
        </header>
        <dl className="grid grid-cols-3 gap-x-[16px] gap-y-[20px]">
          <Stat label="Distance" value={fmtMeters(w.distance)} />
          <Stat label="Time" value={fmtTime(w.moving_time)} />
          <Stat label="Pace /500m" value={fmtPace(w.moving_time, w.distance)} />
          <Stat label="Rate" value={w.avg_spm ? `${w.avg_spm.toFixed(1)} spm` : '–'} />
          <Stat label="Watts" value={w.avg_watts ? Math.round(w.avg_watts) : '–'} />
          <Stat label="Per stroke" value={mps ? `${mps.toFixed(2)}m` : '–'} />
        </dl>
        <Splits laps={w.laps} t={t} />
      </div>

      <div className="lg:col-span-7 flex flex-col gap-[28px]">
        {w.notes ? (
          <blockquote className={`${nichrome} italic text-[18px] md:text-[21px] leading-[1.45] tracking-[0.2px]`}>“{w.notes}”</blockquote>
        ) : (
          <p className="opacity-70">No notes yet. A description on Strava turns into advice here.</p>
        )}
        {w.advice ? <Advice advice={w.advice} t={t} /> : w.notes ? <p className="opacity-70">Advice is on its way.</p> : null}
      </div>
    </article>
  )
}

export default function RowLog({ workouts, bests }) {
  const { theme: t, ready } = useRandomTheme()
  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
        <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
          My erg log. Every row I finish lands here from Strava, with the PRs Strava doesn’t track and what to work on next. 🚣
        </h1>
      </section>

      <div className={`${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
        <Goals bests={bests} t={t} />
        <Records bests={bests} latestId={workouts[0]?.id} t={t} />

        <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
          <Heading>Log</Heading>
          {workouts.length ? (
            <div className="flex flex-col gap-[72px] md:gap-[104px]">
              {workouts.map((w) => (
                <Workout key={w.id} w={w} t={t} />
              ))}
            </div>
          ) : (
            <p className="opacity-70">No rows yet.</p>
          )}
        </section>
      </div>

      <Footer colophon theme={t} />
    </main>
  )
}
