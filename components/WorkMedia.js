'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { mediaSrc, isVideo, isGif, isPlaceholder } from '../lib/projects'

// One image or video from a project folder, filling its (relative) parent.
// It sits on the checkerboard loading state and fades in once loaded.
export default function WorkMedia(props) {
  return isPlaceholder(props.file) ? <PlaceholderCard {...props} /> : <Media {...props} />
}

// Stand-in for a shot that hasn't been exported yet: the shot description on
// a dashed card, numbered so it maps back to the list in lib/projects.js.
function PlaceholderCard({ project, file }) {
  const n = project.images.indexOf(file) + 1
  return (
    <span className="absolute inset-0 flex items-center justify-center p-[16px] md:p-[24px]">
      <span className="w-full h-full max-w-[1300px] max-h-full flex flex-col justify-between rounded-[4px] border border-dashed p-[20px] md:p-[32px] text-left font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
        style={{
          borderColor: 'color-mix(in srgb, currentColor 40%, transparent)',
          backgroundColor: 'color-mix(in srgb, currentColor 5%, transparent)',
        }}
      >
        <span className="text-[13px] md:text-[14px] opacity-60">
          Placeholder {n} / {project.images.length}
        </span>
        <span className="text-[18px] md:text-[26px] leading-[1.25] max-w-[880px]">{file}</span>
      </span>
    </span>
  )
}

function Media({ project, file, sizes, className = '', playing = false, eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)
  // Media can finish before hydration attaches onLoad, so check on mount too.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.tagName === 'VIDEO' ? el.readyState >= 1 : el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])
  const src = mediaSrc(project, file)
  const cls = `load-fade ${className}`
  return (
    <>
      <span aria-hidden="true" className="load-checker absolute inset-0 transition-opacity duration-500" style={{ opacity: loaded ? 0 : 1 }} />
      {isVideo(file) ? (
        // `#t=0.1` makes browsers paint a first frame instead of a blank box.
        <video
          ref={ref}
          className={cls}
          data-loaded={loaded}
          src={`${src}#t=0.1`}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay={playing}
          onLoadedData={() => setLoaded(true)}
          onLoadedMetadata={() => setLoaded(true)}
        />
      ) : (
        <Image
          ref={ref}
          src={src}
          alt={project.title}
          fill
          sizes={sizes}
          className={cls}
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
          unoptimized={isGif(file)}
          priority={eager}
        />
      )}
    </>
  )
}
