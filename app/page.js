import IntroSection from '../components/IntroSection'
import Navigation from '../components/Navigation'
import TestimonialsSection from '../components/TestimonialsSection'
import ImageCarousel from '../components/ImageCarousel'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <IntroSection />
      <TestimonialsSection />
      <ImageCarousel />
      <Footer />
    </main>
  )
}
