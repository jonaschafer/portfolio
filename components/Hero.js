export default function Hero() {
  return (
    <div className="bg-[#ebac1e] w-full">
      <section className="min-w-[1200px] max-w-[1440px] mx-auto pt-[60px] pb-[60px]">
        <div className="w-full px-[60px]">
          <p className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] max-w-[747px]">
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

