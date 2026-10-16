import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function ChatCalendar({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full min-w-0">
      <div className="relative h-[850px] w-full overflow-hidden rounded-lg bg-background sm:h-[760px]">
        {!loaded && <div role="status" aria-label="Loading booking calendar" className="absolute inset-0 space-y-5 p-6"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-64 w-full" /><Skeleton className="h-12 w-full" /></div>}
        <iframe
          src={src}
          title="Book a consultation"
          className="relative h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="payment"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <Button asChild variant="link" className="mt-2 h-auto px-0 text-sm">
        <a href={src} target="_blank" rel="noopener noreferrer">Open calendar<ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
      </Button>
    </div>
  );
}