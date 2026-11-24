// The coach: turns engine output into plain-English notes about what's
// happening on the board right now. Everything is in the player's numbering
// (cream moves 24 down to 1). Brown's points are flipped (its j = your 25 - j).

import { shotRisk, evaluate, winProb, contact, allHome, homePoints, prime, pips, key } from './engine.js?v=14'

export const term = (id, text) => `<a class="term" data-rule="${id}">${text}</a>`

const NAMES = { 5: 'your 5-point', 7: 'your bar point', 4: 'your 4-point', 6: 'your 6-point', 3: 'your 3-point', 20: 'Brown’s 5-point', 21: 'Brown’s 4-point', 18: 'Brown’s bar point' }
const KEY_POINTS = [5, 7, 4, 6, 3, 20, 21, 18, 8]
export const pointName = (i) => NAMES[i] || `the ${i}-point`

// Brown's own numbering to yours.
const flip = (n) => (n === 25 ? 'bar' : n === 0 ? 'off' : 25 - n)
const mine = (n) => (n === 25 ? 'bar' : n === 0 ? 'off' : n)

export function fmtMove(steps, side) {
  const lab = side === 0 ? mine : flip
  const chains = []
  for (const st of steps) {
    const last = chains[chains.length - 1]
    if (last && last.to === st.from && st.from !== 25) { last.path.push({ at: st.to, hit: st.hit }); last.to = st.to }
    else chains.push({ from: st.from, to: st.to, path: [{ at: st.to, hit: st.hit }] })
  }
  const strs = chains.map((c) => {
    let s = String(lab(c.from))
    // Show the intermediate stop only when the checker hit there.
    for (let i = 0; i < c.path.length; i++) {
      const x = c.path[i], lastOne = i === c.path.length - 1
      if (lastOne || x.hit) s += '/' + lab(x.at) + (x.hit ? '*' : '')
    }
    return s
  })
  const counts = new Map()
  for (const s of strs) counts.set(s, (counts.get(s) || 0) + 1)
  return [...counts].map(([s, n]) => (n > 1 ? `${s}(${n})` : s)).join('  ')
}

// The same move in plain words, e.g. "one checker from 13 to 6 (13 to 9 with
// the 4, then 9 to 6 with the 3)". Used anywhere a beginner reads a move.
const NUM = ['', 'one', 'two', 'three', 'four']
export function plainMove(steps, side) {
  const lab = side === 0 ? mine : flip
  const who = side === 0 ? 'Brown' : 'you'
  const chains = []
  for (const st of steps) {
    const last = chains[chains.length - 1]
    if (last && last.to === st.from && st.from !== 25) { last.steps.push(st); last.to = st.to }
    else chains.push({ from: st.from, to: st.to, steps: [st] })
  }
  const phrases = chains.map((c) => {
    const A = lab(c.from), B = lab(c.to)
    let p = A === 'bar' ? `the checker on the bar in to ${B}` : B === 'off' ? `a checker off from ${A}` : `a checker from ${A} to ${B}`
    if (c.steps.length === 2) {
      const [x, y] = c.steps, m = lab(x.to)
      p += ` (${A === 'bar' ? 'in to ' + m : A + ' to ' + m} with the ${x.die}, then ${m} to ${B} with the ${y.die})`
    } else if (c.steps.length > 2) p += ` (using the ${c.steps[0].die} ${NUM[c.steps.length]} times)`
    const hits = c.steps.filter((x) => x.hit).map((x) => lab(x.to))
    if (hits.length) p += `, hitting ${who} ${hits.length === 1 && hits[0] === B ? 'there' : 'on ' + list(hits)}`
    return p
  })
  // two identical moves read better as "two checkers from 13 to 7"
  const counts = new Map()
  for (const p of phrases) counts.set(p, (counts.get(p) || 0) + 1)
  return list([...counts].map(([p, n]) => (n === 1 ? p : p.replace(/^a checker/, `${NUM[n]} checkers`).replace(/^the checker on the bar/, `${NUM[n]} checkers from the bar`))))
}

// ---------- Opening book (your numbering) ----------
// `steps` says the move in plain words; `why` explains it without jargon.

