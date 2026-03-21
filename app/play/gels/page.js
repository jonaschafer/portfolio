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

export default function GelsPage() {
  const [activeTab, setActiveTab] = useState('fueling')

  // Fueling state
  const [hoursOut, setHoursOut] = useState(4)
  const [carbsPerHour, setCarbsPerHour] = useState(80)
  const [flaskSize, setFlaskSize] = useState(250)

  // Recipe state
  const [recipeSalt, setRecipeSalt] = useState('yes')

  // Sodium state
  const [sodiumHours, setSodiumHours] = useState(4)
  const [sodiumSaltInGel, setSodiumSaltInGel] = useState('yes')

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

  const sodium = useMemo(() => {
    const clampedHours = Math.min(14, Math.max(1, sodiumHours))
    const totalLost = SWEAT_LOSS_PER_HR * clampedHours

    const capsPerHour = S_CAPS_PER_HR * S_CAP_SODIUM
    const gelPerHour =
      sodiumSaltInGel === 'yes' ? TARGET_REPLACEMENT_PER_HR - capsPerHour : 0
    const replacedPerHour = gelPerHour + capsPerHour
    const totalReplaced = replacedPerHour * clampedHours

    const deficit = Math.max(0, totalLost - totalReplaced)
    const percentReplaced = totalLost > 0 ? (totalReplaced / totalLost) * 100 : 0

    return {
      clampedHours,
      totalLost,
      totalReplaced,
      deficit,
      percentReplaced,
      gelPerHour,
      capsPerHour,
    }
  }, [sodiumHours, sodiumSaltInGel])

  // Sodium summary row (fueling tab): uses fueling hours + same hourly math as Sodium tab
  const sodiumStrip = useMemo(() => {
    const h = fueling.clampedHours
    const totalLost = SWEAT_LOSS_PER_HR * h
    const capsPerHour = S_CAPS_PER_HR * S_CAP_SODIUM
    const gelPerHour =
      sodiumSaltInGel === 'yes' ? TARGET_REPLACEMENT_PER_HR - capsPerHour : 0
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
    }
  }, [fueling.clampedHours, sodiumSaltInGel])

  const recipeIngredients = useMemo(
    () =>
      getIngredients(flaskSize, recipeSalt === 'yes', fueling.numberOfFlasks),
    [flaskSize, recipeSalt, fueling.numberOfFlasks]
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
    <div className="font-mono bg-white text-black min-h-screen">
      <style jsx global>{`
        html,
        body {
          background: #ffffff;
        }
      `}</style>
      {/* Main */}
      <main className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pt-5 pb-5 md:pt-[60px] md:pb-[60px]">
        {/* Tabs row — bottom margin matches horizontal page inset */}
        <div className="mb-5 md:mb-[60px] flex flex-wrap gap-2">
          {[
            { id: 'fueling', label: 'Fueling plan' },
            { id: 'recipe', label: 'Recipe', anchor: true },
            { id: 'sodium', label: 'Sodium' },
            { id: 'run-log', label: 'Run log' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.anchor) {
                  setActiveTab('fueling')
                  setTimeout(
                    () =>
                      document
                        .getElementById('recipe-section')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    100
                  )
                } else {
                  setActiveTab(tab.id)
                }
              }}
              className={`px-3 py-1 border border-black text-[12px] uppercase tracking-[0.16em] ${
                activeTab === tab.id
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
          className={
            activeTab === 'fueling'
              ? 'grid grid-cols-1 lg:grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-0 lg:items-stretch'
              : 'grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6'
          }
        >
          {/* Left side: main content per tab */}
          <section
            className={
              activeTab === 'fueling'
                ? 'space-y-0 lg:self-stretch lg:min-h-0 lg:flex lg:flex-col lg:justify-self-start lg:w-max lg:max-w-full'
                : 'space-y-4'
            }
          >
            {activeTab === 'fueling' && (
              <>
                {/* Two panels to the left of flask visualizer — stretch to match visualizer column height */}
                <div className="flex flex-col md:flex-row w-full lg:w-auto lg:max-w-full items-stretch flex-1 min-h-0 h-full gap-6">
                  {/* Wide: same max width as visualizer column (minmax(280px, 400px)) */}
                  <div className="border-2 border-black p-[18px] w-full max-w-[400px] lg:w-[400px] lg:max-w-[400px] lg:flex-none shrink-0 min-w-0 min-h-0 h-full flex flex-col">
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

                    <div className="mt-auto pt-10">
                      <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                        Total carbs needed
                      </div>
                      <div className="mt-2 text-[48px] leading-none tabular-nums">
                        {Math.round(fueling.totalCarbs).toLocaleString()}g
                      </div>
                    </div>
                  </div>

                  {/* Narrow: flask size + counts */}
                  <div className="border-2 border-black p-[18px] w-full md:w-[194px] shrink-0 min-h-0 h-full flex flex-col">
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

                    <div className="mt-8 uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                      No. of flasks
                    </div>
                    <div className="mt-2 text-[48px] leading-none tabular-nums">
                      {fueling.numberOfFlasks.toLocaleString()}
                    </div>

                    {/* Same mt-auto + pt-10 as left "Total carbs needed" so labels align */}
                    <div className="mt-auto pt-10">
                      <div className="uppercase text-[11px] tracking-[1.76px] leading-[16.5px]">
                        Carbs per flask
                      </div>
                      <div className="mt-2 text-[48px] leading-none tabular-nums">
                        {Math.round(fueling.carbsPerFlask).toLocaleString()}g
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sodium' && (
              <>
                <h2 className="font-['Mondwest',_sans-serif] text-[24px] md:text-[28px] leading-tight tracking-tight">
                  Sodium
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {/* Fixed inputs */}
                    <div className="border-2 border-black p-4">
                      <div className="flex justify-between mb-1">
                        <div className="uppercase text-[11px] tracking-[0.16em]">
                          Sweat loss
                        </div>
                        <div className="text-[13px]">
                          {SWEAT_LOSS_PER_HR.toLocaleString()} mg/hr
                        </div>
                      </div>
                      <div className="text-[11px] text-black/60">Fixed</div>
                    </div>

                    <div className="border-2 border-black p-4">
                      <div className="flex justify-between mb-1">
                        <div className="uppercase text-[11px] tracking-[0.16em]">
                          Target replacement
                        </div>
                        <div className="text-[13px]">
                          {TARGET_REPLACEMENT_PER_HR.toLocaleString()} mg/hr
                        </div>
                      </div>
                      <div className="text-[11px] text-black/60">
                        ~73% of sweat loss
                      </div>
                    </div>

                    {/* Hours + salt toggle */}
                    <div className="border-2 border-black p-4 space-y-3">
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <div>
                            <div className="uppercase text-[11px] tracking-[0.16em]">
                              Hours out
                            </div>
                            <div className="text-[11px] text-black/60">
                              Match whatever you used in fueling.
                            </div>
                          </div>
                          <div className="text-[13px]">
                            {sodium.clampedHours.toFixed(1)} h
                          </div>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={14}
                          step={0.5}
                          value={sodiumHours}
                          onChange={(e) =>
                            setSodiumHours(parseFloat(e.target.value))
                          }
                          className="w-full accent-black"
                        />
                      </div>

                      <div className="flex justify-between items-baseline">
                        <div>
                          <div className="uppercase text-[11px] tracking-[0.16em]">
                            Salt in gel
                          </div>
                          <div className="text-[11px] text-black/60">
                            Toggle sodium coming from the gel.
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['yes', 'no'].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSodiumSaltInGel(value)}
                              className={`px-3 py-1 border border-black text-[12px] uppercase tracking-[0.12em] ${
                                sodiumSaltInGel === value
                                  ? 'bg-black text-white'
                                  : 'bg-white hover:bg-black hover:text-white transition-colors'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Totals */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-black p-4">
                        <div className="uppercase text-[11px] tracking-[0.16em] mb-1">
                          Total lost
                        </div>
                        <div className="text-[18px]">
                          {sodium.totalLost.toLocaleString()} mg
                        </div>
                        <div className="text-[11px] text-black/60">
                          sweat loss × hours
                        </div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="uppercase text-[11px] tracking-[0.16em] mb-1">
                          Total replaced
                        </div>
                        <div className="text-[18px]">
                          {sodium.totalReplaced.toLocaleString()} mg
                        </div>
                        <div className="text-[11px] text-black/60">
                          gel + S‑caps
                        </div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="uppercase text-[11px] tracking-[0.16em] mb-1">
                          Deficit
                        </div>
                        <div className="text-[18px]">
                          {sodium.deficit.toLocaleString()} mg
                        </div>
                        <div className="text-[11px] text-black/60">
                          lost − replaced
                        </div>
                      </div>
                      <div className="border-2 border-black p-4">
                        <div className="uppercase text-[11px] tracking-[0.16em] mb-1">
                          % replaced
                        </div>
                        <div className="text-[18px]">
                          {sodium.percentReplaced.toFixed(1)}%
                        </div>
                        <div className="text-[11px] text-black/60">
                          aim ~70–80%
                        </div>
                      </div>
                    </div>

                    {/* Breakdown copy */}
                    <div className="border-2 border-black p-4 text-[12px] leading-relaxed">
                      {sodiumSaltInGel === 'yes' ? (
                        <p>
                          With salt in the gel, this sketch assumes about{' '}
                          <span className="underline">
                            {Math.round(sodium.gelPerHour).toLocaleString()} mg/hr
                          </span>{' '}
                          from the gel itself plus{' '}
                          <span className="underline">
                            {Math.round(sodium.capsPerHour).toLocaleString()} mg/hr
                          </span>{' '}
                          from{' '}
                          <span className="underline">
                            {S_CAPS_PER_HR} S‑caps/hr
                          </span>{' '}
                          ({S_CAP_SODIUM} mg each), landing near the
                          800&nbsp;mg/hr target.
                        </p>
                      ) : (
                        <p>
                          With no salt in the gel, this sketch only counts{' '}
                          <span className="underline">
                            {Math.round(sodium.capsPerHour).toLocaleString()} mg/hr
                          </span>{' '}
                          from{' '}
                          <span className="underline">
                            {S_CAPS_PER_HR} S‑caps/hr
                          </span>
                          . That&apos;s roughly{' '}
                          <span className="underline">
                            {sodium.percentReplaced.toFixed(1)}%
                          </span>{' '}
                          of a 1,100&nbsp;mg/hr sweat rate – use this to decide how
                          much you want to lean on drink mix, gel salt, or more
                          capsules.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'run-log' && (
              <>
                <ul className="space-y-4">
                  <li className="border-2 border-black p-4 space-y-2 text-[13px]">
                    <div className="font-['Mondwest',_sans-serif] text-[18px] leading-tight tracking-tight">
                      March 15, 2026
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>2h27min · 8.82 mi · 3,205 ft</li>
                      <li>~226 g carbs total (~92 g/hr), 2 S-caps/hr</li>
                      <li>
                        Felt: <span className="underline">amazing</span>
                      </li>
                    </ul>
                  </li>

                  <li className="border-2 border-black p-4 space-y-2 text-[13px]">
                    <div className="font-['Mondwest',_sans-serif] text-[18px] leading-tight tracking-tight">
                      Arcellus → Larch Mtn
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>5h on feet</li>
                      <li>Est. 5,500 mg sodium lost</li>
                      <li>
                        Replaced: 10 gels (~900 mg), 1.5 L Gnarly (~1,500 mg), 8 S-caps
                        (~1,720 mg) ⇒ ~4,120 mg (~75%).
                      </li>
                      <li>
                        Felt: <span className="underline">great</span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}
          </section>

          {/* Right side */}
          <aside
            className={
              activeTab === 'fueling'
                ? 'space-y-0 lg:self-stretch lg:min-h-0 lg:flex lg:flex-col lg:min-w-0 w-full'
                : 'space-y-4 items-start'
            }
          >
            {activeTab === 'fueling' && (
              <>
                <div className="border-2 border-black p-[18px] w-full h-full min-h-[200px] flex flex-col flex-1">
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
                          className="relative shrink-0"
                          style={{ width: 84 }}
                        >
                          <img
                            src={
                              flaskSize === 500
                                ? '/play/gels/flask-500.png'
                                : '/play/gels/flask-250.png'
                            }
                            alt={`${flaskSize}ml flask`}
                            className="w-full h-auto select-none block"
                            draggable="false"
                          />

                          {/* overlay fill segments */}
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
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </aside>
        {activeTab === 'fueling' && (
          <div className="lg:col-span-2 mt-0 py-6 w-full min-w-0 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-0">
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
                  {sodiumSaltInGel === 'yes' ? (
                    <>
                      Assumes{' '}
                      <span className="text-black font-semibold underline underline-offset-2">
                        ~{Math.round(sodiumStrip.gelPerHour).toLocaleString()}{' '}
                        mg/hr
                      </span>{' '}
                      from gel +{' '}
                      <span className="text-black font-semibold underline underline-offset-2">
                        ~{Math.round(sodiumStrip.capsPerHour).toLocaleString()}{' '}
                        mg/hr
                      </span>{' '}
                      from{' '}
                      <span className="text-black font-semibold underline underline-offset-2">
                        two S-caps/hr
                      </span>{' '}
                      landing near the 800 mg/hr target
                    </>
                  ) : (
                    <>
                      Assumes{' '}
                      <span className="text-black font-semibold underline underline-offset-2">
                        ~{Math.round(sodiumStrip.capsPerHour).toLocaleString()}{' '}
                        mg/hr
                      </span>{' '}
                      from{' '}
                      <span className="text-black font-semibold underline underline-offset-2">
                        two S-caps/hr
                      </span>{' '}
                      only (no gel salt in this sketch)
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>

        {activeTab === 'fueling' && (
          <div
            id="recipe-section"
            className="mt-5 md:mt-0 scroll-mt-5 md:scroll-mt-[60px]"
          >
            <div className="flex justify-center items-start gap-6 text-left text-[11px] font-mono w-full">
              {/* Ingredients */}
              <div className="relative w-[500px] h-[380px] border-2 border-black box-border">
                <div className="absolute top-[31px] left-[19px] uppercase tracking-[1.76px] leading-[16.5px]">
                  ingredients
                </div>

                <div className="absolute top-[76px] left-[18.5px] w-[461px] h-[284px] bg-[#ececec]/50 text-[#1e1e1e]">
                  <div className="absolute top-[19px] left-[20px] w-[421px] flex flex-col items-start gap-0">
                    {recipeIngredients.map((item, idx) => {
                      const isLast = idx === recipeIngredients.length - 1

                      return (
                      <div
                        key={item.label}
                        className={`w-full flex items-center justify-between gap-[20px] pt-[10px] pb-[15px] text-[17px] leading-[25.5px] ${
                          isLast ? '' : 'border-b border-black/40'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="tabular-nums text-right">
                          {item.amount}
                        </span>
                      </div>
                      )
                    })}
                  </div>
                </div>

                <div className="absolute top-[24px] left-[362.5px] flex items-center gap-[8.2px]">
                  <button
                    type="button"
                    onClick={() => setRecipeSalt('yes')}
                    className={`w-[54.5px] border-[1.1px] border-black px-[10.6px] py-[4.2px] flex flex-col items-center justify-center ${
                      recipeSalt === 'yes'
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    <span className="leading-[19.05px] text-[12.7px]">YES</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipeSalt('no')}
                    className={`w-[54.5px] border-[1.1px] border-black px-[10.6px] py-[4.2px] flex flex-col items-center justify-center ${
                      recipeSalt === 'no'
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    <span className="leading-[19.05px] text-[12.7px]">NO</span>
                  </button>
                </div>

                <div className="absolute top-[31px] left-[265.5px] uppercase tracking-[1.76px] leading-[16.5px]">
                  table salt
                </div>
              </div>

              {/* Instructions */}
              <div className="relative flex-1 min-w-[500px] h-[380px] border-2 border-black box-border">
                <div className="absolute top-[24px] left-[30.5px] uppercase tracking-[1.76px] leading-[16.5px]">
                  instructions
                </div>

                <ol className="absolute top-[76px] left-[30.5px] right-[30.5px] text-[#1e1e1e] text-[17px] leading-[100%] list-decimal pl-[23px]">
                  <li className="mb-[14px]">
                    Weigh out the fructose, maltodextrin, and pectin into a
                    heat‑safe container.
                  </li>
                  <li className="mb-[14px]">
                    Bring the water to a full boil in a separate vessel.
                  </li>
                  <li className="mb-[14px]">
                    Pour boiling water over the dry mix while whisking until
                    completely dissolved and smooth.
                  </li>
                  <li className="mb-[14px]">
                    If using salt, stir it in while the gel is still hot so
                    it dissolves evenly.
                  </li>
                  <li className="mb-0">
                    Let the gel cool, then pour into your flask using a small
                    funnel.
                  </li>
                </ol>

                <div className="absolute top-[288px] left-[30.5px] right-[30.5px] text-[14px] leading-[21.5px] text-[#1e1e1e]">
                  Flavor is optional but nice on long days: a splash of{' '}
                  <span className="underline">vanilla</span>, a drop of{' '}
                  <span className="underline">peppermint</span>, or a shot of{' '}
                  <span className="underline">strong espresso</span> all work
                  well. Keep liquids minimal so you don't dilute the carbs too
                  much.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer – mirrors Sounds tone */}
      <footer className="mt-5 md:mt-[60px]" />
    </div>
  )
}

function getIngredients(size, includeSalt, scale = 1) {
  const base =
    size === 250
      ? [
          { label: 'Fructose', grams: 100 },
          { label: 'Maltodextrin', grams: 200 },
          { label: 'Pectin', tsp: 0.5 },
          { label: 'Water (boiling)', grams: 200 },
        ]
      : [
          { label: 'Fructose', grams: 125 },
          { label: 'Maltodextrin', grams: 250 },
          { label: 'Pectin', tsp: 0.75 },
          { label: 'Water (boiling)', grams: 250 },
        ]

  if (includeSalt) {
    base.push({
      label: 'Table salt',
      tsp: size === 250 ? 0.5 : 1,
    })
  }

  const formatGrams = (value) => {
    const scaled = value * scale
    // Round to the nearest 5g (per your spec).
    const rounded5 = Math.round(scaled / 5) * 5
    return `${rounded5}g`
  }

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))

  const formatTsp = (value) => {
    const scaled = value * scale
    // Round to the nearest 1/4 tsp (per your spec).
    const roundedQuarterTsp = Math.round(scaled * 4) / 4

    const whole = Math.floor(roundedQuarterTsp + 1e-9) // tiny epsilon for float safety
    const frac = roundedQuarterTsp - whole
    const quarterNum = Math.round(frac * 4) // 0..3

    if (quarterNum === 0) return `${whole} tsp`

    const g = gcd(quarterNum, 4)
    const n = quarterNum / g
    const d = 4 / g

    if (whole === 0) return `${n}/${d} tsp`
    return `${whole} ${n}/${d} tsp`
  }

  return base.map((item) => {
    if (typeof item.grams === 'number') {
      return { label: item.label, amount: formatGrams(item.grams) }
    }
    return { label: item.label, amount: formatTsp(item.tsp) }
  })
}


