// The Transcribe quick action, drawn in the page's ink (currentColor) so it
// takes the dealt theme. Right-click a memo in Finder, pick Transcribe, and a
// .txt lands next to it. The memo and its text are made up.
const F = "'Social Condensed','Haas Grot Disp',sans-serif"

const MENU = ['Open', 'Open With', 'Get Info', 'Rename', 'Copy']
const LINES = [
  'Okay, idea for the deck. Lead',
  'with the before and after, then',
  'the three decisions, numbers',
  'last. Check if the date moved.',
]

function File({ x, y, ext, name }) {
  return (
    <g>
      <path d={`M${x} ${y} h34 l14 14 v46 h-48 z`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d={`M${x + 34} ${y} v14 h14`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <text x={x + 24} y={y + 50} fontSize="13" textAnchor="middle" fill="currentColor" opacity="0.8">{ext}</text>
      <text x={x + 24} y={y + 86} fontSize="15" textAnchor="middle" fill="currentColor">{name}</text>
    </g>
  )
}

export default function TranscribeDiagram() {
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="Right-click a voice memo in Finder, choose Quick Actions, then Transcribe. A text file with the transcript appears next to the recording." className="block w-full h-auto" style={{ fontFamily: F, letterSpacing: '0.17px' }}>
      <defs>
        <marker id="tr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <File x={24} y={24} ext=".m4a" name="Deck idea" />

      {/* Finder's right-click menu */}
      <rect x={110} y={40} width={176} height={250} rx="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {MENU.map((item, i) => (
        <text key={item} x={126} y={72 + i * 30} fontSize="17" fill="currentColor" opacity="0.7">{item}</text>
      ))}
      <line x1={122} y1={222} x2={274} y2={222} stroke="currentColor" strokeOpacity="0.3" />
      <text x={126} y={250} fontSize="17" fill="currentColor">Quick Actions</text>
      <text x={262} y={250} fontSize="17" fill="currentColor">›</text>

      {/* The submenu */}
      <rect x={290} y={226} width={130} height={38} rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.25" />
      <text x={306} y={251} fontSize="17" fill="currentColor">Transcribe</text>

      <path d="M420 245 C 452 245, 452 120, 470 106" fill="none" stroke="currentColor" strokeWidth="1.25" markerEnd="url(#tr-arrow)" />
      <text x={292} y={290} fontSize="14" fill="currentColor" opacity="0.7">runs on your Mac</text>

      {/* The result */}
      <rect x={478} y={24} width={178} height={170} rx="4" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <text x={492} y={50} fontSize="15" fill="currentColor">Deck idea.txt</text>
      <line x1={490} y1={62} x2={644} y2={62} stroke="currentColor" strokeOpacity="0.3" />
      {LINES.map((l, i) => (
        <text key={i} x={492} y={86 + i * 22} fontSize="12.5" fill="currentColor" opacity="0.85">{l}</text>
      ))}
      <text x={492} y={222} fontSize="14" fill="currentColor" opacity="0.7">saved next to the memo,</text>
      <text x={492} y={242} fontSize="14" fill="currentColor" opacity="0.7">copied to your clipboard</text>
    </svg>
  )
}
