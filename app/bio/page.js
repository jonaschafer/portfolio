import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Jon Schafer — Bio',
  description: 'Jon leads brand at ClassDojo. Twenty-two years of identities, systems, and the teams that run them.',
}

const ROLES = [
  { org: 'ClassDojo', role: 'Head of Brand', note: 'Creative Director, 2025 to 2026', years: '2025 to now' },
  { org: 'Work is Play', role: 'Creative Director', note: 'Novo, Lineage', years: '2024 to 2025' },
  { org: 'Clockwise', role: 'Lead Brand Designer', note: 'Rebrand alongside a $45M Series C', years: '2022 to 2024' },
  { org: 'Zapier', role: 'Founding Brand Designer', note: 'Built the brand function', years: '2017 to 2021' },
  { org: 'AKQA', role: 'Art Director', note: 'Nike', years: '2015' },
  { org: 'Razorfish', role: 'Art Director', note: 'Microsoft, Xbox, Surface', years: '2012 to 2014' },
  { org: 'Engin Creative', role: 'Senior Designer', note: '', years: '2012' },
  { org: 'Opolis Design', role: 'Senior Designer', note: 'Nike', years: '2010 to 2012' },
]

const HATS = [
  'Design lead', 'Manager', 'Product designer', 'Animator', 'Program manager',
  'Illustrator', 'Production designer', 'Art director', 'Hiring manager',
  'Design educator', 'Writer',
]

const SURFACES = [
  'Identities', 'Illustrations', 'Animation', 'Marketing', 'Swag', 'Fabrication',
  'Product', 'System design', 'Ops', 'Storyboarding', 'Education',
]

const EDUCATION = [
  { school: 'University of Montana', detail: 'BS, Marketing. Missoula, MT' },
  { school: 'University of Tasmania', detail: 'Graphic design. Hobart, TAS' },
]

function ListColumn({ label, items }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
        {label}
      </h2>
      <ul className="flex flex-col gap-[8px]">
        {items.map((item) => (
          <li
            key={item}
            className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BioPage() {
  return (
    <main className="bg-[#435938]">
      <Navigation />

      {/* Bio + portrait */}
      <div className="bg-[#435938] w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
            <div className="flex flex-col md:flex-row gap-[40px] md:gap-[60px]">
              <div className="flex flex-col gap-[28px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px]">
                <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
                  I lead brand at ClassDojo, a platform used by 50M+ families across 180 countries.
                </p>
                <div className="flex flex-col gap-[20px] font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]">
                  <p>
                    That has meant a ground-up identity rebuild, the design system under it, and the
                    campaign infrastructure the rest of the company builds from. It also meant making
                    the case for the rebrand before anyone had called it one.
                  </p>
                  <p>
                    Twenty-two years in, the pattern is that I show up before the problem is defined.
                    At Zapier I built the brand function before it had a name. At Clockwise I
                    established brand design and led a rebrand that landed alongside a $45M Series C.
                    The part I care about is what happens after, whether the next ten decisions can
                    get made without me in the room.
                  </p>
                  <p>
                    Based in Portland. A marketing degree in Montana, a year of graphic design in
                    Tasmania, and a long run through agencies working on Nike and Microsoft.
                    Generalist by temperament. I would rather learn the adjacent craft than hand it off.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-[335px] md:max-w-[360px] shrink-0">
                <Image
                  src="/images/jon.jpg"
                  alt="Jon Schafer"
                  width={1100}
                  height={827}
                  className="w-full h-auto rounded-[10px]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Where I've worked */}
      <div className="bg-[#435938] w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[50px] pb-[60px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px] flex flex-col gap-[28px]">
            <h2 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
              Where I&apos;ve worked
            </h2>
            <ul className="flex flex-col">
              {ROLES.map((r) => (
                <li
                  key={r.org}
                  className="flex flex-col md:flex-row md:items-baseline gap-[4px] md:gap-[24px] py-[16px] border-t border-[#FAFAFA]/20 last:border-b"
                >
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA] md:w-[220px] shrink-0">
                    {r.org}
                  </span>
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA] flex-1">
                    {r.role}
                    <span className="text-[#FAFAFA]/80">{r.note ? `. ${r.note}` : ''}</span>
                  </span>
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA]/80 md:text-right md:w-[140px] shrink-0">
                    {r.years}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Hats and surfaces */}
      <div className="bg-[#435938] w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[50px] pb-[60px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[60px]">
              <ListColumn label="Hats worn" items={HATS} />
              <ListColumn label="Surfaces" items={SURFACES} />
            </div>
          </div>
        </section>
      </div>

      {/* Education */}
      <div className="bg-[#435938] w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[50px] pb-[60px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px] flex flex-col gap-[28px]">
            <h2 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px]">
              School
            </h2>
            <ul className="flex flex-col">
              {EDUCATION.map((e) => (
                <li
                  key={e.school}
                  className="flex flex-col md:flex-row md:items-baseline gap-[4px] md:gap-[24px] py-[16px] border-t border-[#FAFAFA]/20 last:border-b"
                >
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA] md:w-[220px] shrink-0">
                    {e.school}
                  </span>
                  <span className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.4] tracking-[0.167px] text-[#FAFAFA]/80 flex-1">
                    {e.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
