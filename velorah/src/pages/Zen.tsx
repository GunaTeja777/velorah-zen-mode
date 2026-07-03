import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { TimerRing } from "@/components/TimerRing"
import { Navbar } from "@/components/Navbar"

const PRESETS = [
  { label: "Sprint", minutes: 15 },
  { label: "Focus", minutes: 25 },
  { label: "Deep Work", minutes: 50 },
  { label: "Flow", minutes: 90 },
]

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function Zen() {
  const [durationMinutes, setDurationMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Mute state synced with localStorage
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("velorah-sound-muted")
    return saved !== null ? JSON.parse(saved) : true
  })

  const toggleMute = () => {
    setIsMuted((prev: boolean) => {
      const next = !prev
      localStorage.setItem("velorah-sound-muted", JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(intervalRef.current ?? undefined)
            setIsRunning(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [isRunning])

  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(secondsLeft)} · Velorah Zen`
      : "Zen Mode · Velorah"
  }, [secondsLeft, isRunning])

  const selectPreset = (minutes: number) => {
    setDurationMinutes(minutes)
    setSecondsLeft(minutes * 60)
    setIsRunning(false)
    setIsComplete(false)
  }

  const toggleRunning = () => {
    if (isComplete) {
      setSecondsLeft(durationMinutes * 60)
      setIsComplete(false)
    }
    setIsRunning((prev) => !prev)
  }

  const reset = () => {
    setIsRunning(false)
    setIsComplete(false)
    setSecondsLeft(durationMinutes * 60)
  }

  const totalSeconds = durationMinutes * 60
  const progress = totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" muted={isMuted} />

      <Navbar
        ctaLabel="Exit Session"
        ctaTo="/"
        minimal={true}
        isMuted={isMuted}
        onMuteToggle={toggleMute}
      />

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-24 min-h-[calc(100vh-96px)] justify-center">
        <p className="animate-fade-rise text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Zen Mode
        </p>

        <h1
          className="animate-fade-rise mt-4 text-4xl sm:text-5xl leading-[0.95] tracking-[-1.5px] text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Sit with the <em className="not-italic text-muted-foreground">silence.</em> Let the work rise.
        </h1>

        <div className="animate-fade-rise-delay mt-14">
          <TimerRing
            progress={isComplete ? 1 : progress}
            isRunning={isRunning}
            label={isComplete ? "Done" : formatTime(secondsLeft)}
            sublabel={isComplete ? "Session complete" : `${durationMinutes} minute ${durationMinutes === 1 ? "session" : "session"}`}
          />
        </div>

        <div className="animate-fade-rise-delay-2 mt-14 flex items-center gap-4">
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="liquid-glass rounded-full p-4 text-foreground transition-transform hover:scale-[1.05]"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            onClick={toggleRunning}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            className="liquid-glass rounded-full px-10 py-4 text-sm text-foreground transition-transform hover:scale-[1.03]"
          >
            <span className="flex items-center gap-2">
              {isRunning ? (
                <Pause className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Play className="h-4 w-4" strokeWidth={1.5} />
              )}
              {isRunning ? "Pause" : isComplete ? "Begin again" : "Start focus"}
            </span>
          </button>
        </div>

        <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap items-center justify-center gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => selectPreset(preset.minutes)}
              className={
                preset.minutes === durationMinutes
                  ? "liquid-glass rounded-full px-5 py-2 text-xs text-foreground transition-transform hover:scale-[1.03]"
                  : "rounded-full px-5 py-2 text-xs text-muted-foreground border border-border transition-colors hover:text-foreground"
              }
            >
              {preset.label} · {preset.minutes}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
