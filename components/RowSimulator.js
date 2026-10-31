'use client'

import { useEffect, useRef } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import useRandomTheme from './useRandomTheme'

// /row-simulator, in the site register: a line drawing of a Concept2 erg and
// a PM5 that respond to rate, stroke length, force and damper. The drawing and
// numbers run imperatively off one animation loop; React only lays out the page.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const lcdFont = "font-['ui-monospace','SF_Mono','Menlo',monospace]"

const DEF = { spm: 24, len: 1.45, force: 345, damper: 4 }
const INTRO =
  'Pick an experiment. It pins the starting point as your baseline, then changes one input so the monitor shows the difference.'
const EXP = {
  slow: {
    title: 'Slow the return', sub: '24 to 20 spm, same stroke',
    from: { spm: 24, len: 1.45, force: 345, damper: 4 }, to: { spm: 20 },
    text: 'The drive still takes the same time. Only the slide back got longer, so the rate dropped. Each stroke now carries you farther, but you take fewer of them, so watts fall and pace slows.',
  },
  long: {
    title: 'Lengthen the stroke', sub: '1.30 to 1.55 m at 24 spm',
    from: { spm: 24, len: 1.3, force: 345, damper: 4 }, to: { len: 1.55 },
    text: 'Same rate, more handle travel. More work goes into every stroke, so watts rise, pace drops and meters per stroke go up. The longer drive eats into the recovery a little.',
  },
  hard: {
    title: 'Press harder', sub: '300 to 420 N at 24 spm',
    from: { spm: 24, len: 1.45, force: 300, damper: 4 }, to: { force: 420 },
    text: 'Same rate and length, more force. Watts rise and pace drops. The handle also moves faster, so the drive gets shorter and you get a bit more time on the slide.',
  },
  rate: {
    title: 'Rate up', sub: '24 to 30 spm, same stroke',
    from: { spm: 24, len: 1.45, force: 345, damper: 4 }, to: { spm: 30 },
    text: 'Same stroke, more of them. Watts and pace improve, but meters per stroke go down because each stroke has less time to carry you. The recovery shrinks fast.',
  },
}
const CONTROLS = [
  { key: 'spm', label: 'Stroke rate', min: 16, max: 36, step: 1,
    help: 'Strokes per minute. The drive takes about the same time at any rate, so this mostly sets how quickly you slide back to the catch.' },
  { key: 'len', label: 'Stroke length', min: 1, max: 1.65, step: 0.01,
    help: 'How far the handle travels from catch to finish. More compression at the catch and a full finish add length.' },
  { key: 'force', label: 'Push force', min: 150, max: 700, step: 5,
    help: 'Average force on the handle during the drive. This is the “pressing hard” part.' },
  { key: 'damper', label: 'Damper', min: 1, max: 10, step: 1,
    help: 'The lever on the flywheel. Higher feels heavier and slows the handle, so the drive takes longer. It does not add watts on its own.' },
]
const STEPS = [
  ['Work per stroke', 'Force times how far the handle travels.'],
  ['Watts', 'Work per stroke times strokes per second. Rate multiplies whatever each stroke is worth.'],
  ['Pace', 'The PM5 converts watts to pace with a cube root, so doubling watts only makes you about 21% faster.'],
  ['Meters per stroke', 'Boat speed times the seconds each stroke takes. A higher rate gives each stroke less time to carry you.'],
  ['Drive and recovery', 'Drive time comes from length and handle speed. Whatever is left of the stroke is the slide back.'],
]

function model(s) {
  const drag = 80 + (s.damper - 1) * 15.5
  const work = s.force * s.len
  const watts = (work * s.spm) / 60
  const pace = 500 * Math.cbrt(2.8 / watts)
  const speed = 500 / pace
  const mps = (speed * 60) / s.spm
  const handle = Math.sqrt(s.force / (0.9 * drag))
  const drive = s.len / handle
  const cycle = 60 / s.spm
  const rec = cycle - drive
  return { drag, work, watts, pace, speed, mps, handle, drive, cycle, rec, ratio: rec / drive }
}

const fmtPace = (p) => {
  const m = Math.floor(p / 60)
  const s = p - m * 60
  return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1)
}
const fmtTime = (t) => {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return m + ':' + (s < 10 ? '0' : '') + s
}
const sign = (x, d) => (x > 0 ? '▲ ' : '▼ ') + Math.abs(x).toFixed(d)
const alpha = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0')

