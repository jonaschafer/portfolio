import recoveryKitData from '../app/mma/data/recovery-kit.json'

export default function MmaRecoveryRecoveryKit({ anchor }) {
  const items = recoveryKitData.items.filter((item) => item.chapters.includes(anchor))
  if (items.length === 0) return null

  return (
    <div className="mb-[20px]">
      <div className="font-['Haas_Grot_Disp',_sans-serif] text-[11px] tracking-[0.1em] uppercase mb-[10px]" style={{ color: '#a99b7f' }}>
        What&apos;s in the kit
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mma-btn-press block rounded-[10px] overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF', boxShadow: '0 14px 30px -18px rgba(90, 70, 40, 0.28)',
              animation: `mmaFadeSlideUp 260ms cubic-bezier(0.23, 1, 0.32, 1) both`,
              animationDelay: `${i * 40}ms`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="w-full aspect-square object-contain p-[10px]" style={{ backgroundColor: '#FBF9F5' }} />
            <div className="px-[10px] pb-[10px]">
              <div className="text-[12px] leading-[1.3] mb-[3px]" style={{ color: '#2b2015' }}>{item.name}</div>
              <div className="text-[11px] leading-[1.4] mb-[4px]" style={{ color: '#8a7c68' }}>{item.note}</div>
              <div className="text-[11px] underline" style={{ color: '#7c8a6d' }}>View on Amazon ↗</div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-[10px] leading-[1.4] mt-[8px]" style={{ color: '#c4b8a0' }}>
        Just what&apos;s actually in the kit, not an endorsement or affiliate link — prices and availability change.
      </p>
    </div>
  )
}
