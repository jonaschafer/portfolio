/**
 * Build plan-data-v3.json from plan-data-v2.json.
 * v3 = plan re-anchored to "where you're at": Mar 2-8 (next week) through race, with BPA test week + MWF circuits.
 * Does NOT modify v2.
 *
 * Run: node build-v3-full.js
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname);
const V2 = JSON.parse(fs.readFileSync(path.join(DIR, 'plan-data-v2.json'), 'utf8'));

// v3 date ranges: 24 weeks from Mar 2 to Aug 15
const V3_DATE_RANGES = [
  'Mar 2-8', 'Mar 9-15', 'Mar 16-22', 'Mar 23-29',
  'Mar 30-Apr 5', 'Apr 6-12', 'Apr 13-19', 'Apr 20-26',
  'Apr 27-May 3', 'May 4-10', 'May 11-17', 'May 18-24',
  'May 25-31', 'Jun 1-7', 'Jun 8-14', 'Jun 15-21',
  'Jun 22-28', 'Jun 29-Jul 5', 'Jul 6-12', 'Jul 13-19',
  'Jul 20-26', 'Jul 27-Aug 2', 'Aug 3-9', 'Aug 10-15'
];

// MWF circuit content (replaces "Same circuit" / original PT)
const MONDAY_CONTENT = "Maintenance — Hip flexors + adductors (injury priority). This is non-negotiable and protecting your future self.\n\n**Circuit (25-30 min):**\n- Seated straight leg raise\n- SL glute bridge\n- Side-lying adduction\n- Copenhagen plank (or side plank clam raise)";
const MONDAY_STRENGTH_ONE_LINE = "Hip flexors + adductors: SL raise, SL glute bridge, side-lying adduction, Copenhagen plank";

const WEDNESDAY_CIRCUIT = "Reactive/athletic + knee.\n\n**Circuit (25-30 min):**\n- Pogo / SL hops\n- Step-downs\n- Wall sit\n- Med ball side-to-side";
const WEDNESDAY_STRENGTH_ONE_LINE = "Reactive + knee: pogo/SL hops, step-downs, wall sit, med ball side-to-side";

const FRIDAY_CIRCUIT = "Abductors + posterior chain.\n\n**Circuit (25-30 min):**\n- Monster walks or Fondas\n- Calf raises\n- SL balance eyes closed\n- Hip drop or hip march";
const FRIDAY_STRENGTH_ONE_LINE = "Abductors + posterior: monster walks/Fondas, calf raises, SL balance, hip drop/hip march";

function applyMWF(week) {
  const days = week.days || [];
  days.forEach(d => {
    if (d.day === 'Monday' && (d.title === 'PT Exercises' || (d.title && d.title.includes('PT')))) {
      d.content = MONDAY_CONTENT;
      if (d.summary) d.summary.strengthOneLine = MONDAY_STRENGTH_ONE_LINE;
    } else if (d.day === 'Wednesday') {
      if (d.content && typeof d.content === 'string') {
        d.content = d.content
          .replace(/\*\*PT Exercises \(25-30 min\)\*\*: Same circuit as Monday/g, '**PT Exercises (25-30 min)**: ' + WEDNESDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Same circuit as Monday/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Same circuit\b/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Progressed circuit/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Same progressed circuit[^\\n]*/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT);
      }
      if (d.summary && (d.summary.strengthOneLine === 'Same circuit as Monday' || d.summary.strengthOneLine === 'Same circuit' || d.summary.strengthOneLine === 'Progressed circuit' || (d.summary.strengthOneLine && d.summary.strengthOneLine.includes('circuit'))))
        d.summary.strengthOneLine = WEDNESDAY_STRENGTH_ONE_LINE;
    } else if (d.day === 'Friday') {
      if (d.content && typeof d.content === 'string') {
        d.content = d.content
          .replace(/\*\*PT Exercises \(25-30 min\)\*\*: Same circuit as Monday\/Wednesday/g, '**PT Exercises (25-30 min)**: ' + FRIDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Same circuit as Monday\/Wednesday/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Same circuit\b/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Progressed circuit/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
          .replace(/\*\*PT Exercises\*\*: Still do these[^\\n]*/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
          .replace(/Rest from running\. Still do PT\./g, 'Rest from running. **PT Exercises**: ' + FRIDAY_CIRCUIT);
      }
      if (d.summary && (d.summary.strengthOneLine === 'Same circuit as Monday/Wednesday' || d.summary.strengthOneLine === 'Same circuit' || d.summary.strengthOneLine === 'Progressed circuit' || (d.summary.strengthOneLine && (d.summary.strengthOneLine.includes('circuit') || d.summary.strengthOneLine.includes('PT')))))
        d.summary.strengthOneLine = FRIDAY_STRENGTH_ONE_LINE;
    }
  });
  // Ensure Monday exists
  const hasMonday = days.some(d => d.day === 'Monday');
  if (!hasMonday && days.length > 0) {
    const monday = {
      day: 'Monday',
      title: 'PT Exercises',
      content: MONDAY_CONTENT,
      summary: { distance: null, vert: null, duration: '30 min', runOneLine: null, strengthOneLine: MONDAY_STRENGTH_ONE_LINE }
    };
    week.days.unshift(monday);
  }
}

