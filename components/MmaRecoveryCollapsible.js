'use client'

import { useState } from 'react'

export default function MmaRecoveryCollapsible({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-t" style={{ borderColor: '#f0e9d9' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mma-btn-press w-full flex items-center justify-between py-[16px] text-left group"
      >
        <span
          className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] tracking-[0.12em] uppercase"
          style={{ color: '#8a7c68' }}
        >
          {label}
        </span>
        <span
          className="text-[18px] leading-none flex-shrink-0 ml-4"
          style={{
            color: '#7c8a6d',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 220ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          +
        </span>
      </button>
      {/* Grid-rows trick: animates smoothly to real content height instead of a hard
          show/hide or a fixed max-height guess. */}
      <div className="mma-collapsible-panel" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div>
          <div className="pb-[22px]">{children}</div>
        </div>
      </div>
    </div>
  )
}
