// Phone pushes for /row through ntfy.sh: install the ntfy app, subscribe to
// the topic in ROW_NTFY_TOPIC, done. The topic name is the only secret, so
// make it long and random. Unset means no pushes.

export const notifyConfigured = () => Boolean(process.env.ROW_NTFY_TOPIC)

export async function push({ title, message, tags = [], click = 'https://www.jonschafer.com/row' }) {
  if (!notifyConfigured()) return
  const res = await fetch('https://ntfy.sh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: process.env.ROW_NTFY_TOPIC, title, message, tags, click }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`ntfy ${res.status}`)
}
