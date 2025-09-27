export default function Navigation() {
  return (
    <div className="bg-[#435938] w-full">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        <nav className="flex items-center justify-between pb-[60px] pt-[30px] px-[20px] md:px-[60px]">
          <p className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap">
            Jon Schafer
          </p>
          
          <div className="flex items-center gap-[20px] md:gap-[30px]">
            <a 
              href="mailto:hello@jonschafer.com?subject=Hello%20from%20MCP!%20" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Say 'ello
            </a>
            <a 
              href="https://open.spotify.com/user/jonaschafer?si=5edabafb78584a0d" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Tunes
            </a>
            <a 
              href="https://www.are.na/jon-schafer/blocks" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap border border-white rounded-full px-[20px] py-[10px] hover:bg-white hover:text-[#435938] transition-all"
            >
              Vibes
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
