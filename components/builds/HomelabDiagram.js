// The homelab, drawn in the page's ink (currentColor) so it takes the dealt
// theme. Phone and laptop reach the Mac mini over Tailscale; Claude Code
// works on it over SSH; everything heavy lives on the 8TB.
const F = "'Social Condensed','Haas Grot Disp',sans-serif"

function Box({ x, y, w, h, title, sub, strong }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={strong ? 'currentColor' : 'none'} fillOpacity={strong ? 0.08 : 0} stroke="currentColor" strokeWidth="1.25" />
      <text x={x + 14} y={y + 26} fontSize="19" fill="currentColor">{title}</text>
      {sub && (
        <text x={x + 14} y={y + 48} fontSize="15" fill="currentColor" opacity="0.7">{sub}</text>
      )}
    </g>
  )
}

function Line({ d, label, lx, ly, dashed }) {
  return (
    <g>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray={dashed ? '4 5' : undefined} markerEnd="url(#hl-arrow)" />
      {label && <text x={lx} y={ly} fontSize="15" fill="currentColor" opacity="0.8">{label}</text>}
    </g>
  )
}

export default function HomelabDiagram() {
  return (
    <svg viewBox="0 0 680 470" role="img" aria-label="Phone and laptop connect over Tailscale to a Mac mini running Ollama, Open WebUI and a media server, with models and media on an 8TB SSD. Claude Code sets it up over SSH." className="block w-full h-auto" style={{ fontFamily: F, letterSpacing: '0.17px' }}>
      <defs>
        <marker id="hl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <Box x={24} y={40} w={170} h={64} title="iPhone" sub="Conduit app, anywhere" />
      <Box x={24} y={130} w={170} h={64} title="MacBook" sub="browser, Raycast" />
      <Box x={24} y={300} w={170} h={64} title="Claude Code" sub="on the laptop" />

      <Line d="M194 72 C 250 72, 250 140, 296 150" label="Tailscale" lx={214} ly={64} />
      <Line d="M194 162 L 296 170" />
      <Line d="M194 332 C 250 332, 250 300, 296 290" label="SSH" lx={226} ly={352} dashed />

      {/* The mini */}
      <rect x={300} y={24} width={356} height={318} rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x={316} y={52} fontSize="21" fill="currentColor">Mac mini, M4, 16GB</text>
      <text x={316} y={74} fontSize="15" fill="currentColor" opacity="0.7">always on, no Docker Desktop</text>

      <Box x={316} y={92} w={158} h={70} title="Ollama" sub="14B model, 16k context" strong />
      <Box x={482} y={92} w={158} h={70} title="Open WebUI" sub="chat, web search" strong />
      <Box x={316} y={172} w={158} h={70} title="Plex" sub="movies, TV" strong />
      <Box x={482} y={172} w={158} h={70} title="Seerr" sub="request queue" strong />
      <Box x={316} y={252} w={324} h={70} title="Audiobookshelf" sub="listens on the phone, keeps your place" strong />

      <Line d="M478 342 L 478 380" />
      <Box x={300} y={384} w={356} h={64} title="8TB external SSD" sub="models, media, Dropbox" />
    </svg>
  )
}
