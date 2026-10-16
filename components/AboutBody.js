'use client'

import Navigation from './Navigation'
import Footer from './Footer'
import Asterisk from './Asterisk'
import useRandomTheme from './useRandomTheme'

const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"

// About page themes from Figma (Website — Oct 26, Faves frames 7:237 to 7:696).
// One is picked at random per load, like the footer.
const THEMES = [
  { bg: '#D5AFFE', ink: '#2E2E2E' },
  { bg: '#130EA8', ink: '#FFFFFF' },
  { bg: '#0F50C8', ink: '#FF69B4' },
  { bg: '#3E3C32', ink: '#9FAE79' },
  { bg: '#FF4B00', ink: '#511A07' },
  { bg: '#D5B800', ink: '#19180E' },
]

// Grouped like Stu Ohler's skills: the coach and the player, plus the
// strategy and the building in between.
const SKILLZ = [
  ['Coach', ['Hiring and team building', 'Coaching and critique', 'Creative direction', 'Getting execs on board']],
  ['Strategist', ['Brand strategy and positioning', 'Brand architecture', 'Naming', 'Creative ops and intake']],
  ['Player', ['Identity systems', 'Campaigns', 'Illustration and characters', 'Motion and video direction', 'Swag and fabrication']],
  ['Builder', ['Design systems', 'Design engineering', 'AI workflows', 'Prototyping']],
]

const FAVES = [
  'Freshly-stirred peanut butter', 'Clever voicemails', 'Jon Stewart', 'Bartlett for America', 'Cherry Coke',
  'Darwinian gardening', 'Diligent note-taking', 'Chop busting', 'Taking fries with that', 'Bird dogging',
  'Moral support', 'Buzzword aversion', 'Jamming mixtapes', 'Bear hugs', 'Simpsons impressions',
  'Fine motor skills', 'Lance Wyman', 'Moving and/or shaking', 'Pinpoint mouse accuracy', 'Firm handshakes',
  'Taco eating', 'Wise cracks', 'Big Sky country', 'Breathing', 'Dumb cracks',
  'Milkshakes in those silver cups', 'Sage advice', 'New adventures',
]

const ROLES = [
  { org: 'ClassDojo', role: 'Head of Brand', years: '2025 to now' },
  { org: 'Work is Play', role: 'Creative Director', years: '2024 to 2025' },
  { org: 'Clockwise', role: 'Lead Brand Designer', years: '2022 to 2024' },
  { org: 'Zapier', role: 'Founding Brand Designer', years: '2017 to 2021' },
  { org: 'AKQA', role: 'Art Director', years: '2015' },
  { org: 'Razorfish', role: 'Art Director', years: '2012 to 2014' },
  { org: 'Freelance', role: 'Designer', years: '2004 to 2012' },
]

const item = `${social} text-[18px] md:text-[21px] leading-[1.15]`
const heading = `${nichromeUltra} text-[28px] md:text-[36px] leading-none tracking-[0.36px]`

function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-[10px] md:gap-[12px]">
      {items.map((t) => (
        <li key={t} className={`${item} flex items-center gap-[9px]`}>
          <Asterisk />
          {t}
        </li>
      ))}
    </ul>
  )
}

export default function AboutBody() {
  const { theme: t, ready } = useRandomTheme(THEMES, 'about-theme')
  return (
    <main style={{ backgroundColor: t.bg, color: t.ink, visibility: ready ? 'visible' : 'hidden' }}>
      <Navigation backgroundColor={t.bg} textColor={t.ink} underlineColor={t.ink} />

      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] desktop:px-[100px] pt-[40px] md:pt-[60px] pb-[60px] md:pb-[100px] grid grid-cols-1 desktop:grid-cols-[minmax(0,867px)_auto] gap-y-[56px] desktop:gap-x-[80px] desktop:justify-between">
        {/* Intro and Lael's bio (Figma 7:329, 7:328) */}
        <div className="flex flex-col gap-[28px] md:gap-[40px]">
          <p className={`${social} text-[18px] md:text-[21px] leading-[1.2]`}>
            Self promotion isn&apos;t my strong suit, so I&apos;ll have my friend{' '}
            <a href="https://www.linkedin.com/in/laeltyler/" target="_blank" rel="noopener noreferrer" className="hl">
              Lael
            </a>{' '}
            give a bit of an intro
          </p>
          <blockquote className={`${nichrome} text-[24px] md:text-[36px] leading-[1.2] tracking-[0.36px] flex flex-col gap-[1.2em]`}>
            <p>
              <span className="-ml-[0.45em]">&ldquo;</span>Jon entered the world of design through the accident of obsession.
              Despite having no formal arts education, he found himself helplessly drawn to Joseph Mueller-Brockman&apos;s
              &lsquo;Grid Systems,&rsquo; clean Nordic design, and the tireless intricacies of Lance Wyman. His restless
              exuberance and appetite for knowledge spurred Jon on a self-taught path towards his future craft.
            </p>
            <p>
              Jon moved to Portland, Oregon in 2004 searching for further growth and creative opportunity. In the
              decades-plus since, he has worked on design projects of nearly every conceivable scale, method, and medium
              and he shows no signs of stopping anytime soon.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Skillz (Figma 7:792) and Faves (Figma 7:238) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[48px] gap-y-[48px] items-start">
          <div className="flex flex-col gap-[24px]">
            <h2 className={heading}>Skillz</h2>
            <div className="flex flex-col gap-[24px] md:gap-[28px]">
              {SKILLZ.map(([label, items]) => (
                <div key={label} className="flex flex-col gap-[10px] md:gap-[12px]">
                  <p className={`${item} opacity-60`}>{label}</p>
                  <Bullets items={items} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[24px]">
            <h2 className={heading}>Faves</h2>
            <Bullets items={FAVES} />
          </div>
        </div>
      </section>

      {/* Career, kept from the old bio page */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] desktop:px-[100px] pb-[80px] md:pb-[120px] flex flex-col gap-[24px]">
        <h2 className={heading}>Where I&apos;ve worked</h2>
        <ul className="flex flex-col">
          {ROLES.map((r) => (
            <li
              key={r.org}
              className={`${item} flex flex-wrap items-baseline gap-x-[24px] gap-y-[2px] py-[14px] border-t last:border-b`}
              style={{ borderColor: `${t.ink}33` }}
            >
              <span className="w-full sm:w-[220px] shrink-0">{r.org}</span>
              <span className="flex-1 opacity-80">{r.role}</span>
              <span className="opacity-80 tabular-nums">{r.years}</span>
            </li>
          ))}
        </ul>
      </section>

      <Footer colophon />
    </main>
  )
}
