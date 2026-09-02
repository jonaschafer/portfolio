'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, Download, Plus, Trash2, Upload } from 'lucide-react'
import { SURGERY_DATE } from '../../app/mma/map/data'
import {
  NUMBNESS_REGIONS,
  NUMBNESS_TREND_REGIONS,
  SWELLING_TREND_OPTIONS,
  RUBBER_BAND_OPTIONS,
  BLEEDING_OPTIONS,
  YES_NO_OPTIONS,
  RED_FLAG_CHECK_ITEMS,
  DIET_STAGE_OPTIONS,
  ARC_OPTIONS,
  emptyDailyEntry,
  emptyWeeklyEntry,
  REFERENCE_CHECKPOINTS,
  JOURNAL_INTRO,
} from '../../app/mma/map/data/journal-schema'
import { ScaleInput, ChoiceRow, TextField } from './ui'
import {
  useLocalState,
  JOURNAL_ENTRIES_KEY,
  JOURNAL_WEEKLY_KEY,
  dateKey,
  exportAllData,
  importAllData,
  downloadJSON,
} from './storage'

function setPath(obj, path, value) {
  if (path.length === 0) return value
  const [key, ...rest] = path
  return { ...obj, [key]: setPath(obj[key] ?? {}, rest, value) }
}

function daysSinceSurgery(dateStr) {
  const surgery = new Date(`${SURGERY_DATE}T00:00:00`)
  const d = new Date(`${dateStr}T00:00:00`)
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  return Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) -
      Date.UTC(surgery.getFullYear(), surgery.getMonth(), surgery.getDate())) /
      MS_PER_DAY
  )
}

