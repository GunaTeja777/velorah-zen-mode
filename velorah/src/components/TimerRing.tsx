interface TimerRingProps {
  progress: number // 0 to 1
  isRunning: boolean
  label: string
  sublabel: string
}

const SIZE = 320
const STROKE = 1.5
const RADIUS = (SIZE - STROKE * 2) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({ progress, isRunning, label, sublabel }: TimerRingProps) {
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={isRunning ? "animate-ambient-pulse -rotate-90" : "-rotate-90"}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span
          className="text-6xl sm:text-7xl text-white tabular-nums"
          style={{
            fontFamily: "'Instrument Serif', serif",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </span>
        <span
          className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/70"
          style={{
            textShadow: "0 1px 5px rgba(0,0,0,0.8)",
          }}
        >
          {sublabel}
        </span>
      </div>
    </div>
  )
}
