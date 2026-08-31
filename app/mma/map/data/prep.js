// Prep · Meds · Diet — transcribed from "3 - prep-meds-diet.md".

export const PREP_SHOPPING = [
  {
    id: 'core',
    title: 'Core',
    intro: 'Dr. Dennis’s actual list is short: ibuprofen, Tylenol, ice packs, and "a very skilled helper at home" (covered). Everything else is convenience.',
    items: [
      { id: 'ibuprofen-tylenol', text: 'Ibuprofen + Tylenol (acetaminophen) — stocked, plenty' },
      { id: 'ice-packs', text: 'Face/jaw ice packs — 2+ so one’s always frozen' },
      { id: 'chlorhexidine', text: 'Chlorhexidine rinse (they’ll prescribe) — pick up ahead' },
      { id: 'prescriptions', text: 'Prescriptions filled ahead: pain meds, antibiotics, anti-nausea' },
      { id: 'saline-spray', text: 'Saline nasal spray — congestion relief when mouth-breathing is already limited' },
      { id: 'humidifier', text: 'Cool-mist humidifier — for the dried-out-throat, mouth-breathing stretch' },
    ],
  },
  {
    id: 'eating',
    title: 'Eating / drinking',
    intro: null,
    items: [
      { id: 'blender', text: 'Immersion or personal blender' },
      { id: 'water-bottle', text: 'Wide-mouth water bottle / bottle with a straw' },
      {
        id: 'catheter-syringes',
        text: 'Catheter-tip (60 mL) syringes',
        status: 'inference',
        detail:
          'A maybe, not a certainty. The team uses a red rubber catheter tip on a syringe only sometimes, early on, to bypass the "can’t swallow" sensation. Many patients just drink from a cup. Buy one or two; don’t build your life around a "feeding kit."',
      },
      { id: 'soft-food-stock', text: 'Soft/no-chew food stock', detail: 'See the diet section below.' },
      { id: 'rags-bibs', text: 'Rags / bibs / burp cloths', detail: 'Real need for the first 1–2 weeks (drooling, numb swollen lips).' },
    ],
  },
  {
    id: 'comfort',
    title: 'Comfort / sleep',
    intro: null,
    items: [
      {
        id: 'wedge-pillow',
        text: 'Wedge pillow or recliner access',
        status: 'inference',
        detail: 'Head-of-bed elevation is optional per Consult 1 ("can help with swelling; we keep post-op simple"). Nice to have, not mandated.',
      },
      { id: 'button-shirts', text: 'Button-front shirts — nothing pulled over the head' },
      { id: 'chapstick-etc', text: 'Chapstick, own pillow, phone charger, notepad', detail: 'Talking is hard early.' },
    ],
  },
]

export const MEDS_EXPECT = [
  {
    id: 'inpatient-meds',
    title: 'Inpatient / immediately post-op',
    notes: [
      { status: 'confirmed', text: 'Scheduled Tylenol + scheduled Toradol (ketorolac), plus oxycodone PRN (as needed).' },
      {
        status: 'confirmed',
        text: 'Most patients take only 1–2 doses of oxycodone total — this surgery is "surprisingly not painful" because you’re numb. It’s discomfort and congestion, not sharp pain.',
      },
      { status: 'confirmed', text: 'Sent home with a small amount of oxycodone as needed.' },
    ],
  },
  {
    id: 'antibiotics',
    title: 'Antibiotics',
    notes: [
      { status: 'confirmed', text: 'Pre-op dose + at least one week after, as pills.' },
      {
        status: 'confirmed',
        text: 'Dr. Dennis prefers pills because dosing is binary — a spilled liquid dose is an unknown dose. Your swallowing works; if your throat hurts it’s from the breathing tube (a sore throat from any surgery), not the jaw. "If that’s your complaint, we’ve totally won."',
      },
    ],
  },
  {
    id: 'swallowing-sensation',
    title: 'The swallowing sensation',
    notes: [
      {
        status: 'confirmed',
        text: 'For ~2 weeks it can feel like you can’t swallow — same weird feeling as an NG tube in the nose, or topical anesthetic running down your throat. The muscles all work. Push fluids anyway.',
      },
    ],
  },
]

