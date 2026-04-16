import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePageMeta, useBusinessInfo } from "@/hooks/use-seo-data";
import { ServiceJsonLd, BreadcrumbListJsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import bodXWatermark from "@/assets/bodX-watermark.svg";
import wpAdminBg from "@/assets/wordpress-admin.jpg";

const problems = [
  "Plugins go unpatched.",
  "Backups get forgotten.",
  "Vulnerabilities appear daily.",
  "Content updates turn into another thing only you can handle.",
];

const howSteps = [
  "<strong>Daily backups</strong> are set up so your site can be restored quickly if anything goes wrong or if there's a big mistake.",
  "<strong>24/7/365 vulnerability monitoring</strong> and firewall protection. Threats are blocked before they reach your site.",
  "<strong>Priority access</strong> to the Vectyr team when you need something handled. We take care of anything you need ASAP.",
  "<strong>Key plugin subscriptions covered</strong>, including Advanced Custom Fields PRO, RankMath SEO, and Gravity Forms.",
  "<strong>Major updates tested</strong> on a staging version of your site first. Nothing goes live until we confirm it works.",
  "<strong>Full site management</strong> and monitoring by the Vectyr team, keeping your site secure, backed up, and running.",
  "<strong>Regular reporting</strong> on site health and status delivered to your inbox, weekly, monthly, or quarterly cadence.",
  "<strong>You get 2 hours worth</strong> of team access for website content and theme updates per month.",
];

const SiteOps = () => {
  const pageMeta = usePageMeta("site-ops");
  const { data: business } = useBusinessInfo();
  return (
    <div className="flex flex-col min-h-screen bg-card">
      <Header />
      <main className="flex-1">
        <SEOHead {...pageMeta} />
        <ServiceJsonLd
          name={pageMeta.title}
          description={pageMeta.description}
          serviceType="WordPress Management"
          path="/site-ops"
          providerName={business.name}
        />
        <BreadcrumbListJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "SiteOps", path: "/site-ops" },
          ]}
        />

        {/* Hero */}
        <section className="relative px-6 pt-32 pb-16 md:pt-52 md:pb-28 overflow-hidden">
          <img
            src={wpAdminBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ opacity: 0.05 }}
          />
          <div className="relative z-10 mx-auto max-w-[1300px]">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
              Website Management
            </span>

            <h1 className="font-headline font-normal text-5xl leading-[0.95] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mb-8">
              SITE<span className="text-primary">OPS</span>
            </h1>

            <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground max-w-2xl">
              Your site is either managed or it's a liability. WordPress sites degrade quietly. Plugins go stale,
              vulnerabilities surface, backups lapse, and performance erodes until something visible breaks. SiteOps
              replaces that cycle with a team that actually manages the thing.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <a href="https://buy.stripe.com/9B67sK81Kdc3fdv3bC0ZW0r" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Get SiteOps for Your Site</Button>
              </a>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="relative px-6 py-16 md:py-32 bg-background overflow-hidden">
          <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                  The Problem
                </span>
                <span className="w-12 h-px bg-muted-foreground" />
              </div>

              <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl">
                Nobody Thinks of the Website <span className="text-primary">Until it's on fire.</span>
              </h2>
            </div>

            <div className="space-y-6 md:pt-8">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                The plugin update you skipped three months ago just introduced a vulnerability. The backup system you
                assumed was running hasn't actually completed a backup since February. The site is loading two seconds
                slower than it was last quarter and nobody noticed because nobody is watching.
              </p>
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Most businesses treat their website the way most people treat their oil change. They know it matters.
                They know it's overdue. They'll get to it eventually. <strong>And then the engine seizes.</strong>
              </p>
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                SiteOps exists because your website should not require your attention to stay healthy. You've got more
                important things to do.
              </p>
            </div>
          </div>
        </section>

        {/* How SiteOps Works */}
        <section className="px-6 py-16 md:py-32 bg-card">
          <div className="mx-auto max-w-[1300px]">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                How It Works
              </span>
              <span className="w-12 h-px bg-muted-foreground" />
            </div>

            <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl mb-16">
              DONE FOR YOU. 
              <br />
              <span className="text-primary">DONE RIGHT.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howSteps.map((step, i) => (
                <div key={i} className="space-y-3">
                  <span className="font-mono text-2xl text-foreground/20 block">{String(i + 1).padStart(2, "0")}</span>
                  <p
                    className="font-body text-sm md:text-base font-light leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </div>
              ))}
            </div>

            <p className="font-body text-base md:text-lg font-semibold text-foreground mt-10 max-w-2xl">
              Put your website in expert hands.
            </p>
          </div>
        </section>

        {/* What Makes SiteOps Different */}
        <section className="relative px-6 py-16 md:py-32 overflow-hidden bg-black01">
          <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
                  The Difference
                </span>
                <span className="w-12 h-px bg-muted-foreground" />
              </div>

              <h2 className="font-headline font-normal text-4xl leading-[0.95] tracking-normal text-foreground sm:text-5xl md:text-7xl">
                NOT A GENERIC
                <br />
                <span className="text-primary">HOSTING ADD-ON.</span>
              </h2>
            </div>

            <div className="space-y-6 md:pt-8">
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Most maintenance plans are generic hosting add-ons that treat your site like a commodity. They run a few
                scripts, send a generic report, and call it managed.
              </p>

              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                SiteOps is run by the same team that installs brand operating systems for a living. We bring the same
                standard of care to your website that we bring to strategy. Staging-tested updates, covered premium
                plugins, real priority access, and a shared task board that actually keeps everyone aligned.
              </p>

              <div className="border-l-4 border-primary bg-foreground/5 p-6 md:p-8">
                <p className="font-mono text-base md:text-lg leading-snug text-foreground">
                  It is not an afterthought. It is operational infrastructure that matches the quality of the brand it
                  carries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Price */}
        <section className="px-6 py-16 bg-white md:py-[100px]">
          <div className="mx-auto max-w-[1300px] flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "#6B6B6B" }}>
                Pricing
              </span>
              <span className="w-12 h-px" style={{ backgroundColor: "#6B6B6B" }} />
            </div>

            <h2
              className="font-headline font-normal text-4xl leading-[0.95] tracking-normal sm:text-5xl md:text-7xl mb-4"
              style={{ color: "#090909" }}
            >
              <span className="text-primary">$495</span> / MONTH
            </h2>

            <div className="space-y-2 max-w-lg mx-auto">
              <p className="font-body text-base md:text-lg font-light" style={{ color: "#6B6B6B" }}>
                Your site should run without you having to watch it. Billed monthly. No long-term contracts. Cancel
                anytime.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <a href="https://buy.stripe.com/9B67sK81Kdc3fdv3bC0ZW0r" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Get SiteOps for Your Site</Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SiteOps;
