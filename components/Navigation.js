'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Name left in Nichrome Regular, Play and About together on the right in
// Social Condensed at the same size and weight, fixed to the top on the
// page's own field. The name goes home, which is the work page.
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
        <div className="flex items-baseline justify-between px-[20px] md:px-[26px] py-[20px] md:py-[24px]">
          <Link
            href="/"
            className="font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal text-[18px] md:text-[19px] leading-none tracking-[0.19px] hover:opacity-80 transition-opacity"
          >
            Jon Schafer
          </Link>
          <div className="flex items-baseline gap-[24px]">
            {link('/play', 'Play')}
            {link('/about', 'About')}
          </div>
        </div>
      </nav>
      {!isTransparent && <div aria-hidden="true" className="h-[60px] md:h-[68px]" />}
    </>
  )
}
