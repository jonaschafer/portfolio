'use client'

import { useEffect, useMemo, useState } from 'react'

const CARBS_PER_FLASK = {
  250: 187,
  500: 375,
}
const SWEAT_LOSS_PER_HR = 1100
const TARGET_REPLACEMENT_PER_HR = 800
/** S-caps sodium intake model (mg/hr). */
const S_CAPS_SODIUM_PER_HR = 380

/** Supplement label — sodium citrate. */
const SODIUM_CITRATE_SUPPLEMENT = {
  servingSize: '1 tsp',
  sodiumPerServingMg: 680,
}

/** Supplement label — potassium chloride. */
const POTASSIUM_CHLORIDE_SUPPLEMENT = {
  servingSizeMg: 200,
  potassiumPerServingMg: 105,
}

/** v1 baseline tsp per single batch (same as /play/gels); hours/flasks scale the list via scale. */
const ELECTROLYTE_TSP_PER_BATCH = {
  250: { sodiumCitrate: 0.375, potassiumChloride: 1 / 16 },
  500: { sodiumCitrate: 0.75, potassiumChloride: 0.125 },
}

/** v2: + adds on top of baseline; hard caps (GI pacing limits + tsp ceiling). */
const V2_STEP_TSP_NA = 0.25
const V2_STEP_TSP_K = 0.125
const V2_MAX_TSP_NA = 4
const V2_MAX_TSP_K = 0.5
const NA_MG_PER_TSP_CITRATE = 680
const K_MG_PER_TSP_KCL = 840
const GI_NA_THRESHOLD_MG_HR = 500
const FLAVOR_K_THRESHOLD_MG_HR = 200

function roundTspQuarter(t) {
  return Math.round(t * 4) / 4
}

