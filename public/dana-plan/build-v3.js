/**
 * One-off: build plan-data-v10.json from plan-data.json with updated Mon/Wed/Fri maintenance circuits.
 * Run: node build-v3.js
 */

const fs = require('fs');
const path = require('path');

const MONDAY_CONTENT = "Maintenance — Hip flexors + adductors (injury priority). This is non-negotiable and protecting your future self.\n\n**Circuit (25-30 min):**\n- Seated straight leg raise\n- SL glute bridge\n- Side-lying adduction\n- Copenhagen plank (or side plank clam raise)";

const WEDNESDAY_CIRCUIT = "Reactive/athletic + knee.\n\n**Circuit (25-30 min):**\n- Pogo / SL hops\n- Step-downs\n- Wall sit\n- Med ball side-to-side";
const WEDNESDAY_STRENGTH_ONE_LINE = "Reactive + knee: pogo/SL hops, step-downs, wall sit, med ball side-to-side";

const FRIDAY_CIRCUIT = "Abductors + posterior chain.\n\n**Circuit (25-30 min):**\n- Monster walks or Fondas\n- Calf raises\n- SL balance eyes closed\n- Hip drop or hip march";
const FRIDAY_STRENGTH_ONE_LINE = "Abductors + posterior: monster walks/Fondas, calf raises, SL balance, hip drop/hip march";

const MONDAY_STRENGTH_ONE_LINE = "Hip flexors + adductors: SL raise, SL glute bridge, side-lying adduction, Copenhagen plank";

function updateWednesdayContent(content) {
  if (!content || typeof content !== 'string') return content;
  // Replace various "Same circuit..." / "Progressed circuit" PT lines with new Wednesday circuit
  let out = content
    .replace(/\*\*PT Exercises \(25-30 min\)\*\*: Same circuit as Monday/g, '**PT Exercises (25-30 min)**: ' + WEDNESDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Same circuit as Monday/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Same circuit\b/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Progressed circuit/g, '**PT Exercises**: ' + WEDNESDAY_CIRCUIT);
  return out;
}

function updateFridayContent(content) {
  if (!content || typeof content !== 'string') return content;
  let out = content
    .replace(/\*\*PT Exercises \(25-30 min\)\*\*: Same circuit as Monday\/Wednesday/g, '**PT Exercises (25-30 min)**: ' + FRIDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Same circuit as Monday\/Wednesday/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Same circuit\b/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Progressed circuit/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT)
    .replace(/\*\*PT Exercises\*\*: Still do these - they're recovery-friendly/g, '**PT Exercises**: ' + FRIDAY_CIRCUIT);
  return out;
}

const dir = path.join(__dirname);
const data = JSON.parse(fs.readFileSync(path.join(dir, 'plan-data.json'), 'utf8'));

data.planTitle = "Wy'East Trailfest 50M Training Plan (v3 — MWF maintenance circuits)";

data.weeks.forEach(week => {
  week.days.forEach(d => {
    if (d.day === 'Monday' && (d.title === 'PT Exercises' || d.title === 'PT Exercises (PROGRESSED)' || (d.title && d.title.includes('PT')))) {
      d.content = MONDAY_CONTENT;
      if (d.summary) d.summary.strengthOneLine = MONDAY_STRENGTH_ONE_LINE;
    } else if (d.day === 'Wednesday') {
      d.content = updateWednesdayContent(d.content);
      if (d.summary && (d.summary.strengthOneLine === 'Same circuit as Monday' || d.summary.strengthOneLine === 'Same circuit' || d.summary.strengthOneLine === 'Progressed circuit'))
        d.summary.strengthOneLine = WEDNESDAY_STRENGTH_ONE_LINE;
    } else if (d.day === 'Friday') {
      d.content = updateFridayContent(d.content);
      if (d.summary && (d.summary.strengthOneLine === 'Same circuit as Monday/Wednesday' || d.summary.strengthOneLine === 'Same circuit' || d.summary.strengthOneLine === 'Progressed circuit' || (d.summary.strengthOneLine && d.summary.strengthOneLine.includes('recovery-friendly'))))
        d.summary.strengthOneLine = FRIDAY_STRENGTH_ONE_LINE;
    }
  });
});

fs.writeFileSync(path.join(dir, 'plan-data-v10.json'), JSON.stringify(data, null, 2), 'utf8');
console.log('Wrote plan-data-v10.json');
