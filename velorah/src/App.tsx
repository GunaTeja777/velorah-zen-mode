import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Hero } from "@/pages/Hero"
import { Zen } from "@/pages/Zen"
import { TaskManager } from "@/pages/TaskManager"
import { PlannerPage } from "@/pages/PlannerPage"
import { ProductivityStats } from "@/pages/ProductivityStats"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/zen" element={<Zen />} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/stats" element={<ProductivityStats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
