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
  const [recipeFlaskSize, setRecipeFlaskSize] = useState(250)
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

  // Filled overlay (fractional last flask)
  const flasksExact = fueling.totalCarbs / fueling.carbsPerFlask
  const fullFlasks = Math.floor(flasksExact)
  const remainderFlaskFraction = Math.min(1, Math.max(0, flasksExact - fullFlasks))
  const SEGMENTS_PER_FLASK = 4

  return (
    <div className="font-mono bg-white text-black min-h-screen">
      <style jsx global>{`
        html,
        body {
          background: #ffffff;
        }
      `}</style>
      {/* Main */}
      <main className="min-w-[375px] max-w-[1440px] mx-auto px-5 md:px-[60px] pt-6 pb-8 md:pt-8 md:pb-12">
        {/* Tabs row – brutalist pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'fueling', label: 'Fueling plan' },
            { id: 'recipe', label: 'Recipe' },
            { id: 'sodium', label: 'Sodium' },
            { id: 'run-log', label: 'Run log' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
          className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6 ${
            ''
          }`}
        >
          {/* Left side: main content per tab */}
          <section className="space-y-4">
            {activeTab === 'fueling' && (
              <>
                {/* Left panel (matches reference layout) */}
                <div className="border-2 border-black p-5">
                  {/* Hours out */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <div className="uppercase text-[11px] tracking-[0.16em]">
                          Hours out
                        </div>
                      </div>
                      <div className="text-[18px] md:text-[20px]">
                        {fueling.clampedHours.toFixed(1)}&nbsp;hr
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-black/60">1–14 h</div>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      step={0.5}
                      value={hoursOut}
                      onChange={(e) => setHoursOut(parseFloat(e.target.value))}
                      className="mt-3 w-full accent-black"
                    />
                  </div>

                  {/* Target carbs/hr */}
                  <div className="mb-10">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <div className="uppercase text-[11px] tracking-[0.16em]">
                          Target carbs/hr
                        </div>
                      </div>
                      <div className="text-[18px] md:text-[20px]">
                        {carbsPerHour.toFixed(0)}&nbsp;g/hr
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-black/60">60–90 g/hr</div>
                    <input
                      type="range"
                      min={60}
                      max={90}
                      step={5}
                      value={carbsPerHour}
                      onChange={(e) =>
                        setCarbsPerHour(parseInt(e.target.value, 10))
                      }
                      className="mt-3 w-full accent-black"
                    />
                  </div>

                  {/* Bottom stats row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="uppercase text-[11px] tracking-[0.16em]">
                        Total carbs(g) needed
                      </div>
                      <div className="mt-2 text-[40px] leading-none">
                        {Math.round(fueling.totalCarbs).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase text-[11px] tracking-[0.16em]">
                        No. of flasks
                      </div>
                      <div className="mt-2 text-[40px] leading-none">
                        {fueling.numberOfFlasks.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase text-[11px] tracking-[0.16em]">
                        Hr per flask
                      </div>
                      <div className="mt-2 text-[40px] leading-none">
                        {fueling.hoursPerFlask.toFixed(1)}&nbsp;hr
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'recipe' && (
              <>
                <h2 className="font-['Mondwest',_sans-serif] text-[24px] md:text-[28px] leading-tight tracking-tight">
                  Recipe
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {/* Flask size */}
                    <div className="border-2 border-black p-4">
                      <div className="flex justify-between items-baseline mb-3">
                        <div>
                          <div className="uppercase text-[11px] tracking-[0.16em]">
                            Flask size
                          </div>
                          <div className="text-[11px] text-black/60">
                            Matches the fueling tab math.
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {[250, 500].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setRecipeFlaskSize(size)}
                              className={`px-3 py-1 border border-black text-[12px] ${
                                recipeFlaskSize === size
                                  ? 'bg-black text-white'
                                  : 'bg-white hover:bg-black hover:text-white transition-colors'
                              }`}
                            >
                              {size} ml
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Salt toggle */}
                    <div className="border-2 border-black p-4">
                      <div className="flex justify-between items-baseline mb-3">
                        <div>
                          <div className="uppercase text-[11px] tracking-[0.16em]">
                            Salt in gel
                          </div>
                          <div className="text-[11px] text-black/60">
                            Adds table salt into the mix.
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['yes', 'no'].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRecipeSalt(value)}
                              className={`px-3 py-1 border border-black text-[12px] uppercase tracking-[0.12em] ${
                                recipeSalt === value
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

                    {/* Carb count */}
                    <div className="border-2 border-black p-4">
                      <div className="uppercase text-[11px] tracking-[0.16em] mb-1">
                        Carb count per flask
                      </div>
                      <div className="text-[18px]">
                        {CARBS_PER_FLASK[recipeFlaskSize].toLocaleString()} g
                      </div>
                      <div className="text-[11px] text-black/60">
                        using this recipe
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Ingredients */}
                    <div className="border-2 border-black p-4">
                      <div className="uppercase text-[11px] tracking-[0.16em] mb-3">
                        Ingredients
                      </div>
                      <div className="space-y-2 text-[13px]">
                        {getIngredients(recipeFlaskSize, recipeSalt === 'yes').map(
                          (item) => (
                            <div
                              key={item.label}
                              className="flex justify-between gap-4"
                            >
                              <span>{item.label}</span>
                              <span className="tabular-nums">
                                {item.amount}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="border-2 border-black p-4">
                      <div className="uppercase text-[11px] tracking-[0.16em] mb-2">
                        Steps
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[13px]">
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
                          If using salt, stir it in while the gel is still hot so
                          it dissolves evenly.
                        </li>
                        <li>
                          Let the gel cool, then pour into your flask using a
                          small funnel.
                        </li>
                      </ol>
                      <p className="mt-3 text-[11px] text-black/70">
                        Flavor is optional but nice on long days: a splash of{' '}
                        <span className="underline">vanilla</span>, a drop of{' '}
                        <span className="underline">peppermint</span>, or a shot
                        of strong <span className="underline">espresso</span>{' '}
                        all work well. Keep liquids minimal so you don&apos;t
                        dilute the carbs too much.
                      </p>
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
                <h2 className="font-['Mondwest',_sans-serif] text-[24px] md:text-[28px] leading-tight tracking-tight">
                  Run log
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <article className="border-2 border-black p-4 space-y-2 text-[13px]">
                    <h3 className="font-['Mondwest',_sans-serif] text-[18px] leading-tight tracking-tight">
                      March 15, 2026
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>2h27min · 8.82 mi · 3,205 ft</li>
                      <li>~226 g carbs total (~92 g/hr), 2 S-caps/hr</li>
                      <li>
                        Felt: <span className="underline">amazing</span>
                      </li>
                    </ul>
                  </article>

                  <article className="border-2 border-black p-4 space-y-2 text-[13px]">
                    <h3 className="font-['Mondwest',_sans-serif] text-[18px] leading-tight tracking-tight">
                      Arcellus → Larch Mtn
                    </h3>
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
                  </article>
                </div>
              </>
            )}
          </section>

          {/* Right side */}
          <aside className="space-y-4 items-start">
            {activeTab === 'fueling' && (
              <>
                <div className="border-2 border-black p-5 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="uppercase text-[11px] tracking-[0.16em]">
                        Flask visualizer
                      </div>
                      <div className="mt-1 text-[11px] text-black/60">
                        ~{CARBS_PER_FLASK[250]} g carbs for 250 ml, ~{CARBS_PER_FLASK[500]} g for 500 ml
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="uppercase text-[11px] tracking-[0.16em] text-black/60">
                        Flask size
                      </div>
                      <div className="flex gap-2">
                        {[250, 500].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setFlaskSize(size)}
                            disabled={size === 250 && fueling.clampedHours >= 12}
                            className={`px-2.5 py-1 border border-black text-[12px] ${
                              size === 250 && fueling.clampedHours >= 12
                                ? 'bg-white text-black/30 border-black/30 cursor-not-allowed'
                                : flaskSize === size
                                  ? 'bg-black text-white'
                                  : 'bg-white hover:bg-black hover:text-white transition-colors'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
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
        </div>
      </main>

      {/* Footer – mirrors Sounds tone */}
      <footer className="border-t-2 border-black mt-12" />
    </div>
  )
}

function getIngredients(size, includeSalt) {
  const base =
    size === 250
      ? [
          { label: 'Fructose', amount: '100 g' },
          { label: 'Maltodextrin', amount: '200 g' },
          { label: 'Pectin', amount: '½ tsp' },
          { label: 'Boiling water', amount: '200 g' },
        ]
      : [
          { label: 'Fructose', amount: '125 g' },
          { label: 'Maltodextrin', amount: '250 g' },
          { label: 'Pectin', amount: '¾ tsp' },
          { label: 'Boiling water', amount: '250 g' },
        ]

  if (includeSalt) {
    base.push({
      label: 'Table salt',
      amount: size === 250 ? '½ tsp (optional)' : '1 tsp (optional)',
    })
  }

  return base
}


