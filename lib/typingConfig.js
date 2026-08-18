// Config for the /typing daily practice page. Edit freely — no other
// code should need to change when you tweak names, ages, or targets.

export const PROFILES = [
  { id: 'kid1', name: 'Kid 1', age: 11, tier: 'easier', emoji: '🦄', color: '#ff5d8f' },
  { id: 'kid2', name: 'Kid 2', age: 14, tier: 'harder', emoji: '🐉', color: '#3aa0ff' },
]

// A profile is "done for today" once they've accumulated this many seconds
// of active typing (across as many short passages as it takes) with an
// overall accuracy at or above the threshold below.
export const SESSION_GOAL_SECONDS = 5 * 60
export const MIN_ACCURACY_PCT = 90

export const STORAGE_KEY = 'typingPractice.v1'
