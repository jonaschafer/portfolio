// The asterisk from the Figma file (Website — Oct 26), drawn from
// public/images/asterisk.svg as a mask so it takes the current text color.
export default function Asterisk({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: '9.65px',
        height: '10.64px',
        WebkitMask: 'url(/images/asterisk.svg) center / contain no-repeat',
        mask: 'url(/images/asterisk.svg) center / contain no-repeat',
      }}
    />
  )
}
