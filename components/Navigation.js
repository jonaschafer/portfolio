'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Francine Thompson's layout: name left, one link centered, one right, fixed
// to the top on the page's own field. Name in Nichrome, links in Social
// Condensed. The name goes home, which is the work page.
export default function Navigation({ backgroundColor = '#FFFFFF', textColor = '#2E2E2E' }) {
  const pathname = usePathname()
  const isTransparent = backgroundColor === 'transparent'
  const link = (href, label) => {
    const active = pathname?.startsWith(href)
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`font-['Social_Condensed','Haas_Grot_Disp',sans-serif] text-[18px] md:text-[19px] leading-none tracking-[0.19px] transition-opacity hover:opacity-100 ${active ? 'opacity-100' : 'opacity-70'}`}
      >
        {label}
      </Link>
    )
  }
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ color: textColor, ...(isTransparent ? {} : { backgroundColor }) }}
      >
        <div className="grid grid-cols-3 items-baseline px-[20px] md:px-[26px] py-[20px] md:py-[24px]">
          <Link
            href="/"
            className="justify-self-start font-['Nichrome','Arial_Black',sans-serif] font-black text-[19px] md:text-[21px] leading-none tracking-[0.21px] hover:opacity-80 transition-opacity"
          >
            Jon Schafer
          </Link>
          <div className="justify-self-center">{link('/play', 'Play')}</div>
          <div className="justify-self-end">{link('/about', 'About')}</div>
        </div>
      </nav>
      {!isTransparent && <div aria-hidden="true" className="h-[60px] md:h-[68px]" />}
    </>
  )
}
