import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import vectyrLogo from "@/assets/vectyr-logo.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify/react";

const socialLinks = [
  { href: "https://www.youtube.com/@vectyrbrands", icon: "mdi:youtube", label: "YouTube" },
  { href: "https://www.behance.net/vectyr", icon: "mdi:behance", label: "Behance" },
  { href: "https://www.linkedin.com/in/stevereedbrands", icon: "mdi:linkedin", label: "LinkedIn" },
];

const navLinks = [
  { to: "/demo", label: "Demo" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Delay order: innermost (closest to logo/center) animates first
// Social icons (left side): index 2 (LinkedIn) first, then 1, then 0
// Nav links (right side): index 0 (Demo) first, then 1, then 2
const socialDelayOrder = [2, 1, 0]; // reversed: innermost first
const navDelayOrder = [0, 1, 2]; // normal: innermost first

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Trigger entrance animation on home page (md+ only)
  useEffect(() => {
    if (isHome && !isMobile) {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(true); // No animation on other pages, just show
    }
  }, [isHome, isMobile]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const shouldAnimate = isHome && !isMobile;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-6">
        {/* Left: social icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {socialLinks.map((s, i) => {
            const delayIndex = socialDelayOrder.indexOf(i);
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={s.label}
                style={shouldAnimate ? {
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
                  transitionDelay: `${0.5 + delayIndex * 0.1}s`,
                } : undefined}
              >
                <Icon icon={s.icon} width={20} height={20} />
              </a>
            );
          })}
        </div>

        {/* Center: logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2"
          style={shouldAnimate ? {
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.85)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            transitionDelay: '0.1s',
          } : undefined}
        >
          <img src={vectyrLogo} alt="Vectyr" className="h-8 md:h-10" />
        </Link>

        {/* Right: nav links on desktop, hamburger on mobile */}
        {isMobile ? (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-[60] w-8 h-8 flex flex-col items-center justify-center gap-[5px] focus:outline-none"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        ) : (
          <nav className="flex items-center gap-5 md:gap-6">
            {navLinks.map((link, i) => {
              const delayIndex = navDelayOrder.indexOf(i);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
                  style={shouldAnimate ? {
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
                    transitionDelay: `${0.5 + delayIndex * 0.1}s`,
                  } : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Mobile fullscreen menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-background flex flex-col items-center justify-center transition-all duration-500 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col items-center gap-0">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`font-headline text-5xl uppercase tracking-normal text-foreground hover:text-accent transition-all duration-500 py-4 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${150 + i * 100}ms` : "0ms",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Decorative accent line */}
          <div
            className={`mt-12 h-[2px] bg-accent transition-all duration-700 ${
              menuOpen ? "w-24 opacity-100" : "w-0 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}
          />
        </div>
      )}
    </>
  );
};

export default Header;
