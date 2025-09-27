export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Jon is an extremely talented visual thinker and designer. He is fast, focused and capable of handling multiple projects simultaneously while moving them forward and meeting client objectives. Jon's positive attitude and energy were a real asset to our small studio dynamic. He is a thoughtful, generous person, and a very gifted designer and problem solver.",
      name: "Lael Tyler",
      title: "Creative Director, Cast Iron Coding"
    },
    {
      quote: "Jon has a knack for creating visual stories that stand out—a talent worth its weight in gold. He's always one to offer a fresh perspective, to challenge the status quo, and to riff on ideas big & small. In short: everything he touches packs the right amount of punch (and has a hint of sparkle). He's an amazing collaborator and curious problem solver, always looking to find the right balance between a variety of needs. We've been so lucky to have him on the team at Clockwise and his impact will last for a very long time.",
      name: "Kacy Boone",
      title: "VP of Marketing, Clockwise"
    },
    {
      quote: "Jon loves design and he really stays on top of industry trends and tech possibilities. He's got great enthusiasm for ideas, and is very methodical in the way he approaches design, creating helpful and organized systems that make things easier for everyone on the team. He's also an all-around nice guy, which is always a treat.",
      name: "Kate McCagg",
      title: "Head of Brand Innovation Lab, Amazon"
    },
    {
      quote: "I've had the pleasure of working alongside Jon for over a year. Jon is consistently curious which is a necessity in product development. This combined with a methodical approach and desire to delight customers pushes our team to develop better solutions. He's always willing to learn and is a force for collaboration on the team. His passion for the details shows up in the quality of his work.",
      name: "Chris Geohegan",
      title: "VP of Product, Zapier"
    }
  ];

  return (
    <div className="bg-[#435938] w-full">
      <div className="min-w-[375px] max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="px-[20px] md:px-[60px] pt-[60px] pb-[30px]">
          <h2 className="font-['Mondwest',_sans-serif] text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] max-w-[747px]">
            Friends
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="px-[20px] md:px-[60px] pb-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[40px]">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col gap-[8px]">
                <p className="font-['Haas_Grot_Disp',_sans-serif] text-[14px] md:text-[16px] lg:text-[19.4px] leading-[1.2] text-[#FAFAFA] tracking-[0.167px]">
                  {testimonial.quote}
                </p>
                <div className="text-[13.4px] leading-[16.44px] text-[#FAFAFA] font-['Haas_Grot_Disp',_sans-serif] tracking-[0.167px]">
                  <p className="mb-0 font-medium">{testimonial.name}</p>
                  <p className="opacity-80">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
