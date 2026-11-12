export const metadata = { title: 'Pages' }

const PAGES = [
  {
    href: '/aleph/audit',
    title: 'Aleph surfaces',
    note: 'Which surfaces Red Antler owns, which are shared, and which are ours regardless.',
    date: 'Sep 2026',
  },
  {
    href: '/aleph/data-viz',
    title: 'Chart kit',
    note: 'Data plus a recipe in, the same chart out as an ebook page, a slide or a live web component.',
    date: 'Nov 2026',
  },
  {
    href: '/aleph/symbolizer',
    title: 'Symbolizer',
    note: 'One piece, placed at 0°, 120° and −120°. Change the piece and all three follow.',
    date: 'Nov 2026',
  },
]

export default function AlephIndex() {
  return (
    <main className="wrap index">
      <p className="lbl">jonschafer.com / aleph</p>
      <h1>Aleph</h1>
      <p className="index-lede">Work in progress for the Aleph team. Please keep the link inside Aleph.</p>
      <ul className="index-list">
        {PAGES.map((p) => (
          <li key={p.href}>
            <a href={p.href}>
              <span className="index-title">{p.title}</span>
              <span className="index-note">{p.note}</span>
              <span className="lbl">{p.date}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="lbl index-lock">
        <a href="/aleph/lock">Lock this browser</a>
      </p>
    </main>
  )
}