const SPLIT = 'Moving one of your two checkers off 24 means they aren’t stuck together at the far end, so they have more ways to escape later.'
export const OPENINGS = {
  '21': { play: '13/11 6/5', idea: 'risks one checker on 5 so you can claim it next turn', steps: 'one checker from 13 to 11, and one from 6 to 5', why: 'The checker on 5 is alone, so Brown might hit it. If it survives, you add a second checker next turn and own the 5-point, the most useful point on the board. A small risk for a big payoff.' },
  '31': { play: '8/5 6/5', idea: 'claims the 5-point, the best point to own', steps: 'one checker from 8 to 5, and one from 6 to 5', why: 'Two checkers on a point make it yours: Brown can’t land there. The 5-point is the most useful point to own, so this is the best first roll in the game.' },
  '41': { play: '24/23 13/9', idea: 'moves a back checker up a little and brings one closer to home', steps: 'one checker from 24 to 23, and one from 13 to 9', why: `The checker on 9 is in range to team up with another checker next turn and claim a new point. ${SPLIT}` },
  '51': { play: '24/23 13/8', idea: 'moves a back checker up a little and brings one safely closer to home', steps: 'one checker from 24 to 23, and one from 13 to 8', why: `8 already has your checkers on it, so that move is safe. ${SPLIT}` },
  '61': { play: '13/7 8/7', idea: 'claims the 7-point, building a wall with 6 and 8', steps: 'one checker from 13 to 7, and one from 8 to 7', why: 'Two checkers on 7 make it yours. Together with 6 and 8 it forms a wall that Brown’s two checkers on your 1-point have to get past.' },
  '32': { play: '24/21 13/11', idea: 'moves a back checker up and brings one closer to home', steps: 'one checker from 24 to 21, and one from 13 to 11', why: `The checker on 11 is in range to help claim a new point next turn. ${SPLIT}` },
  '42': { play: '8/4 6/4', idea: 'claims the 4-point', steps: 'one checker from 8 to 4, and one from 6 to 4', why: 'Two checkers on 4 make it yours: Brown can’t land there. It’s the second most useful point to own early on.' },
  '52': { play: '13/8 13/11', idea: 'brings two checkers closer to home', steps: 'two checkers from 13: one to 8 and one to 11', why: 'It brings fresh checkers closer to home, where they can team up to claim points. The one on 8 is safe; the one on 11 is far enough from Brown to be hard to hit.' },
  '62': { play: '24/18 13/11', idea: 'moves a back checker up and brings one closer to home', steps: 'one checker from 24 to 18, and one from 13 to 11', why: `The checker on 11 is in range to help claim a point next turn. ${SPLIT}` },
  '43': { play: '24/20 13/10', idea: 'moves a back checker up and brings one closer to home', steps: 'one checker from 24 to 20, and one from 13 to 10', why: `20 is a spot Brown wants for its own home, so a checker there gets in Brown’s way. The checker on 10 is in range to help claim a point next turn.` },
  '53': { play: '8/3 6/3', idea: 'claims the 3-point', steps: 'one checker from 8 to 3, and one from 6 to 3', why: 'Two checkers on 3 make it yours. Every point you own near home is one more spot Brown can’t land on.' },
  '63': { play: '24/18 13/10', idea: 'moves a back checker up and brings one closer to home', steps: 'one checker from 24 to 18, and one from 13 to 10', why: `The checker on 10 is in range to help claim a point next turn. ${SPLIT}` },
  '54': { play: '24/20 13/8', idea: 'moves a back checker up and brings one safely closer to home', steps: 'one checker from 24 to 20, and one from 13 to 8', why: '8 already has your checkers, so that move is safe. 20 is a spot Brown wants for its own home, so sitting there gets in Brown’s way.' },
  '64': { play: '8/2 6/2', idea: 'claims the 2-point', steps: 'one checker from 8 to 2, and one from 6 to 2', why: 'Two checkers on 2 make it yours. It’s far from ideal, but owning a point beats leaving checkers alone where Brown can hit them.' },
  '65': { play: '24/13', idea: 'runs a back checker all the way to safety', steps: 'one checker all the way from 24 to 13', why: 'That checker was stuck at the far end. This runs it to safety on 13, where you already have checkers. Players call this one lover’s leap.' },
}
export const openingKey = (d) => `${Math.max(...d)}${Math.min(...d)}`

