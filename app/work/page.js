import Navigation from '../../components/Navigation'
import IntroSection from '../../components/IntroSection'
import ProjectCarousel from '../../components/ProjectCarousel'
import TestimonialsSection from '../../components/TestimonialsSection'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Jon Schafer — Work',
  description: 'Brand strategy, identity systems, and creative direction.',
}

const SHOW_DOJO_REBRAND = false

// Placeholder rows (no images yet). Flip to true once real images are in.
const SHOW_DRAFT_ROWS = false

export default function WorkPage() {
  return (
    <main>
      <Navigation />
      <IntroSection />

      {SHOW_DOJO_REBRAND && (
        <ProjectCarousel
          title="Dojo rebrand"
          description="ClassDojo reaches 50 million families in 180 countries, but its brand had grown up product by product: some robust, some with almost nothing. I pitched and led the brand strategy, rebrand, and site overhaul without a budget. That meant new logos, characters, and color systems for four products, an endorsed-brand model that put all six under one foundation, and 76 pages rebuilt from a system of reusable blocks. The site has shipped page by page since April 2026, and when engineering got stretched I moved into the code myself, using AI tools to QA, fix, and deploy pages. After relaunch, time on the Sparks and Plus pages rose 36% and 42%, against 6% across the site."
          placeholderDescriptions={[
            'New homepage — hero and key blocks, desktop and/or mobile.',
            'Global nav and footer — desktop, showing all products as one family.',
            'Tutor — Nova character, color system, and/or key landing page.',
            'Dojo Sparks — logo and product or web frame showing distinct expression.',
            'Dojo Islands — product or web frame showing its expression within the system.',
            'ClassDojo for districts — landing page or deck frame showing restrained, pro tone.',
            'Design system — type scale, color, and 2–3 components showing scale and reusability.',
            'Tone framework — audience/product/medium (playful vs. professional).',
          ]}
        />
      )}

      {SHOW_DRAFT_ROWS && (
        <ProjectCarousel
          title="Back to school 2026"
          description="Back to school 2025 leaned on emotional storytelling and the lift came in flat. For 2026 I set the campaign identity and creative direction: one visual system and one story across email, web, video, push, in-app, LinkedIn, and sales enablement, reaching 193K school leaders. With Lorna's team running the sends, emails opened at 39-42% against a 30-34% norm, click-to-open doubled, and schoolwide decisions rose 48% year over year. On the refreshed school leaders page, bounce fell 10 points and the average visit went from 80 to 118 seconds, while the rest of the site held flat."
          placeholderDescriptions={[
            'Hero video, 60s, made with Peter Skov Nielsen. Autoplay loop of the strongest 6-8 seconds: gradient, simplified UI, feature moments.',
            'The campaign system on one board: gradient treatment, simplified product UI, textured photography, and type.',
            '/school-leaders landing page. Hero plus 2-3 key blocks on desktop, with a mobile frame alongside.',
            'Email grid: 6-8 of the 47 sends side by side, one template flexing across four school leader segments.',
            'One story everywhere school leaders touch us: in-app banner, launch modal, and push notification in a single composition.',
            'LinkedIn organic posts from ClassDojo and ClassDojo Districts, three up.',
            'Families landing page: hero plus the connect, learn, and play sections.',
            "Teacher What's New page and Mentor BTS kit, showing the system stretching to teachers.",
            'Results slide, typeset clean: 39-42% opens vs. a 30-34% norm, 2x click-to-open, +48% schoolwide decisions year over year.',
          ]}
        />
      )}

      {SHOW_DRAFT_ROWS && (
        <ProjectCarousel
          title="Tutor group classes"
          description="Dojo Tutor only offered 1:1 sessions at $30-39 a class, which priced out a lot of families. Group classes at $10 were the answer, and the launch was the first major campaign to put Tutor's new identity to work. Elizabeth Slavitt led the launch and I led the creative, starting with two landing pages that tested affordability against enrichment messaging, a class card aligned with the product, and a thumbnail generator the team kept using after launch. Weekly group sessions grew from about 50 to 460 in two months."
          placeholderDescriptions={[
            'The two launch landing pages side by side: affordability (lp1) and enrichment (lp2).',
            "New Tutor identity in use: Nova, logo, and color on the group classes hero.",
            'Class card: the marketing card next to the in-product card, showing how they were aligned.',
            'Thumbnail generator output: a grid of 9-12 class thumbnails.',
            'Paid social: 3-4 Facebook and Instagram ads from the launch.',
            'Launch email to one of the six segments (e.g. churned subscribers), desktop and mobile.',
            'Sticker packs summer retention campaign.',
            'Growth slide: weekly group sessions from about 50 to 460, early April to early June 2026.',
          ]}
        />
      )}

      <ProjectCarousel
        title="Novo"
        description={
          <>
            A seven-week site redesign for a fintech brand that had been refreshed but still wasn&apos;t landing. I led design across ten pages and a mini design system, with Shachar Aylon at{' '}
            <a href="https://dawn.la/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Dawn</a>
            , and Dinesh and Sofya at{' '}
            <a href="https://workisplay.studio/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Work Is Play</a>
            {' '}running the studio. Russell Shaw set the illustration style and I drew the other 20+. Favorite part: a homepage hero that spins customers into place like a View-Master reel.
          </>
        }
        folder="02 Novo"
        images={["novo-stina-compressed.mp4", "novo-1.png", "novo-2.png", "novo-3.png", "novo-4.png", "novo-5.png", "novo-6.png", "novo-7.png", "novo-8.png"]}
      />

      <ProjectCarousel
        title="Lineage"
        description={
          <>
            A small, interaction-heavy site for a 20-year consultancy trading agency work for a methodology of its own.{' '}
            <a href="https://dawn.la/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Shachar Aylon</a>
            {' '}shaped the story, Dinesh creative directed, and we built four Next.js and WebGL pages, including a hero with a James Turrell mode. Plus a design system and 40+ CMS templates, made across three holidays, opposite time zones, and a very tight budget.
          </>
        }
        folder="03 Lineage"
        images={["lineage-7.gif", "lineage-1.png", "lineage-2.png", "lineage-3.png", "lineage-4.png", "lineage-5.png", "lineage-6.png", "lineage-8.png", "lineage-9.png"]}
      />

      <ProjectCarousel
        title="Prism"
        description={
          <>
            The launch that turned Clockwise into an AI calendar you talk to. I made the case to grow the budget from $10K to $43K for a 3D launch film with Ben and the crew at{' '}
            <a href="https://yatta.studio/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Yatta</a>
            , then carried the look into the product, nine web pages with Breno on Webflow, and every paid, social, and email surface. Britt, Olivia, and I named it. First two weeks: signups up 17%, new companies up 50%, #2 on Product Hunt.
          </>
        }
        folder="04 Prism"
        images={["prism-9.mp4", "prism-10-yatta.mp4", "prism-1.png", "prism-2.png", "prism-3.png", "prism-4.png", "prism-5.png", "prism-6.png", "prism-7.png", "prism-8.png"]}
      />

      <ProjectCarousel
        title="Clockwise Rebrand"
        description="A full identity overhaul for a Chrome extension that had outgrown itself: too many colors, an outdated logo, and an illustration style only one person could draw. With Charles Martucci and the studio Character, I took it from strategy memo to 40+ pages and 20+ product surfaces. When Character got acquired mid-project, we brought the logo in-house, and Stina Wahlen animated it. It launched alongside a $45M Series C."
        folder="05 Clockwise Rebrand"
        images={["cw-rebrand-14.gif", "cw-rebrand-5.gif", "cw-rebrand-1.png", "cw-rebrand-2.png", "cw-rebrand-3.png", "cw-rebrand-4.png", "cw-rebrand-6.png", "cw-rebrand-7.png", "cw-rebrand-8.png", "cw-rebrand-9.png", "cw-rebrand-10.png", "cw-rebrand-11.png", "cw-rebrand-12.png", "cw-rebrand-13.png"]}
      />

      <ProjectCarousel
        title="Growlers"
        description={
          <>
            Softball team identity for Chill N Fill, and the most fun I&apos;ve had with a mascot. Coach Mickey asked,{' '}
            <a href="https://castironcoding.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Lael Tyler</a>
            {' '}and{' '}
            <a href="https://www.trieuberry.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Linh Triu</a>
            {' '}said yes, and the bar&apos;s growler-fill roots handed us Juggy: a sprinting, shade-wearing, beer-sloshing jug with a bat on his shoulder. Juggy has never caught a ball.
          </>
        }
        folder="06 Growlers"
        images={["all sketches.gif", "growlers-1.png", "growlers-2.png", "growlers-3.png", "growlers-4.png", "growlers-5.png"]}
      />

      <ProjectCarousel
        title="Zapier"
        description="Founding brand designer, four and a half years, and a brand function that didn't exist when I got there. I wrote Zapier's first brand guidelines, built the request process and the design systems that kept email, social, and web from waiting on design, and helped hire the second brand designer. Along the way, a rebrand with Instrument and a motion toolkit with Hobbes that powered two video courses and 52+ videos."
        folder="07 Zapier"
        images={["zapier-1.png", "zapier-2.png", "zapier-3.png", "zapier-4.png", "zapier-5.png", "zapier-6.png", "zapier-7.png", "zapier-8.png", "zapier-9.png", "zapier-10.png"]}
      />

      <ProjectCarousel
        title="Scheduling Links"
        description={
          <>
            An increasingly absurd back-and-forth between Sarah and her contractor Ryan, who cannot find a time to meet, cut into 15, 30, and 60-second spots for Clockwise Links.{' '}
            <a href="https://www.thirdcoastfilms.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">→Third Coast Films</a>
            {' '}shot it in Austin, I art directed from Portland, and Lulu drew the storyboards. The project came within a few hours of being killed before I cracked the script. Paid clicks came in at $32 against a usual $85.
          </>
        }
        folder="08 Scheduling Links"
        images={["links-8.gif", "links-6.gif", "links-1.png", "links-2.png", "links-3.png", "links-4.png", "links-5.png", "links-7.png"]}
      />

      <TestimonialsSection />
      <Footer />
    </main>
  )
}
