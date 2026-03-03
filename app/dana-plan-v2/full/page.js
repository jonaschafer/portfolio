import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanFull from '../../../components/DanaPlanFull'

export const metadata = {
  title: "Dana's Plan — Full text — Jon Schafer",
  description: "Wy'East 50M training plan full week text.",
}

export default function DanaPlanFullPage() {
  return (
    <main className="min-h-screen bg-[#2e2e2e]">
      <Navigation backgroundColor="#2e2e2e" />
      <DanaPlanFull />
      <Footer backgroundColor="#2e2e2e" minimal />
    </main>
  )
}