// ---------- Features ----------

export function features(before, after, steps, s) {
  const me = after[s], meB = before[s]
  const made = [], broke = []
  for (let i = 1; i <= 24; i++) {
    if (me[i] >= 2 && meB[i] < 2) made.push(s === 0 ? i : 25 - i)
    if (me[i] < 2 && meB[i] >= 2) broke.push(s === 0 ? i : 25 - i)
  }
  const risk = shotRisk(after, s)
  const blots = []
  for (let i = 1; i <= 24; i++) if (me[i] === 1) blots.push(s === 0 ? i : 25 - i)
  const escaped = steps.filter((x) => x.from >= 19 && x.from <= 24 && x.to <= 18).length
  return {
    hits: steps.filter((x) => x.hit).length,
    hitAt: steps.filter((x) => x.hit).map((x) => (s === 0 ? x.to : 25 - x.to)),
    made, broke, blots, shots: risk.shots, byPoint: risk.byPoint,
    escaped,
    entered: steps.filter((x) => x.from === 25).length,
    off: steps.filter((x) => x.to === 0).length,
    stack: Math.max(...me.slice(1, 25)),
    prime: prime(me).len,
    pips: pips(me),
  }
}

const keyMade = (f) => f.made.filter((p) => KEY_POINTS.includes(p)).sort((a, b) => KEY_POINTS.indexOf(a) - KEY_POINTS.indexOf(b))
const list = (arr) => (arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1])
const shotsTxt = (n, cap) => (cap ? `${n} of your 36 possible rolls` : `${n} of 36 rolls`)

// ---------- Grading your move ----------

export const GRADES = {
  book: { label: 'Standard', tone: 'best' },
  best: { label: 'Best', tone: 'best' },
  good: { label: 'Good', tone: 'good' },
  inaccuracy: { label: 'Inaccuracy', tone: 'warn' },
  mistake: { label: 'Mistake', tone: 'bad' },
  blunder: { label: 'Blunder', tone: 'bad' },
}

// The turn that matches the standard opening play for this roll, if any.
export function bookTurn(turns, dice) {
  const b = OPENINGS[openingKey(dice)]
  return b ? turns.find((t) => fmtMove(t.steps, 0).replace(/\s+/g, ' ') === b.play) : null
}

export function grade(before, turns, chosenKey, dice, isOpening) {
  const book = isOpening && OPENINGS[openingKey(dice)]
  // On the first move, measure against the standard play, not the engine's pick.
  const best = (book && bookTurn(turns, dice)) || turns[0]
  const chosen = turns.find((t) => key(t.pos) === chosenKey) || best
  const pB = winProb(best.score, best.pos), pC = winProb(chosen.score, chosen.pos)
  const diff = Math.max(0, pB - pC)
  let g
  if (book && fmtMove(chosen.steps, 0).replace(/\s+/g, ' ') === book.play) g = 'book'
  else if (chosen === best || diff < 0.006) g = 'best'
  else if (diff < 0.03) g = 'good'
  else if (diff < 0.07) g = 'inaccuracy'
  else if (diff < 0.14) g = 'mistake'
  else g = 'blunder'
  const fC = features(before, chosen.pos, chosen.steps, 0)
  const fB = features(before, best.pos, best.steps, 0)
  return { grade: g, diff, chosen, best, fC, fB, why: g === 'best' || g === 'book' || g === 'good' ? praise(fC, book, g) : critique(fC, fB, before) }
}

