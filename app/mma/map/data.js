// Recovery Map data — transcribed from "1 - recovery-map.md" (consolidated from
// two OHSU consults: Consult 1 = chief resident, Consult 2 = Dr. Dennis).
//
// Provenance markers, preserved from the source doc:
//   confirmed  (✅) — a surgeon said this directly
//   inference  (🔶) — reasonable inference / a personal choice, not a rule
//   question   (❓) — still needs confirming with the care team
//
// Edit dates/status here as things get confirmed — nothing else in the app
// should need to change.

export const SURGERY_DATE = '2026-10-02' // Friday — MMA, OHSU, morning

export const SURGERY_INFO = {
  procedure: 'MMA (maxillomandibular advancement) for sleep apnea',
  surgeon: 'Dr. Dennis, OHSU',
  note: 'Dr. Dennis leaves the country the day after surgery for ~1 week — Dr. Anglestad covers. One of four surgeons always on call.',
}

// Categories used to group notes within a phase card.
export const CATEGORIES = {
  physical: { label: 'Physical' },
  diet: { label: 'Diet' },
  activity: { label: 'Activity' },
  emotional: { label: 'Emotional' },
  appointment: { label: 'Appointment' },
  logistics: { label: 'Logistics' },
}

const c = (status, category, text) => ({ status, category, text })

