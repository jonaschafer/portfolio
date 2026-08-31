'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export const STATUS_META = {
  confirmed: { mark: '✅', label: 'Confirmed' },
  inference: { mark: '🔶', label: 'Inferred' },
  question: { mark: '❓', label: 'Unconfirmed' },
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  return (
    <span className="block text-[10.5px] font-medium uppercase tracking-[0.07em] text-[var(--muted)] mb-1">
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
  return (
    <h2 className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] mb-3">
      {children}
    </h2>
  )
}

// Row of 0-10 tap targets — deliberately not a slider, so a tired thumb can hit a value in one tap.
export function ScaleInput({ label, sublabel, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[13px] text-[var(--fg)]">
          {label}
          {sublabel && <span className="text-[var(--muted)]"> · {sublabel}</span>}
        </span>
        <span className="text-[12px] tabular-nums text-[var(--muted)]">{value === null || value === undefined ? '—' : value}</span>
      </div>
      <div className="grid grid-cols-11 gap-[3px]">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={`mma-btn-press h-8 rounded-[6px] text-[11px] font-medium tabular-nums ${
              value === n ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'bg-[var(--chip-bg)] text-[var(--muted)]'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// Small on/off segmented control for the enum-ish fields (worse/same/better, on/off/off-to-eat, etc).
export function ChoiceRow({ label, options, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[13px] text-[var(--fg)]">{label}</div>
      <div className="flex flex-wrap gap-[6px]">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`mma-btn-press rounded-full px-3 py-[7px] text-[12.5px] font-medium ${
              value === opt.value ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'bg-[var(--chip-bg)] text-[var(--muted)]'
            }`}
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
  const Tag = isTextarea ? 'textarea' : 'input'
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[13px] text-[var(--fg)]">{label}</div>
      <Tag
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[14px] text-[var(--fg)] placeholder:text-[var(--muted)]"
      />
    </div>
  )
}

export function CheckItem({ id, text, detail, checked, onToggle, note, onNoteChange }) {
  const [noteOpen, setNoteOpen] = useState(Boolean(note))
  return (
    <li data-print-avoid-break className="rounded-[14px] border border-[var(--line)] bg-[var(--card)] px-4 py-3">
      <button type="button" onClick={() => onToggle(id)} className="mma-btn-press flex w-full items-start gap-3 text-left">
        <span
          className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 ${
            checked ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)]'
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} className="text-[var(--accent-fg)]" />}
        </span>
        <span className="flex-1">
          <span className={`text-[14.5px] leading-[1.5] ${checked ? 'text-[var(--muted)] line-through' : 'text-[var(--fg)]'}`}>
            {text}
          </span>
          {detail && <span className="block mt-1 text-[12.5px] leading-[1.5] text-[var(--muted)]">{detail}</span>}
        </span>
      </button>
      <div className="mt-2 pl-8">
        {!noteOpen ? (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="text-[12px] text-[var(--muted)] underline underline-offset-2"
          >
            {note ? 'Edit note' : '+ note'}
          </button>
        ) : (
          <textarea
            value={note || ''}
            onChange={(e) => onNoteChange(id, e.target.value)}
            placeholder="What was the answer?"
            rows={2}
            className="w-full rounded-[10px] border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[13px] text-[var(--fg)] placeholder:text-[var(--muted)]"
          />
        )}
      </div>
    </li>
  )
}
