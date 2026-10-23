import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import DanaPlanViewer from '../../components/DanaPlanViewer'
import { T } from '../../components/planStyle'

export const metadata = {
  title: 'Jon Schafer · Back to 40',
  description: 'Running back to 40 miles a week after jaw surgery, with rows and two lift days. Week by week.',
}

export default function DanaPlanViewerPage() {
  return (
    <main className="min-h-screen pb-[47px] md:pb-0" style={{ backgroundColor: T.bg, color: T.ink }}>
      <Navigation backgroundColor={T.bg} textColor={T.ink} />
      <DanaPlanViewer />
      <Footer colophon theme={T} />
    </main>
  )
}