export const DIET_RULE = {
  headline: '6 weeks of no chewing with your teeth. NOT 6 weeks of liquids.',
  headlineNote: 'This is the single most-corrected point from the earlier plan. Epic’s diet order may literally say "full liquid diet" because there’s no good order code for "no-chew" — ignore the label, follow the rule.',
  allowed: {
    status: 'confirmed',
    text: 'Anything you can safely swallow without your teeth doing work. "You can have a burger — just cut it up and swallow the pieces." Soft-scrambled eggs swallowed without chewing are fine.',
  },
  technique: {
    status: 'confirmed',
    text: 'Move the work from your jaw to before the food goes in. The oven is your friend — softens food. Fork and knife do the breaking-down. After a certain point you take the rubber bands off to eat, then put them back on.',
  },
  timeline: [
    { status: 'confirmed', text: 'Days 0–3: hydration only. That’s the entire goal early on. Getting fluids in is what gets you home and keeps you out of the ER.' },
    {
      status: 'confirmed',
      text: 'After that: calories + protein. It’ll be hard to keep up. Expect to lose 5–10 lb and some muscle — unavoidable, don’t try to train through it. You gain it back.',
    },
  ],
  beforeSurgery: {
    status: 'confirmed',
    text: 'Both consults said to deliberately gain some weight — you’re going to lose it, and you’re an endurance athlete without much reserve. Start now.',
  },
  stock:
    'Protein shakes, bone broth, Greek yogurt, applesauce, blended soups, mashed potatoes, oatmeal, smoothies, ricotta/cottage cheese, refried beans, hummus, avocado, soft tofu, well-cooked pasta (swallowed, not chewed), ice cream / pudding.',
  nutritionTarget: {
    status: 'inference',
    text: '~1.6–2.0 g protein per kg bodyweight to limit muscle loss (standard surgical-recovery range; not from the consults but consistent with their "keep a well-balanced diet as best you can").',
  },
}

export const SINUS_PRECAUTIONS = [
  { status: 'confirmed', text: 'No blowing your nose. No forceful backward pressure.' },
  { status: 'confirmed', text: 'Sneeze with your mouth open — do your best.' },
  { status: 'confirmed', text: 'Sinuses will drain blood for weeks; nose congested. Some blood-tinged drainage is normal.' },
]

export const ORAL_HYGIENE = [
  { status: 'confirmed', text: 'Brush normally, avoiding the incision area — incisions are high up and far back, easy to miss.' },
  { status: 'confirmed', text: 'Chlorhexidine rinse while brushing is difficult (swollen).' },
  { status: 'confirmed', text: 'Keep flossing — hard the first week, use picks if needed, easier after.' },
  { status: 'confirmed', text: 'Back to your normal routine within the post-op period, as long as you’re not putting pressure on the incisions.' },
]

export const RUNNING_NOTE = {
  intro: 'You asked to fold this into the journal. Here it is as a standing prompt.',
  whatSurgeonsSaid: {
    status: 'confirmed',
    text: 'Light exercise is fine at ~2 weeks. Consult 1: running "after the first week if you feel up to it… low-impact is totally fair game." Consult 2: "I’m okay after two weeks… you can start exercising after two weeks." The only hard constraints on movement: no bearing-down / heavy lifting until the bone heals (~6 weeks), and stop if the jaw hurts. Running was described as fine because the jaw is at rest and the teeth don’t touch — your normal resting jaw position is correct.',
  },
  whatYoureChoosing: {
    status: 'inference',
    text: '3–6 months off, by feel. The 2–3 week difference between "cleared" and your plan is immaterial to you.',
  },
  whatToLearn:
    'The gap between medically cleared and actually ready — for the jaw, the congestion, the sleep debt, the energy. Log, roughly weekly:',
  weeklyPrompts: [
    'Could I have run this week? (honest yes/no)',
    'What would have stopped me — jaw, breathing, energy, or just not wanting to?',
    'When did easy movement (walking, then more) start feeling good rather than like a chore?',
  ],
  closing: 'That record is worth more than any pre-written return-to-run schedule, because it’s yours.',
}
