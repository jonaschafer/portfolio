import { readFileSync } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { BUILDS, getBuild } from '../../../lib/builds'
import PlayArticle from '../../../components/PlayArticle'

// Build write-ups. Static routes in app/play (git, gels, sounds...) win over
// this one, and only slugs in lib/builds.js render.
export const dynamicParams = false

export function generateStaticParams() {
  return BUILDS.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }) {
  const build = getBuild(params.slug)
  if (!build) return {}
  return { title: `Jon Schafer — ${build.name}`, description: build.dek }
}

export default function BuildPage({ params }) {
  const build = getBuild(params.slug)
  if (!build) notFound()
  const body = readFileSync(path.join(process.cwd(), 'app/play/[slug]/content', `${build.slug}.md`), 'utf8')
  return <PlayArticle build={build} body={body} />
}
