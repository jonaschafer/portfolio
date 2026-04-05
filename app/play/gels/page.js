'use client'

import { useEffect, useMemo, useState } from 'react'

const CARBS_PER_FLASK = {
  250: 187,
  500: 375,
}
const SWEAT_LOSS_PER_HR = 1100
const TARGET_REPLACEMENT_PER_HR = 800
const S_CAPS_PER_HR = 2
const S_CAP_SODIUM = 215

/** Sodium per single gel batch when electrolytes are included (sodium citrate; 500ml ≈ ¾ tsp ≈ 1,800mg). */
const SODIUM_MG_PER_FLASK_BATCH = {
  250: 900,
  500: 1800,
}

/** Base electrolyte amounts per one batch (before scaling by number of flasks). */
const ELECTROLYTE_TSP_PER_BATCH = {
  250: { sodiumCitrate: 0.375, potassiumChloride: 1 / 16 },
  500: { sodiumCitrate: 0.75, potassiumChloride: 0.125 },
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
    const capsPerHour = S_CAPS_PER_HR * S_CAP_SODIUM
    const sodiumPerBatch = SODIUM_MG_PER_FLASK_BATCH[flaskSize]
    const gelPerHour =
      recipeElectrolytes === 'yes' && cpf > 0 && cph > 0
        ? sodiumPerBatch * (cph / cpf)
        : 0
    const replacedPerHour = gelPerHour + capsPerHour
    const totalReplaced = replacedPerHour * h
    const deficit = Math.max(0, totalLost - totalReplaced)
    const percentReplaced = totalLost > 0 ? (totalReplaced / totalLost) * 100 : 0
    return {
      totalLost,
      totalReplaced,
      deficit,
      percentReplaced,
      gelPerHour,
      capsPerHour,
      replacedPerHour,
    }
  }, [
    fueling.clampedHours,
    fueling.carbsPerFlask,
    carbsPerHour,
    flaskSize,
    recipeElectrolytes,
  ])

  const recipeIngredients = useMemo(
    () =>
      getIngredients(
        flaskSize,
        recipeElectrolytes === 'yes',
        fueling.numberOfFlasks
      ),
    [flaskSize, recipeElectrolytes, fueling.numberOfFlasks]
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-x-6 lg:gap-y-0">
              {/* Box 1 — hourly rates */}
              <div className="border-2 border-black p-[18px] flex flex-col justify-between min-h-[132px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <span className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                    Sweat loss hr
                  </span>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {SWEAT_LOSS_PER_HR.toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <span className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                    Replacement hr
                  </span>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {TARGET_REPLACEMENT_PER_HR.toLocaleString()}mg
                  </span>
                </div>
              </div>

              {/* Box 2 — totals */}
              <div className="border-2 border-black p-[18px] flex flex-col justify-between min-h-[132px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Total lost
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Sweat loss x hours
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
                      Total replaced
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Gels + S Caps
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.totalReplaced).toLocaleString()}mg
                  </span>
                </div>
              </div>

              {/* Box 3 — deficit & % */}
              <div className="border-2 border-black p-[18px] flex flex-col justify-between min-h-[132px] min-w-0 box-border">
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      Deficit
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Lost - replaced
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {Math.round(sodiumStrip.deficit).toLocaleString()}mg
                  </span>
                </div>
                <div className="my-3 h-px w-full bg-[#c8c8c8]" />
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0 pr-2">
                    <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      % replaced
                    </div>
                    <div className="mt-1 text-[11px] leading-[14px] text-black/45">
                      Aim ~70-80%
                    </div>
                  </div>
                  <span className="text-[17px] font-semibold leading-none tabular-nums shrink-0 text-black">
                    {sodiumStrip.percentReplaced.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Box 4 — note */}
              <div className="border-2 border-black p-[18px] flex items-center min-h-[132px] min-w-0 box-border">
                <p className="text-[11px] leading-[16px] text-black/55">
                  Model:{' '}
                  <span className="text-black font-semibold underline underline-offset-2">
                    ~{Math.round(sodiumStrip.gelPerHour).toLocaleString()} mg/hr
                  </span>{' '}
                  sodium from gel (recipe × carbs/hr) +{' '}
                  <span className="text-black font-semibold underline underline-offset-2">
                    ~{Math.round(sodiumStrip.capsPerHour).toLocaleString()} mg/hr
                  </span>{' '}
                  from{' '}
                  <span className="text-black font-semibold underline underline-offset-2">
                    two S-caps/hr
                  </span>
                  . Combined ~{' '}
                  <span className="text-black font-semibold underline underline-offset-2">
                    {Math.round(sodiumStrip.replacedPerHour).toLocaleString()}{' '}
                    mg/hr
                  </span>
                  ; rough intake target ~{TARGET_REPLACEMENT_PER_HR} mg/hr.
                </p>
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
              {/* Ingredients */}
              <div className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:flex-1 lg:min-w-0 lg:basis-0 lg:max-w-none min-h-[380px] h-[440px] border-2 border-black box-border min-w-0 overflow-hidden">
                <div className="absolute top-[24px] left-[19px] right-[19px] flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
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

                <div className="absolute top-[76px] left-[18px] right-[18px] bottom-[20px] bg-[#ececec]/50 text-[#1e1e1e]">
                  <div className="absolute top-[19px] left-[12px] right-[12px] sm:left-[20px] sm:right-[20px] flex flex-col items-start gap-0 min-w-0">
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
                  (~1,800mg sodium, cleaner taste) and{' '}
                  <span className="text-black font-semibold">
                    ⅛ tsp potassium chloride
                  </span>{' '}
                  (~200mg potassium).
                </p>
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

function getIngredients(size, includeElectrolytes, scale = 1) {
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
    const ec = ELECTROLYTE_TSP_PER_BATCH[size]
    base.push(
      {
        label: 'Sodium citrate',
        tspFine: ec.sodiumCitrate,
        link: 'https://www.amazon.com/dp/B07B1G3MSL',
      },
      {
        label: 'Potassium chloride',
        tspFine: ec.potassiumChloride,
        link: 'https://www.amazon.com/dp/B00ENS39Z8',
      }
    )
  }

  const formatGrams = (value) => {
    const scaled = value * scale
    const rounded5 = Math.round(scaled / 5) * 5
    return `${rounded5}g`
  }

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))

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


