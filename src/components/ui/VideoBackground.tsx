import { useRef, useEffect } from 'react'

interface VideoBackgroundProps {
  src: string
  overlayClass?: string  // tailwind class for the overlay gradient
  className?: string
  children?: React.ReactNode
}

/**
 * Fullscreen video background with a gradient overlay for text readability.
 * Falls back to a dark gradient if the video fails to load.
 */
export function VideoBackground({
  src,
  overlayClass = 'video-overlay',
  className = '',
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Attempt autoplay; browser may block it silently
    videoRef.current?.play().catch(() => {
      // fallback: video stays as poster/static
    })
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Fallback: shown if video fails */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(200,223,168,0.18) 0%, rgba(8,10,7,0) 70%), radial-gradient(ellipse at 80% 80%, rgba(139,168,112,0.12) 0%, rgba(8,10,7,0) 60%)',
        }}
      />

      {/* Gradient overlay for readability */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
