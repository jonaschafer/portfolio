'use client'

import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { caseStudies } from '../case-studies/case-studies-data'

const strategyBg = '#F8DB79'
const strategyText = '#333333'

export default function StrategyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: strategyBg }}>
      <Navigation backgroundColor={strategyBg} textColor={strategyText} underlineColor={strategyText} />

      {/* Hero – same structure as /play */}
      <div className="w-full" style={{ backgroundColor: strategyBg }}>
        <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
          <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
            <p
              className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] lg:text-[31px] leading-[1.2] tracking-[0.31px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px] whitespace-pre-wrap"
              style={{ color: strategyText }}
            >
              Strategy
            </p>
          </div>
        </section>
      </div>

      {/* Case studies grid */}
      <div className="flex-1 min-w-[375px] max-w-[1440px] mx-auto w-full">
        <div className="pt-5 pb-5 md:pt-8 md:pb-8 px-5 md:px-[60px] lg:px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-20">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="block group text-inherit no-underline"
              >
                <div className="flex flex-col gap-[12px]">
                  <h2
                    className="font-['Mondwest',_sans-serif] text-[20px] md:text-[24px] leading-[1.2] tracking-[0.31px] group-hover:opacity-85 transition-opacity"
                    style={{ color: strategyText }}
                  >
                    {study.title}
                  </h2>
                  <p
                    className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[16px] leading-[1.35] tracking-[0.167px]"
                    style={{ color: strategyText }}
                  >
                    {study.description}
                  </p>
                  <p
                    className="font-['Haas_Grot_Disp',_sans-serif] text-[12px] tracking-[0.05em] uppercase"
                    style={{ color: strategyText, opacity: 0.7 }}
                  >
                    {study.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer backgroundColor={strategyBg} textColor={strategyText} className="mt-auto" />
    </div>
  )
}
