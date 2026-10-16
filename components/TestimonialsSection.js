import Image from 'next/image'

// Quotes from people Jon has worked with, as cards on the page's theme.
// A hairline top rule in the theme ink, same as the /play cards.
const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

const TESTIMONIALS = [
  {
    quote: "Jon is an extremely talented visual thinker and designer. He is fast, focused and capable of handling multiple projects simultaneously while moving them forward and meeting client objectives. Jon's positive attitude and energy were a real asset to our small studio dynamic. He is a thoughtful, generous person, and a very gifted designer and problem solver.",
    name: 'Lael Tyler',
    photo: '/images/people/lael-tyler.jpg',
    title: 'Creative Director, Cast Iron Coding',
  },
  {
    quote: "Jon has a knack for creating visual stories that stand out—a talent worth its weight in gold. He's always one to offer a fresh perspective, to challenge the status quo, and to riff on ideas big & small. In short: everything he touches packs the right amount of punch (and has a hint of sparkle). He's an amazing collaborator and curious problem solver, always looking to find the right balance between a variety of needs. We've been so lucky to have him on the team at Clockwise and his impact will last for a very long time.",
    name: 'Kacy Boone',
    photo: '/images/people/kacy-boone.jpg',
    title: 'VP of Marketing, Clockwise',
  },
  {
    quote: "Jon loves design and he really stays on top of industry trends and tech possibilities. He's got great enthusiasm for ideas, and is very methodical in the way he approaches design, creating helpful and organized systems that make things easier for everyone on the team. He's also an all-around nice guy, which is always a treat.",
    name: 'Kate McCagg',
    photo: '/images/people/kate-mccagg.jpg',
    title: 'Head of Brand Innovation Lab, Amazon',
  },
  {
    quote: "I've had the pleasure of working alongside Jon for over a year. Jon is consistently curious which is a necessity in product development. This combined with a methodical approach and desire to delight customers pushes our team to develop better solutions. He's always willing to learn and is a force for collaboration on the team. His passion for the details shows up in the quality of his work.",
    name: 'Chris Geohegan',
    photo: '/images/people/chris-geohegan.jpg',
    title: 'VP of Product, Zapier',
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

export default function TestimonialsSection({ theme }) {
  return (
    <section className="px-[20px] md:px-[26px] pb-[80px] md:pb-[120px]">
      <h2 className={`${nichromeUltra} text-[26px] md:text-[30px] leading-none tracking-[0.3px] mb-[24px] md:mb-[32px]`}>
        Friends
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[48px] gap-y-[48px] md:gap-y-[64px]">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between gap-[32px] md:gap-[40px] border-t pt-[16px] md:pt-[20px]"
            style={{ borderColor: `${theme.ink}40` }}
          >
            <blockquote className={`${nichrome} italic text-[18px] md:text-[21px] leading-[1.45] tracking-[0.2px]`}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className={`${social} flex items-center gap-[16px] md:gap-[20px] text-[16px] md:text-[17px] leading-[1.3] tracking-[0.17px]`}>
              <Face name={t.name} photo={t.photo} theme={theme} />
              <span>
                <span className="block">{t.name}</span>
                <span className="block opacity-60">{t.title}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
