'use client'

import { useMemo, useState } from 'react'

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

// ---- Soft visual tokens ----
const LABEL =
  'uppercase text-[10px] tracking-[0.18em] text-neutral-400 font-medium'
const CARD =
  'bg-white rounded-[28px] shadow-[0_18px_50px_-24px_rgba(60,52,44,0.35)] ring-1 ring-black/[0.03] p-6 sm:p-7 w-full min-w-0 box-border'
const CARD_SOFT =
  'bg-[#f5f2ee] rounded-[28px] shadow-[0_14px_44px_-26px_rgba(60,52,44,0.30)] p-6 sm:p-7 w-full min-w-0 box-border'
const PILL = 'rounded-full px-4 py-2 text-[12px] transition-colors duration-200'
const PILL_OFF =
  'bg-[#eae6e1] text-neutral-500 hover:bg-[#e1dcd5] backdrop-blur-sm'
const PILL_ON = 'bg-neutral-700 text-white shadow-sm'
const STEPPER =
  'w-9 h-9 rounded-full bg-[#eae6e1] text-neutral-600 text-[18px] leading-none flex items-center justify-center transition-colors duration-200 hover:bg-neutral-700 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#eae6e1] disabled:hover:text-neutral-600'
const INPUT =
  'rounded-2xl bg-[#f4f1ed] px-3 py-2.5 text-[14px] text-neutral-700 tabular-nums outline-none transition-shadow focus:ring-2 focus:ring-neutral-300 placeholder:text-neutral-300'

