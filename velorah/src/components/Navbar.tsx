import { Link } from "react-router-dom"
import { Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"

const NAV_LINKS = ["Home", "Studio", "About", "Journal", "Reach Us"]

interface NavbarProps {
  active?: string
  ctaLabel?: string
  ctaTo?: string
  onCtaClick?: () => void
  isMuted?: boolean
  onMuteToggle?: () => void
  isZoomed?: boolean
  onZoomToggle?: () => void
  minimal?: boolean
}

export function Navbar({
  active = "Home",
  ctaLabel = "Begin Journey",
  ctaTo,
  onCtaClick,
  isMuted = true,
  onMuteToggle,
  isZoomed = true,
  onZoomToggle,
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
            <a
              key={link}
              href={link === "Home" ? "/" : "#"}
              className={
                link === active
                  ? "text-sm text-foreground transition-colors"
                  : "text-sm text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {link}
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {onZoomToggle && (
          <button
            onClick={onZoomToggle}
            className="liquid-glass rounded-full p-2.5 text-foreground transition-transform hover:scale-[1.03]"
            title={isZoomed ? "Fit to Screen" : "Fill Screen"}
          >
            {isZoomed ? (
              <Minimize2 className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        )}
        
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
