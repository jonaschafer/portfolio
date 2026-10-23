import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanCalendar from '../../../components/DanaPlanCalendar'
import { T } from '../../../components/planStyle'

export const metadata = {
  title: 'Jon Schafer · Back to 40, month',
  description: 'Running back to 40 miles a week after jaw surgery, by month.',
}

export default function DanaPlanCalendarPage() {
  return (
    <main className="min-h-screen pb-[47px] md:pb-0" style={{ backgroundColor: T.bg, color: T.ink }}>
      <Navigation backgroundColor={T.bg} textColor={T.ink} />
      <DanaPlanCalendar />
      <Footer colophon theme={T} />
    </main>
  )
}
