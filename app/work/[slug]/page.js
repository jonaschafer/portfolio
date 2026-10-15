import { notFound } from 'next/navigation'
import Navigation from '../../../components/Navigation'
import ProjectBody from '../../../components/ProjectBody'
import Footer from '../../../components/Footer'
import { WITH_PAGES } from '../projects'

export function generateStaticParams() {
  return WITH_PAGES.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const p = WITH_PAGES.find((x) => x.slug === params.slug)
  if (!p) return {}
  return { title: `${p.title} — Jon Schafer`, description: `${p.title}: ${p.role}, ${p.org}, ${p.year}.` }
}

export default function ProjectPage({ params }) {
  const i = WITH_PAGES.findIndex((x) => x.slug === params.slug)
  if (i === -1) notFound()
  const next = WITH_PAGES[(i + 1) % WITH_PAGES.length]
  return (
    <main className="bg-[#435938]">
      <Navigation />
      <ProjectBody slug={params.slug} nextSlug={next.slug} />
      <Footer colophon />
    </main>
  )
}
