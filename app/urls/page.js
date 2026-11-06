import UrlIndex from '../../components/UrlIndex'
import { getSiteUrls } from '../../lib/site-urls'

// Built once at deploy from the files on disk (see lib/site-urls.js).
export const dynamic = 'force-static'

export const metadata = {
  title: 'Jon Schafer — URLs',
  description: 'Every live page on jonschafer.com.',
  robots: { index: false, follow: true },
}

export default function UrlsPage() {
  const { total, groups } = getSiteUrls()
  return <UrlIndex total={total} groups={groups} />
}
