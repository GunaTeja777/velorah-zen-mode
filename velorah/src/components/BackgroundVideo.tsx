import { useEffect, useRef } from "react"
import { HERO_VIDEO_URL } from "@/lib/constants"

interface BackgroundVideoProps {
  src?: string
  muted?: boolean
  isZoomed?: boolean
}

export function BackgroundVideo({
  src = HERO_VIDEO_URL,
  muted = true,
  isZoomed = true,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Loop continuation handler (seamless transition before hard end)
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime > video.duration - 0.25) {
        video.currentTime = 0.05 // short seek to avoid gap
        video.play().catch(() => {})
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [src])

  // Apply play/pause programmatically if muted changes (sometimes required for browser compliance)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!muted) {
      video.play().catch(() => {})
    }
  }, [muted])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full z-0 transition-all duration-700 ease-in-out"
      style={{
        objectFit: isZoomed ? "cover" : "contain",
        backgroundColor: "#07121b", // Sleek dark backing for fit/contain mode
      }}
      autoPlay
      loop
      muted={muted}
      playsInline
      src={src}
    />
  )
}
