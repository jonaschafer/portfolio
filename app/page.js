import Navigation from '../components/Navigation'
import IntroSection from '../components/IntroSection'
import ImageCarousel from '../components/ImageCarousel'
import TestimonialsSection from '../components/TestimonialsSection'
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
