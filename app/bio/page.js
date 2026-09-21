import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Jon Schafer — Bio',
  description: 'Jon leads brand at ClassDojo. Visual identities, design systems, and the creative team behind them.',
}

const ROLES = [
  { org: 'ClassDojo', role: 'Head of Brand', note: 'Creative Director, 2025 to 2026', years: '2025 to now' },
  { org: 'Work is Play', role: 'Creative Director', note: 'Novo, Lineage', years: '2024 to 2025' },
  { org: 'Clockwise', role: 'Lead Brand Designer', note: 'Rebrand alongside a $45M Series C', years: '2022 to 2024' },
  { org: 'Zapier', role: 'Founding Brand Designer', note: 'Built the brand function', years: '2017 to 2021' },
  { org: 'AKQA', role: 'Art Director', note: 'Nike', years: '2015' },
  { org: 'Razorfish', role: 'Art Director', note: 'Microsoft, Xbox, Surface', years: '2012 to 2014' },
  { org: 'Freelance', role: '', note: '', years: '2004 to 2012' },
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

function RailList({ label, items }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] leading-[1.4] tracking-[0.16px] text-[#FAFAFA]/60">
        {label}
      </p>
      <ul className="flex flex-col gap-[4px]">
        {items.map((item) => (
          <li
            key={item}
            className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] leading-[1.4] tracking-[0.16px] text-[#FAFAFA]"
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

      {/* Portrait, then bio beside the rail */}
      <div className="bg-[#435938] w-full">
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_300px] gap-x-[60px] lg:gap-x-[100px] gap-y-[40px]">
              <div className="max-w-[747px]">
                <Image
                  src="/images/jon.jpg"
                  alt="Jon Schafer"
                  width={1600}
                  height={1200}
                  className="w-full h-auto rounded-[10px]"
                  priority
                />
              </div>
              <div className="hidden md:block" aria-hidden="true" />

              <div className="flex flex-col gap-[20px] max-w-[747px] font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]">
                <p>
                  <span className="-ml-[0.42em]">&ldquo;</span>Jon entered the world of design through the accident of obsession. Despite having
                  no formal arts education, he found himself helplessly drawn to Joseph
                  Mueller-Brockman&apos;s &lsquo;Grid Systems,&rsquo; clean Nordic design, and the
                  tireless intricacies of Lance Wyman. His restless exuberance and appetite for
                  knowledge spurred Jon on a self-taught path towards his future craft.
                </p>
                <p>
                  <span className="-ml-[0.42em]">&ldquo;</span>Jon moved to Portland, Oregon in 2004 searching for further growth and creative
                  opportunity. In the decade-plus since, he has worked on design projects of nearly
                  every conceivable scale, method, and medium.&rdquo;
                </p>
                <p className="text-[#FAFAFA]/80 text-[13.4px] md:text-[16px]">
                  Bio by{' '}
                  <a
                    href="https://www.linkedin.com/in/laeltyler/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity"
                  >
                    Lael Tyler
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-[40px]">
                <RailList label="hats worn" items={HATS} />
                <RailList label="surfaces" items={SURFACES} />
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

      <Footer />
    </main>
  )
}
