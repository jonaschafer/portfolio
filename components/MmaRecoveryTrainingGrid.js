function formatShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

const CARD_STYLE = { backgroundColor: '#FFFFFF', boxShadow: '0 24px 50px -28px rgba(90, 70, 40, 0.22)' }

function WeekGrid({ weeks }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={CARD_STYLE}>
      {/* Mobile: stacked cards, one per week — a horizontally-scrolling table is a bad read on a phone */}
      <div className="sm:hidden divide-y" style={{ borderColor: '#f1ede2' }}>
        {weeks.map((w) => (
          <div key={w.range} className="p-[16px]" style={{ borderColor: '#f1ede2' }}>
            <div className="flex items-baseline gap-[8px] mb-[10px]">
              <span className="font-['Haas_Grot_Disp',_sans-serif] text-[13px]" style={{ color: '#2b2015' }}>Wk {w.range}</span>
              <span className="text-[11px]" style={{ color: '#a99b7f' }}>{formatShort(w.startDate)} – {formatShort(w.endDate)}</span>
            </div>
            <div className="space-y-[6px] text-[13px]">
              <div><span style={{ color: '#a99b7f' }}>Running: </span><span style={{ color: '#4a3b2c' }}>{w.running}</span></div>
              <div><span style={{ color: '#a99b7f' }}>Strength: </span><span style={{ color: '#4a3b2c' }}>{w.strength}</span></div>
              <div><span style={{ color: '#a99b7f' }}>Cross-train: </span><span style={{ color: '#4a3b2c' }}>{w.crossTrain}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-[13px]" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              {['Week', 'Running', 'Strength', 'Cross-train'].map((h) => (
                <th
                  key={h}
                  className="text-left font-['Haas_Grot_Disp',_sans-serif] text-[11px] tracking-[0.12em] uppercase px-[16px] py-[14px]"
                  style={{ color: '#a99b7f' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.range} style={{ borderTop: '1px solid #f1ede2' }}>
                <td className="align-top px-[16px] py-[14px] whitespace-nowrap">
                  <div className="font-['Haas_Grot_Disp',_sans-serif]" style={{ color: '#2b2015' }}>Wk {w.range}</div>
                  <div className="text-[11px]" style={{ color: '#a99b7f' }}>
                    {formatShort(w.startDate)} – {formatShort(w.endDate)}
                  </div>
                </td>
                <td className="align-top px-[16px] py-[14px]" style={{ color: '#4a3b2c' }}>{w.running}</td>
                <td className="align-top px-[16px] py-[14px]" style={{ color: '#4a3b2c' }}>{w.strength}</td>
                <td className="align-top px-[16px] py-[14px]" style={{ color: '#4a3b2c' }}>{w.crossTrain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WeeklyTemplate({ weeklyTemplate, stats }) {
  return (
    <div>
      <div className="rounded-[14px] overflow-hidden mb-[20px]" style={CARD_STYLE}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]" style={{ minWidth: 320 }}>
            <tbody>
              {weeklyTemplate.map((row, i) => (
                <tr key={row.day} style={i > 0 ? { borderTop: '1px solid #f1ede2' } : undefined}>
                  <td className="px-[16px] py-[12px] font-['Haas_Grot_Disp',_sans-serif] whitespace-nowrap" style={{ color: '#7c8a6d' }}>
                    {row.day}
                  </td>
                  <td className="px-[16px] py-[12px]" style={{ color: '#4a3b2c' }}>{row.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[14px]">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[11px] font-['Haas_Grot_Disp',_sans-serif] tracking-[0.12em] uppercase mb-[3px]" style={{ color: '#a99b7f' }}>
                {s.label}
              </div>
              <div className="text-[13px]" style={{ color: '#2b2015' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Benchmarks({ benchmarks, timeline }) {
  return (
    <div>
      {timeline && timeline.length > 0 && (
        <div className="rounded-[14px] overflow-hidden mb-[20px]" style={CARD_STYLE}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]" style={{ minWidth: 320 }}>
              <tbody>
                {timeline.map((t, i) => (
                  <tr key={t.tier} style={i > 0 ? { borderTop: '1px solid #f1ede2' } : undefined}>
                    <td className="px-[16px] py-[12px] font-['Haas_Grot_Disp',_sans-serif] whitespace-nowrap" style={{ color: '#7c8a6d' }}>
                      {t.tier}
                    </td>
                    <td className="px-[16px] py-[12px]" style={{ color: '#4a3b2c' }}>{t.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {benchmarks && benchmarks.length > 0 && (
        <ul className="space-y-[7px]">
          {benchmarks.map((b, i) => (
            <li key={i} className="flex items-start gap-[8px] text-[13px]" style={{ color: '#4a3b2c' }}>
              <span className="mt-[6px] w-[3px] h-[3px] rounded-full flex-shrink-0" style={{ backgroundColor: '#7c8a6d' }} />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function MmaRecoveryTrainingGrid({ phase }) {
  return (
    <div>
      {phase.weeks && <WeekGrid weeks={phase.weeks} />}
      {phase.weeklyTemplate && <WeeklyTemplate weeklyTemplate={phase.weeklyTemplate} stats={phase.stats} />}
      {(phase.benchmarks || phase.timeline) && <Benchmarks benchmarks={phase.benchmarks} timeline={phase.timeline} />}
      {phase.notes && phase.notes.length > 0 && (
        <ul className="space-y-[7px] pt-[18px] mt-[18px] border-t" style={{ borderColor: '#f0e9d9' }}>
          {phase.notes.map((n, i) => (
            <li key={i} className="flex items-start gap-[8px] text-[13px] leading-[1.5]" style={{ color: '#8a7c68' }}>
              <span className="mt-[6px] w-[3px] h-[3px] rounded-full flex-shrink-0" style={{ backgroundColor: '#a99b7f' }} />
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
