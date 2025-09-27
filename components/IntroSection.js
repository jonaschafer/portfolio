export default function IntroSection() {
  return (
    <div className="bg-[#435938] w-full">
      <section className="min-w-[375px] max-w-[1440px] mx-auto min-h-screen flex items-center">
        <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
          <p className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] lg:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px] whitespace-pre-wrap">
            <span>👋 Howdy! I'm Jon, Creative Director at ClassDojo based in rainy  🌧️ Portland. Prev </span>
            <a 
              className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity" 
              href="https://workisplay.studio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Work is Play
            </a>
            <span>, </span>
            <a 
              className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity" 
              href="https://www.getclockwise.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clockwise
            </a>
            <span>, and </span>
            <a 
              className="[text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer decoration-solid underline hover:opacity-80 transition-opacity" 
              href="https://zapier.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zapier
            </a>
            . Big fan of emojis. 🥳
          </p>
        </div>
      </section>
    </div>
  );
}
