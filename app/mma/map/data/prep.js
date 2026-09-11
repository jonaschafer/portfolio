// Prep · Meds · Diet — transcribed from "3 - prep-meds-diet.md".

export const PREP_SHOPPING = [
  {
    id: 'core',
    title: 'Core',
    intro: 'Dr. Dennis’s actual list is short: ibuprofen, Tylenol, ice packs, and "a very skilled helper at home" (covered). Everything else is convenience.',
    items: [
      {
        id: 'small-scissors',
        text: 'Small scissors — keep on you at all times',
        status: 'confirmed',
        detail:
          'If you feel like you’re going to vomit, or have any trouble breathing, cut your rubber bands right away, then call. Your jaws are held by plates and screws, not the bands — cutting them can’t hurt your surgery. Keep this page (or a photo of it) somewhere you can find it fast.',
      },
      { id: 'ibuprofen-tylenol', text: 'Ibuprofen + Tylenol (acetaminophen) — stocked, plenty' },
      {
        id: 'ice-packs',
        text: 'Face/jaw ice packs — 3, so one’s always frozen',
        status: 'confirmed',
        detail: 'Plus a couple of thin towels to wrap them in — numb skin can be injured by cold or heat without you feeling it.',
      },
      { id: 'chlorhexidine', text: 'Chlorhexidine rinse (they’ll prescribe) — pick up ahead' },
      { id: 'child-toothbrush', text: 'Child-sized soft toothbrush', detail: 'Fits where an adult brush can’t, for cleaning around braces near the incision.' },
      { id: 'prescriptions', text: 'Prescriptions filled ahead: pain meds, antibiotics, anti-nausea' },
      { id: 'saline-spray', text: 'Saline nasal spray — congestion relief when mouth-breathing is already limited' },
      { id: 'humidifier', text: 'Cool-mist humidifier — for the dried-out-throat, mouth-breathing stretch' },
      { id: 'stool-softener', text: 'Stool softener', status: 'confirmed', detail: 'Opioids and a liquid diet both cause constipation. Safe to start on day 1.' },
      { id: 'thermometer', text: 'Thermometer', status: 'confirmed', detail: 'Fever of 101.5°F (38.6°C) or higher is a call-the-office sign — see Red Flags.' },
      { id: 'lip-balm', text: 'Lip balm', detail: 'Lips will be dry and cracked for the first couple of weeks.' },
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
      {
        id: 'spare-bands',
        text: 'Spare rubber bands — keep sets in your bag, your car, and at work',
        status: 'confirmed',
        detail: 'If a hook breaks or you run out and can’t replace them, call — don’t just go without. Your bite can shift within a day or two.',
      },
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
    id: 'pain-control',
    title: 'Pain control at home',
    notes: [
      { status: 'confirmed', text: 'Take pain medicine on a schedule for the first 3–4 days rather than waiting for pain to build — it works much better that way.' },
      {
        status: 'confirmed',
        text: 'Total acetaminophen (Tylenol) from all sources must stay under 3,000mg in 24 hours. Your prescription pain medicine may already contain it — don’t add extra Tylenol, cold medicine, or a sleep aid without checking first. Too much can seriously damage your liver.',
      },
      { status: 'confirmed', text: 'The anti-inflammatory (ibuprofen / Toradol) is part of the plan, not a backup — take it on schedule. It treats swelling and jaw pain better than opioids do.' },
      { status: 'confirmed', text: 'Opioid pain medicine is for breakthrough pain only. Don’t drive, operate machinery, or drink alcohol while taking it. Return leftovers to a pharmacy take-back site.' },
      { status: 'confirmed', text: 'You may be given a steroid (such as dexamethasone) to reduce swelling. It can cause trouble sleeping, mood changes, and higher blood sugar for a few days.' },
    ],
  },
  {
    id: 'antibiotics',
    title: 'Antibiotics',
    notes: [
      { status: 'confirmed', text: 'Finish the entire prescription, even if you feel fine.' },
      {
        status: 'confirmed',
        text: 'Dr. Dennis prefers pills because dosing is binary — a spilled liquid dose is an unknown dose. Your swallowing works; if your throat hurts it’s from the breathing tube (a sore throat from any surgery), not the jaw. "If that’s your complaint, we’ve totally won."',
      },
    ],
  },
  {
    id: 'otc-meds',
    title: 'Over-the-counter — ask first',
    notes: [
      { status: 'confirmed', text: 'Oxymetazoline (Afrin) — for a blocked nose after upper jaw surgery. Do not use more than 3 days in a row; using it longer makes congestion worse, not better.' },
      { status: 'confirmed', text: 'Pseudoephedrine (Sudafed) — for sinus pressure. Don’t use if you have high blood pressure, heart rhythm problems, thyroid disease, or glaucoma without checking first.' },
      { status: 'confirmed', text: 'Saline nose spray — safe to use as often as you like; the better first choice for dryness and crusting.' },
      { status: 'confirmed', text: 'Stool softener — safe, start it on day 1.' },
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
    { status: 'confirmed', text: 'Days 1–10: liquid and blended only — no chewing at all. Blended soups, smoothies, milkshakes, yogurt, pudding, applesauce, thinned oatmeal, blended full meals, nutrition shakes.' },
    { status: 'confirmed', text: 'Days 10–21: soft food that needs no chewing, mashed with a fork first. Mashed potatoes, scrambled eggs, refried beans, well-cooked oatmeal, soft pasta cut small, soft rice dishes, cottage cheese, flaked soft fish.' },
    { status: 'confirmed', text: 'Weeks 3–6: still no chewing, but more variety of soft, no-chew food. Mac and cheese, soft casseroles, polenta, hummus, ricotta, well-cooked lentils, avocado, ripe banana, canned fruit, silken tofu, slow-cooked shredded meat mashed with gravy.' },
    { status: 'confirmed', text: 'Weeks 6–12: chewing begins — start with small, soft bites and advance slowly. Ground meat, soft chicken, soft cooked vegetables, soft bread without crust, then sandwiches and tender meats. Go back a step if your jaw aches.' },
    { status: 'confirmed', text: 'After 12 weeks: normal diet, once your surgeon clears you.' },
  ],
  beforeSurgery: {
    status: 'confirmed',
    text: 'Both consults said to deliberately gain some weight — you’re going to lose it, and you’re an endurance athlete without much reserve. Start now.',
  },
  stock:
    'Protein shakes, bone broth, Greek yogurt, applesauce, blended soups, mashed potatoes, oatmeal, smoothies, ricotta/cottage cheese, refried beans, hummus, avocado, soft tofu, well-cooked pasta (swallowed, not chewed), ice cream / pudding.',
  nutritionTarget: {
    status: 'confirmed',
    text: '60–80g of protein a day — 2 to 3 nutrition shakes is the easiest way to reach it. Eat 5–6 small meals instead of 3 large ones; you won’t manage enough in 3. Weigh yourself twice a week — call if you lose more than 10 lb, or more than 5% of your body weight.',
  },
  fluidTarget: {
    status: 'confirmed',
    text: '8–10 cups (2–2.5 liters) of fluid a day. Signs you’re not drinking enough: dark yellow urine, urinating less than every 6 hours, headache, dizziness when you stand, or a very dry mouth — call if these don’t improve once you increase fluids.',
  },
  foodsToAvoid: {
    status: 'confirmed',
    text: 'Until at least 3 months: pizza crust, bagels, hard rolls, raw apples and carrots, nuts, popcorn, chips, jerky, tough steak, gum, ice, and anything you’d need to tear or bite through with your front teeth. The rule for the first 6 weeks: if you have to chew it, don’t eat it.',
  },
}

export const SINUS_PRECAUTIONS = [
  { status: 'confirmed', text: 'No blowing your nose for 2 weeks. Blowing forces air into the healing bone and tissue and can cause sudden swelling, infection, or shift the jaw.' },
  { status: 'confirmed', text: 'Sneeze with your mouth wide open — never hold a sneeze in. Gently wipe or dab your nose instead of blowing it.' },
  { status: 'confirmed', text: 'No straws for the first 2 weeks. Avoid flying and scuba diving for 2 weeks too — same sinus-pressure risk.' },
  { status: 'confirmed', text: 'Sinuses will drain blood for weeks; nose congested and crusty for 1–3 weeks (from swelling, not mucus). Some blood-tinged drainage is normal.' },
  { status: 'confirmed', text: 'Your voice may sound different and your sense of smell may change for a few weeks — both return.' },
]

export const ORAL_HYGIENE = [
  { status: 'confirmed', text: 'Brush normally, avoiding the incision area — incisions are high up and far back, easy to miss. Some gum bleeding while brushing in the first 1–2 weeks is normal.' },
  { status: 'confirmed', text: 'Chlorhexidine rinse (usually 2×/day for 1–2 weeks) while brushing is difficult early on. It may temporarily stain your teeth — that cleans off later.' },
  { status: 'confirmed', text: 'Between meals, rinse gently with warm salt water — 1/2 teaspoon salt in 8 ounces of warm water. Let it sit, tip your head side to side, let it fall out. Don’t swish forcefully the first week.' },
  { status: 'confirmed', text: 'Do not use Listerine or any alcohol-based mouthwash — it burns healing tissue and slows it down.' },
  { status: 'confirmed', text: 'Use the irrigating syringe to gently flush food from around braces and incisions — aim alongside the incision, not directly at it, with light pressure. No water flosser (Waterpik) for the first 7 days; after that, start on the lowest setting.' },
  { status: 'confirmed', text: 'Keep flossing — hard the first week, use picks if needed, easier after. You may not reach the tongue side of your teeth at first; most people manage it by 2 weeks.' },
]

export const RUNNING_NOTE = {
  intro: 'You asked to fold this into the journal. Here it is as a standing prompt.',
  whatSurgeonsSaid: {
    status: 'confirmed',
    text: 'Light exercise is fine at ~2 weeks. Consult 1: running "after the first week if you feel up to it… low-impact is totally fair game." Consult 2: "I’m okay after two weeks… you can start exercising after two weeks." OHSU’s written instructions show a more conservative general table: walking only in week 1, longer walks/stationary bike/light cardio weeks 2–4 (stop if your face throbs — that’s blood pressure pushing on healing tissue), gradual return to running weeks 4–6. The only hard constraints on movement: no bearing-down / heavy lifting until the bone heals (~6 weeks), and stop if the jaw hurts. Running was described as fine because the jaw is at rest and the teeth don’t touch — your normal resting jaw position is correct.',
  },
  whatYoureChoosing: {
    status: 'confirmed',
    text: '2 weeks earliest, 6 weeks at the latest — using the verbal consults as the floor and OHSU’s written table as the ceiling, rather than picking one source and ignoring the other.',
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

// New sections below transcribed from OHSU's official "After Corrective Jaw
// Surgery" patient-instructions PDF (added to /jon/health in Dropbox,
// Sept 2026) — not present in the original consult notes.

export const PROTECT_NUMB_AREAS = {
  intro: 'Almost everyone has numbness after jaw surgery — the nerves that feel your lip, chin, cheek, and gums are stretched during surgery, not cut. You can’t feel heat, cold, or injury in a numb area, so it needs active protection.',
  items: [
    { status: 'confirmed', text: 'Test all hot drinks and heat packs on your neck or forearm first, not your face.' },
    { status: 'confirmed', text: 'Never put ice or a heat pack directly on skin — always wrap it in a thin towel.' },
    { status: 'confirmed', text: 'Be careful not to bite or chew your numb lip or cheek. Check in a mirror if something feels odd.' },
    { status: 'confirmed', text: 'Use lip balm often — lips will be dry and cracked for the first couple of weeks.' },
    { status: 'confirmed', text: 'Tingling, itching, and "pins and needles" are signs a nerve is waking up — a good sign, not a bad one.' },
  ],
}

export const RUBBER_BAND_CARE = {
  intro: 'Small rubber bands stretch between hooks on your braces to guide your bite — they’re not what holds your bones together (small plates and screws do that). A thin plastic splint, if you have one, has grooves your teeth should sit in once the bands are on.',
  wearSchedule: [
    { when: 'First 7 days', how: 'Worn tight to hold your bite steady. Do not remove them, except in an emergency.' },
    { when: 'Days 7–14', how: 'Worn at all times except when eating and cleaning your teeth. Replace them right after.' },
    { when: 'Weeks 2–6', how: 'Your surgeon adjusts the pattern and may reduce wear time — follow the plan given at each visit.' },
    { when: 'After week 6', how: 'Many patients move to nights only, then stop. Your surgeon and orthodontist decide together.' },
  ],
  rules: [
    { status: 'confirmed', text: 'Change to fresh bands at least once a day — used bands stretch out and stop working.' },
    { status: 'confirmed', text: 'Take a photo of your band pattern on day one so you have a reference.' },
    { status: 'confirmed', text: 'Keep spare bands in your bag, your car, and at work.' },
    { status: 'confirmed', text: 'If a hook breaks or you run out, call — don’t just go without. Your bite can shift within a day or two.' },
    { status: 'confirmed', text: 'If one band breaks and you can’t replace it, remove the matching band on the other side too. A single band on one side is worse than none.' },
    { status: 'confirmed', text: 'Don’t change the pattern, add extra bands, or use stronger bands on your own.' },
  ],
}

export const JAW_EXERCISES = {
  intro: 'Your jaw will feel stiff and tight from muscle guarding and swelling — it improves with gentle, gradual work. Rushing it can hurt; doing nothing lets the muscles tighten.',
  timeline: [
    { when: 'Days 0–10', goal: 'No target', how: 'No formal exercises. Gently move your jaw side to side and open slightly while your bands are out for meals.' },
    { when: 'Days 10–28', goal: '~20–25mm (roughly 1 finger)', how: 'In front of a mirror: open and close, side to side, forward and back. Muscles only — do not press with your fingers yet. Moist warmth first makes this easier.' },
    { when: 'Weeks 4–8', goal: '~30–35mm (roughly 2 fingers)', how: 'Add gentle finger stretching between the front teeth. Hold a comfortable stretch 30 seconds, 5 reps, 3–4×/day. Should feel like a pull, never a sharp pain.' },
    { when: 'Weeks 8–12', goal: '~35–40mm (roughly 3 fingers)', how: 'Continue stretching daily until your opening stops improving.' },
  ],
  callIf: [
    'You cannot open more than about 20mm (one finger width) at your 4-week visit.',
    'Your opening gets worse instead of better.',
    'Your jaw locks, or you hear a new grinding or catching.',
  ],
  tip: 'Stack tongue depressors, or use a small ruler at your front teeth, and write your number down each week so you can see progress.',
  jointDiscomfort:
    'Aching or pressure in front of your ears is common — it can feel like an earache, from the jaw joints adapting to their new position, and usually settles over 2–4 weeks. Moist heat and gentle movement help; the scheduled anti-inflammatory works better for this than opioids. Tell your surgeon if it’s severe, worsening, lasts beyond 6 weeks, or comes with locking or a bite change.',
}

export const SHOWER_GUIDANCE = {
  status: 'confirmed',
  text: 'If all of your incisions are inside your mouth, you can shower, bathe, and wash your hair as soon as you feel steady enough — no waiting period. Have someone nearby for your first shower; light-headedness is common in the first few days. Keep the water warm rather than hot — hot water increases swelling and can burn numb skin.',
}