// Enrich abbreviated day content (especially Tue/Thu heavy days) from week-level #### DayName section
const MIN_DAY_CONTENT_LENGTH = 180;
function enrichDayFromWeekContent(week) {
  const blob = (week.content || '').trim();
  if (!blob) return;
  (week.days || []).forEach(d => {
    const raw = (d.content || '').trim();
    if (raw.length >= MIN_DAY_CONTENT_LENGTH) return;
    const dayName = (d.day || '').replace(/\s+/g, '\\s+');
    if (!dayName) return;
    const re = new RegExp('####\\s+' + dayName + '[^\\n]*\\n([\\s\\S]*?)(?=####|$)', 'i');
    const m = blob.match(re);
    if (m && m[1]) {
      const section = m[1].trim();
      if (section.length > raw.length) d.content = section;
    }
  });
}

// Expanded strength routines for one-liner days (progressive overload: build sets/reps over weeks)
const STRENGTH_TEMPLATES = [
  {
    match: /front squats?\s+and\s+presses?/i,
    routine: `**Heavy Strength - Front squats and presses (foundation)**:

Warm up: Leg swings, goblet squats, banded work, empty bar.

Set 1 - 3–4X through:
- 6X front squats at 65–70%
- 6X strict or push press
- Rest as needed between sets

Set 2 - 2–3X through:
- 8X goblet or front rack reverse lunge per side
- 8X single-arm row per side

**Progression:** Add 5% load or 1 rep when form is solid. By week 4 you should be at 4 rounds on Set 1.`
  },
  {
    match: /deadlifts?\s+and\s+push\s+presses?/i,
    routine: `**Heavy Strength - Deadlifts and push presses (hinge + press)**:

Warm up: Good mornings, hip hinges, light deadlifts, shoulder mobility.

Set 1 - 3–4X through:
- 6X deadlifts at 70%
- 6X push press
- Rest as needed

Set 2 - 2–3X through:
- 8X Romanian deadlift or single-leg RDL per side
- 8X single-arm press per side

**Progression:** Build to 4 rounds on Set 1; add weight when 6 reps feel controlled.`
  },
  {
    match: /squat\/?box jump|squat\s*\/\s*box\s*jump/i,
    routine: `**Heavy Strength - Squat/box jump power work**:

Warm up: Glute lifts, SL work, planks, side planks. Pre-set: 10X good mornings, 10X alternating back lunges.

Set 1 - 3–4X through:
- 6X back squats at 65–70%
- 6X box jumps (step down, reset)
- Rest as needed

Set 2 - 2–3X through:
- 6X Bulgarian split squats per side
- 8X bird dog rows per side

**Progression:** Add a round or small load each week; focus on explosive jump and controlled landing.`
  },
  {
    match: /back squats?\s+with\s+pause\s*\+\s*step\s*ups?/i,
    routine: `**Heavy Strength - Back squats with pause + step ups**:

Warm up: Goblet squats, step-throughs, light bar.

Set 1 - 3–4X through:
- 5–6X back squats at 70% with 2 sec pause at bottom
- 6X per side step ups (weighted if able)
- Rest as needed

Set 2 - 2–3X through:
- 8X lateral step-downs per side
- 8X chest press or push-ups

**Progression:** Increase pause time or add weight to step ups week to week.`
  },
  {
    match: /deadlift\s+with\s+broad\s+jumps?/i,
    routine: `**Heavy Strength - Deadlift with broad jumps**:

Warm up: Hip hinges, RDLs, light deadlifts, skipping.

Set 1 - 3–4X through:
- 6X deadlifts at 70%
- 5X broad jumps (full reset between)
- Rest as needed

Set 2 - 2–3X through:
- 8X single-leg RDL per side
- 8X kettlebell swings

**Progression:** Build to 4 rounds; add load on deadlift or distance on jumps when ready.`
  },
  {
    match: /deadlift\s+with\s+snatches?/i,
    routine: `**Heavy Strength - Deadlift with snatches**:

Warm up: Deadlift warm-up, hip mobility, light KB work.

Set 1 - 3–4X through:
- 6X deadlifts at 70%
- 6X per arm kettlebell snatch
- Rest as needed

Set 2 - 2–3X through:
- 8X alternating KB swings
- 8X bird dog rows per side

**Progression:** Add weight or reps each week; keep snatch technique sharp.`
  },
  {
    match: /squat\s+power\s+work/i,
    routine: `**Heavy Strength - Squat power work**:

Set 1 - 3–4X through:
- 6X back squats at 65–70%
- 6X squat jumps or box jumps
- Rest as needed

Set 2 - 2–3X through:
- 8X goblet squat or front rack hold
- 8X per side single-leg balance or step-down

**Progression:** Build to 4 rounds; add load or jump height when form holds.`
  },
  {
    match: /back squats?\s+with\s+pause/i,
    routine: `**Heavy Strength - Back squats with pause**:

Warm up: Goblet squats, band work, empty bar.

Set 1 - 3–4X through:
- 5–6X back squats at 70% with 2–3 sec pause at bottom, drive up
- Rest as needed

Set 2 - 2–3X through:
- 8X Bulgarian split squat per side
- 8X push press or strict press

**Progression:** Add 5% or 1 rep per week; keep pause controlled.`
  },
  {
    match: /deadlifts?\s+and\s+core/i,
    routine: `**Heavy Strength - Deadlifts and core**:

Set 1 - 3–4X through:
- 6X deadlifts at 65–70%
- Rest as needed

Set 2 - 2–3X through:
- 10X heavy kettlebell swings
- 30–45 sec dead bug or hollow hold
- 8X bird dog rows per side

**Progression:** Build deadlift load; add core hold time or swings when recovered.`
  },
  {
    match: /light\s+deadlifts?/i,
    routine: `**Heavy Strength - Light deadlifts (recovery emphasis)**:

Warm up: Hip mobility, RDLs, light pulls.

Set 1 - 2–3X through:
- 6–8X deadlifts at 55–65% (smooth, no grind)
- Rest as needed

Set 2 - 2X through:
- 10X kettlebell swings
- 30 sec plank or dead bug

**Progression:** Keep light; focus on technique and blood flow, not load.`
  },
  {
    match: /deadlifts?\s*\(lighter/i,
    routine: `**Heavy Strength - Deadlifts (lighter day after hike work)**:

Warm up: Easy hip work, light pulls.

Set 1 - 2–3X through:
- 6X deadlifts at 60% (controlled, no max effort)
- Rest as needed

Set 2 - 2X through:
- 10X kettlebell swings
- MOBILITY

**Progression:** Do not push load today; prioritize recovery from the power hike session.`
  },
  {
    match: /important\s+lifts?,?\s+not\s+heavy|light\s+strength|light\s+circuit|light\s+kettlebell/i,
    routine: `**Light Strength - Important lifts, not heavy**:

Focus on movement quality and continuity, not load.

- 2–3 rounds: Goblet squats, RDL or deadlift (light), push press or strict press (light), rows, planks.
- Keep rest short; treat as movement prep, not max strength.

**Progression:** On restore weeks, maintain pattern without adding weight.`
  }
];

const MAX_SHORT_LENGTH = 280;
function expandShortHeavyDays(week) {
  const weekNum = week.week || 0;
  (week.days || []).forEach(d => {
    const raw = (d.content || '').trim();
    if (raw.length >= MAX_SHORT_LENGTH) return;
    const isHeavy = /Tuesday|Thursday/.test(d.day) && (/heavy\s+strength|light\s+strength/i.test(d.title || '') || /\*\*Heavy Strength\*\*|\*\*Light Strength\*\*/.test(raw));
    if (!isHeavy) return;
    const runMatch = raw.match(/^([\s\S]*?)(\n\*\*(?:Heavy|Light)\s+Strength\*\*:\s*[^\n]+)\s*$/);
    const strengthOneLine = (d.summary && d.summary.strengthOneLine) ? d.summary.strengthOneLine : (raw.match(/\*\*(?:Heavy|Light) Strength\*\*:\s*([^\n]+)/) || [])[1] || '';
    for (const t of STRENGTH_TEMPLATES) {
      if (t.match.test(strengthOneLine) || t.match.test(raw)) {
        const runBlock = runMatch ? runMatch[1].trim() : raw.replace(/\*\*(?:Heavy|Light) Strength\*\*:[^\n]+/, '').trim();
        d.content = runBlock ? (runBlock + '\n\n' + t.routine) : t.routine;
        break;
      }
    }
  });
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Parse numeric value from distance/vert strings (e.g. "8 miles", "1,000 ft", "6.5")
function parseNum(s) {
  if (s == null || s === '') return 0;
  const str = String(s).replace(/,/g, '');
  const m = str.match(/(\d+\.?\d*)/);
  return m ? parseFloat(m[1], 10) : 0;
}

// Scale a week's run days to hit target miles and target vert (so displayed totals match "where you're at")
function setWeekVolume(week, targetMiles, targetVert) {
  const days = week.days || [];
  let totalMiles = 0, totalVert = 0;
  const dayValues = days.map(d => {
    const s = d.summary || {};
    const mi = parseNum(s.distance);
    const v = parseNum(s.vert);
    totalMiles += mi;
    totalVert += v;
    return { mi, v };
  });
  if (totalMiles <= 0 && totalVert <= 0) return;
  const scaleM = targetMiles > 0 && totalMiles > 0 ? targetMiles / totalMiles : 1;
  const scaleV = targetVert > 0 && totalVert > 0 ? targetVert / totalVert : 1;

  days.forEach((d, i) => {
    const s = d.summary || {};
    const { mi, v } = dayValues[i];
    if (mi > 0) {
      const newMi = Math.round(mi * scaleM * 10) / 10;
      const newMiStr = newMi % 1 === 0 ? String(Math.round(newMi)) : newMi.toFixed(1);
      s.distance = newMiStr + (s.distance && s.distance.includes('miles') ? ' miles' : '');
      if (d.content && typeof d.content === 'string') {
        d.content = d.content.replace(/(\*\*Run\*\*:\s*)(\d+\.?\d*)\s*miles?/i, (_, pre) => pre + newMiStr + ' miles');
        d.content = d.content.replace(/(\*\*Distance\*\*:\s*~?)(\d+\.?\d*)\s*miles?/i, (_, pre) => pre + newMiStr + ' miles');
      }
    }
    if (v > 0) {
      const newV = Math.round(v * scaleV);
      s.vert = (String(s.vert || '').includes('ft')) ? newV.toLocaleString() + ' ft' : String(newV);
    }
  });
}

// BPA test week (Mar 23-29) — full week with test on Wednesday
function buildBPAWeek() {
  const content = "Full week coming off deload. The fitness test is **Wednesday**; Tuesday is easy so you're rested. Rest of the week is normal structure: easy runs, PT, and a moderate long run Sunday.\n\n#### Monday - PT Exercises\nMaintenance — hip flexors + adductors. Same circuit as usual.\n\n#### Tuesday - Easy Run + PT Exercises\n45 min easy. No heavy strength today; keep legs fresh for the test.\n- **Distance**: ~4 miles\n- **Effort**: Easy, conversation pace\n- **PT**: Wednesday circuit (reactive + knee)\n\n#### Wednesday - FITNESS TEST: 3 BPA repeats\n**Test:** 3 BPA repeats. Same route as previous attempts; compare total time and RPE to last time.\n**Aim:** 21:30–23:00/min pace if things go well (race-relevant vert and effort).\n\nWarm up easy. Run the test. Cool down. Note your time and how you felt.\n\n#### Thursday - Easy Run + PT (optional light strength)\n45–50 min easy. Recovery from the test. Optional light strength if you feel good.\n- **Distance**: ~4 miles\n- **Purpose**: Blood flow, recovery\n\n#### Friday - Easy Run + PT Exercises\n45 min easy + abductors/posterior circuit.\n- **Distance**: ~4 miles\n\n#### Saturday - Day Off\nRest. Foam roll if it helps.\n\n#### Sunday - Long Run (moderate)\n2–2:15 hours easy to moderate. This keeps the week at full structure and bridges into the next build.\n- **Distance**: ~10–11 miles\n- **Vert**: ~1,200–1,500 ft (rolling)\n- **Effort**: Aerobic, no pushing\n- **Fueling**: Practice 60g/hr\n\n**WEEK 4 NOTE:** Test Wednesday; everything else supports recovery and continuity. Use the test result to calibrate the next block.";
  return {
    week: 4,
    dateRange: 'Mar 23-29',
    type: 'TEST',
    target: '~22–24 miles, 2,500 ft (test Wed)',
    content,
    days: [
      { day: 'Monday', title: 'PT Exercises', content: MONDAY_CONTENT, summary: { distance: null, vert: null, duration: '30 min', runOneLine: null, strengthOneLine: MONDAY_STRENGTH_ONE_LINE } },
      { day: 'Tuesday', title: 'Easy Run + PT Exercises', content: '45 min easy. No heavy strength — keep legs fresh for the test.\n- **Distance**: ~4 miles\n- **Effort**: Easy, conversation pace\n\n**PT Exercises (25-30 min)**: ' + WEDNESDAY_CIRCUIT, summary: { distance: '4 miles', vert: null, duration: '45 min', runOneLine: '~4 miles easy', strengthOneLine: WEDNESDAY_STRENGTH_ONE_LINE } },
      { day: 'Wednesday', title: 'Fitness test: 3 BPA repeats', content: '**Test:** 3 BPA repeats. Same route as previous attempts; compare total time and RPE to last time.\n**Aim:** 21:30–23:00/min pace if things go well (race-relevant vert and effort).\n\nWarm up easy. Run the test. Cool down. Note your time and how you felt.', summary: { distance: null, vert: null, duration: null, runOneLine: '3 BPA repeats — aim 21:30–23:00/min', strengthOneLine: null } },
      { day: 'Thursday', title: 'Easy Run + optional light strength', content: '45–50 min easy. Recovery from the test. Optional light strength if you feel good.\n- **Distance**: ~4 miles\n- **Purpose**: Blood flow, recovery', summary: { distance: '4 miles', vert: null, duration: '45-50 min', runOneLine: '~4 miles easy', strengthOneLine: null } },
      { day: 'Friday', title: 'Easy Run + PT Exercises', content: '45 min easy.\n- **Distance**: ~4 miles\n\n**PT Exercises (25-30 min)**: ' + FRIDAY_CIRCUIT, summary: { distance: '4 miles', vert: null, duration: '45 min', runOneLine: '~4 miles easy', strengthOneLine: FRIDAY_STRENGTH_ONE_LINE } },
      { day: 'Saturday', title: 'Day Off', content: 'Rest. Foam roll if it helps.', summary: { distance: null, vert: null, duration: null, runOneLine: null, strengthOneLine: null } },
      { day: 'Sunday', title: 'Long Run (moderate)', content: '2–2:15 hours easy to moderate. Keeps the week at full structure and bridges into the next build.\n- **Distance**: ~10–11 miles\n- **Vert**: ~1,200–1,500 ft (rolling)\n- **Effort**: Aerobic, no pushing\n- **Fueling**: Practice 60g/hr', summary: { distance: '10-11 miles', vert: '1,200-1,500 ft', duration: '2-2:15 hr', runOneLine: '~10-11 miles, aerobic', strengthOneLine: null } }
    ]
  };
}

// Build v3 weeks array
const weeks = [];
const danaWeeks = V2.weeks;

// Week 1: Mar 2-8 — 25 mi, 5k ft ("where you're at" — start of v3, then build progressively)
const w1 = deepClone(danaWeeks[6]); // Dana week 7
w1.week = 1;
w1.dateRange = 'Mar 2-8';
w1.target = '25 miles, 5,000 ft';
w1.content = (w1.content || '').replace('28 miles, 3,500 ft', '25 miles, 5,000 ft').replace('Mar 17-23', 'Mar 2-8');
setWeekVolume(w1, 25, 5000);
applyMWF(w1);
enrichDayFromWeekContent(w1);
expandShortHeavyDays(w1);
weeks.push(w1);

// Week 2: Mar 9-15 — 30 mi, 5.5k ft (build from week 1)
const w2 = deepClone(danaWeeks[8]);
w2.week = 2;
w2.dateRange = 'Mar 9-15';
w2.target = '30 miles, 5,500 ft';
w2.content = (w2.content || '').replace('30 miles, 4,000 ft', '30 miles, 5,500 ft').replace('Mar 31-Apr 6', 'Mar 9-15');
setWeekVolume(w2, 30, 5500);
applyMWF(w2);
enrichDayFromWeekContent(w2);
expandShortHeavyDays(w2);
weeks.push(w2);

// Week 3: Mar 16-22 — deload (~70% of week 2)
const w3 = deepClone(danaWeeks[7]);
w3.week = 3;
w3.dateRange = 'Mar 16-22';
w3.target = '20 miles, 3,000 ft (~70% of previous week)';
w3.content = (w3.content || '').replace('Mar 24-30', 'Mar 16-22').replace('20 miles, 2,400 ft', '20 miles, 3,000 ft');
setWeekVolume(w3, 20, 3000);
applyMWF(w3);
enrichDayFromWeekContent(w3);
expandShortHeavyDays(w3);
weeks.push(w3);

// Week 4: BPA test
weeks.push(buildBPAWeek());

// Weeks 5-22: Dana 9-26, re-dated and re-numbered
for (let i = 0; i <= 17; i++) {
  const danaWeek = danaWeeks[8 + i]; // Dana weeks 9..26
  const w = deepClone(danaWeek);
  w.week = 5 + i;
  w.dateRange = V3_DATE_RANGES[4 + i];
  if (w.content) {
    w.content = w.content.replace(danaWeek.dateRange, w.dateRange);
  }
  applyMWF(w);
  enrichDayFromWeekContent(w);
  expandShortHeavyDays(w);
  weeks.push(w);
}

// Week 23: Aug 3-9 (taper from Dana 27)
const w23 = deepClone(danaWeeks[26]);
w23.week = 23;
w23.dateRange = 'Aug 3-9';
w23.content = (w23.content || '').replace('Aug 4-15', 'Aug 3-9');
applyMWF(w23);
enrichDayFromWeekContent(w23);
expandShortHeavyDays(w23);
weeks.push(w23);

// Week 24: Aug 10-15 (race week)
const w24 = deepClone(danaWeeks[26]);
w24.week = 24;
w24.dateRange = 'Aug 10-15';
w24.target = '~15 miles total before race';
w24.content = (w24.content || '').replace('Aug 4-15', 'Aug 10-15');
applyMWF(w24);
enrichDayFromWeekContent(w24);
expandShortHeavyDays(w24);
weeks.push(w24);

const v3 = {
  planTitle: "Wy'East Trailfest 50M Training Plan (v3 — Current block + BPA test through race)",
  planDates: "Mar 2 - Aug 15, 2026",
  raceDate: "2026-08-15",
  startDate: "2026-03-02",
  weeks,
  reference: V2.reference
};

fs.writeFileSync(path.join(DIR, 'plan-data-v3.json'), JSON.stringify(v3, null, 2), 'utf8');
console.log('Wrote plan-data-v3.json (24 weeks, Mar 2–Aug 15, BPA test week 4, MWF circuits throughout). v2 unchanged.');
