import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FAQMarkdown from "@/components/FAQMarkdown";
import { useHomeServices, type HomeService } from "@/hooks/use-home-services";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

const ServiceCards = () => {
  const { data: services, loading } = useHomeServices();
  const [open, setOpen] = useState<HomeService | null>(null);

  if (loading) {
    return (
      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border-l border-border/40 flex flex-col">
            <div className="p-8 pb-6 space-y-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="mt-auto border-t border-border px-8 py-4">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((card) => (
          <div key={card.id} className="bg-card flex flex-col border-l border-border/40">
            <div className="p-8 pb-6">
              <Icon icon={card.icon} className="text-primary text-3xl" aria-hidden="true" />
              <h3 className="mt-6 font-body font-semibold text-xl md:text-2xl leading-tight text-foreground normal-case tracking-normal">
                {card.title}
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{card.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(card)}
              aria-label={`How it works: ${card.title}`}
              className="group mt-auto flex w-full items-center justify-between border-t border-border px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>How it Works</span>
              <Icon
                icon="lucide:arrow-up-right"
                className="text-lg text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-foreground"
                aria-hidden="true"
              />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-[760px] w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto rounded-none sm:rounded-none border-border p-8 md:p-10">
          {open && (
            <>
              <DialogHeader className="text-left sm:text-left space-y-4">
                <Icon icon={open.icon} className="text-primary text-3xl" aria-hidden="true" />
                <DialogTitle className="font-body font-semibold text-2xl md:text-3xl leading-tight text-foreground tracking-normal">
                  {open.modal_title || open.title}
                </DialogTitle>
                <DialogDescription asChild className="font-body text-base md:text-lg leading-relaxed text-muted-foreground">
                  <div className="[&_h3]:!text-[1.2em]">
                    <FAQMarkdown content={open.modal_description || open.summary} />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Button asChild size="lg">
                  <a
                    href={open.cta_link || "/contact"}
                    {...(isExternal(open.cta_link) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    I want this
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCards;
