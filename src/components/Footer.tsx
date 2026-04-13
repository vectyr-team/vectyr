import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoStacked from "@/assets/bodR-stacked-white.svg";
import bodXIcon from "@/assets/bodX-white.svg";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-card overflow-hidden">
      {/* Accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mx-auto max-w-[1300px] px-6 pt-16 pb-10 md:pt-24 md:pb-12">
        {/* Main grid */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16 text-center md:text-left">
          {/* Brand column */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <img
              src={logoStacked}
              alt="Brand Orchestra — a Vectyr company"
              className="h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
            <p className="font-body text-sm leading-relaxed text-muted-foreground/60 max-w-[260px]">
              Brand infrastructure for founders who are done winging it. We extract, structure, and install your brand so it runs without you in the room.
            </p>
            {/* Social icons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
              {[
                { icon: "mdi:linkedin", href: "#" },
                { icon: "mdi:instagram", href: "#" },
                { icon: "ri:twitter-x-fill", href: "#" },
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
          <nav className="flex flex-col gap-3 items-center md:items-start">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">
              Navigate
            </span>
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "FAQs", to: "/faqs" },
              { label: "Demo", to: "/demo" },
              { label: "Contact", to: "/contact" },
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
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">
              Services
            </span>
            {[
              "Brand Codex",
              "BrandOS Platform",
              "BrandPulse",
            ].map((item) => (
              <span
                key={item}
                className="font-body text-sm text-muted-foreground/70"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">
              Connect
            </span>
            {[
              { label: "Pick Steve's Brain", href: "https://stevesbrain.com" },
              { label: "See the Demo", href: "/demo", internal: true },
              { label: "Book Directly", href: "https://stevescalendar.com" },
            ].map((item) =>
              item.internal ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200 w-fit"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30">
            &copy; {year} Vectyr, Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/40">
              #BRANDORDIE
            </span>
          </div>
        </div>
      </div>

      {/* Background watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
        <img
          src={bodXIcon}
          alt=""
          className="w-[600px] md:w-[900px] lg:w-[1100px] max-w-none"
        />
      </div>
    </footer>
  );
};

export default Footer;
