import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import {
  hero,
  whenToCallMe,
  howItWorks,
  about,
  nextSteps,
} from './content'

export const metadata = {
  title: 'Design Advising — Jon Schafer',
  description: 'Fractional Creative Director: the brand voice in your leadership conversations. Strategic brand direction for Seed to Series B.',
}

const advisingBg = '#FFDAD9'
const advisingText = '#1e1e1e'

const sectionTitle = "font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px]"
const sectionTitleSmall = "font-['Mondwest',_sans-serif] text-[20px] leading-[1.2] tracking-[0.31px]"
const bodyText = "font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[19.4px] leading-[1.2] md:leading-[1.2] tracking-[0.167px]"
const bodyMuted = "font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] tracking-[0.167px] text-[#1e1e1e]/70"
const card = 'bg-[#1e1e1e]/5 p-[16px] md:p-[20px] rounded-[8px]'

export default function AdvisingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: advisingBg }}>
      <Navigation backgroundColor={advisingBg} textColor={advisingText} underlineColor={advisingText} />
      <div className="min-w-[375px] max-w-[1440px] mx-auto px-[20px] md:px-[60px] pb-[60px]">
        {/* Hero */}
        <section className="pt-[40px] md:pt-[60px] pb-[40px] md:pb-[60px] max-w-[747px]">
          <h1 className={sectionTitle} style={{ color: advisingText }}>
            {hero.headline}
          </h1>
        </section>

        {/* You're a good fit if... */}
        <section className="pb-[50px] md:pb-[60px]">
          <h2 className={`${sectionTitleSmall} mb-[28px]`} style={{ color: advisingText }}>You're a good fit if you:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {whenToCallMe.bullets.map((b, i) => (
              <div
                key={i}
                className="rounded-[8px] border-l-[3px] border-[#1e1e1e]/25 bg-[#1e1e1e]/5 border border-[#1e1e1e]/10 border-l-[#1e1e1e]/40 px-[18px] py-[16px]"
              >
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[1.35] tracking-[0.167px]" style={{ color: advisingText }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="pb-[50px] md:pb-[60px]">
          <h2 className={`${sectionTitle} mb-[30px]`} style={{ color: advisingText }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {howItWorks.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-[10px] overflow-hidden bg-[#1e1e1e]/5 border border-[#1e1e1e]/10 flex flex-col"
              >
                <div className={`px-[20px] py-[14px] ${i === 0 ? 'bg-[#1e1e1e]/10' : 'bg-[#1e1e1e]/15'}`}>
                  <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] font-medium tracking-[0.16px]" style={{ color: advisingText }}>
                    {c.planName}
                  </p>
                </div>
                <div className="px-[20px] pt-[24px] pb-[20px] flex flex-col flex-1">
                  <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[24px] leading-[1.2] tracking-[0.31px] mb-[20px]" style={{ color: advisingText }}>
                    {c.subtitle}
                  </p>
                  <p className={`${bodyMuted} mb-[20px]`} style={{ color: advisingText }}>{c.youWillLoveThisIf}</p>
                  <p className="font-['Haas_Grot_Disp',_sans-serif] text-[16px] font-medium mb-[12px]" style={{ color: advisingText }}>
                    What this looks like
                  </p>
                  <ul className="space-y-[10px] mb-[16px]">
                    {c.whatDoIGet.map((item, j) => (
                      <li key={j} className="flex items-start gap-[10px]">
                        <span className="mt-[6px] w-[6px] h-[6px] rounded-full border border-[#1e1e1e] flex-shrink-0" aria-hidden />
                        <span className={bodyMuted} style={{ color: advisingText }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {c.notIncluded && (
                    <p className={`${bodyMuted} mb-[20px]`} style={{ color: 'rgba(30,30,30,0.6)' }}>{c.notIncluded}</p>
                  )}
                  <div className="border-t border-[#1e1e1e]/20 pt-[16px] mt-auto">
                    {/* Pricing hidden for launch – discuss based on scope if asked */}
                    {/* <p className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] font-medium uppercase tracking-[0.05em] mb-[16px]" style={{ color: 'rgba(30,30,30,0.8)' }}>Pause or cancel anytime</p>
                    <p className="font-['Mondwest',_sans-serif] text-[28px] md:text-[32px] leading-[1.2] tracking-[0.31px] mb-[8px]" style={{ color: advisingText }}>{c.price}</p>
                    {c.hours && <p className={`${bodyMuted} mb-[20px]`} style={{ color: advisingText }}>{c.hours}</p>}
                    {!c.hours && <div className="mb-[20px]" />} */}
                    <a
                      href={`mailto:${nextSteps.email}?subject=Advising%20-%20${encodeURIComponent(c.planName)}`}
                      className="inline-flex items-center font-['Haas_Grot_Disp',_sans-serif] text-[14px] font-medium px-[20px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity w-fit"
                      style={{ color: advisingBg, backgroundColor: advisingText }}
                    >
                      {c.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className={`${bodyMuted} mt-[24px] max-w-[648px]`} style={{ color: advisingText }}>
            {howItWorks.customEngagements}
          </p>
        </section>

        {/* About */}
        <section className="pb-[50px] md:pb-[60px] max-w-[648px]">
          <h2 className={`${sectionTitle} mb-[24px]`} style={{ color: advisingText }}>About me</h2>
          <p className={`${bodyText} mb-[24px]`} style={{ color: advisingText }}>{about.bio}</p>
          <p className={`${bodyText} mb-[16px]`} style={{ color: advisingText }}>{nextSteps.intro}</p>
          <a
            href={`mailto:${nextSteps.email}?subject=Advising%20conversation`}
            className="inline-flex items-center font-['Haas_Grot_Disp',_sans-serif] text-[14px] font-medium px-[20px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity w-fit"
            style={{ color: advisingBg, backgroundColor: advisingText }}
          >
            {nextSteps.cta}
          </a>
        </section>
      </div>
      <Footer backgroundColor={advisingBg} textColor={advisingText} />
    </main>
  )
}