function praise(f, book, g) {
  if (g === 'book') return `That’s the standard first move for this roll. ${book.why}`
  const bits = []
  const km = keyMade(f)
  if (f.hits) bits.push(`You ${term('hitting', 'hit')} ${f.hits > 1 ? 'twice' : 'on ' + f.hitAt[0]}, sending Brown back to the bar.`)
  if (km.length) bits.push(`You made ${pointName(km[0])}${km[0] === 5 ? ', the best point on the board' : km[0] === 7 ? ', which starts a wall in front of Brown’s back checkers' : ''}.`)
  else if (f.made.length) bits.push(`You made the ${list(f.made)}-point${f.made.length > 1 ? 's' : ''}.`)
  if (f.escaped) bits.push(`A back checker got out.`)
  if (f.off) bits.push(`${f.off} checker${f.off > 1 ? 's' : ''} borne off.`)
  if (f.shots === 0 && f.blots.length === 0) bits.push(`No ${term('blots', 'blots')} left behind. Nothing for Brown to hit.`)
  else if (f.shots === 0) bits.push(`Your blots are out of Brown’s reach.`)
  else if (f.shots <= 11) bits.push(`Brown only hits back with ${shotsTxt(f.shots)}.`)
  if (!bits.length) bits.push(g === 'best' ? 'That’s the move I’d play.' : 'Close to the top move.')
  return bits.slice(0, 2).join(' ')
}

function critique(fC, fB, before) {
  const reasons = []
  if (fB.hits > fC.hits) reasons.push([10, `${term('hitting', 'Hitting')} on ${fB.hitAt[0]} was there. It puts a Brown checker on the bar and costs it ground.`])
  const kmB = keyMade(fB).filter((p) => !fC.made.includes(p))
  if (kmB.length) reasons.push([8 - KEY_POINTS.indexOf(kmB[0]) * 0.5, `The better play makes ${pointName(kmB[0])}. ${kmB[0] === 5 ? 'It’s the most valuable point on the board.' : kmB[0] === 7 ? 'It blocks Brown’s 6s from the back.' : 'Made points are safe and they block Brown.'}`])
  if (fC.shots - fB.shots >= 5) reasons.push([7 + (fC.shots - fB.shots) / 6, `Your move leaves ${fC.blots.length > 1 ? 'blots' : 'a blot'} Brown hits with ${shotsTxt(fC.shots)}. The better play leaves ${fB.shots ? shotsTxt(fB.shots) : 'nothing to hit'}.`])
  const brokeKey = fC.broke.filter((p) => KEY_POINTS.includes(p) && !fB.broke.includes(p))
  if (brokeKey.length) reasons.push([6, `You gave up ${pointName(brokeKey[0])}. Points are hard to make and easy to lose.`])
  if (fB.escaped > fC.escaped && contact(before)) reasons.push([5, `Getting a back checker out was the priority. They get stuck behind Brown’s points.`])
  if (fB.off > fC.off) reasons.push([6, `You could have borne off ${fB.off} checker${fB.off > 1 ? 's' : ''}.`])
  if (fB.prime > fC.prime && fB.prime >= 4) reasons.push([5, `The better play builds a ${fB.prime}-point ${term('primes', 'prime')}.`])
  if (fC.stack >= 6 && fB.stack < fC.stack) reasons.push([3, `It piles too many checkers on one point. Spread them out so they can make new points.`])
  if (!contact(before) && fC.pips > fB.pips) reasons.push([4, `In a ${term('race', 'race')}, use every pip. Your move wastes some.`])
  reasons.sort((a, b) => b[0] - a[0])
  if (!reasons.length) return 'Close, but the engine likes the other play a bit more for its overall shape.'
  return reasons.slice(0, 2).map((r) => r[1]).join(' ')
}

// ---------- Brown's move ----------

