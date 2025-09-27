'use client'

export default function Footer() {
  return (
    <div className="bg-[#435938] w-full">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pb-[60px] pt-[30px] px-[20px] md:px-[60px] text-center sm:text-left">
          <p className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap">
            Typefaces: PP Mondwest, PP Neue Montreal
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity cursor-pointer"
          >
            Beam me up, Scotty ↑
          </button>
        </footer>
      </div>
    </div>
  );
}
