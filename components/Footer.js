'use client'

export default function Footer({ backgroundColor = '#435938', textColor = '#FAFAFA', className = '' }) {
  return (
    <div className={`w-full ${className}`.trim()} style={{ backgroundColor }}>
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pb-[60px] pt-[30px] px-[20px] md:px-[60px] text-center sm:text-left">
          <p className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap" style={{ color: textColor }}>
            Typefaces: PP Mondwest, PP Neue Montreal
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: textColor }}
          >
            Beam me up, Scotty ↑
          </button>
        </footer>
      </div>
    </div>
  );
}
