import Navigation from '../components/Navigation'
import IntroSection from '../components/IntroSection'
import ProjectCarousel from '../components/ProjectCarousel'
import TestimonialsSection from '../components/TestimonialsSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <IntroSection />
      
      <ProjectCarousel 
        title="Novo"
        description={
          <>
            Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with{' '}
            <a href="https://dawn.la/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Dawn</a>
            {' '}and{' '}
            <a href="https://workisplay.studio/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Work Is Play</a>
            , we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks.
          </>
        }
        folder="02 Novo"
        images={["novo-stina-compressed.mp4", "novo-1.png", "novo-2.png", "novo-3.png", "novo-4.png", "novo-5.png", "novo-6.png", "novo-7.png", "novo-8.png"]}
      />

      <ProjectCarousel 
        title="Lineage"
        description={
          <>
            Lineage is a boutique consultancy turning brands into cultural icons with over 20 years of experience. They came to Work is Play to craft a site that signals a major shift from agency to methodology. Partnering with{' '}
            <a href="https://dawn.la/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Dawn</a>
            , we built a complete design system, 4 interactive Next.js + WebGL pages, and 40+ CMS templates.
          </>
        }
        folder="03 Lineage"
        images={["lineage-7.gif", "lineage-1.png", "lineage-2.png", "lineage-3.png", "lineage-4.png", "lineage-5.png", "lineage-6.png", "lineage-8.png", "lineage-9.png"]}
      />

      <ProjectCarousel 
        title="Prism"
        description={
          <>
            Clockwise reinvented scheduling with Prism, an AI-powered calendar you talk with. Need to clear your day or meet the CEO? Just ask. Over 2 months we launched an ambitious campaign including a 3D animated video with our friends at{' '}
            <a href="https://yatta.studio/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Yatta</a>
            , and a slew of marketing surfaces: social, paid media, email, 4 pages, blog posts and in-product flows.
          </>
        }
        folder="04 Prism"
        images={["prism-9.mp4", "prism-10-yatta.mp4", "prism-1.png", "prism-2.png", "prism-3.png", "prism-4.png", "prism-5.png", "prism-6.png", "prism-7.png", "prism-8.png"]}
      />

      <ProjectCarousel 
        title="Clockwise Rebrand"
        description="Clockwise grew from a Chrome extension into a must-have productivity tool—but the brand was stuck in the past. I led a full identity refresh: a scalable identity, 40+ redesigned pages, 20+ product surfaces—all in 3 months. The result? A brand as seamless and intuitive as the product itself."
        folder="05 Clockwise Rebrand"
        images={["cw-rebrand-14.gif", "cw-rebrand-5.gif", "cw-rebrand-1.png", "cw-rebrand-2.png", "cw-rebrand-3.png", "cw-rebrand-4.png", "cw-rebrand-6.png", "cw-rebrand-7.png", "cw-rebrand-8.png", "cw-rebrand-9.png", "cw-rebrand-10.png", "cw-rebrand-11.png", "cw-rebrand-12.png", "cw-rebrand-13.png"]}
      />

      <ProjectCarousel 
        title="Growlers"
        description={
          <>
            Friend projects are the best projects. That's why I was thrilled to help my friend Mickey — Coach Mickey — build up a identity for Chill N Fill's softball team. With{' '}
            <a href="https://castironcoding.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Lael Tyler</a>
            {' '}and{' '}
            <a href="https://www.trieuberry.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Linh Triu</a>
            , and inspired by the bar's growler-fill roots, we created Juggy the mascot, an anthropomorphic jug ready for catch.
          </>
        }
        folder="06 Growlers"
        images={["all sketches.gif", "growlers-1.png", "growlers-2.png", "growlers-3.png", "growlers-4.png", "growlers-5.png"]}
      />

      <ProjectCarousel 
        title="Zapier"
        description="At Zapier, I built the brand design team from 0 to 1, creating scalable design systems across email, social, and web while driving brand advocacy and education. Highlights include collaborating with Instrument on a rebrand, partnering with Hobbes on a motion toolkit, and leading an in-house rebrand that later aligned with the official launch."
        folder="07 Zapier"
        images={["zapier-1.png", "zapier-2.png", "zapier-3.png", "zapier-4.png", "zapier-5.png", "zapier-6.png", "zapier-7.png", "zapier-8.png", "zapier-9.png", "zapier-10.png"]}
      />

      <ProjectCarousel 
        title="Scheduling Links"
        description={
          <>
