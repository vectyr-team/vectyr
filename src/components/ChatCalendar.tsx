import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function ChatCalendar({ src, autoOpen = false }: { src: string; autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    if (autoOpen && !opened.current) {
      opened.current = true;
      setOpen(true);
    }
  }, [autoOpen]);

  return (
    <div className="w-full min-w-0 py-2">
      <Button type="button" onClick={() => setOpen(true)} className="h-auto gap-2 px-5 py-3 text-base">
        <CalendarDays className="h-5 w-5" />
        Select a Date &amp; Time
      </Button>
      <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) setLoaded(false); }}>
        <DialogContent className="hero-chat theme-light flex h-[85dvh] max-h-[900px] w-[calc(100vw-2rem)] max-w-3xl flex-col gap-0 overflow-hidden bg-background p-0 [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-background [&>button]:p-1 [&>button]:opacity-100">
          <DialogTitle className="sr-only">Book a consultation</DialogTitle>
          <DialogDescription className="sr-only">Choose a date and time for your call.</DialogDescription>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {!loaded && <div role="status" aria-label="Loading booking calendar" className="absolute inset-0 space-y-5 p-6"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-64 w-full" /><Skeleton className="h-12 w-full" /></div>}
            <iframe
              src={src}
              title="Book a consultation"
              className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              allow="payment"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setLoaded(true)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
