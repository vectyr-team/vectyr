import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import vectyrLogo from "@/assets/vectyr-logo.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icon } from "@iconify/react";

const socialLinks = [
  { href: "https://www.youtube.com/@vectyrbrands", icon: "mdi:youtube", label: "YouTube" },
  { href: "https://www.behance.net/vectyr", icon: "mdi:behance", label: "Behance" },
  { href: "https://www.linkedin.com/in/stevereedbrands", icon: "mdi:linkedin", label: "LinkedIn" },
];

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

const navLinks = [
  { to: "/demo", label: "Demo" },
  { to: "https://brandhelix.ai", label: "Login" },
];

// Delay order: innermost (closest to logo/center) animates first
const socialDelayOrder = [2, 1, 0];
// Company (0) first, then Demo (1), then Login (2)
const navDelayOrder = [0, 1, 2];

// All mobile links flattened
const mobileLinks = [
  { to: "/demo", label: "Demo" },
  ...companyLinks,
  { to: "https://brandhelix.ai", label: "Login" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const companyRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCompanyOpen(false);
  }, [location.pathname]);

  // Trigger entrance animation on home page (md+ only)
  useEffect(() => {
    if (isHome && !isMobile) {
      const timer = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(true);
    }
  }, [isHome, isMobile]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Click outside to close company dropdown
  useEffect(() => {
    if (!companyOpen) return;
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [companyOpen]);

  const shouldAnimate = isHome && !isMobile;

  const getAnimStyle = (delayIndex: number) =>
    shouldAnimate
      ? {
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          transitionDelay: `${0.5 + delayIndex * 0.1}s`,
        }
      : undefined;

  return (
    <>
      <header className="theme-dark fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-6">
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
                style={getAnimStyle(delayIndex)}
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
          style={
            shouldAnimate
              ? {
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.85)",
                  transition: "opacity 1s ease-out, transform 1s ease-out",
                  transitionDelay: "0.1s",
                }
              : undefined
          }
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
            <span className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
            <span className={`block h-[2px] w-6 bg-foreground rounded transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        ) : (
          <nav className="flex items-center gap-5 md:gap-6">
            {/* Demo */}
            <Link
              to="/demo"
              className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              style={getAnimStyle(navDelayOrder[0])}
            >
              Demo
            </Link>

            {/* Company dropdown */}
            <div ref={companyRef} className="relative" style={getAnimStyle(navDelayOrder[1])}>
              <button
                onClick={() => setCompanyOpen((v) => !v)}
                className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Company
                <Icon
                  icon="mdi:chevron-down"
                  width={14}
                  height={14}
                  className={`transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`}
                />
              </button>

              {companyOpen && (
                <div className="absolute top-full right-0 mt-3 min-w-[160px] rounded-md border border-border bg-background/95 backdrop-blur-md py-2 shadow-lg">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setCompanyOpen(false)}
                      className="block px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Login */}
            <a
              href="https://brandhelix.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              style={getAnimStyle(navDelayOrder[2])}
            >
              Login
            </a>
          </nav>
        )}
      </header>

      {/* Mobile fullscreen menu */}
      {isMobile && (
        <div
          className={`theme-dark fixed inset-0 z-40 bg-background flex flex-col items-center justify-start pt-32 transition-all duration-500 ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col items-center gap-0">
            {mobileLinks.map((link, i) => {
              const isExternal = link.to.startsWith("http");
              const className = `font-headline text-4xl uppercase tracking-normal text-foreground hover:text-accent transition-all duration-500 py-3 ${
                menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`;
              const style = { transitionDelay: menuOpen ? `${150 + i * 100}ms` : "0ms" };
              return isExternal ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={className}
                  style={style}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={className}
                  style={style}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

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
