import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { Trash2 } from "lucide-react"

export interface PlannerItem {
  id: string
  timeSlot: string
  activity: string
}

const HOURS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM"
]

export function PlannerPage() {
  const [planner, setPlanner] = useState<PlannerItem[]>(() => {
    const saved = localStorage.getItem("velorah-planner")
    return saved ? JSON.parse(saved) : []
  })
  const [selectedTime, setSelectedTime] = useState(HOURS[0])
  const [activityInput, setActivityInput] = useState("")

  // Mute state
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("velorah-sound-muted")
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem("velorah-planner", JSON.stringify(planner))
  }, [planner])

  const addPlannerItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityInput.trim()) return
    const newItem: PlannerItem = {
      id: Date.now().toString(),
      timeSlot: selectedTime,
      activity: activityInput.trim(),
    }
    setPlanner([...planner, newItem].sort((a, b) => HOURS.indexOf(a.timeSlot) - HOURS.indexOf(b.timeSlot)))
    setActivityInput("")
  }

  const deletePlannerItem = (id: string) => {
    setPlanner(planner.filter(item => item.id !== id))
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" muted={isMuted} />
      <Navbar active="Planner" isMuted={isMuted} onMuteToggle={() => setIsMuted(!isMuted)} />

      <section className="relative z-10 flex flex-col items-center px-6 pt-12 pb-24 max-w-2xl mx-auto justify-center min-h-[calc(100vh-96px)]">
        <h1
          className="text-4xl sm:text-5xl text-white text-center leading-[0.95] tracking-[-1.5px] mb-8"
          style={{ fontFamily: "'Instrument Serif', serif", textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
        >
          Daily Planner
        </h1>

        <div className="w-full bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
          <form onSubmit={addPlannerItem} className="flex gap-2 mb-6 flex-wrap sm:flex-nowrap">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour} className="bg-neutral-900 text-white">
                  {hour}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="What is planned for this hour?"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold rounded-xl px-5 py-3 hover:bg-white/90 transition-transform active:scale-[0.98] w-full sm:w-auto"
            >
              Add
            </button>
          </form>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {planner.length === 0 ? (
              <p className="text-center text-sm text-white/50 py-6">Your schedule is clear. Plan your hours above.</p>
            ) : (
              planner.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-white/60 bg-white/10 rounded px-2.5 py-1">
                      {item.timeSlot}
                    </span>
                    <span className="text-sm text-white">{item.activity}</span>
                  </div>
                  <button
                    onClick={() => deletePlannerItem(item.id)}
                    className="text-white/40 hover:text-red-400 p-2 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
