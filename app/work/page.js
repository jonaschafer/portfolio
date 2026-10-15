import Navigation from '../../components/Navigation'
import IntroSection from '../../components/IntroSection'
import WorkIndex from '../../components/WorkIndex'
import TestimonialsSection from '../../components/TestimonialsSection'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Jon Schafer — Work',
  description: 'Brand strategy, identity systems, and creative direction.',
}

// Projects live in ./projects.js. ProjectCarousel is no longer used here but
// stays in components/ for now.
export default function WorkPage() {
  return (
    <main>
      <Navigation />
      <IntroSection />
      <WorkIndex />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
