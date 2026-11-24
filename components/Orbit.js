'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useRandomTheme from './useRandomTheme'
import { THEMES } from '../lib/themes'
import { ago, dayLabel, gcalLink, pdxTime, slotLabel } from '../lib/orbit/time'
import { askText, nudgeLine } from '../lib/orbit/words'
import { textToWindows, windowsToText } from '../lib/orbit/week'

const api = (path, method, body) =>
  fetch(`/api/orbit/${path}`, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) }).then(
    async (r) => {
      if (!r.ok) throw new Error(await r.text())
      return r.json()
    }
  )

const weeks = (d) => Math.round(d / 7)

export default function Orbit({ people, today, site, calendar }) {
  const { theme, ready } = useRandomTheme(THEMES)
  const t = theme || THEMES[4]
  const due = people.filter((p) => p.status.due)
  const waiting = people.filter((p) => !p.status.due && !p.status.upcoming && p.status.invites.length)
  const planned = people.filter((p) => p.status.upcoming)
  const rest = people.filter((p) => !p.status.due && !p.status.upcoming && !p.status.invites.length)
  const [adding, setAdding] = useState(false)

  const statement = due.length
    ? `${due.length} ${due.length === 1 ? 'person is' : 'people are'} due for a hang.`
    : 'Everyone is in orbit.'

  return (
    <main className="ob" style={{ '--ob-bg': t.bg, '--ob-ink': t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <div className="ob-wrap wide">
        <h1 className="ob-title">Orbit</h1>
        <p className="ob-statement">{statement}</p>
        {!calendar && (
          <p className="ob-small">Calendar not connected, so invite times skip the clash check.</p>
        )}
        <div className="ob-cols">
          <div>
            <Section title="Due" people={due} today={today} site={site} empty="Nobody's due. Nice." />
          </div>
          <div>
            {waiting.length > 0 && <Section title="Waiting to hear back" people={waiting} today={today} site={site} />}
            {planned.length > 0 && <Section title="Planned" people={planned} today={today} site={site} />}
            {rest.length > 0 && <Section title="Done for now" people={rest} today={today} site={site} />}
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          {adding ? (
            <EditPanel person={{ name: '', every_days: 42, ideas: [] }} onDone={() => setAdding(false)} />
          ) : (
            <button className="ob-btn" onClick={() => setAdding(true)}>
              + Add someone
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function Section({ title, people, today, site, empty }) {
  return (
    <section>
      <h2 className="ob-section">{title}</h2>
      {!people.length && empty && <p className="ob-small">{empty}</p>}
      {people.map((p) => (
        <Card key={p.id} p={p} today={today} site={site} />
      ))}
    </section>
  )
}

function Card({ p, today, site }) {
  const router = useRouter()
  const s = p.status
  const [open, setOpen] = useState(null) // 'hang' | 'reach' | 'edit' | null
  const toggle = (k) => setOpen(open === k ? null : k)
  const refresh = () => {
    setOpen(null)
    router.refresh()
  }

  // Tapping the push lands here with the text already written.
  useEffect(() => {
    if (window.location.hash !== `#${p.id}`) return
    if (!s.invites.length && !s.upcoming) setOpen(p.invitable ? 'reach' : 'hang')
    document.getElementById(p.id)?.scrollIntoView()
  }, [p.id, p.invitable, s.invites.length, s.upcoming])

  let line
  if (s.upcoming) line = `Planned: ${dayLabel(s.upcoming.day)}${s.upcoming.what ? `, ${s.upcoming.what}` : ''}`
  else if (s.due) line = nudgeLine(p, s)
  else if (s.idea) line = `Next up: ${s.idea}`

  const meta = [
    p.members,
    s.since === null ? 'no hangs logged' : s.since === 0 ? 'saw them today' : `last hang ${ago(s.since)} ago`,
    `every ${weeks(p.every_days)} weeks`,
    s.snoozed && `snoozed to ${dayLabel(p.snoozed_until)}`,
  ].filter(Boolean)

  const snooze = async () => {
    const d = new Date(`${today}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() + 14)
    await api('person', 'PATCH', { id: p.id, snoozed_until: d.toISOString().slice(0, 10) })
    refresh()
  }

  return (
    <article className="ob-card" id={p.id}>
      <div className="ob-name">{p.name}</div>
      <div className="ob-meta">{meta.join(' · ')}</div>
      {line && <div className="ob-line">{line}</div>}
      {!s.upcoming && (
        <div className="ob-bar">
          <span style={{ width: `${Math.min(100, Math.round(s.ratio * 100))}%` }} />
        </div>
      )}
      {s.invites.map((inv) => (
        <OpenInvite key={inv.id} inv={inv} p={p} site={site} onDone={refresh} />
      ))}
      {s.upcoming?.invite_id && <BookedLinks p={p} hang={s.upcoming} />}
      <div className="ob-row">
        <button className={`ob-btn ${open === 'hang' ? 'on' : ''}`} onClick={() => toggle('hang')}>
          Hung out
        </button>
        {p.invitable && !s.invites.length && !s.upcoming && (
          <button className={`ob-btn ${open === 'reach' ? 'on' : ''}`} onClick={() => toggle('reach')}>
            Reach out
          </button>
        )}
        {s.due && (
          <button className="ob-btn quiet" onClick={snooze}>
            Not now
          </button>
        )}
        <button className={`ob-btn quiet ${open === 'edit' ? 'on' : ''}`} onClick={() => toggle('edit')}>
          Edit
        </button>
      </div>
      {open && p.notes && <div className="ob-note">{p.notes}</div>}
      {open === 'hang' && <HangPanel p={p} today={today} onDone={refresh} />}
      {open === 'reach' && <ReachPanel p={p} site={site} onDone={refresh} />}
      {open === 'edit' && <EditPanel person={p} onDone={refresh} />}
    </article>
  )
}

function HangPanel({ p, today, onDone }) {
  const [day, setDay] = useState(today)
  const [what, setWhat] = useState(p.status.idea || '')
  const [busy, setBusy] = useState(false)
  const save = async () => {
    setBusy(true)
    await api('hang', 'POST', { person_id: p.id, day, what })
    onDone()
  }
  const del = async (id) => {
    await api(`hang?id=${id}`, 'DELETE')
    onDone()
  }
  return (
    <div className="ob-panel">
      <div className="ob-label">When</div>
      <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      <div className="ob-label">What</div>
      <div className="ob-row" style={{ marginTop: 0 }}>
        {(p.ideas || []).map((i) => (
          <button key={i} className={`ob-btn ${what === i ? 'on' : ''}`} onClick={() => setWhat(i)}>
            {i}
          </button>
        ))}
      </div>
      <input style={{ marginTop: 8 }} placeholder="Or something else" value={(p.ideas || []).includes(what) ? '' : what} onChange={(e) => setWhat(e.target.value)} />
      <div className="ob-row">
        <button className="ob-btn solid" disabled={busy} onClick={save}>
          {day > today ? 'Save the plan' : 'Log it'}
        </button>
      </div>
      {p.status.hangs.length > 0 && (
        <>
          <div className="ob-label">Recent</div>
          {p.status.hangs.map((h) => (
            <div key={h.id} className="ob-small" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>
                {dayLabel(h.day)}
                {h.what ? `, ${h.what}` : ''}
              </span>
              <button className="ob-btn quiet" style={{ padding: '0 4px', fontSize: 14 }} onClick={() => del(h.id)} aria-label="Delete">
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// Write the text: pick what and when, and the message writes itself with the
// times spelled out. Copying it saves the ask, so the times are waiting here
// when they answer.
function ReachPanel({ p, site, onDone }) {
  const [slots, setSlots] = useState(null)
  const [on, setOn] = useState([])
  const [idea, setIdea] = useState(p.status.idea || '')
  const [msg, setMsg] = useState('')
  const [edited, setEdited] = useState(false)
  const [busy, setBusy] = useState(false)
  const [linked, setLinked] = useState(false)

  useEffect(() => {
    api(`slots?person=${p.id}`, 'GET').then((r) => {
      setSlots(r.slots)
      setOn(r.slots.slice(0, 4).map((_, i) => i))
    })
  }, [p.id])

  const chosen = (slots || []).filter((_, i) => on.includes(i))
  useEffect(() => {
    if (!edited && slots) setMsg(askText(p, idea, chosen))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea, on, slots, edited])

  // Copy first, while the tap still counts (iOS drops clipboard access after a network wait).
  const send = async () => {
    setBusy(true)
    await copyOrShare(msg)
    await api('invite', 'POST', { person_id: p.id, idea, slots: chosen, note: msg })
    onDone()
  }

  // Groups can get a link where everyone taps what works. Two taps: make it, then copy it.
  const makeLink = async () => {
    setBusy(true)
    const inv = await api('invite', 'POST', { person_id: p.id, idea, slots: chosen })
    const ask = idea ? `${lowerFirst(idea)} sometime?` : 'wanna hang?'
    const text = `hey all! it's been a min. ${ask} tap whatever times work: ${site}/orbit/i/${inv.id}`
    await api('invite', 'PATCH', { id: inv.id, note: text })
    setMsg(text)
    setEdited(true)
    setLinked(true)
    setBusy(false)
  }

  return (
    <div className="ob-panel">
      <div className="ob-label">Do what</div>
      <div className="ob-row" style={{ marginTop: 0 }}>
        {(p.ideas || []).map((i) => (
          <button key={i} className={`ob-btn ${idea === i ? 'on' : ''}`} onClick={() => setIdea(i)}>
            {i}
          </button>
        ))}
      </div>
      <input style={{ marginTop: 8 }} placeholder="Or something else" value={(p.ideas || []).includes(idea) ? '' : idea} onChange={(e) => setIdea(e.target.value)} />
      <div className="ob-label">Times to offer</div>
      {!slots && <div className="ob-small">Checking your calendar…</div>}
      {slots && !slots.length && <div className="ob-small">Nothing open in the next three weeks.</div>}
      <div className="ob-row" style={{ marginTop: 0 }}>
        {slots?.map((s, i) => (
          <button
            key={s.start}
            className={`ob-btn ${on.includes(i) ? 'on' : ''}`}
            onClick={() => setOn(on.includes(i) ? on.filter((x) => x !== i) : [...on, i].sort((a, b) => a - b))}
          >
            {slotLabel(s.start)}
          </button>
        ))}
      </div>
      <div className="ob-label">The text</div>
      <textarea
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value)
          setEdited(true)
        }}
        style={{ minHeight: 150 }}
      />
      <div className="ob-row">
        {linked ? (
          <button
            className="ob-btn solid"
            onClick={async () => {
              await copyOrShare(msg)
              onDone()
            }}
          >
            Copy the text
          </button>
        ) : (
          <>
            <button className="ob-btn solid" disabled={busy || !on.length} onClick={send}>
              Copy the text
            </button>
            {p.is_group && (
              <button className="ob-btn" disabled={busy || !on.length} onClick={makeLink}>
                Use a pick-a-time link instead
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)

async function copyOrShare(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    if (navigator.share) await navigator.share({ text }).catch(() => {})
  }
}

// The ask is out. When they answer, tap the time (or type another) and it's on.
function OpenInvite({ inv, p, site, onDone }) {
  const [copied, setCopied] = useState(false)
  const [other, setOther] = useState('')
  const isLink = Boolean(inv.note?.includes('/orbit/i/')) || inv.responses.length > 0
  const tally = inv.slots.map((_, i) => inv.responses.filter((r) => r.picks.includes(i)).map((r) => r.name))
  const lock = async (body) => {
    await api('invite', 'PATCH', { id: inv.id, ...body })
    onDone()
  }
  const asked = inv.created_at ? ` · asked ${dayLabel(inv.created_at.slice(0, 10))}` : ''
  return (
    <div className="ob-panel">
      <div className="ob-label">
        {isLink ? `Link out${inv.idea ? `: ${inv.idea}` : ''} · ${inv.responses.length ? `${inv.responses.length} answered` : 'no answers yet'}` : `Which time did they pick?${asked}`}
      </div>
      <div className="ob-row" style={{ marginTop: 0 }}>
        {inv.slots.map((s, i) => (
          <button key={s.start} className="ob-btn" onClick={() => lock({ slot: i })}>
            {slotLabel(s.start)}
            {tally[i].length ? ` · ${tally[i].join(', ')}` : ''}
          </button>
        ))}
      </div>
      <div className="ob-row" style={{ alignItems: 'center' }}>
        <input type="datetime-local" value={other} onChange={(e) => setOther(e.target.value)} style={{ width: 'auto' }} />
        <button className="ob-btn" disabled={!other} onClick={() => lock({ at: pdxTime(other.slice(0, 10), other.slice(11, 16)).toISOString() })}>
          Other time
        </button>
      </div>
      {inv.responses
        .filter((r) => r.note)
        .map((r, i) => (
          <div key={i} className="ob-note">
            {r.name}: “{r.note}”
          </div>
        ))}
      <div className="ob-row">
        {inv.note && (
          <button
            className="ob-btn quiet"
            onClick={async () => {
              await copyOrShare(inv.note)
              setCopied(true)
            }}
          >
            {copied ? 'Copied' : 'Copy the text again'}
          </button>
        )}
        <button className="ob-btn quiet" onClick={() => lock({ cancel: true })}>
          No dice, drop it
        </button>
      </div>
    </div>
  )
}

function BookedLinks({ p, hang }) {
  // The booked invite's time travels on the hang via the invite list on the server;
  // a plain link to the friend page shows it, and Google gets the event.
  const [inv, setInv] = useState(null)
  useEffect(() => {
    fetch(`/api/orbit/i/${hang.invite_id}?json=1`).then((r) => r.ok && r.json().then(setInv))
  }, [hang.invite_id])
  if (!inv?.picked) return null
  const title = `${inv.idea || 'Hang'} with ${p.name}`
  return (
    <div className="ob-row">
      <a className="ob-btn" href={gcalLink({ title, ...inv.picked })} target="_blank" rel="noreferrer">
        Add to Google Calendar
      </a>
      <span className="ob-small">{slotLabel(inv.picked.start)}</span>
    </div>
  )
}

function EditPanel({ person, onDone }) {
  const router = useRouter()
  const [f, setF] = useState({
    name: person.name || '',
    members: person.members || '',
    weeks: weeks(person.every_days || 42),
    ideas: (person.ideas || []).join('\n'),
    notes: person.notes || '',
    invitable: person.invitable ?? true,
    times: windowsToText(person.windows),
    travel: person.travel_mins ?? 15,
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const save = async () => {
    const body = {
      name: f.name.trim(),
      members: f.members.trim() || null,
      every_days: Math.max(1, Number(f.weeks) || 6) * 7,
      ideas: f.ideas.split('\n').map((s) => s.trim()).filter(Boolean),
      notes: f.notes.trim() || null,
      invitable: f.invitable,
      is_group: f.members.includes(','),
      windows: textToWindows(f.times),
      travel_mins: Math.max(0, Number(f.travel) || 0),
    }
    if (!body.name) return
    if (person.id) await api('person', 'PATCH', { id: person.id, ...body })
    else await api('person', 'POST', body)
    onDone()
    router.refresh()
  }
  const del = async () => {
    if (!confirm(`Remove ${person.name} and their history?`)) return
    await api(`person?id=${person.id}`, 'DELETE')
    onDone()
    router.refresh()
  }
  return (
    <div className="ob-panel">
      <div className="ob-label">Name</div>
      <input value={f.name} onChange={set('name')} />
      <div className="ob-label">Who's in it (for a group or family)</div>
      <input value={f.members} onChange={set('members')} placeholder="Tom, Maren, River, Journey" />
      <div className="ob-label">Remind me every … weeks</div>
      <input type="number" min="1" value={f.weeks} onChange={set('weeks')} style={{ width: 90 }} />
      <div className="ob-label">Times that work, one per line (like “Tue-Thu 6:30pm 2h” or “Sat Sun 1pm 3h”)</div>
      <textarea value={f.times} onChange={set('times')} placeholder="Mon-Fri 8am 45m" />
      <div className="ob-label">Drive, minutes each way</div>
      <input type="number" min="0" value={f.travel} onChange={set('travel')} style={{ width: 90 }} />
      <div className="ob-small" style={{ marginTop: 4 }}>
        Weekday 8am only gets offered when this is 15 or less. Work hours are always off.
      </div>
      <div className="ob-label">Ideas, one per line</div>
      <textarea value={f.ideas} onChange={set('ideas')} />
      <div className="ob-label">Notes to self</div>
      <textarea value={f.notes} onChange={set('notes')} />
      <label className="ob-small" style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        <input type="checkbox" checked={f.invitable} onChange={set('invitable')} style={{ width: 'auto' }} />
        Send pick-a-time invites
      </label>
      <div className="ob-row">
        <button className="ob-btn solid" onClick={save}>
          Save
        </button>
        {person.id && (
          <button className="ob-btn quiet" onClick={del}>
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
