// Journal schema — field structure transcribed from "4 - recovery-journal-template.md".
// This file defines shape and labels only. Entries themselves are runtime state
// in localStorage (see components/mma-map/storage.js), not data here.

export const NUMBNESS_REGIONS = [
  { id: 'upperLipL', label: 'Upper lip', side: 'L' },
  { id: 'upperLipR', label: 'Upper lip', side: 'R' },
  { id: 'lowerLipL', label: 'Lower lip', side: 'L' },
  { id: 'lowerLipR', label: 'Lower lip', side: 'R' },
  { id: 'chinL', label: 'Chin', side: 'L' },
  { id: 'chinR', label: 'Chin', side: 'R' },
  { id: 'roofOfMouth', label: 'Roof of mouth (behind front teeth)', side: null },
  { id: 'cheeksL', label: 'Cheeks', side: 'L' },
  { id: 'cheeksR', label: 'Cheeks', side: 'R' },
]

// Collapses L/R pairs into one series per region for the trends view.
export const NUMBNESS_TREND_REGIONS = [
  { id: 'upperLip', label: 'Upper lip', fields: ['upperLipL', 'upperLipR'] },
  { id: 'lowerLip', label: 'Lower lip', fields: ['lowerLipL', 'lowerLipR'] },
  { id: 'chin', label: 'Chin', fields: ['chinL', 'chinR'] },
  { id: 'roofOfMouth', label: 'Roof of mouth', fields: ['roofOfMouth'] },
  { id: 'cheeks', label: 'Cheeks', fields: ['cheeksL', 'cheeksR'] },
]

export const SWELLING_TREND_OPTIONS = [
  { value: 'worse', label: 'Worse' },
  { value: 'same', label: 'Same' },
  { value: 'better', label: 'Better' },
]

export const RUBBER_BAND_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
  { value: 'off-to-eat', label: 'Off to eat only' },
]

export const BLEEDING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'spotting', label: 'Spotting' },
  { value: 'oozing', label: 'Oozing' },
  { value: 'heavy', label: 'Heavy, bright-red' },
]

export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const RED_FLAG_CHECK_ITEMS = [
  { id: 'breathingTrouble', text: 'Trouble breathing, or breathing that is noisy or takes effort' },
  { id: 'heavyNosebleed', text: 'Heavy bright-red nosebleed' },
  { id: 'visionOrEyePain', text: 'Sudden vision change, or severe pain behind an eye' },
  { id: 'chestOrCalfPain', text: 'Chest pain, or swelling and pain in one calf' },
  { id: 'suddenBiteShift', text: 'Sudden bite shift / feels completely different' },
  { id: 'spreadingRedness', text: 'Spreading redness / fever 101.5°F+ / foul taste or discharge' },
  { id: 'painWorsening', text: 'Pain worsening after it had improved, or not controlled by medicine' },
  { id: 'swellingIncreasing', text: 'Swelling increasing after it had gone down' },
  { id: 'vomitingOrFluids', text: 'Vomiting that won’t stop, or can’t keep liquids down' },
  { id: 'dehydrationSigns', text: 'Urinating much less than normal, or dizzy when standing' },
  { id: 'bandHookLoose', text: 'A rubber band, hook, wire, or splint comes loose and I can’t fix it' },
  { id: 'hardwarePoking', text: 'Hardware poking / feels exposed' },
]

export const DIET_STAGE_OPTIONS = [
  { value: 'no-chew', label: 'Still no-chew' },
  { value: 'bands-off-to-eat', label: 'Bands off to eat' },
  { value: 'other', label: 'Other' },
]

export const ARC_OPTIONS = ['Regret', 'Fog', 'Grief', 'Impatience', 'First light', 'Integration'].map((label) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
}))

export function emptyDailyEntry(dateStr) {
  return {
    date: dateStr,
    pain: { level: null, where: '', medsTaken: [], oxycodoneDosesToday: 0 },
    swelling: { level: null, vsYesterday: null, photoTaken: false },
    sleep: { hours: '', position: '', quality: null, noseBreathing: null },
    nutrition: { fluids: '', caloriesProtein: '', weight: '', notes: '' },
    numbness: Object.fromEntries(NUMBNESS_REGIONS.map((r) => [r.id, null])),
    numbnessTingling: '',
    numbnessNew: '',
    bite: { even: null, shiftSinceYesterday: '', rubberBands: null },
    nose: { congestion: null, bleeding: null, blowingAvoided: null },
    activity: { whatIDid: '', jawResponse: '', couldIHaveRun: null, whatStoppedMe: '' },
    mood: { oneLine: '', regretToday: null, pastTheHump: null },
    redFlags: Object.fromEntries(RED_FLAG_CHECK_ITEMS.map((i) => [i.id, false])),
    questionsForNextAppointment: '',
  }
}

export function emptyWeeklyEntry(weekNumber) {
  return {
    week: weekNumber,
    milestones: { followUpVisit: '', dietStage: null, firstTimeIDidAgain: '' },
    trajectory: { swellingVsLastWeek: '', painVsLastWeek: '', numbnessChange: '', sleepBetterThanPreSurgery: '', energy: null },
    runningQuestion: { couldIHaveRun: null, whatWouldHaveStoppedMe: '', feltGoodOrChore: '' },
    mental: { overall: null, arcPosition: null, whatHelped: '' },
    whatIWantToRemember: '',
    questionsAccumulating: '',
  }
}

export const REFERENCE_CHECKPOINTS = [
  { when: 'Day 3', expected: 'Peak swelling. Peak regret.' },
  { when: 'Week 1', expected: 'Rough. Sleep worse than before. ~1-week follow-up visit.' },
  { when: 'Weeks 1–2', expected: '"The hump" — lips start moving better, drooling ends.' },
  { when: 'Week 2', expected: 'Large chunk of swelling gone. Surgeons’ clearance for light exercise.' },
  { when: 'Week 3', expected: 'Back to most normal activities.' },
  { when: 'Weeks 5–6', expected: 'Face recognizably yours. ~6-week follow-up — likely the last if healing is clean.' },
  { when: '6 weeks', expected: 'No-chew ends. Bone has healed; hardware doing less.' },
  { when: '4–5 months', expected: 'Soft tissue mostly remodeled. Lower-lip nerve begins healing — first real read on numbness.' },
  { when: '6 months', expected: 'Sleep study (confirm timing).' },
  { when: '6–12 months', expected: 'Numbness recovery window. A residual patch is the common permanent outcome, if any.' },
  { when: '~12 months', expected: 'Lingering numbness considered permanent. Face done settling.' },
]

export const JOURNAL_INTRO =
  'Both surgeons said outcomes are individual — "we’ll see where you land," especially on the bite and the numbness. A daily log makes your follow-ups sharper and catches a drifting bite early. Copy the daily block each day; fill the weekly summary each Sunday.'
