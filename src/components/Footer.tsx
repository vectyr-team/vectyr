import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoStacked from "@/assets/bodR-stacked-white.svg";
import bodXIcon from "@/assets/bodX-white.svg";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black01">
      {/* Accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mx-auto max-w-[1300px] px-6 pt-16 pb-10 md:pt-24 md:pb-12">
        {/* Main grid */}
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16 text-center md:text-left">
          {/* Brand column */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <img
              src={logoStacked}
              alt="Brand Orchestra — a Vectyr company"
              className="h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
            <p className="font-body text-sm leading-relaxed text-muted-foreground/60 max-w-[260px]">
              Brand infrastructure for founders who are done winging it. We extract, structure, and install your brand
              so it runs without you in the room.
            </p>
            {/* Social icons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
              {[
                { icon: "mdi:youtube", href: "https://www.youtube.com/@vectyrbrands" },
                { icon: "mdi:behance", href: "https://www.behance.net/vectyr" },
                { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/stevereedbrands" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-8 w-8 rounded-sm border border-border/40 text-muted-foreground/50 hover:text-primary hover:border-primary/50 transition-all duration-200"
                >
                  <Icon icon={s.icon} className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <nav className="flex flex-col gap-3 items-center md:items-start" aria-label="Site navigation">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">EXPLORE</span>
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Team", to: "/team" },
              { label: "FAQs", to: "/faqs" },
              { label: "Glossary", to: "/glossary" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Services */}
          <nav className="flex flex-col gap-3 items-center md:items-start" aria-label="Services">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">THE WORK</span>
            {[
              { label: "Vectyr BrandOS", to: "https://vectyr.com/brand-os" },
              { label: "BrandPulse", to: "https://vectyr.com/pulse" },
              { label: "SiteOps", to: "https://vectyr.com/site-ops" },
              { label: "Archetype Quiz", to: "https://quiz.vectyr.com" },
            ].map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">Connect</span>
            <Link
              to="/demo"
              className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
            >
              See the Demo
            </Link>
            <Link
              to="/contact"
              className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
            >
              Contact
            </Link>
            <a
              href="tel:+15128791233"
              className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
            >
              (512) 879-1233
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30">
            &copy; {year} Vectyr, Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/40">#BRANDORDIE</span>
          </div>
        </div>
      </div>

      {/* Background watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none select-none">
        <img src={bodXIcon} alt="" className="w-[600px] md:w-[900px] lg:w-[1100px] max-w-none" />
      </div>
    </footer>
  );
};

export default Footer;