// Rower geometry, in meters, flywheel on the left.
const ANKLE = { x: 0.6, y: 0.5 }, TOE = { x: 0.49, y: 0.64 }, HIP_Y = 0.56
const THIGH = 0.46, SHIN = 0.46, TORSO = 0.6, UPPER = 0.31, FORE = 0.3
const W0 = -0.75, W1 = 2.65, H0 = -0.05
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (t) => Math.max(0, Math.min(1, t))
const sm = (t) => {
  t = clamp(t)
  return t * t * (3 - 2 * t)
}

function ik(a, b, l1, l2, pickUp) {
  const dx = b.x - a.x, dy = b.y - a.y
  let d = Math.hypot(dx, dy)
  d = Math.max(Math.abs(l1 - l2) + 1e-3, Math.min(l1 + l2 - 1e-3, d))
  const base = Math.atan2(dy, dx)
  const ang = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))
  const p1 = { x: a.x + l1 * Math.cos(base + ang), y: a.y + l1 * Math.sin(base + ang) }
  const p2 = { x: a.x + l1 * Math.cos(base - ang), y: a.y + l1 * Math.sin(base - ang) }
  return pickUp ? (p1.y > p2.y ? p1 : p2) : p1.y < p2.y ? p1 : p2
}

function pose(l, b, a, q) {
  const catchHip = Math.max(0.8, 1.5 - 0.62 * q)
  const hip = { x: lerp(catchHip, 1.5, l), y: HIP_Y }
  const catchAng = (-(22 + 10 * Math.min(q, 1.15)) * Math.PI) / 180
  const ang = lerp(catchAng, (15 * Math.PI) / 180, b)
  const sh = { x: hip.x + TORSO * Math.sin(ang), y: hip.y + TORSO * Math.cos(ang) }
  const hy = lerp(0.7, 0.88, a)
  const R = 0.595, dy = sh.y - hy
  const reachX = sh.x - Math.sqrt(Math.max(0, R * R - dy * dy))
  const finX = hip.x + 0.35 * Math.sin(ang) - 0.12
  const hand = { x: lerp(reachX, finX, sm(a)), y: hy }
  const knee = ik(ANKLE, hip, SHIN, THIGH, true)
  const elbow = ik(sh, hand, UPPER, FORE, false)
  const head = { x: sh.x + 0.17 * Math.sin(ang) - 0.03, y: sh.y + 0.17 * Math.cos(ang) + 0.02 }
  return { hip, sh, hand, knee, elbow, head }
}

