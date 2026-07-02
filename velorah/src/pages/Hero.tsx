import { useNavigate } from "react-router-dom"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { Navbar } from "@/components/Navbar"

export function Hero() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo />

      <Navbar active="Home" ctaTo="/zen" />

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 py-[90px]">
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where <em className="not-italic text-muted-foreground">dreams</em>{" "}
          rise <em className="not-italic text-muted-foreground">through the silence.</em>
        </h1>

        <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
          We're designing tools for deep thinkers, bold creators, and quiet
          rebels. Amid the chaos, we build digital spaces for sharp focus and
          inspired work.
        </p>

        <button
          onClick={() => navigate("/zen")}
          className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 cursor-pointer transition-transform hover:scale-[1.03]"
        >
          Begin Journey
        </button>
      </section>
    </div>
  )
}