// Only what Brown's move means for you. A routine move says nothing.
export function explainBrown(before, after, steps, dice, seen) {
  const lines = []
  if (!steps.length) return lines
  const f = features(before, after, steps, 1)
  if (f.hits) {
    const at = list(f.hitAt)
    if (!seen.has('gotHit')) {
      seen.add('gotHit')
      lines.push(`Brown ${term('hitting', 'hit')} your checker on ${at}. It goes to the ${term('hitting', 'bar')} in the middle, and on your next turn it has to come back in through Brown’s home board (top right) before you can move anything else.`)
    } else lines.push(`Brown hit your checker on ${at}. Bring it in from the bar first next turn.`)
  }
  const hB = homePoints(after[1])
  if (f.made.includes(20)) lines.push(`Brown now has two checkers on 20, its best point. You can’t land there anymore.`)
  else if (f.made.some((p) => p >= 19) && hB >= 3) lines.push(`Brown now owns ${hB} points in its home board (top right). If you get hit, there are fewer open spots to come back in, so keep your checkers safe.`)
  if (f.made.some((p) => p <= 6) && !seen.has('anchorB')) { seen.add('anchorB'); lines.push(`Brown has two checkers together in your home board. That’s an ${term('anchors', 'anchor')}: you can’t hit them while they stay paired.`) }
  const pr = prime(after[1])
  if (pr.len >= 4 && prime(before[1]).len < pr.len && after[0].slice(26 - pr.from).some((x) => x > 0)) {
    lines.push(`Brown has ${pr.len} points in a row (a ${term('primes', 'prime')}). Your checkers behind it need big rolls to jump past.`)
  }
  if (contact(before) && !contact(after)) lines.push(`Every checker has now passed the other side’s, so nobody can hit anymore. It’s a ${term('race', 'race')}: fastest to get home and off wins.`)
  // Only worth saying when you have a real chance to hit.
  const r = shotRisk(after, 1)
  if (r.shots >= 11 && contact(after)) {
    const open = f.blots.filter((b) => r.byPoint[25 - b])
    lines.push(open.length > 1 ? `Brown left checkers alone on ${list(open)}. ${shotsTxt(r.shots, true)} can hit one of them, so look for it when you roll.` : `Brown left a checker alone on ${open[0]}. ${shotsTxt(r.shots, true)} can hit it, so look for it when you roll.`)
  }
  return lines
}

// Where your checkers can hit a lone Brown checker this roll, easiest first.
// Each: { at, from, dice } with dice the die values that checker uses.
function hitOptions(turns) {
  const out = new Map()
  for (const t of turns) {
    const at = {}
    for (const st of t.steps) {
      const prev = (at[st.from] && at[st.from].pop()) || { from: st.from, dice: [] }
      const cur = { from: prev.from, dice: prev.dice.concat(st.die) }
      ;(at[st.to] = at[st.to] || []).push(cur)
      if (st.hit) {
        const ex = out.get(st.to)
        if (!ex || cur.dice.length < ex.dice.length) out.set(st.to, { at: st.to, ...cur })
      }
    }
  }
  return [...out.values()].sort((a, b) => a.dice.length - b.dice.length || a.at - b.at)
}
const withDice = (d) => (d.length === 1 ? `with the ${d[0]}` : `using ${d.map((x) => 'the ' + x).join(' and ')} together (${d.join(' + ')} = ${d.reduce((a, b) => a + b, 0)})`)

// How to put two checkers on point p this roll, in words, from the best turn that does it.
function pointMakers(turns, p) {
  for (const t of turns) {
    const before = t.pos[0][p] - t.steps.filter((x) => x.to === p).length + t.steps.filter((x) => x.from === p).length
    if (t.pos[0][p] < 2 || before >= 2) continue
    const at = {}, landed = []
    for (const st of t.steps) {
      const prev = (at[st.from] && at[st.from].pop()) || { from: st.from, dice: [] }
      const cur = { from: prev.from, dice: prev.dice.concat(st.die) }
      ;(at[st.to] = at[st.to] || []).push(cur)
    }
    for (const c of at[p] || []) landed.push(`one from ${c.from} ${withDice(c.dice)}`)
    if (!landed.length) continue
    return `move ${list(landed)} onto ${p}`
  }
  return null
}

// ---------- A tip when you roll ----------

