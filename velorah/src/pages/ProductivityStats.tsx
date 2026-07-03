import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { Award, Clock, CheckSquare, BarChart } from "lucide-react"

export interface FocusSession {
  id: string
  duration: number
  task: string
  createdAt: number
}

export function ProductivityStats() {
  const [history, setHistory] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem("velorah-focus-history")
    return saved ? JSON.parse(saved) : []
  })

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("velorah-tasks")
    return saved ? JSON.parse(saved) : []
  })

  // Mute state
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("velorah-sound-muted")
    return saved !== null ? JSON.parse(saved) : true
  })

  // Calculations
  const totalMinutes = history.reduce((acc, session) => acc + session.duration, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const sessionsCount = history.length
  
  const completedTasks = tasks.filter((t: any) => t.completed).length
  const totalTasks = tasks.length
  
  // Productivity Score Calculation:
  // (Completed Tasks percentage * 50) + (Focus Session Count points * 10, capped at 50)
  const productivityScore = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 50 + Math.min(sessionsCount * 10, 50))
    : Math.min(sessionsCount * 15, 100)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" muted={isMuted} />
      <Navbar active="Productivity" isMuted={isMuted} onMuteToggle={() => setIsMuted(!isMuted)} />

      <section className="relative z-10 flex flex-col items-center px-6 pt-12 pb-24 max-w-3xl mx-auto justify-center min-h-[calc(100vh-96px)]">
        <h1
          className="text-4xl sm:text-5xl text-white text-center leading-[0.95] tracking-[-1.5px] mb-8"
          style={{ fontFamily: "'Instrument Serif', serif", textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
        >
          Productivity Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
          {/* Card 1: Score */}
          <div className="bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <Award className="h-7 w-7 text-yellow-400 mb-2" />
            <span className="text-xs text-white/60 uppercase tracking-widest">Productivity Score</span>
            <span className="text-4xl font-bold text-white mt-1">{productivityScore}%</span>
          </div>

          {/* Card 2: Focused Time */}
          <div className="bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <Clock className="h-7 w-7 text-blue-400 mb-2" />
            <span className="text-xs text-white/60 uppercase tracking-widest">Productive Hours</span>
            <span className="text-4xl font-bold text-white mt-1">{totalHours}h</span>
            <span className="text-[10px] text-white/40 mt-1">{totalMinutes} total minutes</span>
          </div>

          {/* Card 3: Tasks Finished */}
          <div className="bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <CheckSquare className="h-7 w-7 text-green-400 mb-2" />
            <span className="text-xs text-white/60 uppercase tracking-widest">Tasks Completed</span>
            <span className="text-4xl font-bold text-white mt-1">{completedTasks}/{totalTasks}</span>
          </div>
        </div>

        {/* Focus Session Log */}
        <div className="w-full bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-white/80" />
            Recent Focus Sessions
          </h2>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-center text-sm text-white/50 py-8">No completed sessions logged yet. Start focus to log time!</p>
            ) : (
              history.slice().reverse().map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{session.task}</span>
                    <span className="text-[10px] text-white/40 mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 rounded px-2.5 py-1">
                    +{session.duration} min
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
