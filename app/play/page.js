import PlayIndex from '../../components/PlayIndex'
import { BUILDS } from '../../lib/builds'

export const metadata = {
  title: 'Jon Schafer — Play',
  description: 'Vibe coded ideas, full-on projects and side quests.',
}

const projects = [
  {
    id: 'backgammon',
    name: 'Backgammon',
    description:
      'I wanted to learn backgammon while playing it, the way chess.com teaches chess. Every site I tried makes you look up the rules somewhere else. Here a coach narrates the game as it happens: why Brown just hit you, what your roll can do, a grade on every move with the better play drawn on the board, and red counts on your blots showing how many of 36 rolls hit them. Easy, medium and hard.',
    date: '2026.11.23',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/backgammon',
  },
  {
    id: 'backyard',
    name: 'Backyard',
    description:
      'We keep talking about a hot tub, a sauna and maybe an ADU out back. They all fight for the same small city yard and the same electrical panel, so I researched them together: what each costs to buy and run, salt vs chlorine, sauna health claims sorted by how good the evidence is, house rules for teens and their friends, Portland ADU rules and tenant law, and how it all fits on a 50 × 100 lot.',
    date: '2026.11.23',
    type: 'HTML/CSS',
    tags: ['Research', 'Claude'],
    path: '/play/prototypes/backyard',
  },
  {
    id: 'carscout',
    name: 'carscout',
    description:
      'My son needs a first car and I am not a car guy. This reads every AWD listing on Craigslist Portland under $10k, grades it against the good and bad model years, NHTSA recalls, mileage and what the seller wrote, and explains every car term in plain English. Plus a test drive checklist, how long it will last, and insuring a teen. A read-only snapshot of the tool I run on my laptop.',
    date: '2026.11.23',
    type: 'HTML/CSS',
    tags: ['Python', 'Claude'],
    path: '/play/prototypes/carscout',
  },
  {
    id: 'piano-practice',
    name: 'Piano practice',
    description:
      'Plug a MIDI keyboard into Chrome and every note you play lands on the staff right where you are in the song. Hit what is written and it turns green and the cursor moves on; miss and you see the wrong note in red at its real pitch. Load any MusicXML file, practice one hand at a time, and pick a sound: grand, felt piano, Rhodes-style EP, organ or pad.',
    date: '2026.11.16',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'JavaScript', 'Web MIDI'],
    path: '/play/prototypes/piano-practice',
  },
  {
    id: 'row',
    name: 'Erg log',
    description:
      'Strava skips PRs for rowing, so I built my own. Every row I finish lands here by webhook with its splits, PRs against everything before it, and goals for a 2k and pace. I leave a note on Strava about what hurt, and Claude writes back with the why, the strength work to fix it, and the next piece to row.',
    date: '2026.10.22',
    type: 'REACT',
    tags: ['React', 'Next.js', 'Claude'],
    path: '/row',
  },
  {
    id: 'git',
    name: 'Git, drawn out',
    description:
      'The git commands I kept re-learning, animated and explained in plain English. Branch, merge, rebase, stash, worktree, cherry-pick, reset and revert, plus the branch versus worktree thing that took me forever to get straight.',
    date: '2026.09.09',
    type: 'REACT',
    tags: ['React', 'Next.js'],
    path: '/play/git',
  },
  {
    id: 'two-day-ledger',
    name: 'Two-Day Ledger',
    description:
      'A 24-week strength program built around two full-body sessions a week. Logs weight and reps per set, surfaces last session\'s numbers next to every input, and charts bodyweight and key lifts across the four phases.',
    date: '2026.09.09',
    type: 'HTML/CSS',
    tags: ['HTML/CSS', 'JavaScript'],
    path: '/play/prototypes/two-day-ledger',
  },
  {
    id: 'sounds',
    name: 'Sounds',
    description:
      'A music blog. YouTube audio playback with links to Spotify, Apple Music, Tidal. Brutalist design, random colors on hover.',
    date: '2026.02.05',
    type: 'MUSIC',
    tags: ['React', 'Next.js'],
    path: '/play/sounds',
  },
  {
    id: 'gels',
    name: 'Gels',
    description:
      'DIY running gel calculator: fueling plan, recipe scaling, interactive sodium citrate and potassium chloride (+ pacing caps), and live batch sodium.',
    date: '2026.03.17',
    type: 'HTML/CSS',
    tags: ['React', 'Next.js'],
    path: '/play/gels',
  },
  {
    id: 'spina',
    name: 'Spina',
    description: 'Helping a friend with her illustration side hustle. A straightforward guide for selling art online without being tech savvy.',
    date: '2026.01.24',
    type: 'HTML/CSS',
    tags: ['HTML/CSS'],
    path: '/play/prototypes/spina'
  },
  {
    id: 'vibe-coding-setup',
    name: 'Vibes',
    description: 'Complete guide to setting up your environment for vibe coding with Figma designs, Cursor, GitHub, Vercel, and Supabase. Step-by-step instructions to create a seamless workflow from design to deployment.',
    date: '2026.01.15',
    type: 'TUTORIAL',
    tags: ['Tutorial', 'Next.js'],
    path: '/play/vibe-coding-setup'
  },
  {
    id: 'sourdough',
    name: 'Sourdough',
    description: 'Complete guide to baking sourdough weekly at home. Includes recipes, starter maintenance, glossary, troubleshooting, FAQ, and equipment recommendations. Everything you need to master the art of sourdough.',
    date: '2025.11.15',
    type: 'REACT',
    tags: ['React', 'Food'],
    path: '/play/prototypes/sourdough'
  },
  {
    id: 'pull-ups',
    name: 'Get yer first pull-up',
    description: 'He owns two pull up bars. Isn\'t time he can do a pull up? Let\'s find out. A progressive training guide with video demonstrations, workout tracking, and personalized routines to build strength.',
    date: '2025.09.05',
    type: 'REACT',
    tags: ['React', 'JavaScript'],
    path: '/play/prototypes/pull-ups/v2'
  }
]

// Build write-ups (lib/builds.js) sit in the same grid as everything else.
const builds = BUILDS.map((b) => ({ id: b.slug, name: b.name, description: b.card, date: b.date, tags: b.tags, path: `/play/${b.slug}` }))

export default function PlayPage() {
  return <PlayIndex projects={[...builds, ...projects]} />
}
