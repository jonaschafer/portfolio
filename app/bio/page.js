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
                  Jon entered the world of design through the accident of obsession.
                </p>
                <div className="flex flex-col gap-[20px] font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[19.4px] leading-[1.35] tracking-[0.167px] text-[#FAFAFA]">
                  <p>
                    Despite having no formal arts education, he found himself helplessly drawn to
                    Joseph Mueller-Brockman&apos;s &ldquo;Grid Systems,&rdquo; clean Nordic design, and
                    the tireless intricacies of Lance Wyman. His restless exuberance and appetite for
                    knowledge spurred Jon on a self-taught path towards his future craft.
                  </p>
                  <p>
                    Jon moved to Portland, Oregon in 2004 searching for further growth and creative
                    opportunity. In the decade-plus since, he has worked on design projects of nearly
                    every conceivable scale, method, and medium. His day jobs have included time at
                    small studios like Nemo, Opolis, and Sandstrom, and larger outfits like Nike,
                    Columbia Sportswear, and Razorfish.
                  </p>
                  <p>
                    Why, Hello There began as an extra-curricular side-hustle to bring in additional
                    creative work, but over the years it has become something more; a platform for
                    celebrating great design, and a launch pad for projects driven more by love than
                    labor. He is always happy to discuss new opportunities and creative partnerships.
                  </p>
                  <p className="text-[#FAFAFA]/80 text-[13.4px] md:text-[16px]">
                    Bio by Lael Tyler.
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
