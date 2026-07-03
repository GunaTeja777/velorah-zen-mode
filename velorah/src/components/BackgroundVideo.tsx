import { useEffect, useRef, useState } from "react"
import { HERO_VIDEO_URL } from "@/lib/constants"

interface BackgroundVideoProps {
  src?: string
  muted?: boolean
}

export function BackgroundVideo({
  src = HERO_VIDEO_URL,
  muted = true,
}: BackgroundVideoProps) {
  const videoRefA = useRef<HTMLVideoElement>(null)
  const videoRefB = useRef<HTMLVideoElement>(null)

  const [activeVideo, setActiveVideo] = useState<"A" | "B">("A")
  const [opacityA, setOpacityA] = useState(1)
  const [opacityB, setOpacityB] = useState(0)

  useEffect(() => {
    const videoA = videoRefA.current
    const videoB = videoRefB.current
    if (!videoA || !videoB) return

    // Initialize both videos
    videoA.currentTime = 0
    videoB.currentTime = 0
    
    // Play videoA first
    videoA.play().catch(() => {})
    videoB.pause()
    
    setOpacityA(1)
    setOpacityB(0)
    setActiveVideo("A")
  }, [src])

  useEffect(() => {
    const videoA = videoRefA.current
    const videoB = videoRefB.current
    if (!videoA || !videoB) return

    let rafId: number
    let transitionTriggered = false

    const checkCrossfade = () => {
      const activeRef = activeVideo === "A" ? videoA : videoB
      const inactiveRef = activeVideo === "A" ? videoB : videoA

      if (activeRef.duration) {
        const duration = activeRef.duration
        const currentTime = activeRef.currentTime

        // Trigger crossfade 1.5 seconds before the active video ends
        if (currentTime >= duration - 1.5 && !transitionTriggered) {
          transitionTriggered = true

          // Start playing the inactive video from the beginning under the active one
          inactiveRef.currentTime = 0
          inactiveRef.play().then(() => {
            // Smoothly crossfade opacity A and B
            if (activeVideo === "A") {
              setOpacityA(0)
              setOpacityB(1)
            } else {
              setOpacityA(1)
              setOpacityB(0)
            }

            // Once transition finishes, pause active video and switch active role
            setTimeout(() => {
              activeRef.pause()
              activeRef.currentTime = 0
              setActiveVideo(activeVideo === "A" ? "B" : "A")
              transitionTriggered = false
            }, 1300)
          }).catch(() => {
            transitionTriggered = false
          })
        }
      }
      rafId = requestAnimationFrame(checkCrossfade)
    }

    rafId = requestAnimationFrame(checkCrossfade)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [activeVideo])

  // Sync volume and playback state
  useEffect(() => {
    const videoA = videoRefA.current
    const videoB = videoRefB.current
    if (videoA) videoA.muted = muted
    if (videoB) videoB.muted = muted
    
    const active = activeVideo === "A" ? videoA : videoB
    if (active) {
      active.play().catch(() => {})
    }
  }, [muted, activeVideo])

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-[#07121b] overflow-hidden">
      <video
        ref={videoRefA}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: opacityA,
          transition: "opacity 1200ms ease-in-out",
        }}
        muted={muted}
        playsInline
        preload="auto"
        src={src}
      />
      <video
        ref={videoRefB}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: opacityB,
          transition: "opacity 1200ms ease-in-out",
        }}
        muted={muted}
        playsInline
        preload="auto"
        src={src}
      />
    </div>
  )
}
