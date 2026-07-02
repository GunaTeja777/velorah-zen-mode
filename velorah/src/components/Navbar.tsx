import { Link } from "react-router-dom"

const NAV_LINKS = ["Home", "Studio", "About", "Journal", "Reach Us"]

interface NavbarProps {
  active?: string
  ctaLabel?: string
  ctaTo?: string
  onCtaClick?: () => void
}

export function Navbar({
  active = "Home",
  ctaLabel = "Begin Journey",
  ctaTo,
  onCtaClick,
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

      {cta}
    </nav>
  )
}
