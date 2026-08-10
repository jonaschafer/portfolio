import MmaRecoveryCardViewer from '../../components/MmaRecoveryCardViewer'
import MmaRecoveryLongScroll from '../../components/MmaRecoveryLongScroll'

export const metadata = {
  title: 'Breaking My Jaw to Fix How I Breathe — Jon Schafer',
  description:
    'A narrative log of MMA (maxillomandibular advancement) surgery recovery and the return to running — from pre-op through a full year of rebuild.',
}

export default function MmaPage() {
  return (
    <>
      <div className="md:hidden">
        <MmaRecoveryCardViewer />
      </div>
      <div className="hidden md:block">
        <MmaRecoveryLongScroll />
      </div>
    </>
  )
}
