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
        description="Novo is a financial platform for small businesses, offering banking features and AI-powered bookkeeping. Despite a brand refresh, their site lacked engagement and clarity. Partnering with →Dawn and →Work Is Play, we redesigned 10 pages, created 50+ illustrations, and built a mini design system in 7 weeks."
        folder="novo"
        images={[
          "novo-1.png",
          "novo-2.png", 
          "novo-3.png",
          "novo-4.png",
          "novo-5.png",
          "novo-6.png",
          "novo-7.png",
          "novo-8.png"
        ]}
      />

      <ProjectCarousel 
        title="Lineage"
        description="Your lineage description here..."
        folder="lineage"
        images={[
          "lineage-1.png",
          "lineage-2.png",
          "lineage-3.png",
          "lineage-4.png",
          "lineage-5.png",
          "lineage-6.png",
          "lineage-7.gif",
          "lineage-8.png",
          "lineage-9.png"
        ]}
      />

      <TestimonialsSection />
      <Footer />
    </main>
  )
}
