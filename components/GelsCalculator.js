'use client'

import { useMemo, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import { THEMES } from '../lib/themes'

/**
 * Base recipe = one 500ml flask = exactly 4 hr (~90 g/hr).
 * Everything scales linearly off this: scale = hours / 4.
 * Carbs = fructose + maltodextrin. Water + pectin are the carrier.
 */
const BASE = {
  fructose: 125,
  maltodextrin: 250,
  water: 300,
  pectinTsp: 0.25,
}
const BASE_HOURS = 4
const CARBS_PER_BATCH = BASE.fructose + BASE.maltodextrin // 375 g
const MASS_PER_BATCH = BASE.fructose + BASE.maltodextrin + BASE.water // 675 g
const CARB_FRACTION = CARBS_PER_BATCH / MASS_PER_BATCH // ~0.5556
/** One 500ml flask holds one base batch of gel. */
const FLASK_CAPACITY_G = MASS_PER_BATCH

const HOURS_MIN = 2
const HOURS_MAX = 14

const RECIPE_SOURCE = 'https://www.youtube.com/watch?v=Dj4oYcRLxEo'
const FRUCTOSE_LINK = 'https://www.amazon.com/dp/B0799XXRZK?th=1'
const MALTODEXTRIN_LINK = 'https://www.amazon.com/dp/B01H4BTWGA?th=1'
const PECTIN_LINK = 'https://www.amazon.com/dp/B09DTK9BVN'

// Sodium — sweat loss is fixed.
const SWEAT_LOSS = 1100 // mg/hr
const DEFAULT_TARGET_PCT = 75
const SALTSTICK_MG_PER_CAP = 215 // SaltStick Electrolyte Capsules w/ Vitamin D
const PN_TAB_MG = 750 // Precision effervescent tab in a 500ml flask

// Flasks (empty mass)
const FLASKS = {
  salomon: { label: 'Salomon Soft Flask 500ml', grams: 33 },
  hydrapak: { label: 'HydraPak 500ml', grams: 32 },
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

/** Round grams to nearest 5 for a clean kitchen-scale number. */
function fmtGrams(value) {
  return `${Math.round(value / 5) * 5}g`
}

/** Format a tsp amount to the nearest 1/16 tsp as a mixed fraction. */
function fmtTsp(value) {
  const rounded = Math.round(value * 16) / 16
  const whole = Math.floor(rounded + 1e-9)
  let sixteenths = Math.round((rounded - whole) * 16)
  if (sixteenths === 16) return `${whole + 1} tsp`
  if (sixteenths === 0) return `${whole} tsp`
  const g = gcd(sixteenths, 16)
  const n = sixteenths / g
  const d = 16 / g
  if (whole === 0) return `${n}/${d} tsp`
  return `${whole} ${n}/${d} tsp`
}

function sliderPct(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

function parseNum(str) {
  if (str == null || String(str).trim() === '') return null
  const n = parseFloat(String(str).trim().replace(/,/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : null
}

// ---- Site register, cobalt theme ----
// Fixed to the Blue theme from lib/themes.js rather than dealt per load, so
// the calculator always reads the same. Colors live as CSS vars on the root:
// --g-ink for type and outlines, --g-bg for the field, --g-rule for hairlines.
const T = THEMES[5]
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

const LABEL = 'text-[15px] md:text-[16px] leading-[1.2] tracking-[0.17px] opacity-70'
const SMALL = 'text-[14px] md:text-[15px] leading-[1.3] tracking-[0.15px] opacity-70'
const BIG = 'text-[44px] md:text-[56px] leading-[0.95] tabular-nums tracking-[0.3px]'
const MID = 'text-[30px] md:text-[36px] leading-[0.95] tabular-nums tracking-[0.3px]'
// A card is a hairline top rule in the ink at 25%, then content.
const CARD = 'border-t border-[color:var(--g-rule)] pt-[16px] md:pt-[20px] w-full min-w-0'
const SECTION_H = `${ultra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`
const PRESS = 'active:scale-[0.97] motion-reduce:active:scale-100'
const PILL = `rounded-[4px] border border-[color:var(--g-ink)] px-[10px] py-[7px] md:py-[8px] text-[15px] md:text-[16px] leading-none tracking-[0.17px] transition-colors duration-[140ms] ease-out ${PRESS}`
const PILL_OFF = 'bg-transparent text-[color:var(--g-ink)] g-hover-fill'
const PILL_ON = 'bg-[color:var(--g-ink)] text-[color:var(--g-bg)]'
const STEPPER = `w-[36px] h-[36px] rounded-full border border-[color:var(--g-ink)] text-[18px] leading-none flex items-center justify-center transition-colors duration-[140ms] ease-out g-hover-fill disabled:opacity-35 disabled:cursor-not-allowed ${PRESS}`
const INPUT =
  'rounded-[4px] border border-[color:var(--g-rule)] bg-transparent px-[10px] py-[9px] text-[17px] md:text-[18px] leading-none tabular-nums text-[color:var(--g-ink)] outline-none transition-colors duration-[140ms] focus:border-[color:var(--g-ink)] placeholder:text-[color:var(--g-rule)]'

function Slider({ value, min, max, step, onChange, ariaLabel }) {
  const pct = sliderPct(value, min, max)
  return (
    <div className="relative mt-[18px] h-[28px]">
      <div className="absolute left-0 right-0 top-[13px] h-[2px] bg-[color:var(--g-rule)]" />
      <div className="absolute left-0 top-[13px] h-[2px] bg-[color:var(--g-ink)]" style={{ width: `${pct}%` }} />
      <div
        className="absolute top-[4px] w-[20px] h-[20px] rounded-full bg-[color:var(--g-ink)]"
        style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="g-range absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={ariaLabel}
      />
    </div>
  )
}

export default function GelsCalculator() {
  // Recipe scaler — run length is the only driver (90 g/hr is baked in).
  const [hours, setHours] = useState(4)

  // Sodium
  const [targetPct, setTargetPct] = useState(DEFAULT_TARGET_PCT)
  const [sCapsPerHour, setSCapsPerHour] = useState(3)
  const [pnTabsPerHour, setPnTabsPerHour] = useState(1)

  // Leftover weigh-in
  const [flaskType, setFlaskType] = useState('salomon')
  const [leftoverStr, setLeftoverStr] = useState('')
  const [runHoursStr, setRunHoursStr] = useState('')
  const [runMinutesStr, setRunMinutesStr] = useState('')

  // --- Recipe math (continuous, no rounding to whole batches) ---
  const recipe = useMemo(() => {
    const scale = hours / BASE_HOURS
    const totalCarbs = CARBS_PER_BATCH * scale
    const totalMass = MASS_PER_BATCH * scale
    const flasks = Math.max(1, Math.ceil(totalMass / FLASK_CAPACITY_G - 1e-9))
    const lastFlaskFillPct =
      (totalMass - (flasks - 1) * FLASK_CAPACITY_G) / FLASK_CAPACITY_G
    const ingredients = [
      {
        label: 'Fructose',
        amount: fmtGrams(BASE.fructose * scale),
        link: FRUCTOSE_LINK,
      },
      {
        label: 'Maltodextrin',
        amount: fmtGrams(BASE.maltodextrin * scale),
        link: MALTODEXTRIN_LINK,
      },
      { label: 'Water', amount: fmtGrams(BASE.water * scale), link: null },
      {
        label: 'Pectin',
        amount: fmtTsp(BASE.pectinTsp * scale),
        link: PECTIN_LINK,
      },
    ]
    return {
      scale,
      totalCarbs,
      totalMass,
      flasks,
      lastFlaskFillPct,
      ingredients,
    }
  }, [hours])

  // --- Sodium math (sweat loss fixed at 1100) ---
  const sodium = useMemo(() => {
    const targetMg = (SWEAT_LOSS * targetPct) / 100
    const sCapsMg = sCapsPerHour * SALTSTICK_MG_PER_CAP
    const pnMg = pnTabsPerHour * PN_TAB_MG
    const cov = (mg) => (mg / SWEAT_LOSS) * 100
    return {
      targetMg,
      sCapsMg,
      sCapsCoverage: cov(sCapsMg),
      sCapsMeetsTarget: sCapsMg >= targetMg,
      pnMg,
      pnCoverage: cov(pnMg),
      pnMeetsTarget: pnMg >= targetMg,
    }
  }, [targetPct, sCapsPerHour, pnTabsPerHour])

  // --- Leftover weigh-in math ---
  const weighIn = useMemo(() => {
    const flaskG = FLASKS[flaskType].grams
    // Started with = gel mass straight from the recipe above.
    const startGel = recipe.totalMass
    const leftoverReading = parseNum(leftoverStr)

    const runH = (() => {
      const n = parseInt(runHoursStr, 10)
      return Number.isFinite(n) && n >= 0 ? n : 0
    })()
    const runM = (() => {
      const n = parseInt(runMinutesStr, 10)
      return Number.isFinite(n) && n >= 0 ? Math.min(59, n) : 0
    })()
    const runDuration = runH + runM / 60

    if (leftoverReading == null) {
      return { flaskG, startGel, runH, runM, runDuration, ready: false }
    }

    const leftoverGel = leftoverReading - flaskG
    const consumedGel = startGel - leftoverGel
    const carbsConsumed = consumedGel >= 0 ? consumedGel * CARB_FRACTION : null
    const carbsPerHr =
      carbsConsumed != null && runDuration > 0
        ? carbsConsumed / runDuration
        : null

    let warning = null
    if (leftoverGel < -0.5) {
      warning =
        'Leftover reading minus the empty flask is negative. Check the flask type or the scale reading.'
    } else if (consumedGel < 0) {
      warning =
        'Leftover gel is more than the recipe made. Wrong flask, a refill, or a typo?'
    }

    return {
      flaskG,
      startGel,
      leftoverGel,
      consumedGel,
      carbsConsumed,
      carbsPerHr,
      runH,
      runM,
      runDuration,
      warning,
      ready: true,
    }
  }, [flaskType, leftoverStr, runHoursStr, runMinutesStr, recipe.totalMass])

  const hoursLabel =
    Math.abs(hours - Math.round(hours)) < 0.05
      ? String(Math.round(hours))
      : hours.toFixed(1)

  return (
    <div
      className={`${social} min-h-screen min-w-0 overflow-x-hidden antialiased`}
      style={{ backgroundColor: T.bg, color: T.ink, '--g-bg': T.bg, '--g-ink': T.ink, '--g-rule': `${T.ink}40` }}
    >
      <style jsx global>{`
        html,
        body {
          background: ${T.bg};
        }
        :root {
          --page-bg: ${T.bg};
          --page-ink: ${T.ink};
        }
        @media (hover: hover) and (pointer: fine) {
          .g-hover-fill:not(:disabled):hover {
            background-color: var(--g-ink);
            color: var(--g-bg);
          }
        }
        .g-range:focus-visible + *,
        .g-range:focus-visible {
          outline: none;
        }
        .g-focus:focus-visible,
        button:focus-visible {
          outline: 2px solid var(--g-ink);
          outline-offset: 3px;
        }
      `}</style>

      <Navigation backgroundColor={T.bg} textColor={T.ink} />

      <main className="w-full min-w-0 px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
        {/* Statement */}
        <header className="pt-[32px] pb-[48px] md:pt-[100px] md:pb-[80px] max-w-[1100px]">
          <h1 className={`${nichrome} text-[24px] md:text-[40px] desktop:text-[54px] leading-[1.15] tracking-[0.2px]`}>
            Gels. Pick your run time, and how much sodium you need, and blend this bad boy together.
          </h1>
          <p className={`${SMALL} mt-[16px] md:mt-[20px] max-w-[620px]`}>
            One 500ml flask is 4 hours at about 90 g/hr. Everything scales from there.
          </p>
        </header>

        {/* ============ RECIPE ============ */}
        <section className="mb-[72px] md:mb-[104px]">
          <h2 className={SECTION_H}>Recipe</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
            {/* Inputs */}
            <div className={CARD}>
              <div className="flex justify-between items-baseline gap-4">
                <span className={LABEL}>Run length</span>
                <span className="text-[22px] md:text-[24px] leading-none tabular-nums">{hoursLabel} hr</span>
              </div>
              <Slider value={hours} min={HOURS_MIN} max={HOURS_MAX} step={0.5} onChange={setHours} ariaLabel="Run length in hours" />
              <div className="mt-[16px] flex flex-wrap gap-[8px]">
                {[
                  { label: '3 hr', h: 3 },
                  { label: '4 hr', h: 4 },
                  { label: '6 hr', h: 6 },
                  { label: '8 hr', h: 8 },
                  { label: '12 hr', h: 12 },
                  { label: '50mi ~14h', h: 14 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setHours(p.h)}
                    aria-pressed={Math.abs(hours - p.h) < 0.001}
                    className={`${PILL} ${Math.abs(hours - p.h) < 0.001 ? PILL_ON : PILL_OFF}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="mt-[40px] grid grid-cols-2 gap-[24px]">
                <div className="border-t border-[color:var(--g-rule)] pt-[12px]">
                  <div className={LABEL}>Total carbs</div>
                  <div className={`${BIG} mt-[10px]`}>{Math.round(recipe.totalCarbs).toLocaleString()}g</div>
                  <div className={`${SMALL} mt-[8px]`}>≈90 g/hr · {hoursLabel} hr</div>
                </div>
                <div className="border-t border-[color:var(--g-rule)] pt-[12px]">
                  <div className={LABEL}>500ml flasks</div>
                  <div className={`${BIG} mt-[10px]`}>{recipe.flasks}</div>
                  <div className={`${SMALL} mt-[8px]`}>
                    {recipe.flasks === 1
                      ? `${Math.round(recipe.lastFlaskFillPct * 100)}% full`
                      : `last one ~${Math.round(recipe.lastFlaskFillPct * 100)}% full`}
                  </div>
                </div>
              </div>
            </div>

            {/* Scaled ingredient list */}
            <div className={`${CARD} flex flex-col`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className={LABEL}>Make this</span>
                <span className={`${SMALL} tabular-nums`}>{(Math.round(recipe.scale * 100) / 100).toFixed(2)}× base</span>
              </div>
              <p className={`${SMALL} mt-[6px] mb-[12px]`}>
                {Math.round(recipe.totalMass).toLocaleString()}g gel total · {Math.round(recipe.totalCarbs).toLocaleString()}g
                carbs. Mix one batch, split across {recipe.flasks} flask{recipe.flasks === 1 ? '' : 's'}.
              </p>

              <ul>
                {recipe.ingredients.map((ing) => (
                  <li
                    key={ing.label}
                    className="flex items-baseline justify-between gap-3 py-[12px] border-b border-[color:var(--g-rule)] last:border-b-0"
                  >
                    <span className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">
                      {ing.link ? (
                        <a href={ing.link} target="_blank" rel="noreferrer" className="hl">
                          {ing.label}
                        </a>
                      ) : (
                        ing.label
                      )}
                    </span>
                    <span className="text-[20px] md:text-[21px] leading-[1.2] tabular-nums">{ing.amount}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-[20px] pt-[16px] border-t border-[color:var(--g-rule)] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]">
                <p className={`${nichrome} italic mb-[4px]`}>Method:</p>
                <p>
                  Mix dry together. Pour dry into wet in batches, stir with a whisk. Clumps are fine. Fill 500ml flask,
                  fridge. Lasts 3 to 5 days.
                </p>
                <p className="mt-[12px]">
                  <span className={`${nichrome} italic`}>Source:</span>{' '}
                  <a href={RECIPE_SOURCE} target="_blank" rel="noreferrer" className="hl break-all">
                    youtube.com/watch?v=Dj4oYcRLxEo
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SODIUM ============ */}
        <section className="mb-[72px] md:mb-[104px]">
          <h2 className={SECTION_H}>Sodium</h2>

          {/* target (sweat loss fixed at 1100) */}
          <div className={`${CARD} mb-[48px] md:mb-[64px]`}>
            <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-2">
              <div>
                <span className={LABEL}>Replacement target</span>
                <div className={`${SMALL} mt-[4px]`}>
                  Share of {SWEAT_LOSS} mg/hr sweat loss to replace. About 75% is realistic.
                </div>
              </div>
              <span className="text-[22px] md:text-[24px] leading-none tabular-nums shrink-0">
                {targetPct}% · {Math.round(sodium.targetMg)} mg/hr
              </span>
            </div>
            <Slider
              value={targetPct}
              min={50}
              max={100}
              step={5}
              onChange={(v) => setTargetPct(v)}
              ariaLabel="Sodium replacement target percent"
            />
          </div>

          {/* two source cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
            <SodiumCard
              title="SaltStick caps"
              subtitle="Long training runs, alongside aid-station food."
              perUnitLabel={`${SALTSTICK_MG_PER_CAP} mg sodium per cap`}
              unit="cap"
              count={sCapsPerHour}
              setCount={setSCapsPerHour}
              maxCount={5}
              mg={sodium.sCapsMg}
              coverage={sodium.sCapsCoverage}
              meetsTarget={sodium.sCapsMeetsTarget}
              note="Tried 4/hr (860 mg) and it was fine."
            />
            <SodiumCard
              title="Precision tab"
              subtitle="Races. Effervescent tab in the 500ml flask."
              perUnitLabel={`${PN_TAB_MG} mg sodium per tab`}
              unit="tab"
              count={pnTabsPerHour}
              setCount={setPnTabsPerHour}
              maxCount={3}
              mg={sodium.pnMg}
              coverage={sodium.pnCoverage}
              meetsTarget={sodium.pnMeetsTarget}
              note="One tab per 500ml flask, about one flask per hour."
            />
          </div>
        </section>

        {/* ============ LEFTOVER WEIGH-IN ============ */}
        <section>
          <h2 className={SECTION_H}>Leftover weigh-in</h2>

          <div className={CARD}>
            <p className="mb-[24px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px] max-w-[680px]">
              Weigh the leftover flask after your run. Pick the flask type to subtract its empty weight, and enter your
              run time to see the carbs you actually took per hour. The starting gel comes from the recipe above.
            </p>

            {/* Started-with, on one line, from the recipe above */}
            <div className="mb-[28px] flex flex-wrap items-baseline gap-x-[8px] gap-y-1">
              <span className={`${nichrome} italic text-[16px] md:text-[17px]`}>Started with:</span>
              <span className="text-[20px] md:text-[21px] leading-none tabular-nums">{Math.round(weighIn.startGel)}g gel</span>
              <span className={SMALL}>
                from the recipe above ({hoursLabel} hr, {recipe.flasks} flask{recipe.flasks === 1 ? '' : 's'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px]">
              {/* Flask type */}
              <div className="flex flex-col gap-[6px] min-w-0">
                <span className={LABEL}>Flask</span>
                <div className="mt-[2px] flex flex-col gap-[8px]">
                  {Object.entries(FLASKS).map(([key, f]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFlaskType(key)}
                      aria-pressed={flaskType === key}
                      className={`${PILL} py-[9px] md:py-[9px] leading-[1.2] text-left ${flaskType === key ? PILL_ON : PILL_OFF}`}
                    >
                      {f.label}
                      <span className="block tabular-nums opacity-70">{f.grams}g empty</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leftover reading */}
              <label className="flex flex-col gap-[6px] min-w-0">
                <span className={LABEL}>Leftover on scale (g)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="flask + gel"
                  value={leftoverStr}
                  onChange={(e) => setLeftoverStr(e.target.value)}
                  className={`${INPUT} mt-[2px]`}
                />
                <span className={SMALL}>Whole leftover flask, gel inside.</span>
              </label>

              {/* Run time */}
              <div className="flex flex-col gap-[6px] min-w-0">
                <span className={LABEL}>Run time</span>
                <div className="mt-[2px] flex items-end gap-[8px]">
                  <label className="flex flex-col gap-[4px]">
                    <span className={SMALL}>Hr</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={runHoursStr}
                      onChange={(e) => setRunHoursStr(e.target.value)}
                      className={`${INPUT} w-[72px]`}
                    />
                  </label>
                  <label className="flex flex-col gap-[4px]">
                    <span className={SMALL}>Min</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={runMinutesStr}
                      onChange={(e) => setRunMinutesStr(e.target.value)}
                      className={`${INPUT} w-[72px]`}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Results */}
            {weighIn.ready && (
              <dl className="mt-[32px] text-[17px] md:text-[18px] leading-[1.2] tracking-[0.17px]">
                <div className="flex justify-between items-baseline gap-3 py-[10px] border-t border-[color:var(--g-rule)]">
                  <dt className="opacity-70 min-w-0">Gel remaining (scale − {weighIn.flaskG}g flask)</dt>
                  <dd className="tabular-nums shrink-0">{Math.round(weighIn.leftoverGel)}g</dd>
                </div>
                <div className="flex justify-between items-baseline gap-3 py-[10px] border-t border-[color:var(--g-rule)]">
                  <dt className="opacity-70 min-w-0">Gel consumed</dt>
                  <dd className="tabular-nums shrink-0">
                    {weighIn.consumedGel >= 0 ? `${Math.round(weighIn.consumedGel)}g` : '–'}
                  </dd>
                </div>
                <div className="flex justify-between items-baseline gap-3 py-[10px] border-t border-[color:var(--g-rule)]">
                  <dt className="opacity-70 min-w-0">Carbs consumed (gel × {Math.round(CARB_FRACTION * 100)}%)</dt>
                  <dd className="tabular-nums shrink-0">
                    {weighIn.carbsConsumed != null ? `${Math.round(weighIn.carbsConsumed)}g` : '–'}
                  </dd>
                </div>
                {weighIn.runDuration > 0 && (
                  <div className="flex justify-between items-baseline gap-3 py-[10px] border-t border-[color:var(--g-rule)]">
                    <dt className="opacity-70 min-w-0">Run duration</dt>
                    <dd className="tabular-nums shrink-0">
                      {weighIn.runH}h {weighIn.runM}m ({(Math.round(weighIn.runDuration * 100) / 100).toFixed(2)} h)
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-baseline gap-3 pt-[16px] mt-[4px] border-t border-[color:var(--g-ink)]">
                  <dt className={`${nichrome} italic min-w-0`}>Carbs/hr:</dt>
                  <dd className={`${MID} shrink-0`}>
                    {weighIn.carbsPerHr != null ? `${(Math.round(weighIn.carbsPerHr * 10) / 10).toFixed(1)} g/hr` : '–'}
                  </dd>
                </div>
              </dl>
            )}

            {weighIn.ready && weighIn.warning && (
              <p className="mt-[20px] rounded-[4px] border border-[color:var(--g-ink)] px-[12px] py-[10px] text-[16px] md:text-[17px] leading-[1.3]">
                {weighIn.warning}
              </p>
            )}
            {weighIn.ready && !weighIn.warning && weighIn.runDuration <= 0 && weighIn.consumedGel >= 0 && (
              <p className={`${SMALL} mt-[12px]`}>Enter run hours and/or minutes to see carbs per hour.</p>
            )}
          </div>
        </section>
      </main>

      <Footer colophon theme={T} />
    </div>
  )
}

function SodiumCard({ title, subtitle, perUnitLabel, unit, count, setCount, maxCount, mg, coverage, meetsTarget, note }) {
  return (
    <div className={`${CARD} flex flex-col`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[20px] md:text-[21px] leading-[1.2] tracking-[0.21px]">{title}</span>
        {/* Status is filled vs outlined in the ink, never a red/green pair. */}
        <span
          className={`rounded-[4px] border border-[color:var(--g-ink)] px-[8px] py-[3px] text-[14px] leading-[1.2] ${
            meetsTarget ? 'bg-[color:var(--g-ink)] text-[color:var(--g-bg)]' : ''
          }`}
        >
          {meetsTarget ? 'Meets target' : 'Below target'}
        </span>
      </div>
      <p className="mt-[6px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]">{subtitle}</p>
      <p className={`${SMALL} mt-[2px]`}>{perUnitLabel}</p>

      <div className="mt-[20px] flex items-center gap-[12px]">
        <button
          type="button"
          aria-label={`Less ${unit}s per hour`}
          disabled={count <= 0}
          onClick={() => setCount(Math.max(0, count - 1))}
          className={STEPPER}
        >
          −
        </button>
        <span className="text-[18px] md:text-[19px] tabular-nums min-w-[90px] text-center">
          {count} {unit}
          {count === 1 ? '' : 's'}/hr
        </span>
        <button
          type="button"
          aria-label={`More ${unit}s per hour`}
          disabled={count >= maxCount}
          onClick={() => setCount(Math.min(maxCount, count + 1))}
          className={STEPPER}
        >
          +
        </button>
      </div>

      <div className="mt-[24px] grid grid-cols-2 gap-[24px]">
        <div className="border-t border-[color:var(--g-rule)] pt-[12px]">
          <div className={LABEL}>Sodium</div>
          <div className={`${MID} mt-[10px]`}>
            {Math.round(mg)}
            <span className="text-[16px] opacity-70"> mg/hr</span>
          </div>
        </div>
        <div className="border-t border-[color:var(--g-rule)] pt-[12px]">
          <div className={LABEL}>Coverage</div>
          <div className={`${MID} mt-[10px]`}>
            {Math.round(coverage)}
            <span className="text-[16px] opacity-70">%</span>
          </div>
        </div>
      </div>
      <p className={`${SMALL} mt-[16px]`}>{note}</p>
    </div>
  )
}
