'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useRandomTheme from './useRandomTheme'
import { THEMES } from '../lib/themes'
import { ago, dayLabel, gcalLink, slotLabel } from '../lib/orbit/time'
import { nudgeLine } from '../lib/orbit/words'

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
  const planned = people.filter((p) => p.status.upcoming)
  const rest = people.filter((p) => !p.status.due && !p.status.upcoming)
  const [adding, setAdding] = useState(false)

  const statement = due.length
    ? `${due.length} ${due.length === 1 ? 'person is' : 'people are'} due for a hang.`
    : 'Everyone is in orbit.'

  return (
    <main className="ob" style={{ '--ob-bg': t.bg, '--ob-ink': t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <div className="ob-wrap">
        <h1 className="ob-title">Orbit</h1>
        <p className="ob-statement">{statement}</p>
        {!calendar && (
          <p className="ob-small">Calendar not connected, so invite times skip the clash check.</p>
        )}
        {due.length > 0 && <Section title="Due" people={due} today={today} site={site} />}
        {planned.length > 0 && <Section title="Planned" people={planned} today={today} site={site} />}
        {rest.length > 0 && <Section title="In orbit" people={rest} today={today} site={site} />}
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

function Section({ title, people, today, site }) {
  return (
    <section>
      <h2 className="ob-section">{title}</h2>
      {people.map((p) => (
        <Card key={p.id} p={p} today={today} site={site} />
      ))}
    </section>
  )
}

function Card({ p, today, site }) {
  const router = useRouter()
  const s = p.status
  const [open, setOpen] = useState(null) // 'hang' | 'invite' | 'edit' | null
  const toggle = (k) => setOpen(open === k ? null : k)
  const refresh = () => {
    setOpen(null)
    router.refresh()
  }

  useEffect(() => {
    if (window.location.hash === `#${p.id}`) setOpen(s.invites.length ? null : 'hang')
  }, [p.id, s.invites.length])

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
        {p.invitable && !s.invites.length && (
          <button className={`ob-btn ${open === 'invite' ? 'on' : ''}`} onClick={() => toggle('invite')}>
            Find a time
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
      {open === 'invite' && <InvitePanel p={p} site={site} onDone={refresh} />}
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

function InvitePanel({ p, site, onDone }) {
  const [slots, setSlots] = useState(null)
  const [on, setOn] = useState([])
  const [idea, setIdea] = useState(p.status.idea || '')
  const [link, setLink] = useState(null)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api(`slots?person=${p.id}`, 'GET').then((r) => {
      setSlots(r.slots)
      setOn(r.slots.slice(0, 5).map((_, i) => i))
    })
  }, [p.id])

  const make = async () => {
    const chosen = slots.filter((_, i) => on.includes(i))
    const inv = await api('invite', 'POST', { person_id: p.id, idea, slots: chosen })
    const url = `${site}/orbit/i/${inv.id}`
    setLink(url)
    const ask = idea ? `${idea.charAt(0).toLowerCase()}${idea.slice(1)} soon?` : 'wanna hang soon?'
    setMsg(`yo! ${ask} here's when i'm free, tap whatever works: ${url}`)
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: msg })
        return
      } catch {}
    }
    await navigator.clipboard.writeText(msg)
    setCopied(true)
  }

  if (link) {
    return (
      <div className="ob-panel">
        <div className="ob-label">Send this</div>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
        <div className="ob-row">
          <button className="ob-btn solid" onClick={share}>
            Share
          </button>
          <button
            className="ob-btn"
            onClick={async () => {
              await navigator.clipboard.writeText(msg)
              setCopied(true)
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="ob-btn quiet" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    )
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
      <div className="ob-row">
        <button className="ob-btn solid" disabled={!on.length} onClick={make}>
          Make the link
        </button>
      </div>
    </div>
  )
}

function OpenInvite({ inv, p, site, onDone }) {
  const [copied, setCopied] = useState(false)
  const url = `${site}/orbit/i/${inv.id}`
  const tally = inv.slots.map((_, i) => inv.responses.filter((r) => r.picks.includes(i)).map((r) => r.name))
  const lock = async (slot) => {
    await api('invite', 'PATCH', { id: inv.id, slot })
    onDone()
  }
  const cancel = async () => {
    await api('invite', 'PATCH', { id: inv.id, cancel: true })
    onDone()
  }
  return (
    <div className="ob-panel">
      <div className="ob-label">
        Invite out{inv.idea ? `: ${inv.idea}` : ''} ·{' '}
        {inv.responses.length ? `${inv.responses.length} answered` : 'no answers yet'}
      </div>
      {inv.slots.map((s, i) => (
        <div key={s.start} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 150 }}>{slotLabel(s.start)}</span>
          <span className="ob-small" style={{ flex: 1 }}>{tally[i].join(', ')}</span>
          <button className="ob-btn quiet" style={{ padding: '2px 6px' }} onClick={() => lock(i)}>
            Lock
          </button>
        </div>
      ))}
      {inv.responses
        .filter((r) => r.note)
        .map((r, i) => (
          <div key={i} className="ob-note">
            {r.name}: “{r.note}”
          </div>
        ))}
      <div className="ob-row">
        <button
          className="ob-btn"
          onClick={async () => {
            await navigator.clipboard.writeText(url)
            setCopied(true)
          }}
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button className="ob-btn quiet" onClick={cancel}>
          Cancel invite
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
