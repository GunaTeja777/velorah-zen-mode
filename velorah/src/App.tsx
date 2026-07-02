import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Hero } from "@/pages/Hero"
import { Zen } from "@/pages/Zen"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/zen" element={<Zen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
