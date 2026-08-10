'use client'

import { useEffect, useState } from 'react'
import chaptersData from '../app/mma/data/chapters.json'
import milestonesData from '../app/mma/data/milestones.json'
import trainingData from '../app/mma/data/training-weeks.json'
import psychologyData from '../app/mma/data/psychology-checkpoints.json'
import MmaRecoveryLongScrollEntry from './MmaRecoveryLongScrollEntry'

function getStatus(startDate, endDate, today) {
  const s = new Date(startDate + 'T00:00:00Z')
  const e = new Date(endDate + 'T23:59:59Z')
  if (today < s) return 'upcoming'
  if (today > e) return 'past'
  return 'current'
}

export default function MmaRecoveryLongScroll() {
  const [today, setToday] = useState(null)

  useEffect(() => {
    setToday(new Date())
  }, [])

  const chapters = chaptersData.chapters.map((c) => ({
    ...c,
    status: today ? getStatus(c.startDate, c.endDate, today) : 'upcoming',
  }))

  const phaseById = Object.fromEntries(trainingData.phases.map((p) => [p.id, p]))
  const seenParts = new Set()

  return (
    <div style={{ backgroundColor: '#FDFBF7' }} className="min-h-screen px-[40px] py-[60px]">
      <div className="max-w-[720px] mx-auto">
        {chapters.map((chapter) => {
          const isPartOpener = !seenParts.has(chapter.part)
          seenParts.add(chapter.part)
          const partMeta = chaptersData.parts.find((p) => p.id === chapter.part)
          const phases = chapter.phaseIds.map((id) => phaseById[id]).filter(Boolean)
          const milestones = milestonesData.milestones.filter((m) => m.anchor === chapter.anchor)
          const checkpoints = psychologyData.checkpoints.filter((cp) => cp.anchor === chapter.anchor)

          return (
            <MmaRecoveryLongScrollEntry
              key={chapter.id}
              chapter={chapter}
              phases={phases}
              milestones={milestones}
              checkpoints={checkpoints}
              isPartOpener={isPartOpener}
              partMeta={partMeta}
            />
          )
        })}
      </div>
    </div>
  )
}
