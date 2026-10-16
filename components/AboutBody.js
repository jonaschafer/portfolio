'use client'

import Image from 'next/image'
import Navigation from './Navigation'
import Footer from './Footer'
import Asterisk from './Asterisk'
import useRandomTheme from './useRandomTheme'

const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
const nichromeUltra = "font-['Nichrome','Arial_Black',sans-serif] font-black"
const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"

// About page themes from Figma (Website — Oct 26, Faves frames 7:237 to 7:696).
// One is picked at random per load, like the footer. Default is the
// 7:880 frame's olive.
const THEMES = [
  { bg: '#3E3C32', ink: '#9FAE79' },
  { bg: '#D5AFFE', ink: '#2E2E2E' },
  { bg: '#130EA8', ink: '#FFFFFF' },
  { bg: '#0F50C8', ink: '#FF69B4' },
  { bg: '#FF4B00', ink: '#511A07' },
  { bg: '#D5B800', ink: '#19180E' },
]

const FAVES = [
  'Freshly-stirred peanut butter', 'Clever voicemails', 'Jon Stewart', 'Bartlett for America', 'Cherry Coke',
  'Darwinian gardening', 'Diligent note-taking', 'Chop busting', 'Taking fries with that', 'Bird dogging',
  'Moral support', 'Buzzword aversion', 'Jamming mixtapes', 'Bear hugs', 'Simpsons impressions',
  'Fine motor skills', 'Lance Wyman', 'Moving and/or shaking', 'Pinpoint mouse accuracy', 'Firm handshakes',
  'Taco eating', 'Wise cracks', 'Big Sky country', 'Breathing', 'Dumb cracks',
  'Milkshakes in those silver cups', 'Sage advice', 'New adventures',
]

const item = `${social} text-[18px] md:text-[21px] leading-[1.15]`
const heading = `${nichromeUltra} text-[26px] md:text-[30px] leading-none tracking-[0.3px]`

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
      <Navigation backgroundColor={t.bg} textColor={t.ink} />

      {/* Figma: Website — Oct 26, node 7:880 */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] desktop:px-[100px] pt-[20px] md:pt-[40px] pb-[80px] md:pb-[120px]">
        <div className="relative w-full max-w-[867px] aspect-[867/577] overflow-hidden rounded-[6px]">
          <Image
            src="/images/about/jon-trail.jpg"
            alt="Jon running a trail high above the Columbia River Gorge"
            fill
            priority
            sizes="(min-width: 1024px) 867px, 100vw"
            className="object-cover"
          />
        </div>

        <p className={`${social} text-[18px] md:text-[21px] leading-[1.2] mt-[48px] md:mt-[96px]`}>
          Self promotion isn&apos;t my strong suit, so I&apos;ll have my friend{' '}
          <a href="https://www.linkedin.com/in/laeltyler/" target="_blank" rel="noopener noreferrer" className="hl">
            Lael
          </a>{' '}
          give a bit of an intro
        </p>

        <div className="mt-[28px] md:mt-[36px] grid grid-cols-1 desktop:grid-cols-[minmax(0,867px)_auto] gap-y-[56px] desktop:gap-x-[80px] desktop:justify-between items-start">
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

          <div className="flex flex-col gap-[24px]">
            <h2 className={heading}>Faves</h2>
            <Bullets items={FAVES} />
          </div>
        </div>
      </section>

      {/* One random color for the whole page, footer included */}
      <Footer colophon theme={t} />
    </main>
  )
}