function Heading({ children }) {
  return <h2 className={`${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>{children}</h2>
}

function LcdCell({ id, unit, big, right, inline }) {
  const size = big ? 'text-[34px]' : inline === 'lg' ? 'text-[22px]' : 'text-[17px]'
  return (
    <div className={`grid ${right ? 'text-right' : ''}`}>
      {inline ? (
        <span className="flex items-baseline gap-[4px]">
          <span data-o={id} className={`${size} font-semibold leading-[1.05]`} />
          <span className="text-[10px] font-semibold">{unit}</span>
        </span>
      ) : (
        <>
          <span data-o={id} className={`${size} font-semibold leading-[1.05]`} />
          <span className="text-[10px] font-semibold">{unit}</span>
        </>
      )}
      <span data-d={id} className="text-[10px] min-h-[1em] text-[#4d5a4b]" />
    </div>
  )
}

export default function RowSimulator() {
  const { theme: t, ready } = useRandomTheme()
  const root = useRef(null)
  const themeRef = useRef(t)
  themeRef.current = t

  useEffect(() => {
    const el = root.current
    if (!el) return
    const $ = (sel) => el.querySelector(sel)
    const out = (k) => $(`[data-o="${k}"]`)
    const dlt = (k) => $(`[data-d="${k}"]`)
    const S = { ...DEF }
    const inputs = {}
    CONTROLS.forEach((c) => (inputs[c.key] = $(`#rs-${c.key}`)))
    let M = model(S)
    let base = { ...model(S), spmIn: S.spm }

    const render = () => {
      M = model(S)
      $('[data-v="spm"]').textContent = S.spm + ' spm'
      $('[data-v="len"]').textContent = S.len.toFixed(2) + ' m'
      $('[data-v="force"]').textContent = Math.round(S.force) + ' N · about ' + Math.round(S.force / 9.81) + ' kg'
      $('[data-v="damper"]').textContent = S.damper + ' · drag factor ' + Math.round(M.drag)

      out('pace').textContent = fmtPace(M.pace)
      out('spm').textContent = Math.round(S.spm)
      out('watts').textContent = Math.round(M.watts)
      out('mps').textContent = M.mps.toFixed(1)

      const dp = M.pace - base.pace, dw = M.watts - base.watts, dm = M.mps - base.mps, ds = S.spm - base.spmIn
      dlt('pace').textContent = Math.abs(dp) < 0.05 ? '' : dp < 0 ? '▼ ' + (-dp).toFixed(1) + ' s faster' : '▲ ' + dp.toFixed(1) + ' s slower'
      dlt('watts').textContent = Math.abs(dw) < 0.5 ? '' : sign(dw, 0)
      dlt('mps').textContent = Math.abs(dm) < 0.05 ? '' : sign(dm, 1)
      dlt('spm').textContent = Math.abs(ds) < 0.5 ? '' : sign(ds, 0)

      const rec = Math.max(M.rec, 0)
      $('[data-seg="drive"]').style.width = Math.min(100, (M.drive / M.cycle) * 100) + '%'
      $('[data-seg="drive"]').textContent = 'drive ' + M.drive.toFixed(2) + ' s'
      $('[data-seg="rec"]').textContent = 'recovery ' + rec.toFixed(2) + ' s'
      $('[data-cycle]').textContent = M.cycle.toFixed(2) + ' s per stroke'
      const note = $('[data-note]')
      if (M.rec < 0.3) note.textContent = 'Not doable: the drive alone takes ' + M.drive.toFixed(2) + ' s, leaving almost no time to come back. ⚠️'
      else if (M.ratio < 1.2) note.textContent = 'Rushing the slide: recovery is about as fast as the drive (' + M.ratio.toFixed(1) + ' : 1). ⚠️'
      else if (M.ratio < 1.8) note.textContent = 'Race rhythm: recovery is ' + M.ratio.toFixed(1) + '× the drive.'
      else note.textContent = 'Steady rhythm: recovery is ' + M.ratio.toFixed(1) + '× the drive. Coaches aim for about 2 : 1 at steady rates.'

      const c = (i) => $(`[data-c="${i}"]`)
      c(0).textContent = Math.round(S.force) + ' N × ' + S.len.toFixed(2) + ' m = ' + Math.round(M.work) + ' J'
      c(1).textContent = Math.round(M.work) + ' J × ' + S.spm + '/60 = ' + Math.round(M.watts) + ' W'
      c(2).textContent = '500 × ∛(2.80 ÷ ' + Math.round(M.watts) + ') = ' + fmtPace(M.pace) + ' /500m'
      c(3).textContent = M.speed.toFixed(2) + ' m/s × ' + M.cycle.toFixed(2) + ' s = ' + M.mps.toFixed(1) + ' m'
      c(4).textContent = S.len.toFixed(2) + ' m ÷ ' + M.handle.toFixed(2) + ' m/s = ' + M.drive.toFixed(2) + ' s drive, ' + rec.toFixed(2) + ' s back'
    }
    const pin = () => {
      base = { ...model(S), spmIn: S.spm }
      render()
    }
    const syncInputs = () => {
      for (const k in inputs) inputs[k].value = S[k]
    }

    let tween = null, tweenDelay = null
    const cancelTween = () => {
      if (tween) cancelAnimationFrame(tween)
      clearTimeout(tweenDelay)
      tween = null
    }
    const expButtons = [...el.querySelectorAll('[data-exp]')]
    const setPressed = (btn) => expButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)))

    let elapsed = 0, dist = 0
    const offs = []
    const on = (node, ev, fn) => {
      node.addEventListener(ev, fn)
      offs.push(() => node.removeEventListener(ev, fn))
    }
    for (const k in inputs)
      on(inputs[k], 'input', () => {
        cancelTween()
        S[k] = parseFloat(inputs[k].value)
        render()
      })
    on($('[data-act="pin"]'), 'click', pin)
    on($('[data-act="reset"]'), 'click', () => {
      cancelTween()
      Object.assign(S, DEF)
      syncInputs()
      pin()
      elapsed = 0
      dist = 0
      setPressed(null)
      $('[data-exp-out]').textContent = INTRO
    })
    expButtons.forEach((btn) =>
      on(btn, 'click', () => {
        const e = EXP[btn.dataset.exp]
        setPressed(btn)
        cancelTween()
        Object.assign(S, e.from)
        syncInputs()
        pin()
        $('[data-exp-out]').textContent = e.text
        const start = { ...S }, dur = 1400
        tweenDelay = setTimeout(() => {
          const t0 = performance.now()
          const step = (now) => {
            const k = Math.min(1, (now - t0) / dur), ek = k * k * (3 - 2 * k)
            for (const key in e.to) {
              let v = start[key] + (e.to[key] - start[key]) * ek
              if (key === 'spm' || key === 'damper') v = Math.round(v)
              if (key === 'len') v = Math.round(v * 100) / 100
              if (key === 'force') v = Math.round(v / 5) * 5
              S[key] = v
            }
            syncInputs()
            render()
            tween = k < 1 ? requestAnimationFrame(step) : null
          }
          tween = requestAnimationFrame(step)
        }, 350)
      })
    )

    // drawing
    const cv = $('canvas'), ctx = cv.getContext('2d')
    let sc = 100, dpr = 1
    const resize = () => {
      dpr = window.devicePixelRatio || 1
      const r = cv.getBoundingClientRect()
      cv.width = Math.round(r.width * dpr)
      cv.height = Math.round(r.height * dpr)
      sc = cv.width / (W1 - W0)
    }
    on(window, 'resize', resize)
    const X = (x) => (x - W0) * sc, Y = (y) => cv.height - (y - H0) * sc
    const line = (pts, w, col) => {
      ctx.strokeStyle = col
      ctx.lineWidth = w
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(X(pts[0].x), Y(pts[0].y))
      for (let i = 1; i < pts.length; i++) ctx.lineTo(X(pts[i].x), Y(pts[i].y))
      ctx.stroke()
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let phase = 0, fanAng = 0, last = performance.now(), raf = null
    const odTime = out('time'), odDist = out('dist'), cursor = $('[data-cursor]')

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const drive = M.drive, rec = Math.max(0.3, M.rec), cyc = drive + rec
      if (!reduce) {
        phase = (phase + dt) % cyc
        elapsed += dt
        dist += M.speed * dt
      } else phase = drive * 0.999
      const inDrive = phase < drive
      let l, b, a
      if (inDrive) {
        const p = sm(phase / drive)
        l = sm(p / 0.62); b = sm((p - 0.25) / 0.55); a = sm((p - 0.62) / 0.38)
      } else {
        const r = (phase - drive) / rec
        a = 1 - sm(r / 0.28); b = 1 - sm((r - 0.12) / 0.33); l = 1 - sm((r - 0.33) / 0.67)
      }
      cursor.style.left = (phase / cyc) * 100 + '%'
      odTime.textContent = fmtTime(elapsed)
      odDist.textContent = Math.floor(dist)

      const th = themeRef.current
      const C = { ink: th.ink, ink2: alpha(th.ink, 0.6), line: alpha(th.ink, 0.25), bg: th.bg }
      const q = S.len / 1.45
      const P = pose(l, b, a, q)
      ctx.clearRect(0, 0, cv.width, cv.height)
      const lw = Math.max(1.5, 0.012 * sc), body = Math.max(3, 0.034 * sc)

      line([{ x: W0 + 0.1, y: 0 }, { x: W1 - 0.1, y: 0 }], 1 * dpr, C.line)
      line([{ x: -0.05, y: 0.4 }, { x: 2.42, y: 0.4 }], lw * 1.6, C.ink2)
      line([{ x: 2.4, y: 0.4 }, { x: 2.4, y: 0.0 }], lw, C.ink2)
      line([{ x: 2.25, y: 0.0 }, { x: 2.55, y: 0.0 }], lw * 1.4, C.ink2)
      line([{ x: -0.3, y: 0.36 }, { x: -0.3, y: 0.04 }], lw, C.ink2)
      line([{ x: -0.62, y: 0.02 }, { x: 0.02, y: 0.02 }], lw * 1.4, C.ink2)
      const fc = { x: -0.3, y: 0.66 }, fr = 0.3
      ctx.strokeStyle = C.ink2
      ctx.lineWidth = lw
      ctx.beginPath(); ctx.arc(X(fc.x), Y(fc.y), fr * sc, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(X(fc.x), Y(fc.y), fr * 0.86 * sc, 0, Math.PI * 2); ctx.stroke()
      fanAng += (reduce ? 0 : dt) * M.speed * (inDrive ? 3.4 : 3.0)
      for (let i = 0; i < 10; i++) {
        const tt = fanAng + (i * Math.PI) / 5
        line([{ x: fc.x + 0.06 * Math.cos(tt), y: fc.y + 0.06 * Math.sin(tt) }, { x: fc.x + 0.24 * Math.cos(tt + 0.25), y: fc.y + 0.24 * Math.sin(tt + 0.25) }], lw * 0.7, C.line)
      }
      ctx.beginPath(); ctx.arc(X(fc.x), Y(fc.y), 0.05 * sc, 0, Math.PI * 2); ctx.stroke()
      const dA = ((-150 + S.damper * 9) * Math.PI) / 180
      line([{ x: fc.x - 0.21, y: fc.y }, { x: fc.x - 0.21 + 0.12 * Math.cos(dA), y: fc.y + 0.12 * Math.sin(dA) }], lw * 1.2, C.ink)
      line([{ x: -0.12, y: 0.9 }, { x: 0.02, y: 1.26 }], lw, C.ink2)
      ctx.save(); ctx.translate(X(0.06), Y(1.33)); ctx.rotate(-0.25)
      ctx.strokeStyle = C.ink2; ctx.lineWidth = lw; ctx.strokeRect(-0.07 * sc, -0.1 * sc, 0.12 * sc, 0.2 * sc)
      ctx.restore()
      line([{ x: 0.64, y: 0.42 }, { x: 0.46, y: 0.7 }], lw * 1.4, C.ink2)
      const sx = P.hip.x
      ctx.fillStyle = C.ink2
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(X(sx - 0.15), Y(0.53), 0.27 * sc, 0.06 * sc, 0.02 * sc) : ctx.rect(X(sx - 0.15), Y(0.53), 0.27 * sc, 0.06 * sc)
      ctx.fill()
      line([{ x: sx - 0.08, y: 0.47 }, { x: sx + 0.06, y: 0.47 }], lw, C.ink2)

      const cP = pose(0, 0, 0, q), fP = pose(1, 1, 1, q), dimY = 0.18
      line([{ x: cP.hand.x, y: dimY }, { x: fP.hand.x, y: dimY }], 1 * dpr, C.ink2)
      line([{ x: cP.hand.x, y: dimY - 0.04 }, { x: cP.hand.x, y: dimY + 0.04 }], 1 * dpr, C.ink2)
      line([{ x: fP.hand.x, y: dimY - 0.04 }, { x: fP.hand.x, y: dimY + 0.04 }], 1 * dpr, C.ink2)
      ctx.fillStyle = C.ink2
      ctx.font = `${Math.round(0.065 * sc)}px "Social Condensed", "Haas_Grot_Disp", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('stroke length ' + S.len.toFixed(2) + ' m', X((cP.hand.x + fP.hand.x) / 2), Y(dimY + 0.05))
      ctx.fillStyle = inDrive ? C.ink : C.ink2
      ctx.beginPath(); ctx.arc(X(P.hand.x), Y(dimY), 0.022 * sc, 0, Math.PI * 2); ctx.fill()

      // chain: solid and heavy while it is loaded
      line([{ x: 0.0, y: 0.68 }, P.hand], inDrive ? lw * 1.8 : lw * 0.7, inDrive ? C.ink : C.line)

      line([TOE, ANKLE, P.knee, P.hip], body, C.ink)
      line([P.hip, P.sh], body * 1.15, C.ink)
      line([P.sh, P.elbow, P.hand], body * 0.85, C.ink)
      ctx.strokeStyle = C.ink; ctx.lineWidth = body * 0.6; ctx.fillStyle = C.bg
      ctx.beginPath(); ctx.arc(X(P.head.x), Y(P.head.y), 0.095 * sc, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      line([{ x: P.hand.x - 0.01, y: P.hand.y - 0.03 }, { x: P.hand.x + 0.01, y: P.hand.y + 0.03 }], body * 0.7, inDrive ? C.ink : C.ink2)

      raf = requestAnimationFrame(frame)
    }

    syncInputs()
    resize()
    render()
    raf = requestAnimationFrame((ts) => {
      last = ts
      frame(ts)
    })
    return () => {
      cancelAnimationFrame(raf)
      cancelTween()
      offs.forEach((f) => f())
    }
  }, [])

  const rule = { borderColor: `${t.ink}40` }

  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      <div ref={root}>
        <section className="px-[20px] md:px-[26px] pt-[32px] md:pt-[100px] pb-[48px] md:pb-[80px]">
          <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px] max-w-[1340px]`}>
            Concept2 rowing physics. Move the sliders and watch rate, stroke length and force turn into watts, pace and meters per stroke. 🚣
          </h1>
          <p className={`${social} mt-[16px] md:mt-[24px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] max-w-[640px]`}>
            Built to make sense of my own rows. The real ones are in my{' '}
            <a href="/row" className="hl">erg log</a>.
          </p>
        </section>

        <div className={`${social} text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] tabular-nums`}>
          <section className="px-[20px] md:px-[26px] pb-[56px] md:pb-[120px] grid gap-x-[48px] gap-y-[32px] lg:grid-cols-12">
            <div className="lg:col-span-9 min-w-0 border-t pt-[16px] md:pt-[20px]" style={rule}>
              <div className="flex gap-[16px] flex-wrap opacity-70 text-[14px]">
                <span>━ drive, chain loaded</span>
                <span>╌ recovery, chain slack</span>
              </div>
              <canvas aria-label="Animated line drawing of a person rowing on a Concept2 erg" className="block w-full max-w-full" style={{ aspectRatio: '3.4 / 1.75' }} />
            </div>

            {/* The PM5 is drawn as the object it is, so it keeps its own colors on every theme. */}
            <div className="lg:col-span-3 self-start w-full max-w-[340px] rounded-[16px] bg-[#1e2226] p-[14px] grid gap-[10px] border border-[#0d0f11]">
              <div className={`${ultra} text-center italic text-[#e9ecef] text-[15px] tracking-[0.06em]`}>CONCEPT2</div>
              <div className="grid grid-cols-[minmax(0,1fr)_26px] gap-[10px]">
                <div className={`${lcdFont} bg-[#b8c3ae] text-[#1c261b] rounded-[4px] border-[3px] border-[#0b0d0f] p-[8px] grid grid-cols-[minmax(0,1fr)_auto] gap-[6px] min-w-0`}>
                  <div className="grid gap-[4px] min-w-0 [&>div]:border-b-[1.5px] [&>div]:border-[#1c261b] [&>div]:pb-[4px] [&>div:last-child]:border-0">
                    <div className="flex justify-between items-end gap-[8px]">
                      <LcdCell id="time" unit="time" inline={false} />
                      <LcdCell id="spm" unit="s/m" right />
                    </div>
                    <div><LcdCell id="pace" unit="/500m" big inline="big" /></div>
                    <div className="flex justify-between items-end gap-[8px]">
                      <LcdCell id="watts" unit="watts" />
                      <LcdCell id="mps" unit="m/stroke" right />
                    </div>
                    <div><LcdCell id="dist" unit="m" inline="lg" /></div>
                  </div>
                  <div aria-hidden className="flex flex-col justify-around text-right text-[9px] font-semibold pl-[5px] border-l-[1.5px] border-[#1c261b]">
                    <span>PIN</span><span>RESET</span><span /><span /><span />
                  </div>
                </div>
                <div className="flex flex-col justify-around items-center py-[6px]">
                  {['pin', 'reset', null, null, null].map((act, i) => (
                    <button
                      key={i}
                      type="button"
                      data-act={act || undefined}
                      disabled={!act}
                      aria-label={act === 'pin' ? 'Pin as baseline' : act === 'reset' ? 'Reset' : undefined}
                      aria-hidden={act ? undefined : true}
                      tabIndex={act ? undefined : -1}
                      className="w-[22px] h-[22px] rounded-full border border-[#0b0d0f] bg-[#3a4046] enabled:hover:bg-[#59616a] enabled:active:scale-[0.97] disabled:opacity-70 transition-colors"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-[#c9ced3] text-[12px]">
                <span className="flex items-center gap-[8px] uppercase tracking-[0.08em]">
                  <i className="inline-block w-[26px] h-[14px] rounded-[7px] bg-[#3a4046] border border-[#0b0d0f]" />Menu
                </span>
                <span className={`${ultra} text-[15px]`}>PM5</span>
              </div>
            </div>
          </section>

          <section className="px-[20px] md:px-[26px] pb-[56px] md:pb-[120px]">
            <Heading>One stroke, start to start</Heading>
            <p data-note className="mb-[16px] max-w-[640px]" />
            <div className="relative h-[36px] flex overflow-hidden rounded-[4px] border" style={{ borderColor: t.ink }}>
              <div data-seg="drive" className="flex items-center px-[10px] whitespace-nowrap overflow-hidden transition-[width] duration-200" style={{ backgroundColor: t.ink, color: t.bg }} />
              <div data-seg="rec" className="flex flex-1 items-center px-[10px] whitespace-nowrap overflow-hidden" style={{ backgroundColor: `${t.ink}1f` }} />
              <div data-cursor className="absolute top-0 bottom-0 w-[2px]" style={{ backgroundColor: t.ink, left: 0 }} />
            </div>
            <div className="flex justify-between mt-[8px] text-[14px] opacity-70">
              <span>catch</span><span data-cycle /><span>next catch</span>
            </div>
          </section>

          <section className="px-[20px] md:px-[26px] pb-[56px] md:pb-[120px] grid gap-x-[48px] gap-y-[56px] lg:grid-cols-2">
            <div>
              <Heading>Inputs</Heading>
              <div className="grid gap-[24px]">
                {CONTROLS.map((c) => (
                  <div key={c.key} className="border-t pt-[16px]" style={rule}>
                    <div className="flex justify-between items-baseline gap-[12px]">
                      <label htmlFor={`rs-${c.key}`} className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">{c.label}</label>
                      <output data-v={c.key} htmlFor={`rs-${c.key}`} />
                    </div>
                    <input
                      id={`rs-${c.key}`}
                      type="range"
                      min={c.min}
                      max={c.max}
                      step={c.step}
                      defaultValue={DEF[c.key]}
                      className="w-full my-[8px]"
                      style={{ accentColor: t.ink }}
                    />
                    <p className="opacity-70">{c.help}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Heading>Try one thing at a time</Heading>
              <p className={`${nichrome} italic text-[18px] md:text-[21px] leading-[1.45] tracking-[0.2px] mb-[24px]`}>
                “spm is how fast you return to the start. Then realizing you can keep that while lengthening the stroke, then pressing hard lowers pace.”
              </p>
              <div className="flex flex-wrap gap-[8px] mb-[24px]">
                {Object.entries(EXP).map(([k, e]) => (
                  <button
                    key={k}
                    type="button"
                    data-exp={k}
                    aria-pressed="false"
                    className="text-left rounded-[4px] border px-[10px] py-[8px] transition-colors duration-[120ms] active:scale-[0.97] aria-pressed:bg-[var(--rs-ink)] aria-pressed:text-[var(--rs-bg)]"
                    style={{ borderColor: t.ink, '--rs-ink': t.ink, '--rs-bg': t.bg }}
                  >
                    <span className="block text-[17px] leading-[1.15]">{e.title}</span>
                    <span className="block text-[14px] opacity-80">{e.sub}</span>
                  </button>
                ))}
              </div>
              <p data-exp-out className="border-t pt-[16px] max-w-[560px]" style={rule}>{INTRO}</p>
            </div>
          </section>

          <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
            <Heading>How the numbers connect</Heading>
            <ol>
              {STEPS.map(([title, body], i) => (
                <li key={title} className="grid grid-cols-[28px_minmax(0,1fr)] md:grid-cols-[28px_minmax(0,1fr)_minmax(0,1fr)] gap-x-[16px] gap-y-[4px] border-t py-[16px]" style={rule}>
                  <span className="opacity-70">{i + 1}</span>
                  <div>
                    <div className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">{title}</div>
                    <div className="opacity-70">{body}</div>
                  </div>
                  <div data-c={i} className="col-start-2 md:col-start-3 md:text-right" />
                </li>
              ))}
            </ol>
            <p className="mt-[24px] max-w-[640px] opacity-70 text-[14px]">
              Watts to pace uses Concept2’s published formula (watts = 2.80 ÷ (seconds per meter)³). Handle speed, drive time and the damper effect are simplified estimates, so read those as directional.
            </p>
          </section>
        </div>
      </div>

      <Footer colophon theme={t} />
    </main>
  )
}