function MedsTakenEditor({ meds, onChange }) {
  const update = (i, field, value) => {
    const next = meds.slice()
    next[i] = { ...next[i], [field]: value }
    onChange(next)
  }
  const add = () => onChange([...meds, { name: '', dose: '', time: '' }])
  const remove = (i) => onChange(meds.filter((_, idx) => idx !== i))

  return (
    <div className="mb-4">
      <div className="mb-1.5 text-sm text-base-content">Meds taken</div>
      <div className="space-y-2">
        {meds.map((m, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              value={m.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Name"
              className="input input-bordered input-sm w-[34%]"
            />
            <input
              value={m.dose}
              onChange={(e) => update(i, 'dose', e.target.value)}
              placeholder="Dose"
              className="input input-bordered input-sm w-[28%]"
            />
            <input
              value={m.time}
              onChange={(e) => update(i, 'time', e.target.value)}
              placeholder="Time"
              className="input input-bordered input-sm w-[26%]"
            />
            <button type="button" onClick={() => remove(i)} className="btn btn-ghost btn-sm btn-square shrink-0" aria-label="Remove">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="btn btn-link btn-sm mt-1 gap-1 px-0 no-underline">
        <Plus size={14} /> Add med
      </button>
    </div>
  )
}

function NumbnessMapEditor({ numbness, onChange }) {
  return (
    <div>
      {NUMBNESS_REGIONS.map((r) => (
        <ScaleInput
          key={r.id}
          label={r.label}
          sublabel={r.side}
          value={numbness[r.id]}
          onChange={(v) => onChange({ ...numbness, [r.id]: v })}
        />
      ))}
    </div>
  )
}

function RedFlagCheck({ values, onChange }) {
  const anyChecked = RED_FLAG_CHECK_ITEMS.some((i) => values[i.id])
  return (
    <div className={`rounded-2xl px-4 py-3 ${anyChecked ? 'border border-error/20 bg-error/10' : 'bg-base-200'}`}>
      <div className={`mb-2 text-xs font-bold uppercase tracking-wide ${anyChecked ? 'text-base-content' : 'text-base-content/50'}`}>
        Any = contact the team
      </div>
      <div className="space-y-2">
        {RED_FLAG_CHECK_ITEMS.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={Boolean(values[item.id])}
              onChange={(e) => onChange({ ...values, [item.id]: e.target.checked })}
              className="checkbox checkbox-error checkbox-sm"
            />
            <span className="text-sm text-base-content">{item.text}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function FieldGroup({ title, children }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">{title}</div>
      {children}
    </div>
  )
}

function DailyEntryForm({ entry, onChange, oxycodoneRunningTotal }) {
  const day = daysSinceSurgery(entry.date)
  const week = Math.floor(Math.max(day, 0) / 7)
  const set = (path, value) => onChange(setPath(entry, path, value))

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div className="text-base font-semibold text-base-content">{entry.date}</div>
        <div className="text-xs text-base-content/50">{day >= 0 ? `Day ${day} · Week ${week}` : `${-day} days to go`}</div>
      </div>

      <FieldGroup title="Pain">
        <ScaleInput label="Level" value={entry.pain.level} onChange={(v) => set(['pain', 'level'], v)} />
        <TextField label="Where" value={entry.pain.where} onChange={(v) => set(['pain', 'where'], v)} placeholder="e.g. jaw hinge, left side" />
        <MedsTakenEditor meds={entry.pain.medsTaken} onChange={(v) => set(['pain', 'medsTaken'], v)} />
        <div>
          <div className="mb-1.5 text-sm text-base-content">Oxycodone doses today</div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set(['pain', 'oxycodoneDosesToday'], n)}
                  className={`btn btn-sm btn-circle ${entry.pain.oxycodoneDosesToday === n ? 'btn-primary' : 'btn-outline'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <span className="text-xs text-base-content/50">running total: {oxycodoneRunningTotal}</span>
          </div>
        </div>
      </FieldGroup>

      <FieldGroup title="Swelling">
        <ScaleInput label="Level" value={entry.swelling.level} onChange={(v) => set(['swelling', 'level'], v)} />
        <ChoiceRow
          label="Vs. yesterday"
          options={SWELLING_TREND_OPTIONS}
          value={entry.swelling.vsYesterday}
          onChange={(v) => set(['swelling', 'vsYesterday'], v)}
        />
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={entry.swelling.photoTaken}
            onChange={(e) => set(['swelling', 'photoTaken'], e.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          <span className="text-sm text-base-content">Photo taken (front + profile)</span>
        </label>
      </FieldGroup>

      <FieldGroup title="Sleep">
        <TextField label="Hours" value={entry.sleep.hours} onChange={(v) => set(['sleep', 'hours'], v)} placeholder="e.g. 6.5" />
        <TextField label="Position / angle" value={entry.sleep.position} onChange={(v) => set(['sleep', 'position'], v)} />
        <ScaleInput label="Quality" value={entry.sleep.quality} onChange={(v) => set(['sleep', 'quality'], v)} />
        <ScaleInput
          label="Nose breathing overnight"
          sublabel="10 = clear"
          value={entry.sleep.noseBreathing}
          onChange={(v) => set(['sleep', 'noseBreathing'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Nutrition / hydration">
        <TextField label="Fluids (rough total)" value={entry.nutrition.fluids} onChange={(v) => set(['nutrition', 'fluids'], v)} />
        <TextField
          label="Calories / protein"
          value={entry.nutrition.caloriesProtein}
          onChange={(v) => set(['nutrition', 'caloriesProtein'], v)}
          placeholder="low / ok / good, or an estimate"
        />
        <TextField label="Weight" value={entry.nutrition.weight} onChange={(v) => set(['nutrition', 'weight'], v)} />
        <TextField
          label="What went down easily / what didn’t"
          rows={2}
          value={entry.nutrition.notes}
          onChange={(v) => set(['nutrition', 'notes'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Numbness map">
        <p className="mb-2 text-xs text-base-content/50">0 = totally numb, 10 = normal feeling</p>
        <NumbnessMapEditor numbness={entry.numbness} onChange={(v) => set(['numbness'], v)} />
        <TextField label="Tingling / pins-and-needles — where" value={entry.numbnessTingling} onChange={(v) => set(['numbnessTingling'], v)} />
        <TextField label="New numbness, or any waking up?" value={entry.numbnessNew} onChange={(v) => set(['numbnessNew'], v)} />
      </FieldGroup>

      <FieldGroup title="Bite">
        <ChoiceRow label="Even side to side?" options={YES_NO_OPTIONS} value={entry.bite.even} onChange={(v) => set(['bite', 'even'], v)} />
        <TextField label="Any shift since yesterday?" value={entry.bite.shiftSinceYesterday} onChange={(v) => set(['bite', 'shiftSinceYesterday'], v)} />
        <ChoiceRow label="Rubber bands" options={RUBBER_BAND_OPTIONS} value={entry.bite.rubberBands} onChange={(v) => set(['bite', 'rubberBands'], v)} />
      </FieldGroup>

      <FieldGroup title="Nose / sinus">
        <ScaleInput label="Congestion" sublabel="10 = clear" value={entry.nose.congestion} onChange={(v) => set(['nose', 'congestion'], v)} />
        <ChoiceRow label="Bleeding" options={BLEEDING_OPTIONS} value={entry.nose.bleeding} onChange={(v) => set(['nose', 'bleeding'], v)} />
        <ChoiceRow
          label="Nose-blowing avoided?"
          options={YES_NO_OPTIONS}
          value={entry.nose.blowingAvoided}
          onChange={(v) => set(['nose', 'blowingAvoided'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Activity">
        <TextField
          label="What I did"
          value={entry.activity.whatIDid}
          onChange={(v) => set(['activity', 'whatIDid'], v)}
          placeholder="walk min, chores, screen time"
        />
        <TextField label="How the jaw / face responded" value={entry.activity.jawResponse} onChange={(v) => set(['activity', 'jawResponse'], v)} />
        <ChoiceRow
          label="Could I have run today?"
          options={YES_NO_OPTIONS}
          value={entry.activity.couldIHaveRun}
          onChange={(v) => set(['activity', 'couldIHaveRun'], v)}
        />
        <TextField label="What stopped me" value={entry.activity.whatStoppedMe} onChange={(v) => set(['activity', 'whatStoppedMe'], v)} />
      </FieldGroup>

      <FieldGroup title="Mood / head">
        <TextField label="One line" value={entry.mood.oneLine} onChange={(v) => set(['mood', 'oneLine'], v)} />
        <ChoiceRow label="Regret today?" options={YES_NO_OPTIONS} value={entry.mood.regretToday} onChange={(v) => set(['mood', 'regretToday'], v)} />
        <ChoiceRow
          label="Past the hump yet?"
          options={YES_NO_OPTIONS}
          value={entry.mood.pastTheHump}
          onChange={(v) => set(['mood', 'pastTheHump'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Red-flag check">
        <RedFlagCheck values={entry.redFlags} onChange={(v) => set(['redFlags'], v)} />
      </FieldGroup>

      <TextField
        label="Questions for next appointment"
        rows={3}
        value={entry.questionsForNextAppointment}
        onChange={(v) => set(['questionsForNextAppointment'], v)}
      />
    </div>
  )
}

function WeeklyEntryForm({ entry, onChange }) {
  const set = (path, value) => onChange(setPath(entry, path, value))

  return (
    <div>
      <div className="mb-4 text-base font-semibold text-base-content">Week {entry.week}</div>

      <FieldGroup title="Milestones this week">
        <TextField
          label="Follow-up visit? Date / what they said"
          value={entry.milestones.followUpVisit}
          onChange={(v) => set(['milestones', 'followUpVisit'], v)}
        />
        <ChoiceRow
          label="Diet stage"
          options={DIET_STAGE_OPTIONS}
          value={entry.milestones.dietStage}
          onChange={(v) => set(['milestones', 'dietStage'], v)}
        />
        <TextField
          label="First time I did ___ again"
          value={entry.milestones.firstTimeIDidAgain}
          onChange={(v) => set(['milestones', 'firstTimeIDidAgain'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Trajectory">
        <TextField label="Swelling vs. last week" value={entry.trajectory.swellingVsLastWeek} onChange={(v) => set(['trajectory', 'swellingVsLastWeek'], v)} />
        <TextField label="Pain vs. last week" value={entry.trajectory.painVsLastWeek} onChange={(v) => set(['trajectory', 'painVsLastWeek'], v)} />
        <TextField label="Numbness — any change anywhere" value={entry.trajectory.numbnessChange} onChange={(v) => set(['trajectory', 'numbnessChange'], v)} />
        <TextField
          label="Sleep — better than pre-surgery yet?"
          value={entry.trajectory.sleepBetterThanPreSurgery}
          onChange={(v) => set(['trajectory', 'sleepBetterThanPreSurgery'], v)}
        />
        <ScaleInput label="Energy" value={entry.trajectory.energy} onChange={(v) => set(['trajectory', 'energy'], v)} />
      </FieldGroup>

      <FieldGroup title="The running question">
        <ChoiceRow
          label="Could I have run this week?"
          options={YES_NO_OPTIONS}
          value={entry.runningQuestion.couldIHaveRun}
          onChange={(v) => set(['runningQuestion', 'couldIHaveRun'], v)}
        />
        <TextField
          label="What would have stopped me"
          value={entry.runningQuestion.whatWouldHaveStoppedMe}
          onChange={(v) => set(['runningQuestion', 'whatWouldHaveStoppedMe'], v)}
          placeholder="jaw / breathing / energy / didn’t want to / nothing"
        />
        <TextField
          label="Did easy movement feel good this week, or like a chore?"
          value={entry.runningQuestion.feltGoodOrChore}
          onChange={(v) => set(['runningQuestion', 'feltGoodOrChore'], v)}
        />
      </FieldGroup>

      <FieldGroup title="Mental">
        <ScaleInput label="Overall" value={entry.mental.overall} onChange={(v) => set(['mental', 'overall'], v)} />
        <ChoiceRow label="Where am I on the arc" options={ARC_OPTIONS} value={entry.mental.arcPosition} onChange={(v) => set(['mental', 'arcPosition'], v)} />
        <TextField label="What helped" value={entry.mental.whatHelped} onChange={(v) => set(['mental', 'whatHelped'], v)} />
      </FieldGroup>

      <TextField
        label="What I want to remember from this week"
        rows={2}
        value={entry.whatIWantToRemember}
        onChange={(v) => set(['whatIWantToRemember'], v)}
      />
      <TextField
        label="Questions accumulating for the team"
        rows={2}
        value={entry.questionsAccumulating}
        onChange={(v) => set(['questionsAccumulating'], v)}
      />
    </div>
  )
}

function Sparkline({ points, width = 280, height = 40 }) {
  if (points.length < 2) {
    return <div className="flex h-10 items-center text-xs text-base-content/50">Not enough entries yet</div>
  }
  const max = 10
  const stepX = width / (points.length - 1)
  const coords = points.map((p, i) => `${i * stepX},${height - (p.value / max) * height}`)
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block text-primary">
      <polyline points={coords.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function regionSeries(entries, region) {
  return Object.keys(entries)
    .sort()
    .map((d) => {
      const e = entries[d]
      const vals = region.fields.map((f) => e.numbness?.[f]).filter((v) => v !== null && v !== undefined)
      if (!vals.length) return null
      return { date: d, value: vals.reduce((a, b) => a + b, 0) / vals.length }
    })
    .filter(Boolean)
}

export default function JournalView() {
  const [entries, setEntries] = useLocalState(JOURNAL_ENTRIES_KEY, {})
  const [weekly, setWeekly] = useLocalState(JOURNAL_WEEKLY_KEY, {})
  const [tab, setTab] = useState('today')
  const [editingDate, setEditingDate] = useState(null)
  const [editingWeek, setEditingWeek] = useState(null)
  const [importMsg, setImportMsg] = useState('')

  const today = dateKey(new Date())
  const todayEntry = entries[today]

  const sortedDates = useMemo(() => Object.keys(entries).sort().reverse(), [entries])
  const sortedWeeks = useMemo(() => Object.keys(weekly).map(Number).sort((a, b) => b - a), [weekly])

  const oxyRunningTotal = (dateStr) =>
    Object.entries(entries)
      .filter(([d]) => d <= dateStr)
      .reduce((sum, [, e]) => sum + (e.pain?.oxycodoneDosesToday || 0), 0)

  const startTodayEntry = () => {
    const priorDates = Object.keys(entries).filter((d) => d < today).sort()
    const prior = priorDates.length ? entries[priorDates[priorDates.length - 1]] : null
    const base = emptyDailyEntry(today)
    if (prior) {
      base.numbness = { ...prior.numbness }
      base.pain.medsTaken = (prior.pain.medsTaken || []).map((m) => ({ name: m.name, dose: m.dose, time: '' }))
    }
    setEntries((prev) => ({ ...prev, [today]: base }))
  }

  const updateEntry = (dateStr, next) => setEntries((prev) => ({ ...prev, [dateStr]: next }))

  const startOrOpenWeek = (weekNum) => {
    setWeekly((prev) => (prev[weekNum] ? prev : { ...prev, [weekNum]: emptyWeeklyEntry(weekNum) }))
    setEditingWeek(weekNum)
    setTab('log')
  }

  const handleExport = () => downloadJSON(`mma-recovery-map-export-${today}.json`, exportAllData())

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importAllData(JSON.parse(reader.result))
        setImportMsg('Imported. Reloading…')
        setTimeout(() => window.location.reload(), 800)
      } catch (err) {
        setImportMsg(err.message || 'Import failed.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const day = daysSinceSurgery(today)
  const week = Math.floor(Math.max(day, 0) / 7)
  const isSunday = new Date().getDay() === 0

  return (
    <div className="px-4 pb-10 pt-5">
      <p className="mb-4 text-sm leading-relaxed text-base-content/60">{JOURNAL_INTRO}</p>

      <div role="tablist" className="tabs tabs-boxed mb-5">
        {[
          { id: 'today', label: 'Today' },
          { id: 'log', label: 'Entries' },
          { id: 'trends', label: 'Trends' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            onClick={() => {
              setTab(t.id)
              setEditingDate(null)
              setEditingWeek(null)
            }}
            className={`tab flex-1 ${tab === t.id ? 'tab-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'today' && (
        <div>
          {day >= 0 && isSunday && (
            <button
              type="button"
              onClick={() => startOrOpenWeek(week)}
              className="btn btn-outline btn-primary mb-4 w-full justify-start text-left font-normal normal-case"
            >
              It’s Sunday — fill in the Week {week} summary →
            </button>
          )}
          {!todayEntry ? (
            <button
              type="button"
              onClick={startTodayEntry}
              className="card w-full border border-base-300 bg-base-100 px-5 py-6 text-center"
            >
              <div className="mb-1 text-base font-semibold text-base-content">Start today’s entry</div>
              <div className="text-sm text-base-content/50">
                {today}
                {day >= 0 ? ` · Day ${day}` : ''}
              </div>
            </button>
          ) : (
            <DailyEntryForm entry={todayEntry} onChange={(next) => updateEntry(today, next)} oxycodoneRunningTotal={oxyRunningTotal(today)} />
          )}
        </div>
      )}

      {tab === 'log' &&
        (editingDate ? (
          <div>
            <button type="button" onClick={() => setEditingDate(null)} className="btn btn-ghost btn-sm mb-4 gap-1 px-0">
              <ChevronLeft size={16} /> All entries
            </button>
            <DailyEntryForm
              entry={entries[editingDate]}
              onChange={(next) => updateEntry(editingDate, next)}
              oxycodoneRunningTotal={oxyRunningTotal(editingDate)}
            />
          </div>
        ) : editingWeek !== null ? (
          <div>
            <button type="button" onClick={() => setEditingWeek(null)} className="btn btn-ghost btn-sm mb-4 gap-1 px-0">
              <ChevronLeft size={16} /> All entries
            </button>
            <WeeklyEntryForm entry={weekly[editingWeek]} onChange={(next) => setWeekly((prev) => ({ ...prev, [editingWeek]: next }))} />
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Weekly summaries</div>
                <button type="button" onClick={() => startOrOpenWeek(week)} className="btn btn-link btn-xs px-0 no-underline">
                  + Week {week}
                </button>
              </div>
              {sortedWeeks.length === 0 ? (
                <p className="text-sm text-base-content/50">None yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sortedWeeks.map((w) => (
                    <li key={w}>
                      <button
                        type="button"
                        onClick={() => setEditingWeek(w)}
                        className="btn btn-outline btn-block justify-start font-normal normal-case"
                      >
                        Week {w}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Daily entries</div>
              {sortedDates.length === 0 ? (
                <p className="text-sm text-base-content/50">None yet — start today’s entry from the Today tab.</p>
              ) : (
                <ul className="space-y-2">
                  {sortedDates.map((d) => (
                    <li key={d}>
                      <button
                        type="button"
                        onClick={() => setEditingDate(d)}
                        className="btn btn-outline btn-block justify-between font-normal normal-case"
                      >
                        <span>{d}</span>
                        <span className="text-base-content/50">Day {daysSinceSurgery(d)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

      {tab === 'trends' && (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Numbness over time</div>
          <p className="mb-4 text-sm leading-relaxed text-base-content/60">
            The surgeons said the numbness verdict isn’t known for 4–5 months — this trend matters more than any single day.
          </p>
          <div className="mb-6 space-y-3">
            {NUMBNESS_TREND_REGIONS.map((region) => {
              const series = regionSeries(entries, region)
              const latest = series[series.length - 1]
              return (
                <div key={region.id} className="card card-compact border border-base-300 bg-base-100">
                  <div className="card-body">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-sm text-base-content">{region.label}</span>
                      <span className="text-xs tabular-nums text-base-content/50">{latest ? latest.value.toFixed(1) : '—'}</span>
                    </div>
                    <Sparkline points={series} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Reference checkpoints</div>
          <p className="mb-3 text-xs text-base-content/50">Use these to sanity-check where you are, not as targets to hit.</p>
          <ul className="space-y-2">
            {REFERENCE_CHECKPOINTS.map((c, i) => (
              <li key={i} className="text-sm leading-relaxed text-base-content">
                <span className="font-medium">{c.when}:</span> <span className="text-base-content/60">{c.expected}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="divider" />
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Backup</div>
      <p className="mb-3 text-sm leading-relaxed text-base-content/60">
        Everything on this page stays on this device. Export regularly, and use the file to move data to another device.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={handleExport} className="btn btn-outline btn-sm">
          <Download size={14} /> Export JSON
        </button>
        <label className="btn btn-outline btn-sm">
          <Upload size={14} /> Import
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>
      </div>
      {importMsg && <p className="mt-2 text-xs text-base-content/50">{importMsg}</p>}
    </div>
  )
}
