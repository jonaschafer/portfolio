export async function POST(request) {
  const { password } = await request.json().catch(() => ({}))
  const pw = process.env.ORBIT_PASSWORD
  if (!pw || password !== pw) return Response.json({ error: 'Nope' }, { status: 401 })
  const res = Response.json({ ok: true })
  res.headers.set('Set-Cookie', `orbit=${encodeURIComponent(pw)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`)
  return res
}
