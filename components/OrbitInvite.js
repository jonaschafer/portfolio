'use client'

import { useState } from 'react'
import useRandomTheme from './useRandomTheme'
import { THEMES } from '../lib/themes'
import { gcalLink, slotLabel } from '../lib/orbit/time'

// What a friend sees: Jon's open times, tap one, done. Groups tap every time
// that works and add a name, and Jon locks it in.
export default function OrbitInvite({ invite, group, name: initialName }) {
  const { theme, ready } = useRandomTheme(THEMES)
  const t = theme || THEMES[4]
  const [picks, setPicks] = useState([])
  const [name, setName] = useState(initialName)
  const [note, setNote] = useState('')
  const [none, setNone] = useState(false)
  const [sent, setSent] = useState(null) // { booked } | { ok }
  const [busy, setBusy] = useState(false)

  const booked = sent?.booked || (invite.status === 'booked' && invite.picked)
  const what = invite.idea ? invite.idea.charAt(0).toLowerCase() + invite.idea.slice(1) : 'a hang'
  const title = `${invite.idea || 'Hang'} with Jon`

  const tap = (i) => {
    setNone(false)
    if (group) setPicks(picks.includes(i) ? picks.filter((x) => x !== i) : [...picks, i])
    else setPicks([i])
  }

  const send = async () => {
    setBusy(true)
    const res = await fetch(`/api/orbit/i/${invite.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, picks: none ? [] : picks, note }),
    })
    setBusy(false)
    if (res.ok) setSent(await res.json())
    else setSent({ closed: true })
  }

  let body
  if (booked) {
    body = (
      <>
        <p className="ob-statement">
          Locked in: {slotLabel(booked.start)}, {what}. See you then.
        </p>
        <div className="ob-row">
          <a className="ob-btn solid" href={gcalLink({ title, ...booked })} target="_blank" rel="noreferrer">
            Add to Google Calendar
          </a>
          <a className="ob-btn" href={`/api/orbit/i/${invite.id}`}>
            Apple / Outlook
          </a>
        </div>
      </>
    )
  } else if (sent?.closed) {
    body = <p className="ob-statement">This one's already sorted. Text Jon if that's news to you.</p>
  } else if (sent) {
    body = <p className="ob-statement">Got it, thanks. Jon will lock in a time and let you know.</p>
  } else {
    body = (
      <>
        <p className="ob-statement">
          Jon's up for {what}. {group ? 'Tap every time that works.' : 'Tap a time that works.'}
        </p>
        <div>
          {invite.slots.map((s, i) => (
            <button key={s.start} className={`ob-slot ${picks.includes(i) ? 'on' : ''}`} onClick={() => tap(i)}>
              <span>{slotLabel(s.start)}</span>
              <span>{picks.includes(i) ? '✓' : ''}</span>
            </button>
          ))}
          <button
            className={`ob-slot ${none ? 'on' : ''}`}
            onClick={() => {
              setNone(!none)
              setPicks([])
            }}
          >
            <span>None of these work</span>
            <span>{none ? '✓' : ''}</span>
          </button>
        </div>
        {(group || none || !initialName) && (
          <>
            <div className="ob-label" style={{ marginTop: 20 }}>Your name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}
        <div className="ob-label" style={{ marginTop: 16 }}>
          {none ? 'What works for you?' : 'Anything else? (optional)'}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} style={{ minHeight: 60 }} />
        <div className="ob-row" style={{ marginTop: 16 }}>
          <button
            className="ob-btn solid"
            style={{ fontSize: 19, padding: '10px 16px' }}
            disabled={busy || (!picks.length && !(none && note.trim())) || ((group || none) && !name.trim())}
            onClick={send}
          >
            {group || none ? 'Send' : 'Lock it in'}
          </button>
        </div>
      </>
    )
  }

  return (
    <main className="ob" style={{ '--ob-bg': t.bg, '--ob-ink': t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <div className="ob-wrap">
        <h1 className="ob-title">Hang with Jon</h1>
        {body}
      </div>
    </main>
  )
}
