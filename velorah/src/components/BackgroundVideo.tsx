import { HERO_VIDEO_URL } from "@/lib/constants"

export function BackgroundVideo() {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      loop
      muted
      playsInline
      src={HERO_VIDEO_URL}
    />
  )
}