// Day 0 = surgery day. Ranges are inclusive day-of-recovery offsets.
// Boundaries beyond 6 weeks are 🔶 — converted from the surgeons' month-based
// estimates (using ~30.44 days/month) since the source doc speaks in months,
// not exact days, from that point on.
export const PHASES = [
  {
    id: 'day0',
    startDay: 0,
    endDay: 0,
    label: 'Day 0 — Surgery day',
    dateLabel: 'Fri Oct 2, 2026',
    summary: 'Surgery day. Whole-day event with anesthesia in and out.',
    notes: [
      c('confirmed', 'physical', 'Surgery itself takes 2–4 hours — a whole-day event with anesthesia in and out.'),
      c('confirmed', 'physical', 'Wake up numb — upper jaw and lip numb. Feels more uncomfortable and congested than painful.'),
      c('confirmed', 'physical', 'Sinuses full of blood → very congested immediately. Breathing through the nose will be difficult at first.'),
      c('confirmed', 'logistics', '~50% of patients stay one night, ~50% go home same day. MMA is "normally an inpatient case." Decision is yours/partner’s, based on how you feel — the only criterion to go home is being able to take fluids by mouth for hydration.'),
      c('confirmed', 'physical', 'Not wired shut (99.9%). One rubber band on each side to guide the bite. Small chance of wiring only if the controlled fracture goes an odd angle — Dr. Dennis has never had to.'),
      c('confirmed', 'physical', 'Meds inpatient: scheduled Tylenol + scheduled Toradol, PRN oxycodone. Antibiotics started (pre-op dose + continuing).'),
    ],
  },
  {
    id: 'days1_3',
    startDay: 1,
    endDay: 3,
    label: 'Days 1–3 — Peak',
    summary: 'The worst stretch. Swelling peaks around day 3.',
    notes: [
      c('confirmed', 'physical', 'Swelling peaks around day 3. This is the worst stretch — "you’re really going to hate us before day three."'),
      c('confirmed', 'physical', 'Congestion heavy; sinuses draining blood for weeks starts now.'),
      c('confirmed', 'physical', 'Numbness everywhere: upper lip, around the nose, whole lower lip.'),
      c('confirmed', 'diet', 'It will feel like you can’t swallow — swollen, congested, muscles repositioned. You can. The team deliberately avoids calling in speech pathology ("rabbit hole"). A red rubber catheter tip on a syringe can bypass the sensation early; many people just drink from a cup.'),
      c('confirmed', 'physical', 'Most patients take only 1–2 oxycodone doses total. Sent home with some as needed.'),
      c('inference', 'physical', 'Drooling / keeping a rag handy — lips swollen and numb, hard to tell where they are.'),
    ],
  },
  {
    id: 'week1',
    startDay: 4,
    endDay: 7,
    label: 'Week 1 — "Hell week"',
    summary: 'Emotional low point. Sleep is worse before it gets better.',
    notes: [
      c('confirmed', 'emotional', 'Still rough. Emotional low — regret is universal for about a week ("I was living a normal life, didn’t need to do this"). Don’t judge the surgery yet.'),
      c('confirmed', 'physical', 'Sleep will be worse than before at first — that’s the cruel part, since the surgery is for sleep. Energy follows.'),
      c('confirmed', 'physical', 'Wound care = oral hygiene. Brush normally, avoid the incision area (high up, far back — easy to avoid). Chlorhexidine rinse while brushing is hard. Flossing is challenging this week, easier after.'),
      c('question', 'appointment', 'Follow-up visit ~1 week post-op ("We’ll see you one week post-op").'),
      c('inference', 'logistics', 'Off screens / work. You work on camera remotely — plan on being offline.'),
    ],
  },
  {
    id: 'week2',
    startDay: 8,
    endDay: 14,
    label: 'Week 2',
    summary: 'Over the crest. Lips start moving better — "return to humanity."',
    notes: [
      c('confirmed', 'emotional', 'Still pretty rough, but "over the crest of the mountain." The discrete hump is somewhere in the 1–2 week mark: lips start moving better, you "return to humanity."'),
      c('confirmed', 'physical', '~80% of swelling gone by two weeks (Consult 1’s number; Consult 2 said 80% by six weeks instead) — expect somewhere in between, and trace swelling for months regardless.'),
      c('confirmed', 'physical', 'Drooling / bib phase typically ends around here (1–2 weeks).'),
      c('inference', 'activity', 'Surgeons’ clearance point for light exercise. (Your choice to wait longer — see Hard Rules vs. Choices.)'),
      c('question', 'appointment', 'Next follow-up visit ~2–3 weeks after the week-1 visit.'),
    ],
  },
  {
    id: 'weeks3_4',
    startDay: 15,
    endDay: 28,
    label: 'Weeks 3–4',
    summary: 'Definitely getting back to things.',
    notes: [
      c('confirmed', 'activity', '"Definitely getting back to things." Most people are back to most of their normal activities around week 3 (typically out of work/school ~2 weeks).'),
      c('confirmed', 'physical', 'Bruising, if any, cycles out (skin bruising is actually uncommon — ~15–20% — can track down the neck).'),
      c('inference', 'logistics', 'Back on camera for work becomes realistic (swelling noticeable to you, maybe not to others).'),
    ],
  },
  {
    id: 'weeks5_6',
    startDay: 29,
    endDay: 41,
    label: 'Weeks 5–6',
    summary: 'Face is recognizably yours again.',
    notes: [
      c('confirmed', 'physical', 'Face is recognizably yours again, just different in the lower third.'),
      c('question', 'appointment', 'Follow-up visit ~6 weeks post-op — Consult 1 framed this as roughly the last one: "as long as everything looks good, you’re free to go." No week-6 imaging "gate" was described — confirm whether an X-ray/CT happens.'),
    ],
  },
  {
    id: 'sixWeeks',
    startDay: 42,
    endDay: 60,
    label: '6 Weeks — No-chew ends',
    summary: 'The hard 6-week rule lifts. Bone takes the load now.',
    notes: [
      c('confirmed', 'physical', 'Bone healed enough that the hardware is now doing much less work — the bone takes the load. Chewing resumes.'),
      c('confirmed', 'diet', 'Rubber bands: for a same-bite case like yours, "probably not that long — a couple of weeks at most." At some point you take them off to eat and put them back on. Whether the rubber-band screws get left in is decided during surgery.'),
    ],
  },
  {
    id: 'twoToFiveMonths',
    startDay: 61,
    endDay: 152,
    label: '2–5 Months',
    summary: 'Soft-tissue remodeling. Lip numbness still an open question.',
    notes: [
      c('confirmed', 'physical', 'Swelling ~90–95% gone by 6 weeks; the last trace takes a few months. Full soft-tissue remodeling ~4–5 months (slower as an adult than at 16).'),
      c('confirmed', 'physical', 'Lower-lip numbness: no real information until 4–5 months — that’s how long those nerves take to begin healing. Upper lip almost always comes back (slower). Roof of the mouth behind the front teeth is unpredictable but a minor issue, usually only noticed by people over 40.'),
    ],
  },
  {
    id: 'sixMonths',
    startDay: 153,
    endDay: 274,
    label: '6 Months',
    summary: 'Numbness recovery continues. Sleep study to confirm the fix.',
    notes: [
      c('question', 'appointment', 'Sleep study to confirm the apnea is fixed (timing not stated in these consults — confirm).'),
      c('confirmed', 'physical', 'Numbness recovery continues up to 6–12 months. Most common permanent outcome is a patch that didn’t fully come back, not the whole lip. Worse odds with age; "non-zero chance" of a permanent area, low chance it’s the whole lip/chin. Doesn’t affect eating or speech — you mostly notice it shaving.'),
    ],
  },
  {
    id: 'twelveMonths',
    startDay: 275,
    endDay: 365,
    label: '12 Months',
    summary: 'Lingering numbness is now considered permanent.',
    notes: [
      c('confirmed', 'physical', '~1-year mark is when lingering numbness is considered permanent.'),
      c('inference', 'physical', 'Face finishes its last subtle settling around a year.'),
    ],
  },
  {
    id: 'beyond',
    startDay: 366,
    endDay: Infinity,
    label: 'Beyond 12 Months',
    summary: 'Recovery complete. Any remaining numbness is permanent.',
    notes: [
      c('confirmed', 'physical', 'Any numbness still present at this point is considered permanent — most commonly a small patch, not the whole lip.'),
    ],
  },
]