export function tipForRoll(pos, dice, turns, ctx) {
  const { seen, isOpening } = ctx
  const me = pos[0]
  const once = (id) => (seen.has(id) ? false : (seen.add(id), true))
  if (isOpening) {
    const b = OPENINGS[openingKey(dice)]
    if (b) {
      const [hi, lo] = openingKey(dice).split('')
      return `First move of the game. With ${hi}-${lo}, the standard play ${b.idea}. Can you find it?<p>Why it’s good: ${b.why}</p><p>Stuck? Press <b>Show me</b>.</p>${once('openings') ? `<p>Every first roll has a standard move like this. They’re all listed under ${term('openings', 'opening moves')}.</p>` : ''}`
    }
  }
  if (me[25] > 0) {
    if (once('enter')) return `You’re on the bar, so that checker has to ${term('entering', 'come in')} first. It enters Brown’s home board, top right: a 1 lands on 24, a 6 on 19. Points with two or more Brown checkers are closed.`
    return `Enter from the bar first.`
  }
  if (dice[0] === dice[1] && once('doubles')) return `${term('doubles', 'Doubles')}! You play a ${dice[0]} four times. Move one checker four times, four checkers once, or any mix.`
  if (!contact(pos)) {
    if (allHome(me) && once('bearoff')) return `Everything’s home, so you can ${term('bearoff', 'bear off')}. A 3 takes a checker off the 3-point. If the number is higher than your highest checker, take off the highest.`
    if (once('race')) return `No more contact, so this is a ${term('race', 'race')}. Get everything home and off. Pip count is the score: you ${pips(me)}, Brown ${pips(pos[1])}.`
    return null
  }
  const hits = hitOptions(turns)
  if (hits.length) {
    const spots = list(hits.slice(0, 3).map((x) => x.at))
    let t = `You can ${term('hitting', 'hit')} this turn. Brown has ${hits.length > 1 ? 'checkers' : 'a checker'} sitting alone on ${spots}. Landing on one sends it to the bar, so Brown has to start that checker’s trip over.`
    t += `<p>How to find it: count the points from each of your checkers down to ${hits.length > 1 ? 'one of those spots' : hits[0].at}. If the count matches one die, or both dice added together, that checker can hit.</p>`
    return t
  }
  for (const [p, why] of [[5, 'It’s the best point to own: Brown can’t land there, and it’s a safe spot for you.'], [7, 'It blocks the 6s Brown uses to run its back checkers out.']]) {
    if (me[p] >= 2) continue
    const via = pointMakers(turns, p)
    if (via && once(p === 5 ? 'five' : 'bar7')) return `You can claim ${p} this turn by getting two checkers onto it. Two checkers on a ${term('points', 'point')} make it yours. ${why}<p>How to find it: look for checkers that are exactly one die (or both dice added) away from ${p}.</p>`
  }
  if (once('blotsIntro')) return `A checker alone on a point is a ${term('blots', 'blot')}. Brown can hit it. Two or more make a ${term('points', 'point')} and are safe. After you move, the red numbers show how many of Brown’s 36 rolls hit each blot.`
  if (once('pipsIntro')) return `Your ${term('pips', 'pip count')} is how far you have to travel to finish: you ${pips(me)}, Brown ${pips(pos[1])}. Lower is better.`
  if (homePoints(pos[1]) >= 4 && once('strongBoard')) return `Brown’s home board is strong (${homePoints(pos[1])} points). Getting hit now could keep you on the bar for a while, so play safer.`
  return null
}

export function noMoveText(pos, dice) {
  if (pos[0][25] > 0) return `You rolled ${Math.max(...dice)}-${Math.min(...dice)} but can’t ${term('entering', 'enter')}: points ${[...new Set(dice)].map((d) => 25 - d).join(' and ')} are closed by Brown. Your turn is skipped.`
  return `You rolled ${Math.max(...dice)}-${Math.min(...dice)} and every move is ${term('blocked', 'blocked')}. Turn skipped.`
}

export function blockedText(reason, from, dice) {
  switch (reason) {
    case 'bar': return `You have a checker on the bar. It has to ${term('entering', 'come in')} before anything else can move.`
    case 'notHome': return `You can’t ${term('bearoff', 'bear off')} until all 15 checkers are in your home board (points 1 to 6).`
    case 'overshoot': return `A roll higher than the point only bears off your highest checker. Move a checker from a higher point first.`
    case 'blocked': return `${from === 25 ? 'The entry point is' : 'Every landing spot for that checker is'} ${term('blocked', 'blocked')}: Brown has two or more there.`
    default: return `That checker could move, but then you couldn’t use your other die. ${term('blocked', 'You must use both dice')} when there’s a way to.`
  }
}

export { evaluate, winProb }
