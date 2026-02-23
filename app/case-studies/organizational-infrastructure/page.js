import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'

const bgColor = '#F8DB79'
const textColor = '#333333'
const mutedColor = 'rgba(51,51,51,0.85)'
const borderColor = 'rgba(51,51,51,0.2)'

const prose = {
  h1: ({ node, ...props }) => (
    <h1
      className="font-['Mondwest',_sans-serif] text-[28px] md:text-[36px] leading-tight tracking-[0.31px] mt-0 mb-8"
      style={{ color: textColor }}
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="font-['Mondwest',_sans-serif] text-[20px] md:text-[24px] font-semibold mt-12 mb-4 leading-tight tracking-[0.31px]"
      style={{ color: textColor }}
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="font-['Mondwest',_sans-serif] text-[18px] md:text-[20px] font-semibold mt-8 mb-3 leading-tight"
      style={{ color: textColor }}
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p
      className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[19.4px] leading-[1.35] tracking-[0.167px] my-5"
      style={{ color: mutedColor }}
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="font-['Haas_Grot_Disp',_sans-serif] list-disc pl-6 my-5 space-y-2 text-[13.4px] md:text-[19.4px]"
      style={{ color: mutedColor }}
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="font-['Haas_Grot_Disp',_sans-serif] list-decimal pl-6 my-5 space-y-2 text-[13.4px] md:text-[19.4px]"
      style={{ color: mutedColor }}
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 pl-5 my-6 italic"
      style={{ borderColor, color: mutedColor }}
      {...props}
    />
  ),
  a: ({ node, href, ...props }) => {
    const isExternal = href?.startsWith('http')
    const Comp = isExternal ? 'a' : Link
    const extra = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <Comp
        href={href || '#'}
        className="underline hover:opacity-80 transition-opacity"
        style={{ color: textColor }}
        {...extra}
        {...props}
      />
    )
  },
  strong: ({ node, ...props }) => (
    <strong className="font-semibold" style={{ color: textColor }} {...props} />
  ),
  code: ({ node, inline, className, children, ...props }) =>
    inline ? (
      <code
        className="px-1.5 py-0.5 rounded text-[13px] font-mono"
        style={{ color: textColor, backgroundColor: 'rgba(51,51,51,0.1)' }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block p-4 rounded-lg my-4 text-[13px] font-mono overflow-x-auto"
        style={{ color: textColor, backgroundColor: 'rgba(51,51,51,0.1)' }}
        {...props}
      >
        {children}
      </code>
    ),
  hr: ({ node, ...props }) => (
    <hr className="my-8" style={{ borderColor }} {...props} />
  ),
}

function getContent() {
  try {
    const filePath = path.join(
      process.cwd(),
      'app/case-studies/organizational-infrastructure/content.md'
    )
    return readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

export const metadata = {
  title: 'Moving a brand team from order-takers to strategic partners — Jon Schafer',
  description:
    "I didn't write a process doc. I built software.",
}

export default function OrganizationalInfrastructurePage() {
  const content = getContent()

  return (
    <main className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <Navigation backgroundColor={bgColor} textColor={textColor} underlineColor={textColor} />
      <article className="min-w-[375px] max-w-[747px] mx-auto px-[20px] md:px-[60px] pb-[60px]">
        <header className="pt-[40px] md:pt-[60px] pb-[40px] md:pb-[48px]">
          <h1
            className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] leading-[1.2] tracking-[0.31px]"
            style={{ color: textColor }}
          >
            Moving a brand team from order-takers to strategic partners
          </h1>
          <p
            className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] md:text-[19.4px] leading-[1.35] mt-4"
            style={{ color: mutedColor }}
          >
            I didn't write a process doc. I built software.
          </p>
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={prose}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
      <Footer backgroundColor={bgColor} textColor={textColor} />
    </main>
  )
}
