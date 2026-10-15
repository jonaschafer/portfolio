'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { mediaSrc, isVideo, isGif } from '../app/work/projects'

// One image or video from a project folder, filling its (relative) parent.
// It sits on the checkerboard loading state and fades in once loaded.
export default function WorkMedia({ project, file, sizes, className = '', playing = false, eager = false }) {
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
          className={`relative ${cls}`}
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