export const HARD_RULES = [
  {
    id: 'no-chew',
    text: 'No chewing with your teeth for 6 weeks. That’s how long the bone needs to heal underneath. It is not 6 weeks of liquids — anything you can swallow without chewing is allowed.',
  },
  {
    id: 'no-bearing-down',
    text: 'No bearing down / heavy lifting until the bone is healed (~6 weeks) — bleeding and pressure risk.',
  },
  {
    id: 'sinus-precautions',
    text: 'Sinus precautions for weeks: no nose-blowing; sneeze with your mouth open.',
  },
  {
    id: 'jaw-pain-stop',
    text: 'Jaw pain during or after activity means stop and call — not a push-through signal.',
  },
]

export const MY_CHOICES = [
  {
    id: 'running-layoff',
    text: 'Sitting out running for 3–6 months. Both consults actually cleared light exercise at ~2 weeks (Consult 1: after week 1 if you feel up to it; Consult 2: "I’m okay after two weeks… you can start exercising after two weeks"). Playing the return by ear.',
  },
  {
    id: 'overnight-stay',
    text: 'Overnight hospital stay: deciding day-of, partner’s call.',
  },
  {
    id: 'fmla',
    text: 'FMLA: 3 weeks.',
  },
]

export const RED_FLAGS = [
  {
    id: 'nosebleed',
    severity: 'er',
    sign: 'Profuse, bright-red nosebleed — gushing, not oozing',
    action: 'Go to the ER. This is the acute risk.',
    detail: 'Small nosebleeds and blood-tinged drainage for weeks are normal and expected.',
  },
  {
    id: 'bite-shift',
    severity: 'call',
    sign: 'Bite suddenly shifts / feels completely different',
    action: 'Call the surgeon first — they can triage.',
  },
  {
    id: 'infection',
    severity: 'call',
    sign: 'Signs of infection — spreading redness, fever, foul taste/discharge, worsening pain after it had improved',
    action: 'Call the surgeon.',
  },
  {
    id: 'hardware',
    severity: 'call-nonurgent',
    sign: 'Hardware sensation change — new poking, a screw feels exposed',
    action: 'Call (not urgent, but flag it).',
  },
  {
    id: 'increasing-swelling',
    severity: 'call',
    sign: 'Increasing swelling after it had started going down',
    action: 'Call.',
  },
]

export const RED_FLAGS_FOOTER =
  'Non-urgent questions → MyChart or the clinic line. Dr. Dennis’s clinic is Fridays; residents are always in.'

export const OPEN_QUESTIONS = [
  {
    id: 'running-timeline',
    title: 'Running timeline',
    text: 'Consult 1 said running is fine "after the first week if you feel up to it"; Consult 2 said "okay after two weeks." Both are far earlier than the 3-month figure that’s been floating around. The conservative choice is yours regardless — but get the actual number on record so it’s a choice, not a misremembered restriction.',
  },
  {
    id: 'week6-imaging',
    title: 'Week-6 imaging / follow-up schedule',
    text: 'Confirm the visit schedule (Consult 1 implied ~1 wk, ~3 wk, ~6 wk) and whether any imaging happens at 6 weeks, or whether "looks good = free to go" is purely clinical.',
  },
]
