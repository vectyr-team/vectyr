import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoStacked from "@/assets/bodR-stacked-centered-white.svg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "FAQs", to: "/faqs" },
  { label: "Demo", to: "/demo" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-card overflow-hidden">
      {/* Subtle top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="mx-auto max-w-[1300px] px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-16 items-start">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-6">
            <img
              src={logoStacked}
              alt="Brand Orchestra — a Vectyr company"
              className="h-16 w-auto self-start opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50 max-w-[280px]">
              Brand infrastructure for founders who are done winging it.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Navigate
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Connect
            </span>
            <a
              href="https://stevesbrain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Pick Steve's Brain
            </a>
            <a
              href="https://stevescalendar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Book Directly
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 h-px w-full bg-border/40" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">
            &copy; {year} Vectyr, Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40">
              Powered by
            </span>
            <Icon icon="mdi:lightning-bolt" className="text-primary text-sm" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary/60">
              Vectyr
            </span>
          </div>
        </div>
      </div>

      {/* Large background watermark */}
      <div className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[30%] opacity-[0.02] pointer-events-none select-none">
        <span className="font-headline text-[20rem] md:text-[28rem] leading-none text-foreground">
          V
        </span>
      </div>
    </footer>
  );
};

export default Footer;
