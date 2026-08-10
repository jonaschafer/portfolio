'use client'

import { useState } from 'react'
import MmaRecoveryChapterLayers from './MmaRecoveryChapterLayers'
import MmaRecoveryShareButton from './MmaRecoveryShareButton'

const STATUS_WORD = { past: 'lived', current: 'now', upcoming: 'planned' }

export default function MmaRecoveryLongScrollEntry({ chapter, phases, milestones, checkpoints, isPartOpener, partMeta }) {
  const hasEntries = chapter.entries && chapter.entries.length > 0
  const [layer, setLayer] = useState(hasEntries ? 'story' : 'body')

  return (
    <div id={chapter.anchor} className="scroll-mt-[40px] py-[36px] border-t" style={{ borderColor: '#f0e9d9' }}>
      {isPartOpener && (
        <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] tracking-[0.14em] uppercase mb-[14px]" style={{ color: '#7c8a6d' }}>
          {partMeta.label} — {partMeta.title}
        </div>
      )}

      <div className="flex items-baseline justify-between gap-[16px] flex-wrap mb-[6px]">
        <h2 className="font-['Fraunces',_serif] text-[28px] leading-[1.15]" style={{ color: '#2b2015' }}>
          {chapter.title}
        </h2>
        <MmaRecoveryShareButton anchor={chapter.anchor} />
      </div>
      <p className="text-[13px] italic mb-[16px]" style={{ color: '#a99b7f' }}>
        {chapter.dateRange} — {STATUS_WORD[chapter.status]}
      </p>

      <p className="text-[15px] leading-[1.6] mb-[20px] max-w-[600px]" style={{ color: '#4a3b2c' }}>
        {chapter.summary}
      </p>

      <div className="flex items-center gap-[18px] mb-[18px]">
        {[
          ['story', 'Story'],
          ['body', 'Body'],
          ['head', 'Head'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setLayer(key)}
            className="mma-btn-press text-[13px] pb-[6px]"
            style={{
              color: layer === key ? '#2b2015' : '#a99b7f',
              borderBottom: '1.5px solid ' + (layer === key ? '#7c8a6d' : 'transparent'),
              transition: 'border-color 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <MmaRecoveryChapterLayers chapter={chapter} phases={phases} milestones={milestones} checkpoints={checkpoints} layer={layer} />
    </div>
  )
}
