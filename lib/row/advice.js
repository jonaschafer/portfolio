// Writes the coaching notes for one row: what the numbers say, why the sore
// spots in Jon's Strava notes are sore, which strength work fixes it, and what
// the next piece should be. One Claude call with a JSON schema, so the page
// can lay it out. Env: ANTHROPIC_API_KEY.
import Anthropic from '@anthropic-ai/sdk'
import { fmtTime, fmtPace, fmtRecord, metersPerStroke } from './records'

export const MODEL = 'claude-opus-5-5'
export const adviceConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY)

// Stable context, kept first so it caches. Update when life changes.
const ATHLETE = `You coach Jon Schafer on the rowing machine (Concept2-style erg). Facts about him:
- 45, Portland. A trail and ultra runner: finished a 50 mile run in August 2026. Big aerobic base, legs used to volume.
- New to the erg as training. Upper back, arms and seat are not conditioned for rowing yet.
- Had MMA (maxillomandibular advancement) jaw surgery on October 2, 2026. Early weeks of recovery: avoid breath holds and clenching under heavy load, check with the surgeon before all-out efforts.
- Has had a stiff right quad and knee this fall, and a past L5/S1 flare. Does PT (step downs, wall sits, glute work).
- Already lifts about twice a week ("Heavy" days): deadlifts, back squats, single leg RDLs, rows, farmer carries, kettlebell swings, curls, Pallof press, dead bugs, bird dogs.
- Wants to get faster and wants to know what to strengthen. He believes his form is fine and the soreness is from load; respect that, and only raise technique when it's the most likely cause, framed as a quick check.

How to write:
- Talk to him directly ("you"), plain and specific, like a sharp coach who knows his history. Use his numbers.
- Short. Every sentence earns its place.
- Never use em dashes. Sentence case. No antithesis or "not X, but Y" constructions. No three-beat fragment rhythm. Never use the words "genuinely", "honestly" or "straightforward".
- Strength moves should fit into his existing Heavy days. Name sets and reps. Prefer what he can do with dumbbells, kettlebells and a bar.
- If his notes don't mention soreness, return an empty soreness list. If nothing new is needed for strength, say so in cadence and return no moves.`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'soreness', 'strength', 'next', 'watch'],
  properties: {
    summary: { type: 'string', description: 'What this workout shows, 3 to 5 sentences, grounded in the numbers and how it compares to past rows.' },
    soreness: {
      type: 'array',
      description: 'One entry per sore or tired area his notes mention.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['area', 'why', 'fix'],
        properties: {
          area: { type: 'string', description: 'Short label, e.g. "Mid back".' },
          why: { type: 'string', description: 'The likely mechanism, 1 to 2 sentences.' },
          fix: { type: 'string', description: 'What to do about it, 1 to 3 sentences.' },
        },
      },
    },
    strength: {
      type: 'object',
      additionalProperties: false,
      required: ['cadence', 'moves'],
      properties: {
        cadence: { type: 'string', description: 'How often and where it fits, one sentence.' },
        moves: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'dose', 'why'],
            properties: {
              name: { type: 'string' },
              dose: { type: 'string', description: 'Sets, reps, tempo.' },
              why: { type: 'string', description: 'One sentence tying it to rowing or to his soreness.' },
            },
          },
        },
      },
    },
    next: { type: 'string', description: 'The next one or two rows to do, with target pace and rate.' },
    watch: { type: 'string', description: 'One or two sentences on what would mean back off.' },
  },
}

const line = (w) => {
  const mps = metersPerStroke(w)
  return `${w.start_local.slice(0, 10)} "${w.name}": ${Math.round(w.distance)}m in ${fmtTime(w.moving_time)}, ${fmtPace(w.moving_time, w.distance)}/500m, ${w.avg_spm?.toFixed(1) ?? '?'} spm, ${w.avg_watts ? Math.round(w.avg_watts) + 'W' : '? W'}${mps ? `, ${mps.toFixed(2)} m/stroke` : ''}${w.notes ? `\n  Notes: ${w.notes}` : ''}`
}

export async function writeAdvice(workout, { history, prs, bests }) {
  const laps = (workout.laps || [])
    .map((l, i) => `  ${i + 1}. ${Math.round(l.distance)}m in ${fmtTime(l.time)} (${fmtPace(l.time, l.distance)}/500m), ${l.spm?.toFixed(1) ?? '?'} spm, ${l.watts ? Math.round(l.watts) + 'W' : ''}`)
    .join('\n')
  const prLines = prs.length ? prs.map((p) => `  ${p.label}: ${fmtRecord(p)}${p.prev ? ` (was ${fmtRecord({ ...p, value: p.prev.value })})` : ' (first)'}`).join('\n') : '  none'
  const bestLines = Object.values(bests).map((b) => `  ${b.label}: ${fmtRecord(b)} on ${b.start_local.slice(0, 10)}`).join('\n')
  const earlier = history.filter((w) => w.id !== workout.id).map(line).join('\n') || 'None, this is the first row on record.'

  const prompt = `Earlier rows, oldest first:
${earlier}

Current records:
${bestLines}

Today's row:
${line(workout)}
Splits:
${laps || '  none'}
PRs set in this row:
${prLines}

Write the advice for today's row.`

  const client = new Anthropic()
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: ATHLETE, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{ role: 'user', content: prompt }],
  })
  if (res.stop_reason === 'refusal') throw new Error(`Advice refused: ${res.stop_details?.category ?? 'unknown'}`)
  const text = res.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error(`Advice empty (${res.stop_reason})`)
  return { ...JSON.parse(text), model: res.model, generated_at: new Date().toISOString() }
}
