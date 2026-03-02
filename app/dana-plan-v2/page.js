import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import DanaPlanViewer from '../../components/DanaPlanViewer'

export const metadata = {
  title: "Dana's Plan — Jon Schafer",
  description: "Wy'East 50M training plan. Weekly view with targets and day-by-day cards.",
}

export default function DanaPlanV2Page() {
  return (
    <main className="min-h-screen bg-[#435938]">
      <Navigation />
      <DanaPlanViewer />
      <Footer />
    </main>
  )
}
