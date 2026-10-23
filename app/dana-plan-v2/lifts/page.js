import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanLifts from '../../../components/DanaPlanLifts'
import { T } from '../../../components/planStyle'

export const metadata = {
  title: 'Jon Schafer · Back to 40, lifts',
  description: 'Heavy A and Heavy B by phase, plus plate math for deadlifts and squats.',
}

export default function DanaPlanLiftsPage() {
  return (
    <main className="min-h-screen pb-[47px] md:pb-0" style={{ backgroundColor: T.bg, color: T.ink }}>
      <Navigation backgroundColor={T.bg} textColor={T.ink} />
      <DanaPlanLifts />
      <Footer colophon theme={T} />
    </main>
  )
}