function roundTspEighth(t) {
  return Math.round(t * 8) / 8
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

/** Human-readable tsp from a fine (1/16) rational amount (no recipe scaling). */
function formatTspFineDisplay(value) {
  const rounded = Math.round(value * 16) / 16
  const whole = Math.floor(rounded + 1e-9)
  let sixteenths = Math.round((rounded - whole) * 16)
  if (sixteenths === 16) {
    return `${whole + 1} tsp`
  }
  if (sixteenths === 0) return `${whole} tsp`

  const g = gcd(sixteenths, 16)
  const n = sixteenths / g
  const d = 16 / g

  if (whole === 0) return `${n}/${d} tsp`
  return `${whole} ${n}/${d} tsp`
}

/** Flask visualizer: fixed width matches layout; height follows 250ml PNG so 500ml scales down to same height (no column jump). */
const FLASK_VIS_WIDTH_PX = 84
const FLASK_250_IMAGE_PX = { w: 344, h: 1024 }
const FLASK_VIS_HEIGHT_PX =
  (FLASK_VIS_WIDTH_PX * FLASK_250_IMAGE_PX.h) / FLASK_250_IMAGE_PX.w

export default function GelsPage() {
  // Fueling state
  const [hoursOut, setHoursOut] = useState(4)
  const [carbsPerHour, setCarbsPerHour] = useState(80)
  const [flaskSize, setFlaskSize] = useState(250)

  // Recipe state
  const [recipeElectrolytes, setRecipeElectrolytes] = useState('yes')
  /** Added on top of v1 per-batch baseline (same as /play/gels). Reset clears to 0. */
  const [extraTspNa, setExtraTspNa] = useState(0)
  const [extraTspK, setExtraTspK] = useState(0)

  const baselineTspNa = ELECTROLYTE_TSP_PER_BATCH[flaskSize].sodiumCitrate
  const baselineTspK = ELECTROLYTE_TSP_PER_BATCH[flaskSize].potassiumChloride

  const tspSodiumCitrate = roundTspQuarter(baselineTspNa + extraTspNa)
  const tspPotassiumChloride = roundTspEighth(baselineTspK + extraTspK)

  const fueling = useMemo(() => {
    const clampedHours = Math.min(14, Math.max(1, hoursOut))
    const totalCarbs = clampedHours * carbsPerHour
    const carbsPerFlask = CARBS_PER_FLASK[flaskSize]
    const numberOfFlasks = Math.max(1, Math.ceil(totalCarbs / carbsPerFlask))
    const hoursPerFlask = carbsPerFlask / carbsPerHour || 0

    return {
      clampedHours,
      totalCarbs,
      carbsPerFlask,
      numberOfFlasks,
      hoursPerFlask,
    }
  }, [hoursOut, carbsPerHour, flaskSize])

  // Auto-switch to 500ml at 12h+
  useEffect(() => {
    if (fueling.clampedHours >= 12 && flaskSize !== 500) {
      setFlaskSize(500)
    }
  }, [fueling.clampedHours, flaskSize])

  // Sodium summary: gel Na scales with carbs/hr vs carbs per flask; caps fixed per hour
  const sodiumStrip = useMemo(() => {
    const h = fueling.clampedHours
    const cpf = fueling.carbsPerFlask
    const cph = carbsPerHour
    const totalLost = SWEAT_LOSS_PER_HR * h
    const capsPerHour = S_CAPS_SODIUM_PER_HR
    const sodiumPerBatch =
      recipeElectrolytes === 'yes'
        ? tspSodiumCitrate * NA_MG_PER_TSP_CITRATE
        : 0
    const gelPerHour =
      recipeElectrolytes === 'yes' && cpf > 0 && cph > 0
        ? sodiumPerBatch * (cph / cpf)
        : 0
    const sodiumReplacedPerHour = gelPerHour + capsPerHour
    const sodiumReplacedTotal = sodiumReplacedPerHour * h
    const percentReplaced =
      totalLost > 0 ? (sodiumReplacedTotal / totalLost) * 100 : 0
    const totalSodiumDeficit = totalLost - sodiumReplacedTotal
    const hourlySodiumDeficit = SWEAT_LOSS_PER_HR - sodiumReplacedPerHour
    return {
      totalLost,
      percentReplaced,
      gelPerHour,
      capsPerHour,
      sodiumReplacedPerHour,
      sodiumReplacedTotal,
      totalSodiumDeficit,
      hourlySodiumDeficit,
    }
  }, [
    fueling.clampedHours,
    fueling.carbsPerFlask,
    carbsPerHour,
    flaskSize,
    recipeElectrolytes,
    tspSodiumCitrate,
  ])

  /** K from KCl scales like gel sodium (carbs/hr vs carbs per flask). Na reuses sodiumStrip.gelPerHour. */
  const electrolyteFromGel = useMemo(() => {
    const h = fueling.clampedHours
    const cpf = fueling.carbsPerFlask
    const cph = carbsPerHour
    const on = recipeElectrolytes === 'yes' && cpf > 0 && cph > 0
    const ratio = on ? cph / cpf : 0
    const kPerBatch =
      recipeElectrolytes === 'yes'
        ? tspPotassiumChloride * K_MG_PER_TSP_KCL
        : 0
    const potassiumPerHour = on ? kPerBatch * ratio : 0
    return {
      sodiumPerHour: sodiumStrip.gelPerHour,
      sodiumTotal: sodiumStrip.gelPerHour * h,
      potassiumPerHour,
      potassiumTotal: potassiumPerHour * h,
    }
  }, [
    fueling.clampedHours,
    fueling.carbsPerFlask,
    carbsPerHour,
    flaskSize,
    recipeElectrolytes,
    sodiumStrip.gelPerHour,
    tspPotassiumChloride,
  ])

  const hForThreshold = fueling.clampedHours

  const nextExtraNa = roundTspQuarter(extraTspNa + V2_STEP_TSP_NA)
  const nextEffectiveNa = roundTspQuarter(baselineTspNa + nextExtraNa)
  const sodiumPlusDisabled =
    recipeElectrolytes !== 'yes' ||
    nextEffectiveNa > V2_MAX_TSP_NA + 1e-9 ||
    (hForThreshold > 0 &&
      (nextEffectiveNa * NA_MG_PER_TSP_CITRATE) / hForThreshold >
        GI_NA_THRESHOLD_MG_HR)

  const nextExtraK = roundTspEighth(extraTspK + V2_STEP_TSP_K)
  const nextEffectiveK = roundTspEighth(baselineTspK + nextExtraK)
  const potassiumPlusDisabled =
    recipeElectrolytes !== 'yes' ||
    nextEffectiveK > V2_MAX_TSP_K + 1e-9 ||
    (hForThreshold > 0 &&
      (nextEffectiveK * K_MG_PER_TSP_KCL) / hForThreshold >
        FLAVOR_K_THRESHOLD_MG_HR)

  const hoursLabelForWarning =
    Math.abs(hForThreshold - Math.round(hForThreshold)) < 0.05
      ? String(Math.round(hForThreshold))
      : (Math.round(hForThreshold * 10) / 10).toFixed(1)

  const sodiumAtLimitMessage = useMemo(() => {
    if (recipeElectrolytes !== 'yes' || !sodiumPlusDisabled) return null
    if (nextEffectiveNa > V2_MAX_TSP_NA + 1e-9) {
      return `Cannot add more: the next step would exceed the ${V2_MAX_TSP_NA} tsp sodium citrate per-batch limit.`
    }
    if (
      hForThreshold > 0 &&
      (nextEffectiveNa * NA_MG_PER_TSP_CITRATE) / hForThreshold >
        GI_NA_THRESHOLD_MG_HR
    ) {
      return `Cannot add more: for your ${hoursLabelForWarning}-hour plan, the next step would push batch sodium past ~${GI_NA_THRESHOLD_MG_HR} mg/hr (GI pacing: tsp × ${NA_MG_PER_TSP_CITRATE} mg ÷ hours). Shorten hours or tap Reset.`
    }
    return null
  }, [
    recipeElectrolytes,
    sodiumPlusDisabled,
    nextEffectiveNa,
    hForThreshold,
    hoursLabelForWarning,
  ])

  const potassiumAtLimitMessage = useMemo(() => {
    if (recipeElectrolytes !== 'yes' || !potassiumPlusDisabled) return null
    if (nextEffectiveK > V2_MAX_TSP_K + 1e-9) {
      return `Cannot add more: the next step would exceed the ${formatTspFineDisplay(V2_MAX_TSP_K)} tsp potassium chloride per-batch limit (taste / metallic).`
    }
    if (
      hForThreshold > 0 &&
      (nextEffectiveK * K_MG_PER_TSP_KCL) / hForThreshold >
        FLAVOR_K_THRESHOLD_MG_HR
    ) {
      return `Cannot add more: for your ${hoursLabelForWarning}-hour plan, the next step would push batch potassium past ~${FLAVOR_K_THRESHOLD_MG_HR} mg/hr (flavor / gut pacing: tsp × ${K_MG_PER_TSP_KCL} mg ÷ hours). Shorten hours or tap Reset.`
    }
    return null
  }, [
    recipeElectrolytes,
    potassiumPlusDisabled,
    nextEffectiveK,
    hForThreshold,
    hoursLabelForWarning,
  ])

  const sodiumCitrateBatchMg = Math.round(
    tspSodiumCitrate * NA_MG_PER_TSP_CITRATE
  )

  const recipeIngredients = useMemo(
    () =>
      getIngredientsV2(
        flaskSize,
        recipeElectrolytes === 'yes',
        fueling.numberOfFlasks,
        tspSodiumCitrate,
        tspPotassiumChloride
      ),
    [
      flaskSize,
      recipeElectrolytes,
      fueling.numberOfFlasks,
      tspSodiumCitrate,
      tspPotassiumChloride,
    ]
  )

  const totalScaledTspNa = roundTspQuarter(
    tspSodiumCitrate * fueling.numberOfFlasks
  )
  const totalScaledTspK = roundTspEighth(
    tspPotassiumChloride * fueling.numberOfFlasks
  )

  // Filled overlay (fractional last flask)
  const flasksExact = fueling.totalCarbs / fueling.carbsPerFlask
  const fullFlasks = Math.floor(flasksExact)
  const remainderFlaskFraction = Math.min(1, Math.max(0, flasksExact - fullFlasks))
  const SEGMENTS_PER_FLASK = 4

  const HOURS_MIN = 1
  const HOURS_MAX = 14
  const CARBS_MIN = 60
  const CARBS_MAX = 90
  const hoursOutPercent = Math.min(
    100,
    Math.max(
      0,
      ((fueling.clampedHours - HOURS_MIN) / (HOURS_MAX - HOURS_MIN)) * 100
    )
  )
  const carbsPerHourPercent = Math.min(
    100,
    Math.max(0, ((carbsPerHour - CARBS_MIN) / (CARBS_MAX - CARBS_MIN)) * 100)
  )

  // Hours where total carbs crosses another full flask → recipe scale changes
  const hoursRecipeChangeTicks = useMemo(() => {
    const cph = carbsPerHour
    const cpf = CARBS_PER_FLASK[flaskSize]
    if (cph <= 0) return []
    const ticks = []
    for (let k = 1; k <= 200; k++) {
      const h = (k * cpf) / cph
      if (h > HOURS_MAX) break
      if (h >= HOURS_MIN) ticks.push(h)
    }
    return ticks
  }, [carbsPerHour, flaskSize])

  return (
    <div className="font-mono bg-white text-black min-h-screen min-w-0 overflow-x-hidden">
      <style jsx global>{`
        html,
        body {
          background: #ffffff;
        }
      `}</style>
      {/* Main */}
      <main className="w-full max-w-[1440px] mx-auto min-w-0 px-5 md:px-8 lg:px-[60px] pt-5 pb-5 md:pt-[60px] md:pb-[60px]">
        {/* Tabs row — bottom margin matches horizontal page inset */}
        <div className="mb-5 md:mb-[60px] flex flex-wrap gap-2">
          {[
            { id: 'fueling', label: 'Fueling plan', anchorId: 'fueling-plan' },
            { id: 'recipe', label: 'Recipe', anchorId: 'recipe-section' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                document
                  .getElementById(tab.anchorId)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`px-3 py-1 border border-black text-[12px] uppercase tracking-[0.16em] ${
                tab.id === 'fueling'
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-black hover:text-white transition-colors'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div
          id="fueling-plan"
          className="grid grid-cols-1 lg:grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-5 lg:gap-y-0 lg:items-stretch scroll-mt-5 md:scroll-mt-[60px]"
        >
          {/* Left side: main content */}
          <section className="space-y-0 lg:self-stretch lg:min-h-0 lg:flex lg:flex-col lg:justify-self-start lg:w-max lg:max-w-full">
                {/* Two panels to the left of flask visualizer — stretch to match visualizer column height */}
                <div className="flex flex-col md:flex-row w-full lg:w-auto lg:max-w-full items-stretch lg:flex-1 lg:min-h-0 lg:h-full gap-5">
                  {/* Wide: same max width as visualizer column (minmax(280px, 400px)) */}
                  <div className="border-2 border-black p-[18px] w-full md:flex-1 lg:w-[400px] lg:max-w-[400px] lg:flex-none shrink-0 min-w-0 lg:h-full flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <span className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                        Hours out
                      </span>
                      <span className="text-[20px] leading-none tabular-nums">
                        {fueling.clampedHours.toFixed(1)} hr
                      </span>
                    </div>
                    <div className="relative mt-3 h-[50px]">
                      {/* Hash marks where flask count / recipe changes */}
                      <div
                        className="pointer-events-none absolute left-0 right-0 top-[10px] h-[16px]"
                        aria-hidden="true"
                      >
                        {hoursRecipeChangeTicks.map((h) => {
                          const pct =
                            ((h - HOURS_MIN) / (HOURS_MAX - HOURS_MIN)) * 100
                          const label =
                            Math.abs(h - Math.round(h)) < 0.05
                              ? String(Math.round(h))
                              : (Math.round(h * 10) / 10).toFixed(1)
                          return (
                            <div
                              key={`tick-${h}`}
                              className="absolute flex flex-col items-center"
                              style={{
                                left: `${pct}%`,
                                transform: 'translateX(-50%)',
                              }}
                            >
                              <div className="h-[10px] w-px bg-black" />
                              <span className="mt-1 text-[9px] leading-none tabular-nums text-black/55">
                                {label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="absolute left-0 right-0 top-[14px] h-[8px] bg-[#efefef] border border-[#b2b2b2] rounded-[30px]" />
                      <div
                        className="absolute left-0 top-[14px] h-[8px] bg-black rounded-[30px]"
                        style={{ width: `${hoursOutPercent}%` }}
                      />
                      <div
                        className="absolute top-[8px] w-[18px] h-[18px] bg-black rounded-full"
                        style={{
                          left: `${hoursOutPercent}%`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                      <input
                        type="range"
                        min={HOURS_MIN}
                        max={HOURS_MAX}
                        step={0.5}
                        value={hoursOut}
                        onChange={(e) =>
                          setHoursOut(parseFloat(e.target.value))
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>

                    <div className="flex justify-between items-start gap-4 mt-8">
                      <div>
                        <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                          Target carbs/hr
                        </div>
                        <div className="mt-1 text-[11px] text-black/60">
                          Target 60–90 g/hr
                        </div>
                      </div>
                      <span className="text-[20px] leading-none tabular-nums shrink-0">
                        {carbsPerHour.toFixed(0)} g/hr
                      </span>
                    </div>
                    <div className="relative mt-3 h-[34px]">
                      <div className="absolute left-0 right-0 top-[14px] h-[8px] bg-[#efefef] border border-[#b2b2b2] rounded-[30px]" />
                      <div
                        className="absolute left-0 top-[14px] h-[8px] bg-black rounded-[30px]"
                        style={{ width: `${carbsPerHourPercent}%` }}
                      />
                      <div
                        className="absolute top-[8px] w-[18px] h-[18px] bg-black rounded-full"
                        style={{
                          left: `${carbsPerHourPercent}%`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                      <input
                        type="range"
                        min={CARBS_MIN}
                        max={CARBS_MAX}
                        step={5}
                        value={carbsPerHour}
                        onChange={(e) =>
                          setCarbsPerHour(parseInt(e.target.value, 10))
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    <div className="mt-6 lg:mt-auto pt-0 lg:pt-10">
                      <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                        Total carbs needed
                      </div>
                      <div className="mt-2 text-[48px] leading-none tabular-nums">
                        {Math.round(fueling.totalCarbs).toLocaleString()}g
                      </div>
                    </div>
                  </div>

                  {/* Narrow: flask size + counts */}
                  <div className="border-2 border-black p-[18px] w-full md:flex-1 lg:w-[194px] lg:flex-none shrink-0 lg:h-full flex flex-col">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Flask size (ml)
                    </div>
                    <div className="mt-3 flex gap-[11px]">
                      <button
                        type="button"
                        onClick={() => setFlaskSize(250)}
                        disabled={fueling.clampedHours >= 12}
                        className={`flex-1 min-w-0 border border-black py-2 text-[17px] leading-none ${
                          flaskSize === 250 && fueling.clampedHours < 12
                            ? 'bg-black text-white'
                            : fueling.clampedHours >= 12
                              ? 'bg-white text-black/30 border-black/30 cursor-not-allowed'
                              : 'bg-white text-black'
                        }`}
                      >
                        250
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlaskSize(500)}
                        className={`flex-1 min-w-0 border border-black py-2 text-[17px] leading-none ${
                          flaskSize === 500
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        500
                      </button>
                    </div>

                    {/* Side by side on mobile only; stacked at md+ (box is 194px at tablet) */}
                    <div className="mt-5 flex flex-row gap-4 md:flex-col md:gap-0 md:flex-1 md:mt-8">
                      <div className="flex-1 md:flex-none">
                        <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                          No. of flasks
                        </div>
                        <div className="mt-2 text-[48px] leading-none tabular-nums">
                          {fueling.numberOfFlasks.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex-1 md:mt-6 lg:mt-auto lg:pt-10">
                        <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                          Carbs per flask
                        </div>
                        <div className="mt-2 text-[48px] leading-none tabular-nums">
                          {Math.round(fueling.carbsPerFlask).toLocaleString()}g
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </section>

          {/* Right side */}
          <aside className="space-y-0 lg:self-stretch lg:min-h-0 lg:flex lg:flex-col lg:min-w-0 w-full">
                <div className="border-2 border-black p-[18px] w-full min-h-[200px] flex flex-col lg:h-full lg:flex-1">
                  <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                    Flask visualizer
                  </div>

                  <div className="mt-6 flex gap-3 overflow-x-auto pb-2 flex-1 min-h-0 items-start">
                    {Array.from({
                      length: Math.min(fueling.numberOfFlasks, 6),
                    }).map((_, i) => {
                      const fraction =
                        i < fullFlasks
                          ? 1
                          : i === fullFlasks
                            ? remainderFlaskFraction
                            : 0

                      const filledSegments = Math.min(
                        SEGMENTS_PER_FLASK,
                        Math.max(0, Math.round(fraction * SEGMENTS_PER_FLASK))
                      )

                      return (
                        <div
                          key={i}
                          className="relative shrink-0 flex justify-center"
                          style={{ width: FLASK_VIS_WIDTH_PX }}
                        >
                          <div
                            className="relative inline-block"
                            style={{ height: FLASK_VIS_HEIGHT_PX }}
                          >
                            <img
                              src={
                                flaskSize === 500
                                  ? '/play/gels/flask-500.png'
                                  : '/play/gels/flask-250.png'
                              }
                              alt={`${flaskSize}ml flask`}
                              className="block h-full w-auto max-w-full select-none object-contain"
                              draggable="false"
                            />

                            {/* overlay fill segments — positioned vs image box so 250/500 stay aligned */}
                            <div
                              className="absolute left-[14%] right-[14%] top-[28%] bottom-[18%] grid grid-rows-4 gap-1 pointer-events-none"
                              aria-hidden="true"
                            >
                              {Array.from({ length: SEGMENTS_PER_FLASK }).map(
                                (__unused, segIdx) => {
                                  const filled =
                                    segIdx >= SEGMENTS_PER_FLASK - filledSegments
                                  return (
                                    <div
                                      key={segIdx}
                                      className={`border border-black ${
                                        filled ? 'bg-black/50' : 'bg-transparent'
                                      }`}
                                    />
                                  )
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
          </aside>
        <div className="lg:col-span-2 mt-0 py-6 w-full min-w-0 font-mono">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-x-6 lg:gap-y-0">
              {/* Box 1 — benchmarks + % replaced */}
              <div className="border-2 border-black px-[18px] pt-[48px] pb-[48px] flex flex-col justify-between min-h-[228px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <span className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                    Sweat loss/hr
                  </span>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {SWEAT_LOSS_PER_HR.toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <span className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                    Replacement/hr
                  </span>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {TARGET_REPLACEMENT_PER_HR.toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      % replaced
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Model vs sweat loss
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {sodiumStrip.percentReplaced.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Box 2 — totals for the outing */}
              <div className="border-2 border-black p-[18px] flex flex-col justify-between min-h-[280px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Total lost
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Sweat loss × hours
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.totalLost).toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Total S-caps
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      {S_CAPS_SODIUM_PER_HR} mg/hr assumed · sodium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(
                      sodiumStrip.capsPerHour * fueling.clampedHours
                    ).toLocaleString()}
                    mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Sodium citrate total
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Serving {SODIUM_CITRATE_SUPPLEMENT.servingSize} ·{' '}
                      {SODIUM_CITRATE_SUPPLEMENT.sodiumPerServingMg}mg sodium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(electrolyteFromGel.sodiumTotal).toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Potassium chloride total
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Serving {POTASSIUM_CHLORIDE_SUPPLEMENT.servingSizeMg}mg ·{' '}
                      {POTASSIUM_CHLORIDE_SUPPLEMENT.potassiumPerServingMg}mg
                      potassium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(electrolyteFromGel.potassiumTotal).toLocaleString()}mg
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Total deficit
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Sweat Na lost − Na replaced (S-caps + gel)
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.totalSodiumDeficit).toLocaleString()}mg
                  </span>
                </div>
              </div>

              {/* Box 3 — same rows, per hour */}
              <div className="border-2 border-black p-[18px] flex flex-col justify-between min-h-[280px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Lost/hr
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Sweat sodium model
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {SWEAT_LOSS_PER_HR.toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      S-caps/hr
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      {S_CAPS_SODIUM_PER_HR} mg/hr · sodium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.capsPerHour).toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Sodium citrate/hr
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Serving {SODIUM_CITRATE_SUPPLEMENT.servingSize} ·{' '}
                      {SODIUM_CITRATE_SUPPLEMENT.sodiumPerServingMg}mg sodium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(electrolyteFromGel.sodiumPerHour).toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Potassium chloride/hr
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Serving {POTASSIUM_CHLORIDE_SUPPLEMENT.servingSizeMg}mg ·{' '}
                      {POTASSIUM_CHLORIDE_SUPPLEMENT.potassiumPerServingMg}mg
                      potassium
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(electrolyteFromGel.potassiumPerHour).toLocaleString()}mg
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Deficit/hr
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Sweat Na/hr − Na replaced/hr
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.hourlySodiumDeficit).toLocaleString()}mg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            id="recipe-section"
            className="mt-5 md:mt-0 scroll-mt-5 md:scroll-mt-[60px]"
          >
            {/* Below lg: stack. lg+ (1024px): two columns with flex-1 min-w-0 so they stay side by side and shrink */}
            <div className="flex flex-col lg:flex-row lg:justify-center lg:items-stretch gap-4 md:gap-6 text-left text-[11px] font-mono w-full min-w-0">
              {/* Ingredients — flex column so electrolyte controls never overlap the list */}
              <div className="flex w-full max-w-[500px] mx-auto lg:mx-0 lg:flex-1 lg:min-w-0 lg:basis-0 lg:max-w-none min-h-[420px] flex-col border-2 border-black box-border min-w-0">
                <div className="shrink-0 px-[19px] pt-6 pb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <span className="uppercase tracking-[1.76px] leading-[16.5px]">
                    ingredients
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                    <span className="uppercase tracking-[1.76px] leading-[16.5px]">
                      Na citrate + KCl
                    </span>
                    <div className="flex items-center gap-[8.2px]">
                      <button
                        type="button"
                        onClick={() => setRecipeElectrolytes('yes')}
                        className={`w-[54.5px] border-[1.1px] border-black px-[10.6px] py-[4.2px] flex flex-col items-center justify-center ${
                          recipeElectrolytes === 'yes'
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        <span className="leading-[19.05px] text-[12.7px]">
                          YES
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecipeElectrolytes('no')}
                        className={`w-[54.5px] border-[1.1px] border-black px-[10.6px] py-[4.2px] flex flex-col items-center justify-center ${
                          recipeElectrolytes === 'no'
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        <span className="leading-[19.05px] text-[12.7px]">
                          NO
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {recipeElectrolytes === 'yes' && (
                  <div className="shrink-0 mx-[14px] sm:mx-[18px] mb-3 border border-black/30 bg-white p-3 space-y-3 text-[11px] sm:text-[12px] leading-snug">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="uppercase tracking-[1.2px] text-black">
                        Electrolytes (per batch)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setExtraTspNa(0)
                          setExtraTspK(0)
                        }}
                        className="border border-black px-2 py-1 text-[11px] uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-black">
                          Sodium citrate
                        </div>
                        <div className="mt-1 text-[11px] text-black/50 tabular-nums">
                          Base {formatTspFineDisplay(baselineTspNa)}
                          {extraTspNa > 0 && (
                            <>
                              {' '}
                              + extra {formatTspFineDisplay(extraTspNa)} →{' '}
                              <span className="text-black">
                                {formatTspFineDisplay(tspSodiumCitrate)}
                              </span>{' '}
                              / batch
                            </>
                          )}
                          {extraTspNa <= 0 && (
                            <span className="text-black">
                              {' '}
                              ({formatTspFineDisplay(tspSodiumCitrate)} / batch)
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px] text-black/45">
                          Total all flasks:{' '}
                          {formatTspFineDisplay(totalScaledTspNa)} (
                          {fueling.numberOfFlasks}× batch)
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-center sm:self-start">
                        <button
                          type="button"
                          aria-label="Add sodium citrate"
                          disabled={sodiumPlusDisabled}
                          onClick={() =>
                            setExtraTspNa((e) =>
                              roundTspQuarter(e + V2_STEP_TSP_NA)
                            )
                          }
                          className="w-9 h-9 border border-black text-[18px] leading-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {sodiumAtLimitMessage && (
                      <p className="text-[11px] text-red-900 bg-red-50 border border-red-200 px-2 py-1.5">
                        {sodiumAtLimitMessage}
                      </p>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-black">
                          Potassium chloride
                        </div>
                        <div className="mt-1 text-[11px] text-black/50 tabular-nums">
                          Base {formatTspFineDisplay(baselineTspK)}
                          {extraTspK > 0 && (
                            <>
                              {' '}
                              + extra {formatTspFineDisplay(extraTspK)} →{' '}
                              <span className="text-black">
                                {formatTspFineDisplay(tspPotassiumChloride)}
                              </span>{' '}
                              / batch
                            </>
                          )}
                          {extraTspK <= 0 && (
                            <span className="text-black">
                              {' '}
                              ({formatTspFineDisplay(tspPotassiumChloride)} /
                              batch)
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px] text-black/45">
                          Total all flasks:{' '}
                          {formatTspFineDisplay(totalScaledTspK)} (
                          {fueling.numberOfFlasks}× batch)
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-center sm:self-start">
                        <button
                          type="button"
                          aria-label="Add potassium chloride"
                          disabled={potassiumPlusDisabled}
                          onClick={() =>
                            setExtraTspK((e) =>
                              roundTspEighth(e + V2_STEP_TSP_K)
                            )
                          }
                          className="w-9 h-9 border border-black text-[18px] leading-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {potassiumAtLimitMessage && (
                      <p className="text-[11px] text-red-900 bg-red-50 border border-red-200 px-2 py-1.5">
                        {potassiumAtLimitMessage}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex-1 min-h-[240px] mx-[10px] sm:mx-[18px] mb-[18px] bg-[#ececec]/50 text-[#1e1e1e] overflow-y-auto">
                  <div className="px-[12px] sm:px-[20px] py-[19px] flex flex-col items-start gap-0 min-w-0">
                    {recipeIngredients.map((item, idx) => {
                      const isLast = idx === recipeIngredients.length - 1

                      return (
                        <div
                          key={item.label}
                          className={`w-full min-w-0 flex items-center justify-between gap-2 sm:gap-3 pt-[10px] pb-[15px] text-[15px] xl:text-[17px] leading-snug xl:leading-[25.5px] ${
                            isLast ? '' : 'border-b border-black/40'
                          }`}
                        >
                          <span className="min-w-0 shrink">
                            {item.label}
                            {item.link && (
                              <> (<a href={item.link} target="_blank" rel="noopener noreferrer" className="underline opacity-60 hover:opacity-100">source</a>)</>
                            )}
                          </span>
                          <span className="tabular-nums text-right shrink-0">
                            {item.amount}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Instructions — flow layout (no overlapping absolutes when column is narrow) */}
              <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:flex-1 lg:min-w-0 lg:basis-0 lg:max-w-none min-h-[440px] flex flex-col border-2 border-black box-border min-w-0">
                <div className="shrink-0 pt-6 px-[30.5px] uppercase tracking-[1.76px] leading-[16.5px]">
                  instructions
                </div>

                <ol className="mt-4 px-[30.5px] text-[#1e1e1e] text-[15px] xl:text-[17px] leading-snug xl:leading-tight list-decimal list-inside space-y-[14px]">
                  <li>
                    Weigh out the fructose, maltodextrin, and pectin into a
                    heat‑safe container.
                  </li>
                  <li>
                    Bring the water to a full boil in a separate vessel.
                  </li>
                  <li>
                    Pour boiling water over the dry mix while whisking until
                    completely dissolved and smooth.
                  </li>
                  <li>
                    If using sodium citrate and potassium chloride, stir them
                    in while the gel is still hot so they dissolve evenly.
                  </li>
                  <li>
                    Let the gel cool, then pour into your flask using a small
                    funnel.
                  </li>
                </ol>

                <div className="shrink-0 mt-4 px-[30.5px] pb-6 text-[13px] xl:text-[14px] leading-snug xl:leading-[21.5px] text-[#1e1e1e]">
                  Flavor is optional but nice on long days: a splash of{' '}
                  <span className="underline">vanilla</span>, a drop of{' '}
                  <span className="underline">peppermint</span>, or a shot of{' '}
                  <span className="underline">strong espresso</span> all work
                  well. Keep liquids minimal so you don't dilute the carbs too
                  much.
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 border-2 border-black p-[18px] w-full min-w-0 box-border">
              <p className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px] mb-3">
                Sodium citrate &amp; potassium chloride
              </p>
              <div className="space-y-3 text-[12px] sm:text-[13px] leading-[1.55] text-[#1e1e1e]">
                <p>
                  <span className="font-semibold text-black">
                    Sodium citrate
                  </span>{' '}
                  is what most commercial gels use instead of table salt. Same
                  sodium content but no chloride bite, so it tastes cleaner
                  and slightly tart rather than salty. At high intake rates
                  (80–90g carbs/hr over 5+ hours) the &quot;salty gel&quot;
                  flavor can become unpleasant — sodium citrate sidesteps that.
                  Maurten uses it. GU uses it. It&apos;s also slightly easier on
                  the stomach for some people.
                </p>
                <p>
                  <span className="font-semibold text-black">
                    Potassium chloride
                  </span>{' '}
                  (salt substitute) covers a secondary electrolyte loss. You
                  sweat potassium too, just less than sodium — roughly 150–200mg/hr
                  vs your 1,100mg/hr sodium. It&apos;s not a priority fix but
                  rounds out the electrolyte profile on very long efforts.
                  Tastes slightly bitter/metallic in large amounts, so a little
                  goes a long way.
                </p>
                <p className="text-black/70">
                  Practical swap for a 500ml batch (scaled on this page for
                  flask size and number of flasks): instead of 1 tsp table salt,
                  use{' '}
                  <span className="text-black font-semibold">
                    ¾ tsp sodium citrate
                  </span>{' '}
                  (~510mg sodium from ¾ tsp × 680mg/tsp, cleaner taste) and{' '}
                  <span className="text-black font-semibold">
                    ⅛ tsp potassium chloride
                  </span>{' '}
                  (~{Math.round(baselineTspK * K_MG_PER_TSP_KCL)}mg potassium at
                  base {formatTspFineDisplay(baselineTspK)} ×{' '}
                  {K_MG_PER_TSP_KCL}mg K/tsp).
                </p>
                {recipeElectrolytes === 'yes' && (
                  <p className="text-black/70">
                    <span className="font-semibold text-black">
                      Live batch sodium
                    </span>{' '}
                    from your slider:{' '}
                    <span className="tabular-nums text-black font-semibold">
                      {sodiumCitrateBatchMg}mg
                    </span>{' '}
                    per flask batch (
                    {formatTspFineDisplay(tspSodiumCitrate)} ×{' '}
                    {NA_MG_PER_TSP_CITRATE}mg Na/tsp).
                  </p>
                )}
                <div className="mt-4 border border-black/30 p-3 text-[11px] sm:text-[12px] leading-[1.5] text-black/80">
                  <p className="uppercase tracking-[1.4px] text-black mb-2">
                    Supplement facts (your products)
                  </p>
                  <dl className="space-y-2">
                    <div>
                      <dt className="font-semibold text-black">
                        Potassium chloride
                      </dt>
                      <dd className="mt-0.5 pl-0 text-black/75">
                        Serving size{' '}
                        <span className="tabular-nums text-black">
                          {POTASSIUM_CHLORIDE_SUPPLEMENT.servingSizeMg}mg
                        </span>
                        . Amount per serving (potassium){' '}
                        <span className="tabular-nums text-black">
                          {POTASSIUM_CHLORIDE_SUPPLEMENT.potassiumPerServingMg}mg
                        </span>
                        .
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-black">
                        Sodium citrate
                      </dt>
                      <dd className="mt-0.5 pl-0 text-black/75">
                        Serving size{' '}
                        <span className="text-black">
                          {SODIUM_CITRATE_SUPPLEMENT.servingSize}
                        </span>
                        . Amount per serving (sodium){' '}
                        <span className="tabular-nums text-black">
                          {SODIUM_CITRATE_SUPPLEMENT.sodiumPerServingMg}mg
                        </span>
                        .
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 border-2 border-black bg-black p-[18px] w-full min-w-0 box-border text-white">
              <p className="text-[12px] sm:text-[13px] leading-[1.55] text-white">
                <span className="font-semibold text-white">Recipe source:</span>{' '}
                <a
                  href="https://www.youtube.com/watch?v=Dj4oYcRLxEo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-2 opacity-90 hover:opacity-100 break-all"
                >
                  https://www.youtube.com/watch?v=Dj4oYcRLxEo
                </a>
              </p>
            </div>
          </div>
      </main>

      {/* Footer – mirrors Sounds tone */}
      <footer className="mt-5 md:mt-[60px]" />
    </div>
  )
}

function getIngredientsV2(
  size,
  includeElectrolytes,
  scale = 1,
  tspNaPerBatch,
  tspKPerBatch
) {
  const base =
    size === 250
      ? [
          { label: 'Fructose', grams: 100, link: 'https://www.amazon.com/dp/B0799XXRZK?th=1' },
          { label: 'Maltodextrin', grams: 200, link: 'https://www.amazon.com/dp/B01H4BTWGA?th=1' },
          { label: 'Pectin', tsp: 0.5, link: 'https://www.amazon.com/dp/B09DTK9BVN' },
          { label: 'Water (boiling)', grams: 200 },
        ]
      : [
          { label: 'Fructose', grams: 125, link: 'https://www.amazon.com/dp/B0799XXRZK?th=1' },
          { label: 'Maltodextrin', grams: 250, link: 'https://www.amazon.com/dp/B01H4BTWGA?th=1' },
          { label: 'Pectin', tsp: 0.75, link: 'https://www.amazon.com/dp/B09DTK9BVN' },
          { label: 'Water (boiling)', grams: 250 },
        ]

  if (includeElectrolytes) {
    base.push(
      {
        label: 'Sodium citrate',
        tspFine: tspNaPerBatch,
        link: 'https://www.amazon.com/dp/B07B1G3MSL',
      },
      {
        label: 'Potassium chloride',
        tspFine: tspKPerBatch,
        link: 'https://www.amazon.com/dp/B00ENS39Z8',
      }
    )
  }

  const formatGrams = (value) => {
    const scaled = value * scale
    const rounded5 = Math.round(scaled / 5) * 5
    return `${rounded5}g`
  }

  const formatTsp = (value) => {
    const scaled = value * scale
    const roundedQuarterTsp = Math.round(scaled * 4) / 4

    const whole = Math.floor(roundedQuarterTsp + 1e-9)
    const frac = roundedQuarterTsp - whole
    const quarterNum = Math.round(frac * 4)

    if (quarterNum === 0) return `${whole} tsp`

    const g = gcd(quarterNum, 4)
    const n = quarterNum / g
    const d = 4 / g

    if (whole === 0) return `${n}/${d} tsp`
    return `${whole} ${n}/${d} tsp`
  }

  /** Rounds to nearest 1/16 tsp so ⅛ and smaller base amounts stay accurate when scaled. */
  const formatTspFine = (value) => {
    const scaled = value * scale
    const rounded = Math.round(scaled * 16) / 16
    const whole = Math.floor(rounded + 1e-9)
    let sixteenths = Math.round((rounded - whole) * 16)
    if (sixteenths === 16) {
      return `${whole + 1} tsp`
    }
    if (sixteenths === 0) return `${whole} tsp`

    const g = gcd(sixteenths, 16)
    const n = sixteenths / g
    const d = 16 / g

    if (whole === 0) return `${n}/${d} tsp`
    return `${whole} ${n}/${d} tsp`
  }

  return base.map((item) => {
    if (typeof item.grams === 'number') {
      return { label: item.label, amount: formatGrams(item.grams), link: item.link }
    }
    if (typeof item.tspFine === 'number') {
      return {
        label: item.label,
        amount: formatTspFine(item.tspFine),
        link: item.link,
      }
    }
    return { label: item.label, amount: formatTsp(item.tsp), link: item.link }
  })
}


