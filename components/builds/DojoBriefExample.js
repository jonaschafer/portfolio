// What /dojo-brief does, shown rather than told: a real branding thread on
// the left (people and the partner renamed, trimmed for length), and the
// brief the skill pulled out of it on the right. Drawn in the page's ink so
// it takes the dealt theme.
const THREAD = [
  ['Rowan', 'Plus-related branding q. We’re white-labeling Lumen’s AI math tutor and launching it as “Dojo Math.” Should our promo lean into their aesthetic (dark, mesh gradients, very AI-native) or go Dojo-native? Not looking for a full brand exercise.'],
  ['Priya', 'Leaning into theirs feels cohesive once parents try the freemium. Tho we’re selling it for K-2 and their brand doesn’t work great for that age'],
  ['Jon', 'Is this a Plus feature or standalone? And what’s the success criteria for the pilot?'],
  ['Priya', 'Not part of Plus for the pilot. Success is trial starts and booking conversion'],
  ['Jon', 'Pilots that work become permanent, so I’d keep our emails and landing page Dojo-native. Also “Dojo Math” gives me pause, Tutor teaches math too'],
  ['Priya', 'Name isn’t final. Sticky stuff for the pilot: naming, learning subtab, kid entry point, post-purchase page + email'],
]

const BRIEF = [
  ['Project', 'Dojo Math pilot: parent promo (working name)'],
  ['Team', 'Product, P1'],
  ['Core message', 'A math tutor built for K-2, ready to try free from the app you already use.'],
  ['Audience', 'Parents of K-2 kids on ClassDojo'],
  ['Deliverables', 'Pilot banner, learning subtab, kid entry point, post-purchase page and email'],
  ['Requirements', 'Our surfaces stay Dojo-native. Lumen’s in-app experience stays theirs. Name not final.'],
  ['Success', 'Trial starts, booking conversion'],
  ['Missing', 'Launch date, final decision maker'],
]

export default function DojoBriefExample() {
  const rule = { borderColor: 'color-mix(in srgb, currentColor 25%, transparent)' }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px] font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[15px] leading-[1.3]">
      <div>
        <p className="pb-[8px] mb-[10px] border-b opacity-70" style={rule}>Slack thread, 6 messages (trimmed)</p>
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
