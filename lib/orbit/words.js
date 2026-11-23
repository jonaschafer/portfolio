import { ago } from './time'

// "It's been 2 months since Lael. Coffee at Old Friends?"
export function nudgeLine(person, s) {
  const lead = s.since === null ? `No hang logged with ${person.name} yet.` : `It's been ${ago(s.since)} since ${person.name}.`
  return s.idea ? `${lead} ${s.idea}?` : lead
}
