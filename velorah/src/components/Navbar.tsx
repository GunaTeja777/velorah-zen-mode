import { Link } from "react-router-dom"
import { Volume2, VolumeX } from "lucide-react"

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Zen Focus", to: "/zen" },
  { label: "Task Manager", to: "/tasks" },
  { label: "Planner", to: "/planner" },
  { label: "Productivity", to: "/stats" },
]

interface NavbarProps {
  active?: string
  ctaLabel?: string
  ctaTo?: string
  onCtaClick?: () => void
  isMuted?: boolean
  onMuteToggle?: () => void
  minimal?: boolean
}

export function Navbar({
  active = "Home",
  ctaLabel = "Begin Journey",
  ctaTo,
  onCtaClick,
  isMuted = true,
  onMuteToggle,
  minimal = false,
}: NavbarProps) {
  const cta = ctaTo ? (
    <Link
      to={ctaTo}
      className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]"
    >
      {ctaLabel}
    </Link>
  ) : (
    <button
      onClick={onCtaClick}
      className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]"
    >
      {ctaLabel}
    </button>
  )

  return (
    <nav className="relative z-10 flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <Link
        to="/"
        className="text-3xl tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Velorah<sup className="text-xs">®</sup>
      </Link>

      {!minimal && (
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={
                link.label === active
                  ? "text-sm text-white transition-colors border-b border-white pb-1 font-medium"
                  : "text-sm text-white/60 transition-colors hover:text-white pb-1"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {onMuteToggle && (
          <button
            onClick={onMuteToggle}
            className="liquid-glass rounded-full p-2.5 text-foreground transition-transform hover:scale-[1.03]"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        )}

        {cta}
      </div>
    </nav>
  )
}
