export default function Navigation() {
  return (
    <nav className="bg-[#435938] flex items-center justify-between pb-[60px] pt-[30px] px-[20px] md:px-[60px]">
      <p className="font-['Inter',_sans-serif] font-normal leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap">
        Jon Schafer
      </p>
      
      <div className="flex items-center gap-[20px] md:gap-[30px]">
        <a 
          href="#hello" 
          className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
        >
          Say 'ello
        </a>
        <a 
          href="#tunes" 
          className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap hover:opacity-80 transition-opacity"
        >
          Tunes
        </a>
        <a 
          href="#vibes" 
          className="font-['Haas_Grot_Disp',_sans-serif] leading-[1.4] text-[16px] text-[#FAFAFA] tracking-[0.16px] whitespace-nowrap border border-white rounded-full px-[20px] py-[10px] hover:bg-white hover:text-[#435938] transition-all"
        >
          Vibes
        </a>
      </div>
    </nav>
  );
}
