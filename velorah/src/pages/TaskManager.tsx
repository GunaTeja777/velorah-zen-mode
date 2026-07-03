import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { Plus, Check, Trash2, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("velorah-tasks")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const navigate = useNavigate()

  // Mute state
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("velorah-sound-muted")
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem("velorah-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    }
    setTasks([newTask, ...tasks])
    setInput("")
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const startTaskFocus = (taskText: string) => {
    localStorage.setItem("velorah-active-task", taskText)
    navigate("/zen")
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" muted={isMuted} />
      <Navbar active="Task Manager" isMuted={isMuted} onMuteToggle={() => setIsMuted(!isMuted)} />

      <section className="relative z-10 flex flex-col items-center px-6 pt-12 pb-24 max-w-2xl mx-auto justify-center min-h-[calc(100vh-96px)]">
        <h1
          className="text-4xl sm:text-5xl text-white text-center leading-[0.95] tracking-[-1.5px] mb-8"
          style={{ fontFamily: "'Instrument Serif', serif", textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
        >
          Task Manager
        </h1>

        <div className="w-full bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="What are we focusing on next?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold rounded-xl px-5 py-3 hover:bg-white/90 transition-transform active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-center text-sm text-white/50 py-6">No tasks added yet. Add a task to start focusing.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-center h-5 w-5 rounded-md border ${
                        task.completed
                          ? "bg-white border-white text-black"
                          : "border-white/30 hover:border-white/60"
                      } transition-all`}
                    >
                      {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>
                    <span
                      className={`text-sm ${
                        task.completed ? "line-through text-white/40" : "text-white"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!task.completed && (
                      <button
                        onClick={() => startTaskFocus(task.text)}
                        title="Start focus session"
                        className="bg-white/10 hover:bg-white text-white/80 hover:text-black rounded-lg p-2 transition-all active:scale-[0.95]"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-white/40 hover:text-red-400 p-2 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
