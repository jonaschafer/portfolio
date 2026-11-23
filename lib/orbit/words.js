import { ago, slotLabel } from './time'

// "It's been 2 months since Lael. Coffee at Old Friends?"
export function nudgeLine(person, s) {
  const lead = s.since === null ? `No hang logged with ${person.name} yet.` : `It's been ${ago(s.since)} since ${person.name}.`
  return s.idea ? `${lead} ${s.idea}?` : lead
}

// The push: "hey, reach out to Lael. it's been 8 weeks."
export function pushLine(person, s) {
  const gap = s.since === null ? "it's been a while" : `it's been ${ago(s.since)}`
  return `hey, reach out to ${person.name}. ${gap}.${s.idea ? ` maybe ${lowerFirst(s.idea)}?` : ''}`
}

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)

// The text Jon pastes into Messages, times written out so nobody has to click anything.
export function askText(person, idea, slots) {
  const hi = person.is_group ? 'all' : person.name.split(/[ +]/)[0]
  const what = idea ? `${idea} sometime?` : 'wanna hang?'
  const times = slots.map((s) => `- ${slotLabel(s.start).replace(' · ', ' at ')}`).join('\n')
  return `hey ${hi}! it's been a min. ${what} i'm free:\n${times}\nany of those work for ya?`
}
