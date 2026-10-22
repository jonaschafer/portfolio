import Image from 'next/image'

// Quotes from people Jon has worked with, shown inline on the homepage as
// pull quotes (trimmed `pull` text, falling back to `quote`). Slots follow
// a rhythm: 3 projects, quote, then a quote every 2 projects. A quote with
// `after` (a project slug) is pinned to that project; the rest fill the
// open slots in order. Anything left over sits in the Friends section at
// the bottom as cards. A quote set to null is a placeholder and doesn't show.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

export const TESTIMONIALS = [
  {
    quote: "Jon is a maker and a thinker. A dangerous combination. And with a wonderful 'can-do' attitude sprinkled on top, you got yourself one hell of a teammate on your side. Whenever Jon is involved, I know the project is in good hands.",
    name: 'Shachar Aylon',
    photo: '/images/people/shachar-aylon.jpg',
    title: 'Founder, Dawn',
    linkedin: 'https://www.linkedin.com/in/saylon/',
    pull: null,
  },
  {
    // Placeholder: Proof dept offered to write something up.
    quote: null,
    pull: null,
    name: 'Proof dept',
    photo: null,
    title: '',
    linkedin: null,
  },
  {
    quote: "Jon is an extremely talented visual thinker and designer. He is fast, focused and capable of handling multiple projects simultaneously while moving them forward and meeting client objectives. Jon's positive attitude and energy were a real asset to our small studio dynamic. He is a thoughtful, generous person, and a very gifted designer and problem solver.",
    name: 'Lael Tyler',
    photo: '/images/people/lael-tyler.jpg',
    title: 'Creative Director, Cast Iron Coding',
    linkedin: 'https://www.linkedin.com/in/laeltyler/',
    pull: "Jon's positive attitude and energy were a real asset to our small studio dynamic. He is a thoughtful, generous person, and a very gifted designer and problem solver.",
  },
  {
    quote: "Jon has a knack for creating visual stories that stand out—a talent worth its weight in gold. He's always one to offer a fresh perspective, to challenge the status quo, and to riff on ideas big & small. In short: everything he touches packs the right amount of punch (and has a hint of sparkle). He's an amazing collaborator and curious problem solver, always looking to find the right balance between a variety of needs. We've been so lucky to have him on the team at Clockwise and his impact will last for a very long time.",
    name: 'Kacy Boone',
    photo: '/images/people/kacy-boone.jpg',
    title: 'Senior Director, Growth Marketing, Hover',
    linkedin: 'https://www.linkedin.com/in/kacyboone/',
    pull: "He's always one to offer a fresh perspective, to challenge the status quo, and to riff on ideas big & small. Everything he touches packs the right amount of punch (and has a hint of sparkle).",
    after: 'clockwise-rebrand',
  },
  {
    quote: "Jon loves design and he really stays on top of industry trends and tech possibilities. He's got great enthusiasm for ideas, and is very methodical in the way he approaches design, creating helpful and organized systems that make things easier for everyone on the team. He's also an all-around nice guy, which is always a treat.",
    name: 'Kate McCagg',
    photo: '/images/people/kate-mccagg.jpg',
    title: 'Global Head, Brand Innovation Lab, Amazon Ads',
    linkedin: 'https://www.linkedin.com/in/kate-mccagg-82b9343/',
    pull: "He's got great enthusiasm for ideas, and is very methodical in the way he approaches design, creating helpful and organized systems that make things easier for everyone on the team.",
  },
  {
    quote: "I've had the pleasure of working alongside Jon for over a year. Jon is consistently curious which is a necessity in product development. This combined with a methodical approach and desire to delight customers pushes our team to develop better solutions. He's always willing to learn and is a force for collaboration on the team. His passion for the details shows up in the quality of his work.",
    name: 'Chris Geoghegan',
    photo: '/images/people/chris-geohegan.jpg',
    title: 'VP, Product, Ashby',
    linkedin: 'https://www.linkedin.com/in/chrisgeoghegan/',
    pull: 'Jon is consistently curious, which is a necessity in product development. His passion for the details shows up in the quality of his work.',
    after: 'growlers',
  },
]

// Headshot, or initials in the theme ink until a photo is set.
function Face({ name, photo, theme }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <span
      className={`${social} relative shrink-0 w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full overflow-hidden flex items-center justify-center text-[17px]`}
      style={{ backgroundColor: theme.ink, color: theme.bg }}
    >
      {photo ? <Image src={photo} alt="" fill sizes="64px" className="object-cover" /> : initials}
    </span>
  )
}

function Caption({ t, theme }) {
  return (
    <figcaption className={`${social} flex items-center gap-[16px] md:gap-[20px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
      <Face name={t.name} photo={t.photo} theme={theme} />
      <span>
        {t.linkedin ? (
          <a
            href={t.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block underline decoration-1 underline-offset-[3px] decoration-current/30 hover:decoration-current transition-[text-decoration-color] duration-150"
          >
            {t.name}
          </a>
        ) : (
          <span className="block">{t.name}</span>
        )}
        {t.title && <span className="block opacity-60">{t.title}</span>}
      </span>
    </figcaption>
  )
}

const ready = (t) => t.quote || t.pull

// Which quote follows which project: { slug: quote }, plus what's left over.
export function placeQuotes(slugs) {
  const live = TESTIMONIALS.filter(ready)
  const placed = {}
  live.filter((t) => t.after && slugs.includes(t.after)).forEach((t) => (placed[t.after] = t))
  const open = slugs.filter((slug, i) => i >= 2 && (i - 2) % 2 === 0 && !placed[slug])
  const loose = live.filter((t) => !t.after || !slugs.includes(t.after))
  open.forEach((slug) => loose.length && (placed[slug] = loose.shift()))
  return { placed, rest: loose }
}

// One quote between projects, in an outlined pill the width of the
// slideshow column. Upright Nichrome with a hanging open quote, per the
// Oct 26 Figma (Website + Deck, node 112:14818).
export function PullQuote({ t, theme }) {
  return (
    <figure className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-[48px]">
      <div
        className="lg:col-span-9 border-2 rounded-[40px] md:rounded-[120px] desktop:rounded-[190px] px-[32px] py-[48px] md:px-[96px] md:py-[96px] desktop:px-[160px] desktop:py-[130px] flex flex-col gap-[28px] md:gap-[41px]"
        style={{ borderColor: theme.ink }}
      >
        <blockquote className={`${nichrome} indent-[-0.45em] text-[24px] md:text-[30px] desktop:text-[36px] leading-[1.2] tracking-[0.01em]`}>
          &ldquo;{t.pull || t.quote}&rdquo;
        </blockquote>
        <Caption t={t} theme={theme} />
      </div>
    </figure>
  )
}

export default function TestimonialsSection({ theme, rest }) {
  rest = rest.filter((t) => t.quote)
  if (!rest.length) return null
  return (
    <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
      <h2 className={`${nichromeUltra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>
        Friends
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
        {rest.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between gap-[32px] md:gap-[40px] border-t pt-[16px] md:pt-[20px]"
            style={{ borderColor: `${theme.ink}40` }}
          >
            <blockquote className={`${nichrome} italic text-[18px] md:text-[21px] leading-[1.45] tracking-[0.2px]`}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <Caption t={t} theme={theme} />
          </figure>
        ))}
      </div>
    </section>
  )
}
