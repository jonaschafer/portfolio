export default function IntroSection() {
  return (
    <div className="bg-[#435938] w-full">
      <section className="min-w-[375px] max-w-[1440px] mx-auto pt-[60px] pb-[40px]">
        <div className="w-full px-5 md:px-[60px] lg:px-[60px]">
          <h1 className="font-['Mondwest',_sans-serif] text-[20px] md:text-[31px] text-[#FAFAFA] leading-[1.2] tracking-[0.31px] max-w-[335px] md:max-w-[648px] lg:max-w-[747px]">
            I&apos;m Jon, head of brand at{' '}
            <a className="hl" href="https://www.classdojo.com/" target="_blank" rel="noopener noreferrer">
              ClassDojo
            </a>{' '}
            in rainy Portland. 🌧️ For <span className="text-[#F8DB79]">22 years</span> I&apos;ve built identities, the
            systems that carry them, and the teams that keep them going.
          </h1>
        </div>
      </section>
    </div>
  )
}
