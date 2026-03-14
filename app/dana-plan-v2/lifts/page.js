import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanLifts from '../../../components/DanaPlanLifts'

export const metadata = {
  title: "Lifts — Dana's Plan",
  description: 'Strength lift percentages, weights, and plate loading for the training plan.',
}

export default function DanaPlanLiftsPage() {
  return (
    <main className="min-h-screen bg-[#2e2e2e]">
      <Navigation backgroundColor="#2e2e2e" />
      <DanaPlanLifts />
      <Footer backgroundColor="#2e2e2e" minimal />
    </main>
  )
}
