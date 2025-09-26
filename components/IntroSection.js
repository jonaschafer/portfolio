// components/IntroSection.js
export default function IntroSection() {
  return (
    <section className="bg-[#435938] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <p className="font-['PP_Mondwest:Regular',_sans-serif] text-[clamp(24px,_4vw,_31px)] text-neutral-50 leading-[1.2] tracking-[0.31px]">
          <span className="inline-block mr-2">👋</span>
          <span>Howdy! I'm Jon, Creative Director at ClassDojo based in rainy </span>
          <span className="inline-block mx-1">🌧️</span>
          <span>Portland. Prev </span>
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
          <span>. Big fan of emojis. </span>
          <span className="inline-block">🥳</span>
        </p>
      </div>
    </section>
  );
}
