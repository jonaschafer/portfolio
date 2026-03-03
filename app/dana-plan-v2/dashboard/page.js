import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanDashboard from '../../../components/DanaPlanDashboard'

export const metadata = {
  title: "Dana's Plan — Dashboard — Jon Schafer",
  description: "Wy'East 50M training plan at-a-glance.",
}

export default function DanaPlanDashboardPage() {
  return (
    <main className="min-h-screen bg-[#2e2e2e]">
      <Navigation backgroundColor="#2e2e2e" />
      <DanaPlanDashboard />
      <Footer backgroundColor="#2e2e2e" minimal />
    </main>
  )
}
