import HqBody from '../../components/HqBody'

export const metadata = {
  title: 'Jon Schafer — HQ',
  description: 'HQ, a forms tool for studios. A live intake form, embedded.',
  // A demo for a studio trial, not a portfolio page yet.
  robots: { index: false, follow: false },
}

export default function HqPage() {
  return <HqBody />
}
