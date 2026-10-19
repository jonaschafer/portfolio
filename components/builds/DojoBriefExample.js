// What /dojo-brief does, shown rather than told: a messy thread on the left,
// the structured brief on the right. Invented example, no real people or
// projects. Drawn in the page's ink so it takes the dealt theme.
const THREAD = [
  ['Maya', 'can brand help w the conferences thing? need something for families before Nov'],
  ['Maya', 'like an email + maybe a printable? teachers keep asking'],
  ['Theo', 'esp spanish speaking families, last yr turnout was rough'],
  ['Maya', 'oh and it has to say the translation feature, legal wants the disclaimer'],
  ['Theo', 'nov 4 is when invites go out fwiw'],
]

const BRIEF = [
  ['Project', 'Fall family conferences kit'],
  ['Priority', 'P1, invites go out Nov 4'],
  ['Core message', 'Every family can show up to conferences ready, in their own language.'],
  ['Audience', 'Families, with a focus on Spanish-speaking households'],
  ['Deliverables', 'Family email, printable one-pager'],
  ['Requirements', 'Mention message translation. Legal disclaimer in footer.'],
  ['Missing', 'Final decision maker, launch owner'],
]

export default function DojoBriefExample() {
  const rule = { borderColor: 'color-mix(in srgb, currentColor 25%, transparent)' }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px] font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[15px] leading-[1.3]">
      <div>
        <p className="pb-[8px] mb-[10px] border-b opacity-70" style={rule}>#marketing, 5 messages</p>
        <ul className="flex flex-col gap-[10px]">
          {THREAD.map(([who, msg], i) => (
            <li key={i}>
              <span className="opacity-70">{who}</span>
              <p>{msg}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="pb-[8px] mb-[10px] border-b opacity-70" style={rule}>/dojo-brief</p>
        <dl className="flex flex-col gap-[8px]">
          {BRIEF.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[96px_1fr] gap-[10px]">
              <dt className="opacity-70">{k}</dt>
              <dd>{k === 'Missing' ? <span className="rounded-[2px] px-[4px]" style={{ backgroundColor: 'color-mix(in srgb, currentColor 14%, transparent)' }}>{v}</span> : v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
