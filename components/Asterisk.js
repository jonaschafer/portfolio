// Six-petal asterisk (the Wingdings-style one). Inherits color; size it with
// width/height or font-size via `em`.
const PETAL = 'M0 -4 C -2.6 -16 -8.5 -27 -8.5 -34 A 8.5 8.5 0 1 1 8.5 -34 C 8.5 -27 2.6 -16 0 -4 Z'

export default function Asterisk({ className = '', title }) {
  return (
    <svg
      viewBox="-44 -44 88 88"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path key={r} d={PETAL} transform={`rotate(${r})`} />
      ))}
    </svg>
  )
}
