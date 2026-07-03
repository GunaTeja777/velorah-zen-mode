import { useEffect, useRef } from "react"
import { BackgroundVideo } from "./BackgroundVideo"
import { HERO_VIDEO_URL } from "@/lib/constants"
import { ambientSound } from "@/lib/audio"

interface ThemeBackgroundProps {
  theme: string
  isMuted?: boolean
}

// Particle types
interface Petal {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  angle: number
  spin: number
  opacity: number
  color: string
}

interface Butterfly {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  speed: number
  wingAngle: number
  wingSpeed: number
  color: string
  trail: { x: number; y: number }[]
}

interface Firefly {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  angle: number
  opacity: number
  opacitySpeed: number
}

interface Star {
  x: number
  y: number
  size: number
  twinkleSpeed: number
  phase: number
}

interface Cloud {
  x: number
  y: number
  width: number
  height: number
  speed: number
  opacity: number
}

interface Leaf {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  angle: number
  spin: number
  flipAngle: number
  flipSpeed: number
  color: string
}

export function ThemeBackground({ theme, isMuted = true }: ThemeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== "cinematic" && !isMuted) {
      ambientSound.play(theme)
    } else {
      ambientSound.stop()
    }
    return () => {
      ambientSound.stop()
    }
  }, [theme, isMuted])

  useEffect(() => {
    // If the theme is video-based, we don't run the canvas loop.
    if (theme === "cinematic") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle high DPI screens
    const resize = () => {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    // Mouse movement tracking
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.lastX
      mouse.vy = e.clientY - mouse.lastY
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.lastX = e.clientX
      mouse.lastY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Initialize particles based on theme
    const petals: Petal[] = []
    const butterflies: Butterfly[] = []
    const fireflies: Firefly[] = []
    const stars: Star[] = []
    const clouds: Cloud[] = []
    const leaves: Leaf[] = []

    const petalColors = [
      "hsla(340, 100%, 82%, 0.75)", // Cherry blossom pink
      "hsla(340, 95%, 88%, 0.7)",  // Soft blossom pink
      "hsla(350, 100%, 90%, 0.8)", // Pale blush
      "hsla(45, 100%, 75%, 0.65)",  // Golden yellow accent
    ]

    const butterflyColors = [
      "hsla(190, 100%, 70%, 0.8)",  // Magic cyan
      "hsla(280, 100%, 75%, 0.8)",  // Radiant violet
      "hsla(25, 100%, 65%, 0.8)",   // Sunset amber
      "hsla(320, 100%, 75%, 0.8)",  // Pink amethyst
    ]

    const leafColors = [
      "hsla(140, 35%, 25%, 0.75)",  // Deep forest green
      "hsla(155, 40%, 30%, 0.7)",   // Emerald green
      "hsla(38, 75%, 45%, 0.65)",   // Golden yellow/orange
      "hsla(20, 70%, 40%, 0.65)",   // Warm rust
    ]

    // Populate arrays
    if (theme === "flowers") {
      const count = 50
      for (let i = 0; i < count; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: 6 + Math.random() * 8,
          speedX: -1 + Math.random() * 2,
          speedY: 1 + Math.random() * 1.8,
          angle: Math.random() * Math.PI * 2,
          spin: -0.02 + Math.random() * 0.04,
          opacity: 0.4 + Math.random() * 0.5,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
        })
      }
    } else if (theme === "butterflies") {
      // 6 Butterflies
      for (let i = 0; i < 6; i++) {
        butterflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: Math.random() * width,
          targetY: Math.random() * height,
          size: 14 + Math.random() * 8,
          speed: 1.2 + Math.random() * 1.5,
          wingAngle: Math.random() * Math.PI * 2,
          wingSpeed: 0.12 + Math.random() * 0.08,
          color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
          trail: [],
        })
      }
      // 30 Fireflies in the butterfly meadow
      for (let i = 0; i < 30; i++) {
        fireflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1 + Math.random() * 2.5,
          speedX: -0.5 + Math.random() * 1,
          speedY: -0.5 + Math.random() * 1,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random(),
          opacitySpeed: 0.01 + Math.random() * 0.02,
        })
      }
    } else if (theme === "mountains") {
      // 80 Twinkling stars
      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7), // Mostly in upper sky
          size: 0.6 + Math.random() * 1.4,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
        })
      }
      // 4 Drifting mist/cloud layers
      for (let i = 0; i < 4; i++) {
        clouds.push({
          x: Math.random() * width,
          y: height * 0.45 + Math.random() * (height * 0.25),
          width: 250 + Math.random() * 300,
          height: 60 + Math.random() * 60,
          speed: 0.15 + Math.random() * 0.25,
          opacity: 0.08 + Math.random() * 0.12,
        })
      }
    } else if (theme === "trees") {
      // 40 Leaves
      for (let i = 0; i < 40; i++) {
        leaves.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: 8 + Math.random() * 8,
          speedX: -0.8 + Math.random() * 1.6,
          speedY: 0.8 + Math.random() * 1.5,
          angle: Math.random() * Math.PI * 2,
          spin: -0.03 + Math.random() * 0.06,
          flipAngle: Math.random() * Math.PI * 2,
          flipSpeed: 0.02 + Math.random() * 0.04,
          color: leafColors[Math.floor(Math.random() * leafColors.length)],
        })
      }
      // 30 Fireflies in forest
      for (let i = 0; i < 30; i++) {
        fireflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1 + Math.random() * 2,
          speedX: -0.4 + Math.random() * 0.8,
          speedY: -0.3 + Math.random() * 0.6,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random(),
          opacitySpeed: 0.008 + Math.random() * 0.015,
        })
      }
    }

    // Helper functions for drawing
    const drawLeafCluster = (x: number, y: number, radius: number, color: string) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.arc(x - radius * 0.4, y + radius * 0.2, radius * 0.8, 0, Math.PI * 2)
      ctx.arc(x + radius * 0.4, y - radius * 0.2, radius * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    const drawLeafShape = (size: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-size / 2, -size / 2, -size / 2, -size, 0, -size * 1.4)
      ctx.bezierCurveTo(size / 2, -size, size / 2, -size / 2, 0, 0)
      ctx.fillStyle = color
      ctx.fill()
    }

    const drawSwayingBranches = (t: number) => {
      const swayLeft = Math.sin(t * 0.01) * 0.02
      const swayRight = Math.cos(t * 0.012) * 0.025
      
      ctx.save()
      // Top-left branch
      ctx.translate(0, 0)
      ctx.rotate(swayLeft)
      ctx.beginPath()
      ctx.moveTo(-10, -10)
      ctx.bezierCurveTo(width * 0.15, height * 0.05, width * 0.25, height * 0.25, width * 0.35, height * 0.18)
      ctx.lineWidth = 14
      ctx.strokeStyle = "#081410"
      ctx.stroke()
      
      // Draw some leaf clusters along the branch
      drawLeafCluster(width * 0.15, height * 0.10, 30, "hsla(150, 40%, 15%, 0.8)")
      drawLeafCluster(width * 0.25, height * 0.20, 24, "hsla(150, 45%, 12%, 0.8)")
      drawLeafCluster(width * 0.35, height * 0.18, 18, "hsla(160, 40%, 18%, 0.9)")
      ctx.restore()
      
      ctx.save()
      // Top-right branch
      ctx.translate(width, 0)
      ctx.rotate(swayRight)
      ctx.beginPath()
      ctx.moveTo(10, -10)
      ctx.bezierCurveTo(-width * 0.12, height * 0.08, -width * 0.22, height * 0.22, -width * 0.32, height * 0.15)
      ctx.lineWidth = 12
      ctx.strokeStyle = "#081410"
      ctx.stroke()
      
      drawLeafCluster(-width * 0.12, height * 0.08, 28, "hsla(150, 40%, 15%, 0.8)")
      drawLeafCluster(-width * 0.22, height * 0.22, 22, "hsla(150, 45%, 12%, 0.8)")
      drawLeafCluster(-width * 0.32, height * 0.15, 16, "hsla(160, 40%, 18%, 0.9)")
      ctx.restore()
    }

    // Normalized mountain curves for response scaling
    const mountainLayers = [
      {
        peaks: [0.15, 0.45, 0.3, 0.55, 0.38, 0.65, 0.48, 0.35, 0.52],
        color: "hsl(220, 32%, 12%)",
        parallax: 0.015,
      },
      {
        peaks: [0.32, 0.22, 0.38, 0.18, 0.45, 0.28, 0.38, 0.22, 0.32],
        color: "hsl(220, 35%, 8%)",
        parallax: 0.04,
      },
      {
        peaks: [0.18, 0.12, 0.24, 0.09, 0.2, 0.06, 0.15, 0.1, 0.14],
        color: "hsl(220, 38%, 4%)",
        parallax: 0.07,
      },
    ]

    let time = 0

    // Main animation frame loop
    const animate = () => {
      time++
      ctx.clearRect(0, 0, width, height)

      if (theme === "flowers") {
        // Background Gradient: Warm soft twilight (deep violet to dusky amber)
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, "hsl(245, 30%, 10%)")
        grad.addColorStop(0.5, "hsl(280, 25%, 15%)")
        grad.addColorStop(1, "hsl(350, 20%, 18%)")
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Draw and update petals
        petals.forEach((p) => {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)

          // Petal shape
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size / 2, -p.size * 1.5, 0, -p.size * 2)
          ctx.bezierCurveTo(p.size / 2, -p.size * 1.5, p.size / 2, -p.size / 2, 0, 0)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.opacity
          ctx.fill()

          // Petal rib line
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, -p.size * 1.4)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"
          ctx.lineWidth = 0.8
          ctx.stroke()

          ctx.restore()

          // Move down
          p.y += p.speedY
          p.x += p.speedX + Math.sin(p.angle) * 0.15
          p.angle += p.spin

          // Mouse push effect
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 140) {
            const force = (140 - dist) / 140
            p.x += (dx / dist) * force * 4
            p.y += (dy / dist) * force * 3
          }

          // Off-screen recycle
          if (p.y > height + 20) {
            p.y = -20
            p.x = Math.random() * width
            p.speedY = 1 + Math.random() * 1.8
            p.speedX = -1 + Math.random() * 2
            p.angle = Math.random() * Math.PI * 2
          }
        })
      } else if (theme === "butterflies") {
        // Background Gradient: Mystical teal-indigo meadow
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, "hsl(220, 45%, 8%)")
        grad.addColorStop(1, "hsl(180, 35%, 12%)")
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Draw fireflies
        fireflies.forEach((f) => {
          f.angle += 0.02
          f.x += f.speedX + Math.sin(f.angle) * 0.2
          f.y += f.speedY + Math.cos(f.angle) * 0.2
          f.opacity += f.opacitySpeed

          if (f.opacity > 0.8 || f.opacity < 0.05) {
            f.opacitySpeed = -f.opacitySpeed
          }

          // Recycle
          if (f.x < -10 || f.x > width + 10 || f.y < -10 || f.y > height + 10) {
            f.x = Math.random() * width
            f.y = Math.random() * height
            f.opacity = Math.random()
          }

          ctx.beginPath()
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(80, 100%, 75%, ${Math.max(0, f.opacity)})`
          ctx.shadowBlur = 8
          ctx.shadowColor = "hsl(80, 100%, 75%)"
          ctx.fill()
          ctx.shadowBlur = 0 // Reset shadow
        })

        // Draw butterflies
        butterflies.forEach((b) => {
          // Trail update
          b.trail.push({ x: b.x, y: b.y })
          if (b.trail.length > 8) b.trail.shift()

          // Draw trail
          b.trail.forEach((t, index) => {
            const alpha = index / b.trail.length * 0.25
            ctx.beginPath()
            ctx.arc(t.x, t.y, b.size * 0.2, 0, Math.PI * 2)
            ctx.fillStyle = b.color
            ctx.globalAlpha = alpha
            ctx.fill()
          })
          ctx.globalAlpha = 1.0

          // Flight path algorithm
          const dx = b.targetX - b.x
          const dy = b.targetY - b.y
          const dist = Math.hypot(dx, dy)

          if (dist < 30) {
            b.targetX = Math.random() * width
            b.targetY = Math.random() * height
          } else {
            b.x += (dx / dist) * b.speed
            b.y += (dy / dist) * b.speed
          }

          // Soft mouse flutter attraction
          const mouseDist = Math.hypot(mouse.x - b.x, mouse.y - b.y)
          if (mouseDist < 160) {
            b.targetX = mouse.x + (Math.random() - 0.5) * 80
            b.targetY = mouse.y + (Math.random() - 0.5) * 80
          }

          b.wingAngle += b.wingSpeed

          ctx.save()
          ctx.translate(b.x, b.y)
          const angle = Math.atan2(dy, dx)
          ctx.rotate(angle + Math.PI / 2)

          const wingWidth = b.size * Math.abs(Math.sin(b.wingAngle))

          // Left wing
          ctx.beginPath()
          ctx.ellipse(-wingWidth / 2, -b.size / 4, wingWidth / 2, b.size / 2, -Math.PI / 6, 0, Math.PI * 2)
          ctx.fillStyle = b.color
          ctx.shadowBlur = 12
          ctx.shadowColor = b.color
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(-wingWidth / 2.5, b.size / 4, wingWidth / 3, b.size / 3, -Math.PI / 4, 0, Math.PI * 2)
          ctx.fill()

          // Right wing
          ctx.beginPath()
          ctx.ellipse(wingWidth / 2, -b.size / 4, wingWidth / 2, b.size / 2, Math.PI / 6, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(wingWidth / 2.5, b.size / 4, wingWidth / 3, b.size / 3, Math.PI / 4, 0, Math.PI * 2)
          ctx.fill()

          // Antennae
          ctx.beginPath()
          ctx.moveTo(-1, -b.size / 2)
          ctx.quadraticCurveTo(-3, -b.size * 0.8, -4, -b.size * 0.9)
          ctx.moveTo(1, -b.size / 2)
          ctx.quadraticCurveTo(3, -b.size * 0.8, 4, -b.size * 0.9)
          ctx.strokeStyle = "rgba(255,255,255,0.7)"
          ctx.lineWidth = 0.8
          ctx.stroke()

          // Body
          ctx.beginPath()
          ctx.ellipse(0, 0, 1.2, b.size / 2, 0, 0, Math.PI * 2)
          ctx.fillStyle = "#ffffff"
          ctx.fill()

          ctx.restore()
          ctx.shadowBlur = 0 // Reset shadow
        })
      } else if (theme === "mountains") {
        // Sky Gradient: Deep starry dark navy to twilight indigo
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, "hsl(225, 45%, 6%)")
        grad.addColorStop(0.65, "hsl(245, 35%, 10%)")
        grad.addColorStop(1, "hsl(270, 25%, 14%)")
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Draw Twinkling Stars
        stars.forEach((s) => {
          s.phase += s.twinkleSpeed
          const currentOpacity = 0.15 + (Math.sin(s.phase) + 1) / 2 * 0.85
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
          ctx.fill()
        })

        // Shooting Stars (Occasional)
        if (Math.random() < 0.003) {
          const startX = Math.random() * width
          const startY = Math.random() * (height * 0.4)
          const length = 50 + Math.random() * 80
          const speed = 12 + Math.random() * 8
          
          let curX = startX
          let curY = startY

          const drawShooter = () => {
            if (curX > width || curY > height) return
            ctx.beginPath()
            ctx.moveTo(curX, curY)
            ctx.lineTo(curX - length, curY - length * 0.5)
            const shootGrad = ctx.createLinearGradient(curX, curY, curX - length, curY - length * 0.5)
            shootGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)")
            shootGrad.addColorStop(1, "rgba(255, 255, 255, 0)")
            ctx.strokeStyle = shootGrad
            ctx.lineWidth = 1.2
            ctx.stroke()

            curX += speed
            curY += speed * 0.5
          }
          // Simple local draw for immediate stroke
          drawShooter()
        }

        // Draw Mist Clouds in Valley
        clouds.forEach((c) => {
          c.x += c.speed
          if (c.x > width + c.width) c.x = -c.width

          ctx.save()
          ctx.beginPath()
          ctx.ellipse(c.x, c.y, c.width, c.height, 0, 0, Math.PI * 2)
          const cloudGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.width)
          cloudGrad.addColorStop(0, `rgba(220, 230, 255, ${c.opacity})`)
          cloudGrad.addColorStop(0.8, `rgba(220, 230, 255, ${c.opacity * 0.3})`)
          cloudGrad.addColorStop(1, "rgba(220, 230, 255, 0)")
          ctx.fillStyle = cloudGrad
          ctx.fill()
          ctx.restore()
        })

        // Draw Mountain Silhouette Layers (Responsive with Parallax)
        mountainLayers.forEach((layer) => {
          const step = width / (layer.peaks.length - 1)
          const parallaxX = (mouse.x - width / 2) * layer.parallax

          ctx.beginPath()
          ctx.moveTo(0, height)
          
          // Connect peak points smoothly
          const startY = height - layer.peaks[0] * height
          ctx.lineTo(0 + parallaxX, startY)

          for (let i = 0; i < layer.peaks.length - 1; i++) {
            const x1 = i * step + parallaxX
            const y1 = height - layer.peaks[i] * height
            const x2 = (i + 1) * step + parallaxX
            const y2 = height - layer.peaks[i + 1] * height
            
            const cx = (x1 + x2) / 2
            const cy = (y1 + y2) / 2
            ctx.quadraticCurveTo(x1, y1, cx, cy)
          }

          const endY = height - layer.peaks[layer.peaks.length - 1] * height
          ctx.lineTo(width + parallaxX, endY)
          ctx.lineTo(width, height)
          ctx.closePath()
          ctx.fillStyle = layer.color
          ctx.fill()
        })
      } else if (theme === "trees") {
        // Background Gradient: Forest dusk glow (emerald to deep pine teal)
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, "hsl(160, 45%, 5%)")
        grad.addColorStop(0.5, "hsl(150, 30%, 9%)")
        grad.addColorStop(1, "hsl(140, 20%, 12%)")
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Forest Fireflies
        fireflies.forEach((f) => {
          f.angle += 0.015
          f.x += f.speedX + Math.sin(f.angle) * 0.15
          f.y += f.speedY + Math.cos(f.angle) * 0.1
          f.opacity += f.opacitySpeed

          if (f.opacity > 0.85 || f.opacity < 0.05) {
            f.opacitySpeed = -f.opacitySpeed
          }

          if (f.x < -10 || f.x > width + 10 || f.y < -10 || f.y > height + 10) {
            f.x = Math.random() * width
            f.y = Math.random() * height
            f.opacity = Math.random()
          }

          ctx.beginPath()
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(110, 100%, 75%, ${Math.max(0, f.opacity)})`
          ctx.shadowBlur = 6
          ctx.shadowColor = "hsl(110, 100%, 75%)"
          ctx.fill()
          ctx.shadowBlur = 0
        })

        // Draw and animate swaying branch silhouettes
        drawSwayingBranches(time)

        // Draw and update falling leaves
        leaves.forEach((l) => {
          ctx.save()
          ctx.translate(l.x, l.y)
          ctx.rotate(l.angle)
          ctx.scale(1, Math.sin(l.flipAngle))

          drawLeafShape(l.size, l.color)

          ctx.restore()

          l.y += l.speedY
          l.x += l.speedX + Math.sin(l.flipAngle) * 0.4
          l.flipAngle += l.flipSpeed
          l.angle += l.spin

          // Mouse push leaves
          const dx = l.x - mouse.x
          const dy = l.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 120) {
            const force = (120 - dist) / 120
            l.x += (dx / dist) * force * 5
            l.y += (dy / dist) * force * 4
          }

          // Off-screen recycle
          if (l.y > height + 20) {
            l.y = -20
            l.x = Math.random() * width
            l.speedY = 0.8 + Math.random() * 1.5
            l.speedX = -0.8 + Math.random() * 1.6
            l.angle = Math.random() * Math.PI * 2
          }
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [theme])

  if (theme === "cinematic") {
    // If the theme is cinematic, we render the BackgroundVideo (which renders HERO_VIDEO_URL)
    return <BackgroundVideo src={HERO_VIDEO_URL} muted={isMuted} />
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none block"
    />
  )
}