function Slider({ value, min, max, step, onChange, ariaLabel }) {
  const pct = sliderPct(value, min, max)
  return (
    <div className="relative mt-4 h-[28px]">
      <div className="absolute left-0 right-0 top-[11px] h-[6px] bg-[#e7e2db] rounded-full" />
      <div
        className="absolute left-0 top-[11px] h-[6px] bg-neutral-400 rounded-full"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full shadow-[0_3px_10px_rgba(60,52,44,0.22)] ring-1 ring-black/[0.04]"
        style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
        'Leftover reading minus the empty flask is negative — check the flask type or the scale reading.'
    } else if (consumedGel < 0) {
      warning =
        'Leftover gel is more than the recipe made — wrong flask, refill, or a typo?'
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
    <div className="font-sans bg-[#edeae5] text-neutral-600 min-h-screen min-w-0 overflow-x-hidden antialiased">
      <style jsx global>{`
        html,
        body {
          background: #edeae5;
        }
      `}</style>

      <main className="w-full max-w-[1100px] mx-auto min-w-0 px-5 md:px-8 lg:px-[60px] pt-24 pb-24 md:pt-[120px]">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <h1 className="text-[40px] md:text-[54px] leading-[1.02] font-medium tracking-tight text-neutral-700">
            Gels
          </h1>
          <p className="mt-4 text-[13px] md:text-[15px] text-neutral-400 max-w-[620px] leading-[1.7]">
            Scale my fructose / maltodextrin gel recipe by run length, plan
            sodium, and back-calculate carbs/hr from a leftover weigh-in. Base
            recipe is one 500ml flask = 4 hr at ~90 g/hr; everything scales from
            there.
          </p>
        </header>

        {/* ============ RECIPE ============ */}
        <section className="mb-10 md:mb-14">
          <h2 className={`${LABEL} mb-4 ml-1`}>Recipe</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Inputs */}
            <div className={CARD}>
              <div className="flex justify-between items-start gap-4">
                <span className={LABEL}>Run length</span>
                <span className="text-[22px] leading-none tabular-nums font-light text-neutral-700">
                  {hoursLabel} hr
                </span>
              </div>
              <Slider
                value={hours}
                min={HOURS_MIN}
                max={HOURS_MAX}
                step={0.5}
                onChange={setHours}
                ariaLabel="Run length in hours"
              />
              <div className="mt-4 flex flex-wrap gap-2">
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
                    className={`${PILL} ${
                      Math.abs(hours - p.h) < 0.001 ? PILL_ON : PILL_OFF
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="mt-9 grid grid-cols-2 gap-5">
                <div>
                  <div className={LABEL}>Total carbs</div>
                  <div className="mt-2 text-[44px] leading-none tabular-nums font-light text-neutral-700">
                    {Math.round(recipe.totalCarbs).toLocaleString()}g
                  </div>
                  <div className="mt-2 text-[11px] text-neutral-400">
                    ≈90 g/hr · {hoursLabel} hr
                  </div>
                </div>
                <div>
                  <div className={LABEL}>500ml flasks</div>
                  <div className="mt-2 text-[44px] leading-none tabular-nums font-light text-neutral-700">
                    {recipe.flasks}
                  </div>
                  <div className="mt-2 text-[11px] text-neutral-400">
                    {recipe.flasks === 1
                      ? `${Math.round(recipe.lastFlaskFillPct * 100)}% full`
                      : `last one ~${Math.round(
                          recipe.lastFlaskFillPct * 100
                        )}% full`}
                  </div>
                </div>
              </div>
            </div>

            {/* Scaled ingredient list */}
            <div className={`${CARD_SOFT} flex flex-col`}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className={LABEL}>Make this</span>
                <span className="text-[11px] text-neutral-400 tabular-nums">
                  {(Math.round(recipe.scale * 100) / 100).toFixed(2)}× base
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-5 leading-[1.6]">
                {Math.round(recipe.totalMass).toLocaleString()}g gel total ·{' '}
                {Math.round(recipe.totalCarbs).toLocaleString()}g carbs. Mix one
                batch, split across {recipe.flasks} flask
                {recipe.flasks === 1 ? '' : 's'}.
              </p>

              <ul className="divide-y divide-neutral-300/40">
                {recipe.ingredients.map((ing) => (
                  <li
                    key={ing.label}
                    className="flex items-baseline justify-between gap-3 py-3"
                  >
                    <span className="text-[15px] text-neutral-600">
                      {ing.link ? (
                        <a
                          href={ing.link}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-neutral-300 underline-offset-[3px] hover:decoration-neutral-500 transition-colors"
                        >
                          {ing.label}
                        </a>
                      ) : (
                        ing.label
                      )}
                    </span>
                    <span className="text-[17px] tabular-nums font-light text-neutral-700">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-5 border-t border-neutral-300/40 text-[12px] text-neutral-500 leading-[1.7]">
                <p className="font-medium text-neutral-600 mb-1">Method</p>
                <p>
                  Mix dry together. Pour dry into wet in batches, stir with a
                  whisk. Clumps are fine. Fill 500ml flask, fridge. Lasts 3–5
                  days.
                </p>
                <p className="mt-3">
                  Recipe source:{' '}
                  <a
                    href={RECIPE_SOURCE}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-neutral-300 underline-offset-[3px] hover:decoration-neutral-500 break-all transition-colors"
                  >
                    youtube.com/watch?v=Dj4oYcRLxEo
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SODIUM ============ */}
        <section className="mb-10 md:mb-14">
          <h2 className={`${LABEL} mb-4 ml-1`}>Sodium</h2>

          {/* target (sweat loss fixed at 1100) */}
          <div className={`${CARD} mb-5`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={LABEL}>Replacement target</span>
                <div className="mt-2 text-[11px] text-neutral-400 leading-[1.6]">
                  % of {SWEAT_LOSS} mg/hr sweat loss to replace (~75%
                  realistic).
                </div>
              </div>
              <span className="text-[18px] leading-none tabular-nums font-light text-neutral-700 shrink-0">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SodiumCard
              title="SaltStick caps"
              subtitle="Long training runs — alongside aid-station food."
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
              subtitle="Races — effervescent tab in the 500ml flask."
              perUnitLabel={`${PN_TAB_MG} mg sodium per tab`}
              unit="tab"
              count={pnTabsPerHour}
              setCount={setPnTabsPerHour}
              maxCount={3}
              mg={sodium.pnMg}
              coverage={sodium.pnCoverage}
              meetsTarget={sodium.pnMeetsTarget}
              note="One tab per 500ml flask, ~one flask per hour."
            />
          </div>
        </section>

        {/* ============ LEFTOVER WEIGH-IN ============ */}
        <section className="mb-10 md:mb-14">
          <h2 className={`${LABEL} mb-4 ml-1`}>Leftover weigh-in</h2>

          <div className={CARD}>
            <p className="mb-5 text-[12px] sm:text-[13px] leading-[1.7] text-neutral-400 max-w-[680px]">
              Weigh the leftover flask after your run. Pick the flask type to
              subtract its empty weight — the starting gel comes straight from
              the recipe above — and enter your run time to see the carbs you
              actually took per hour.
            </p>

            {/* Started-with, on one line, from the recipe above */}
            <div className="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-2xl bg-[#f4f1ed] px-4 py-3 text-[13px]">
              <span className={LABEL}>Started with</span>
              <span className="tabular-nums font-medium text-neutral-700 ml-1">
                {Math.round(weighIn.startGel)}g gel
              </span>
              <span className="text-neutral-400 text-[12px]">
                — from recipe above ({hoursLabel} hr, {recipe.flasks} flask
                {recipe.flasks === 1 ? '' : 's'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-[13px]">
              {/* Flask type */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className={LABEL}>Flask</span>
                <div className="mt-1 flex flex-col gap-2">
                  {Object.entries(FLASKS).map(([key, f]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFlaskType(key)}
                      className={`rounded-2xl px-3 py-2.5 text-[12px] leading-tight text-left transition-colors duration-200 ${
                        flaskType === key
                          ? 'bg-neutral-700 text-white'
                          : 'bg-[#f4f1ed] text-neutral-600 hover:bg-[#ece8e2]'
                      }`}
                    >
                      {f.label}
                      <span className="block tabular-nums opacity-60">
                        {f.grams}g empty
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leftover reading */}
              <label className="flex flex-col gap-1 min-w-0">
                <span className={LABEL}>Leftover on scale (g)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="flask + gel"
                  value={leftoverStr}
                  onChange={(e) => setLeftoverStr(e.target.value)}
                  className={`${INPUT} mt-1`}
                />
                <span className="text-[10px] text-neutral-400 leading-snug">
                  Whole leftover flask, gel inside.
                </span>
              </label>

              {/* Run time */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className={LABEL}>Run time</span>
                <div className="mt-1 flex items-end gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-neutral-400">Hr</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={runHoursStr}
                      onChange={(e) => setRunHoursStr(e.target.value)}
                      className={`${INPUT} w-16`}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-neutral-400">Min</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={runMinutesStr}
                      onChange={(e) => setRunMinutesStr(e.target.value)}
                      className={`${INPUT} w-16`}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Results */}
            {weighIn.ready && (
              <dl className="mt-7 space-y-3 text-[13px] sm:text-[14px] border-t border-neutral-300/40 pt-5">
                <div className="flex justify-between items-baseline gap-3">
                  <dt className="text-neutral-400 min-w-0">
                    Gel remaining (scale − {weighIn.flaskG}g flask)
                  </dt>
                  <dd className="tabular-nums shrink-0 text-neutral-600">
                    {Math.round(weighIn.leftoverGel)}g
                  </dd>
                </div>
                <div className="flex justify-between items-baseline gap-3">
                  <dt className="text-neutral-400 min-w-0">Gel consumed</dt>
                  <dd className="tabular-nums font-medium shrink-0 text-neutral-700">
                    {weighIn.consumedGel >= 0
                      ? `${Math.round(weighIn.consumedGel)}g`
                      : '—'}
                  </dd>
                </div>
                <div className="flex justify-between items-baseline gap-3">
                  <dt className="text-neutral-400 min-w-0">
                    Carbs consumed (gel × {Math.round(CARB_FRACTION * 100)}%)
                  </dt>
                  <dd className="tabular-nums font-medium shrink-0 text-neutral-700">
                    {weighIn.carbsConsumed != null
                      ? `${Math.round(weighIn.carbsConsumed)}g`
                      : '—'}
                  </dd>
                </div>
                {weighIn.runDuration > 0 && (
                  <div className="flex justify-between items-baseline gap-3 text-[12px] text-neutral-400">
                    <dt className="min-w-0">Run duration</dt>
                    <dd className="tabular-nums shrink-0">
                      {weighIn.runH}h {weighIn.runM}m (
                      {(Math.round(weighIn.runDuration * 100) / 100).toFixed(2)}{' '}
                      h)
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-baseline gap-3 pt-3 border-t border-neutral-300/40">
                  <dt className="font-medium min-w-0 text-neutral-600">
                    Carbs/hr (consumed ÷ run time)
                  </dt>
                  <dd className="tabular-nums font-light text-[20px] shrink-0 text-neutral-700">
                    {weighIn.carbsPerHr != null
                      ? `${(Math.round(weighIn.carbsPerHr * 10) / 10).toFixed(
                          1
                        )} g/hr`
                      : '—'}
                  </dd>
                </div>
              </dl>
            )}

            {weighIn.ready && weighIn.warning && (
              <p className="mt-4 text-[12px] text-[#a06a5e] bg-[#f3e6e1] rounded-2xl px-4 py-3 leading-[1.6]">
                {weighIn.warning}
              </p>
            )}
            {weighIn.ready &&
              !weighIn.warning &&
              weighIn.runDuration <= 0 &&
              weighIn.consumedGel >= 0 && (
                <p className="mt-3 text-[11px] text-neutral-400">
                  Enter run hours and/or minutes to see carbs per hour.
                </p>
              )}
          </div>
        </section>
      </main>
    </div>
  )
}

function SodiumCard({
  title,
  subtitle,
  perUnitLabel,
  unit,
  count,
  setCount,
  maxCount,
  mg,
  coverage,
  meetsTarget,
  note,
}) {
  return (
    <div className={`${CARD} flex flex-col`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-medium text-neutral-700">
          {title}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white ${
            meetsTarget ? 'bg-[#8aa57e]' : 'bg-[#cf8b80]'
          }`}
        >
          {meetsTarget ? 'Meets target' : 'Below target'}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-neutral-400 leading-[1.6]">
        {subtitle}
      </p>
      <p className="mt-1 text-[11px] text-neutral-400">{perUnitLabel}</p>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Less ${unit}s per hour`}
          disabled={count <= 0}
          onClick={() => setCount(Math.max(0, count - 1))}
          className={STEPPER}
        >
          −
        </button>
        <span className="text-[15px] tabular-nums min-w-[90px] text-center text-neutral-700">
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

      <div className="mt-6 pt-5 border-t border-neutral-200/70 grid grid-cols-2 gap-4">
        <div>
          <div className={LABEL}>Sodium</div>
          <div className="mt-2 text-[30px] leading-none tabular-nums font-light text-neutral-700">
            {Math.round(mg)}
            <span className="text-[14px] text-neutral-400"> mg/hr</span>
          </div>
        </div>
        <div>
          <div className={LABEL}>Coverage</div>
          <div className="mt-2 text-[30px] leading-none tabular-nums font-light text-neutral-700">
            {Math.round(coverage)}
            <span className="text-[14px] text-neutral-400">%</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-neutral-400 leading-[1.6]">{note}</p>
    </div>
  )
}
