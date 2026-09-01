const LINKS = [
  {
    href: '/mma/map/compare/daisyui',
    title: 'daisyUI',
    desc: 'Real, fully-opinionated component CSS (stat, card, btn, badge) — the most concretely different result of the three.',
  },
  {
    href: '/mma/map/compare/park',
    title: 'Park UI',
    desc: 'Real Ark UI primitive (Switch) + Park UI’s published visual tokens, hand-applied via Tailwind instead of their Panda CSS build.',
  },
  {
    href: '/mma/map/compare/headless',
    title: 'Headless UI',
    desc: 'Real Headless UI primitive (Switch), styled to Tailwind Labs’ own documented example conventions — Headless UI itself has no visual opinions.',
  },
]

export default function ComparePage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Framework comparison</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 1.5 }}>
        Three real recreations of the recovery-map home screen, one per framework. Not wired to real
        checklist state or your device data — layout/spacing/type only.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              display: 'block',
              padding: 16,
              borderRadius: 10,
              border: '1px solid #e5e5e5',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{l.title}</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{l.desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
