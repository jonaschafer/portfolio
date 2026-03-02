import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanCalendar from '../../../components/DanaPlanCalendar'

export const metadata = {
  title: "Dana's Plan — Calendar — Jon Schafer",
  description: "Wy'East 50M training plan calendar view.",
}

export default function DanaPlanCalendarPage() {
  return (
    <main className="min-h-screen bg-[#435938]">
      <Navigation />
      <DanaPlanCalendar />
      <Footer />
    </main>
  )
}
