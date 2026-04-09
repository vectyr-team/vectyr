import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen bg-card">
      <Header />

      <section className="px-6 pt-32 pb-12 md:pt-44 md:pb-24">
        <div className="mx-auto max-w-[1300px]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6 block">
            Contact
          </span>

          <h1 className="font-headline font-light text-5xl leading-[1.05] tracking-normal text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            LET'S <span className="text-primary">TALK.</span>
          </h1>

          <p className="mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-muted-foreground">
            Whether you're ready to start or just have questions, we're here. No gatekeeping, no forms that go nowhere.
          </p>

          <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
            <div className="bg-card p-8">
              <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">
                Free Diagnostic
              </h3>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                30 minutes. No pitch. Steve looks at your brand situation and gives you an honest read.
              </p>
              <div className="mt-6">
                <a href="https://stevesbrain.com">
                  <Button size="sm">Book a Free Call</Button>
                </a>
              </div>
            </div>
            <div className="bg-card p-8">
              <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">
                Email Us
              </h3>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                Have a specific question? Drop us a line and we'll get back to you within 24 hours.
              </p>
              <div className="mt-6">
                <a href="mailto:hello@vectyr.com">
                  <Button size="sm">Send Email</Button>
                </a>
              </div>
            </div>
            <div className="bg-card p-8">
              <h3 className="font-body font-semibold text-2xl leading-tight text-foreground">
                Book Directly
              </h3>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                Ready to move? Skip the small talk and get straight on the calendar.
              </p>
              <div className="mt-6">
                <a href="https://stevescalendar.com">
                  <Button size="sm">Book Now</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
