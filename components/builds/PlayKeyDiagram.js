// The play key problem and the fix, drawn in the page's ink (currentColor)
// so it takes the dealt theme: press play, Music tries to open, noTunes
// quits it, Spotify opens instead. Stacks on phones.
const tint = (pct) => ({ backgroundColor: `color-mix(in srgb, currentColor ${pct}%, transparent)` })
const rule = { borderColor: 'color-mix(in srgb, currentColor 30%, transparent)' }

function Keycap() {
  return (
    <div
      className="relative w-[84px] h-[84px] shrink-0 rounded-[10px] border flex flex-col items-center justify-center gap-[2px]"
      style={{ borderColor: 'currentColor', boxShadow: '0 4px 0 0 color-mix(in srgb, currentColor 30%, transparent)' }}
      aria-hidden="true"
    >
      <svg width="30" height="14" viewBox="0 0 30 14" fill="currentColor">
        <path d="M0 0 L11 7 L0 14 Z" />
        <rect x="17" y="0" width="4" height="14" />
        <rect x="25" y="0" width="4" height="14" />
      </svg>
      <span className="text-[13px] opacity-70">F8</span>
    </div>
  )
}

function Step({ label, title, sub, struck, strong }) {
  return (
    <div className="flex-1 min-w-0 rounded-[4px] border px-[14px] py-[12px]" style={{ ...rule, ...(strong ? tint(10) : {}) }}>
      <p className="text-[13px] opacity-70">{label}</p>
      <p className={`text-[19px] leading-[1.15] ${struck ? 'line-through decoration-[1.5px]' : ''}`}>{title}</p>
      <p className="mt-[2px] text-[14px] leading-[1.25] opacity-70">{sub}</p>
    </div>
  )
}

const Arrow = () => (
  <span aria-hidden="true" className="self-center text-[20px] opacity-60 rotate-90 md:rotate-0">→</span>
)

export default function PlayKeyDiagram() {
  return (
    <div
      role="img"
      aria-label="Pressing the play key with Spotify closed opens Apple Music. noTunes quits Music the moment it launches and opens Spotify instead."
      className="flex flex-col md:flex-row items-stretch md:items-center gap-[12px] font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
    >
      <div className="self-center md:pr-[4px]"><Keycap /></div>
      <Arrow />
      <Step label="macOS" title="Apple Music" sub="opens, every time" struck />
      <Arrow />
      <Step label="noTunes" title="Quits it" sub="before it settles in" />
      <Arrow />
      <Step label="instead" title="Spotify" sub="opens and plays" strong />
    </div>
  )
}
