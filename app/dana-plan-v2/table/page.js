import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import DanaPlanTable from '../../../components/DanaPlanTable'

export const metadata = {
  title: "Dana's Plan — Table — Jon Schafer",
  description: "Wy'East 50M training plan table view.",
}

export default function DanaPlanTablePage() {
  return (
    <main className="min-h-screen bg-[#435938]">
      <Navigation />
      <DanaPlanTable />
      <Footer />
    </main>
  )
}
