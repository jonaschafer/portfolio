// Decisions & Open Questions — transcribed from "2 - preop-decisions-and-questions.md".
// The three checklist groups below are checkable in the UI (state lives in
// localStorage via useChecklist, not here). This file is just the static text.

export const DECIDED = [
  {
    id: 'hospital-stay',
    decision: 'Hospital stay',
    choice: 'Decide day-of; partner’s call',
    notes:
      '~50/50 among patients. Only bar to going home: can drink fluids for hydration. MMA is normally inpatient, so no pressure either way.',
  },
  {
    id: 'fmla',
    decision: 'FMLA duration',
    choice: '3 weeks',
    notes: 'Ask for the longer window up front so the form doesn’t have to be redone; can return early with a release note. Resident’s advice.',
  },
  {
    id: 'return-to-running',
    decision: 'Return to running',
    choice: 'Play by ear; planning 3–6 months off',
    notes:
      'Surgeons cleared light exercise at ~2 weeks. The gap between "cleared" and "ready" is the thing to observe — track it in the journal.',
  },
  {
    id: 'rubber-band-screws',
    decision: 'Rubber-band screws left in?',
    choice: 'Decided intraoperatively',
    notes: 'Depends how the occlusion looks when they finish. "Most of the time we do."',
  },
  {
    id: 'septum',
    decision: 'Septum',
    choice: 'Not being touched',
    notes:
      'Another physician wants first crack at it if a septoplasty/rhinoplasty happens later. Dr. Dennis has a pop-up note: "don’t touch the septum." MMA may improve septal position anyway — it gets released from the maxilla and can settle to a neutral midline before it reattaches.',
  },
]

export const DECISIONS_REVIEW = {
  id: 'review',
  title: 'For the virtual planning review',
  subtitle: '~mid-September — the engineers’ PDF',
  intro:
    'Dr. Dennis will email a PDF from the planning session (Stryker/KLS engineers + Dr. Dennis + chief resident). It has the movement numbers and usually a chin vs. no-chin mock-up. He invited a call to discuss. Come to that call with positions on:',
  items: [
    {
      id: 'genioplasty',
      text: 'Genioplasty (sliding chin advancement) — yes / no?',
      detail:
        'A ~20-minute add-on while they’re already in there. Partly functional — a tongue-muscle (genioglossus) attachment on the inner chin means advancing it opens the airway further. Partly aesthetic. Your chin comes forward regardless (~12–15 mm of projection if the advancement is ~10 mm at the teeth); the question is whether to add more on top. Your stated leaning: you’ve "always hated the double chin," and moving the chin forward addresses that directly (~1:1), because it’s a lack of structure draping it, not fat.',
    },
    {
      id: 'tooth-show',
      text: 'Tooth show — more / less / same?',
      detail:
        'You have a healthy amount now, no gummy smile. Dr. Dennis’s recommendation: don’t change it much (losing tooth show reads as an aged look).',
    },
    {
      id: 'movement-numbers',
      text: 'Review the movement numbers: forward advancement, left/right, and the amount of rotation.',
      detail: 'Ask what "at least a centimeter" translates to in your specific plan.',
    },
    {
      id: 'nose-upturn',
      text: 'Nose up-turn / widening — ask what they’re doing to minimize it.',
      detail:
        'The lever is rotating the maxilla about its axis rather than sliding it straight forward (straight-forward movement pushes the nose up because the cut is through the nasal floor). Partner has flagged: prefer the nose not to turn up.',
    },
    {
      id: 'soft-tissue-prediction',
      text: 'Review the soft-tissue prediction.',
      detail: 'They can show a textureless "blob" render from the CT. Understand it’s a rough guide; soft tissue is the X-factor and won’t be exact.',
    },
    {
      id: 'splint',
      text: 'Is a splint being fabricated for your case, or not (since the bite isn’t changing)?',
    },
  ],
}

export const DECISIONS_PREOP = {
  id: 'preop',
  title: 'For the pre-op appointment(s)',
  subtitle: 'Pre-op visit ~Sept 18, plus a separate anesthesia/PMC phone screening',
  intro: null,
  items: [
    {
      id: 'followup-schedule',
      text: 'Confirm the follow-up visit schedule.',
      detail: 'Consult 1 implied ~1 week, ~3 weeks, ~6 weeks post-op, then done if healing is clean.',
    },
    {
      id: 'week6-imaging',
      text: 'Any imaging at week 6? Or is "looks good = free to go" purely clinical?',
      detail: 'The "week-6 imaging gate" idea came from AI planning, not the surgeons.',
    },
    {
      id: 'antibiotic-duration',
      text: 'Antibiotic duration — pre-op dose + "at least a week after," as pills.',
      detail: 'Confirm exact length and which antibiotic.',
    },
    { id: 'anti-nausea', text: 'Anti-nausea — will you go home with something?' },
    { id: 'driving', text: 'Driving — when is it safe (off narcotics + can turn head + reaction time)?' },
    { id: 'back-on-camera', text: 'Back on camera for work — realistic week?', detail: 'You’re remote and on video.' },
    { id: 'sleep-study', text: '6-month sleep study — confirm it’s ordered and when.' },
    {
      id: 'head-of-bed',
      text: 'Head-of-bed elevation — confirm.',
      detail: 'Optional per Consult 1 ("can help with swelling, we keep post-op simple").',
    },
    { id: 'cpap', text: 'CPAP — you don’t use one now; confirm nothing changes that pre-op.' },
    { id: 'psoriasis', text: 'Psoriasis on the face — skin prep is a betadine paint; flag it again so they’re aware.' },
    {
      id: 'klinefelters-trt',
      text: 'Klinefelter’s / TRT history — confirm cardiology + sleep medicine + anesthesia sign-offs are all in.',
      detail: 'This is your history, not something the consults covered — verify it’s handled.',
    },
  ],
}

export const DECISIONS_LOGISTICS = {
  id: 'logistics',
  title: 'Logistics',
  subtitle: null,
  intro: null,
  items: [
    {
      id: 'miranda-fmla',
      text: 'Miranda (care coordinator) — confirm she has what she needs.',
      detail:
        'She coordinates the FMLA paperwork and reviews it with the doctor. Flow: fill the form as completely as you can → scan into MyChart → nursing team gets it signed → back to you → give it to your employer. She may have already emailed.',
    },
    { id: 'arrival-ride', text: 'Confirm hospital arrival time and that a ride both ways is arranged.' },
    { id: 'stop-blood-thinners', text: 'Stop blood thinners / supplements per surgeon instruction — confirm the list and the cutoff.' },
    { id: 'last-meal', text: 'Last-meal cutoff — nothing to eat or drink after the stated time.' },
    { id: 'antibacterial-shower', text: 'Antibacterial shower the night before.' },
    { id: 'recovery-station', text: 'Recovery station set up at home before leaving for the hospital.', detail: 'See Prep · Meds · Diet.' },
    {
      id: 'tell-the-kids',
      text: 'Tell the kids — prep them with a realistic picture.',
      detail: 'They just started school. Bruising possible, face swollen for weeks: "Dad will look rough for a bit and that’s expected."',
    },
  ],
}

export const DECISIONS_GROUPS = [DECISIONS_REVIEW, DECISIONS_PREOP, DECISIONS_LOGISTICS]
