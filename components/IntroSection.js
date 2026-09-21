
import Link from 'next/link'

export default function IntroSection() {
  return (
    <div className="bg-[#435938] w-full">
      <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
        <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
          <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] lg:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px] whitespace-pre-wrap">
            <span>I'm Jon. I lead brand at </span>
            <a
              className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity"
              href="https://www.classdojo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ClassDojo
            </a>
            <span>, where I build visual identities, design systems, and the creative teams that bring them to life. </span>
            <Link
              href="/bio"
              className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity"
            >
              More about me
            </Link>
            <span> 🌧️</span>
          </p>
        </div>
      </section>
    </div>
  );
}
