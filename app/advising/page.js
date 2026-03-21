import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import {
  caseStudies,
  hero,
  otherWaysICanHelp,
  howItWorks,
  calendlyBookingUrl,
} from './content'

export const metadata = {
  title: 'Design Advising — Jon Schafer',
  description: 'Fractional Creative Director: the brand voice in your leadership conversations. Strategic brand direction for Seed to Series B.',
}

const advisingBg = '#F8DB79'
const advisingText = '#333333'

const sectionTitle = "font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px]"
const bodyText = "font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[19.4px] leading-[1.2] md:leading-[1.2] tracking-[0.167px]"
const bodyMuted = "font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] tracking-[0.167px] text-[#333333]/70"

export default function AdvisingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: advisingBg }}>
      <Navigation backgroundColor={advisingBg} textColor={advisingText} underlineColor={advisingText} />
      <div className="min-w-[375px] w-full max-w-[900px] mx-auto px-[20px] md:px-[40px] pb-[60px]">
        {/* Hero */}
        <section className="pt-[40px] md:pt-[60px] pb-[40px] md:pb-[60px]">
          <p className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] tracking-[0.14em] uppercase text-[#333333]/70 mb-5">
            {hero.eyebrow}
          </p>
          <h1 className={sectionTitle} style={{ color: advisingText }}>
            {hero.headline}
          </h1>
          <p className={`${bodyText} mt-[14px]`} style={{ color: advisingText }}>
            {hero.subhead}
          </p>
        </section>

        {/* Case studies */}
        <section className="pb-[50px] md:pb-[60px]">
          <h2 className={`${sectionTitle} mb-[30px]`} style={{ color: advisingText }}>Case studies</h2>
          <div className="flex flex-col gap-[12px]">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="block px-[20px] py-[14px] md:py-[16px] rounded-[10px] border border-[#333333]/10 bg-[#333333]/5 hover:bg-[#333333]/10 hover:border-[#333333]/20 transition-all duration-200 group text-inherit no-underline"
              >
                <h3 className="font-['Mondwest',_sans-serif] text-[18px] md:text-[20px] leading-[1.2] tracking-[0.31px] mb-[6px] group-hover:opacity-90 transition-opacity" style={{ color: advisingText }}>
                  {study.title}
                </h3>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.35] tracking-[0.167px] mb-[4px]" style={{ color: advisingText }}>
                  {study.description}
                </p>
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[12px] tracking-[0.05em]" style={{ color: advisingText, opacity: 0.7 }}>
                  {study.readTime}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Ways I can help */}
        <section className="pb-[50px] md:pb-[60px]">
          <h2 className={`${sectionTitle} mb-[30px]`} style={{ color: advisingText }}>Ways I can help</h2>
          <ul className="space-y-[12px]">
            {otherWaysICanHelp.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-[10px]">
                <span className="mt-[8px] w-[6px] h-[6px] rounded-full border border-[#333333] flex-shrink-0" aria-hidden />
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.35] tracking-[0.167px]" style={{ color: advisingText }}>
                  {b}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works — Book a call links to Calendly (no badge widget / fixed button) */}
        <section className="pb-[50px] md:pb-[60px]">
          <h2 className={`${sectionTitle} mb-[30px]`} style={{ color: advisingText }}>How it works</h2>
          <p className={`${bodyText} mb-[24px]`} style={{ color: advisingText }}>
            {howItWorks.text}
          </p>
          <a
            href={calendlyBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-['Haas_Grot_Disp',_sans-serif] text-[14px] font-medium px-[20px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity w-fit"
            style={{ color: advisingBg, backgroundColor: advisingText }}
          >
            Book a call
          </a>
          <p className={`${bodyMuted} mt-[12px]`} style={{ color: advisingText }}>
            {howItWorks.note}
          </p>
        </section>
      </div>
      <Footer backgroundColor={advisingBg} textColor={advisingText} />
    </main>
  )
}
