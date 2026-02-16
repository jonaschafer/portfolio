import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import {
  hero,
  whenToCallMe,
  howItWorks,
  about,
  nextSteps,
} from '../content'

export const metadata = {
  title: 'Design Advising — Jon Schafer',
  description: 'Fractional Creative Director: the brand voice in your leadership conversations. Strategic brand direction for Seed to Series B.',
}

const advisingBg = '#FFDAD9'
const advisingText = '#1e1e1e'

// G.E.O. about–style: editorial, clear hierarchy, list-heavy
const styles = {
  heroLead: "font-['Mondwest',_sans-serif] text-[24px] md:text-[32px] leading-[1.2] tracking-[-0.02em]",
  heroSub: "font-['Haas_Grot_Disp',_sans-serif] text-[16px] md:text-[18px] leading-[1.45] tracking-[0.01em]",
  body: "font-['Haas_Grot_Disp',_sans-serif] text-[15px] md:text-[17px] leading-[1.5] tracking-[0.01em]",
  sectionHead: "font-['Mondwest',_sans-serif] text-[14px] md:text-[16px] font-medium uppercase tracking-[0.12em]",
  listItem: "font-['Haas_Grot_Disp',_sans-serif] text-[15px] md:text-[17px] leading-[1.5]",
  personHead: "font-['Mondwest',_sans-serif] text-[18px] md:text-[20px] leading-[1.25]",
}

export default function AdvisingV2Page() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: advisingBg }}>
      <Navigation backgroundColor={advisingBg} textColor={advisingText} underlineColor={advisingText} />
      <div className="min-w-[375px] max-w-[1200px] mx-auto px-[24px] md:px-[48px] pb-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-[56px] lg:gap-x-[72px] pt-[48px] md:pt-[72px]">
          {/* Left column (2/3): hero, you're good fit if */}
          <div className="md:col-span-2 space-y-[48px] md:space-y-[56px]">
            {/* Hero */}
            <section>
              <h1 className={styles.heroLead} style={{ color: advisingText }}>
                {hero.headline}
              </h1>
            </section>

            {/* You're a good fit if */}
            <section>
              <h2 className={`${styles.sectionHead} mb-[28px]`} style={{ color: advisingText }}>
                You're a good fit if you:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {whenToCallMe.bullets.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-[8px] border-l-[3px] border-[#1e1e1e]/25 bg-[#1e1e1e]/5 border border-[#1e1e1e]/10 border-l-[#1e1e1e]/40 px-[18px] py-[16px]"
                  >
                    <p className={styles.listItem} style={{ color: advisingText }}>
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column (1/3): options, about me / contact */}
          <div className="md:col-span-1 space-y-[48px] md:space-y-[56px] md:pt-0">
            {/* How it works / Options */}
            <section>
              <h2 className={`${styles.sectionHead} mb-[20px]`} style={{ color: advisingText }}>
                How it works
              </h2>
              <ul className="list-none">
                {howItWorks.cards.map((c, i) => (
                  <li
                    key={i}
                    className={i > 0 ? 'pt-[32px] mt-[32px] border-t border-[#1e1e1e]/15' : ''}
                  >
                    <p className={`${styles.personHead} font-bold`} style={{ color: advisingText }}>
                      {c.planName} — {c.subtitle}
                    </p>
                    <p className={`${styles.body} mt-[14px]`} style={{ color: advisingText }}>
                      {c.youWillLoveThisIf}
                    </p>
                    <p className={`${styles.body} mt-[14px] font-medium`} style={{ color: advisingText }}>
                      {c.price}
                    </p>
                    {c.hours && (
                      <p className={`${styles.body} mt-[2px]`} style={{ color: advisingText }}>
                        {c.hours}
                      </p>
                    )}
                    <a
                      href={`mailto:${nextSteps.email}?subject=Advising%20-%20${encodeURIComponent(c.planName)}`}
                      className="inline-flex items-center font-['Haas_Grot_Disp',_sans-serif] text-[14px] font-medium mt-[12px] px-[20px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity w-fit"
                      style={{ color: advisingBg, backgroundColor: advisingText }}
                    >
                      {c.ctaText}
                    </a>
                  </li>
                ))}
              </ul>
              <p className={`${styles.body} mt-[24px]`} style={{ color: advisingText }}>
                {howItWorks.customEngagements}
              </p>
            </section>

            {/* About me / contact */}
            <section id="contact" className="pt-[24px] md:pt-[32px] border-t border-[#1e1e1e]/15">
              <h2 className={`${styles.sectionHead} mb-[16px]`} style={{ color: advisingText }}>
                About me
              </h2>
              <p className={styles.body} style={{ color: advisingText }}>
                {about.bio}
              </p>
              <a
                href={`mailto:${nextSteps.email}?subject=Advising%20conversation`}
                className="inline-flex items-center font-['Haas_Grot_Disp',_sans-serif] text-[14px] font-medium mt-[24px] px-[20px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity w-fit"
                style={{ color: advisingBg, backgroundColor: advisingText }}
              >
                {nextSteps.cta}
              </a>
            </section>
          </div>
        </div>
      </div>
      <Footer backgroundColor={advisingBg} textColor={advisingText} />
    </main>
  )
}
