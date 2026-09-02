'use client'

import { useState } from 'react'

export const STATUS_META = {
  confirmed: { mark: '✅', label: 'Confirmed' },
  inference: { mark: '🔶', label: 'Inferred', badgeClass: 'badge-warning' },
  question: { mark: '❓', label: 'Unconfirmed', badgeClass: 'badge-info' },
}

// "Confirmed" notes are the majority case and carry no extra signal — only
// surface a badge when something is inferred or still needs confirming.
export function StatusBadge({ status }) {
  if (status === 'confirmed') return null
  const meta = STATUS_META[status]
  return (
    <span className={`badge badge-sm badge-outline ${meta.badgeClass} mb-1 gap-1`}>
      <span aria-hidden="true">{meta.mark}</span> {meta.label}
    </span>
  )
}

export function Collapsible({ open, children }) {
  return (
    <div className="mma-collapsible-panel" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
      <div>{children}</div>
    </div>
  )
}

export function SectionHeader({ children }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">{children}</h2>
}

// A daisyUI button "join" of 0-10 tap targets — deliberately not a slider, so
// a tired thumb can hit a value in one tap.
export function ScaleInput({ label, sublabel, value, onChange }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm text-base-content">
          {label}
          {sublabel && <span className="text-base-content/50"> · {sublabel}</span>}
        </span>
        <span className="text-xs tabular-nums text-base-content/50">{value === null || value === undefined ? '—' : value}</span>
      </div>
      <div className="join w-full">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={`btn btn-xs join-item flex-1 px-0 tabular-nums ${value === n ? 'btn-primary' : 'btn-outline'}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// A daisyUI button "join" segmented control for the enum-ish fields
// (worse/same/better, on/off/off-to-eat, etc).
export function ChoiceRow({ label, options, value, onChange }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 text-sm text-base-content">{label}</div>
      <div className="join flex flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`btn btn-sm join-item ${value === opt.value ? 'btn-primary' : 'btn-outline'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TextField({ label, value, onChange, placeholder, rows }) {
  const isTextarea = Boolean(rows)
  return (
    <label className="form-control mb-4 w-full">
      <div className="label pb-1.5 pt-0">
        <span className="label-text text-sm">{label}</span>
      </div>
      {isTextarea ? (
        <textarea
          rows={rows}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="textarea textarea-bordered w-full text-sm"
        />
      ) : (
        <input
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="input input-bordered w-full text-sm"
        />
      )}
    </label>
  )
}

export function CheckItem({ id, text, detail, checked, onToggle, note, onNoteChange }) {
  const [noteOpen, setNoteOpen] = useState(Boolean(note))
  return (
    <li data-print-avoid-break className="card card-compact bg-base-100 border border-base-300">
      <div className="card-body">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(id)}
            className="checkbox checkbox-sm checkbox-primary mt-0.5"
          />
          <span className="flex-1">
            <span className={`text-sm ${checked ? 'text-base-content/50 line-through' : 'text-base-content'}`}>{text}</span>
            {detail && <span className="block mt-1 text-xs text-base-content/50">{detail}</span>}
          </span>
        </label>
        <div className="pl-8">
          {!noteOpen ? (
            <button type="button" onClick={() => setNoteOpen(true)} className="link link-hover text-xs text-base-content/50">
              {note ? 'Edit note' : '+ note'}
            </button>
          ) : (
            <textarea
              value={note || ''}
              onChange={(e) => onNoteChange(id, e.target.value)}
              placeholder="What was the answer?"
              rows={2}
              className="textarea textarea-bordered textarea-sm w-full"
            />
          )}
        </div>
      </div>
    </li>
  )
}
