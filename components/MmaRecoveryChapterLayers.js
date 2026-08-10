import MmaRecoveryCollapsible from './MmaRecoveryCollapsible'
import MmaRecoveryTrainingGrid from './MmaRecoveryTrainingGrid'
import MmaRecoveryRecoveryKit from './MmaRecoveryRecoveryKit'
import { buildIcsDataUri } from '../lib/mma-recovery-ics'

const CALENDAR_WORTHY = new Set(['gate', 'appointment'])

function formatShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// Renders whichever of Story / Body / Head is active for a chapter. Shared between the
// mobile card viewer and the desktop long-scroll so the two never drift out of sync.
export default function MmaRecoveryChapterLayers({ chapter, phases, milestones, checkpoints, layer }) {
  return (
    <div
      key={layer}
      style={{ animation: 'mmaFadeSlideUp 220ms cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <MmaRecoveryChapterLayerContent chapter={chapter} phases={phases} milestones={milestones} checkpoints={checkpoints} layer={layer} />
    </div>
  )
}

function MmaRecoveryChapterLayerContent({ chapter, phases, milestones, checkpoints, layer }) {
  const hasEntries = chapter.entries && chapter.entries.length > 0
  const isOtherPart = chapter.part === 'other'
  const knownNowTopics = isOtherPart ? [] : chapter.topics

  if (layer === 'story') {
    return hasEntries ? (
      <div className="space-y-[14px]">
        {chapter.entries.map((entry, i) => (
          <div key={i}>
            <div className="text-[12px] mb-[3px]" style={{ color: '#a99b7f' }}>{formatShort(entry.date)}</div>
            <p className="text-[15px] leading-[1.6]" style={{ color: '#3a2c1e' }}>{entry.body}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[14px] leading-[1.6] italic max-w-[560px]" style={{ color: '#a99b7f' }}>
        Not written yet. This is where the real account of {chapter.title.toLowerCase()} goes once it
        happens — not what the plan predicted.
      </p>
    )
  }

  if (layer === 'body') {
    return (
      <div className="max-w-[600px]">
        {isOtherPart && chapter.topics.length > 0 && (
          <ul className="space-y-[10px] mb-[18px]">
            {chapter.topics.map((topic, i) => (
              <li key={i} className="text-[14px] leading-[1.55]" style={{ color: '#4a3b2c' }}>— {topic}</li>
            ))}
          </ul>
        )}

        {knownNowTopics.length > 0 && (
          <ul className="space-y-[10px] mb-[18px]">
            {knownNowTopics.map((topic, i) => (
              <li key={i} className="text-[14px] leading-[1.55]" style={{ color: '#4a3b2c' }}>— {topic}</li>
            ))}
          </ul>
        )}

        {milestones && milestones.length > 0 && (
          <div className="space-y-[8px] mb-[18px]">
            {milestones.map((m) => {
              const icsHref = CALENDAR_WORTHY.has(m.type)
                ? buildIcsDataUri({ title: `${m.label}${m.tentative ? ' (tentative)' : ''}`, description: 'MMA recovery — jonschafer.com/mma-recovery', date: m.date, time: m.time })
                : null
              return (
                <div key={m.date + m.label} className="text-[13px]" style={{ color: '#4a3b2c' }}>
                  <span style={{ color: '#7c8a6d' }}>→ </span>
                  {m.label}{m.tentative ? ' (tentative)' : ''}
                  <span style={{ color: '#a99b7f' }}> · {formatShort(m.date)}{m.time ? ` · ${m.time}` : ''}</span>
                  {icsHref && (
                    <>
                      {' '}
                      <a href={icsHref} download={`${m.label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`} className="underline" style={{ color: '#7c8a6d' }}>
                        add to calendar
                      </a>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <MmaRecoveryRecoveryKit anchor={chapter.anchor} />

        {phases && phases.length > 0 && (
          <div>
            {phases.map((phase) => (
              <MmaRecoveryCollapsible key={phase.id} label={`Detailed plan — ${phase.label}`}>
                <MmaRecoveryTrainingGrid phase={phase} />
              </MmaRecoveryCollapsible>
            ))}
          </div>
        )}
      </div>
    )
  }

  // layer === 'head'
  return (
    <div className="space-y-[12px] max-w-[560px]">
      {checkpoints && checkpoints.length > 0 ? (
        checkpoints.map((cp) => (
          <p key={cp.id} className="font-['Fraunces',_serif] italic text-[17px] leading-[1.5]" style={{ color: '#3a2c1e' }}>
            {cp.label && <span className="font-['Haas_Grot_Disp',_sans-serif] not-italic text-[11px] uppercase tracking-[0.1em] mr-[8px]" style={{ color: '#a99b7f' }}>{cp.label}</span>}
            This may look like {cp.physicalState.toLowerCase()}, {cp.emotionalState.toLowerCase()}. What tends to help: {cp.whatHelps.toLowerCase()}.
          </p>
        ))
      ) : chapter.psychologyNote ? (
        <p className="font-['Fraunces',_serif] italic text-[17px] leading-[1.5]" style={{ color: '#3a2c1e' }}>
          This may look like {chapter.psychologyNote.toLowerCase()}
        </p>
      ) : (
        <p className="text-[14px] italic" style={{ color: '#a99b7f' }}>Nothing checkpointed for this stage.</p>
      )}
    </div>
  )
}
