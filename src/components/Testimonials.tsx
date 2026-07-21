import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "@iconify/react";

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  headline: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  video_url: string | null;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        icon="mdi:star"
        className={`w-4 h-4 ${i < rating ? "text-primary" : "text-black/15"}`}
      />
    ))}
  </div>
);

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const toEmbedUrl = (url: string): { kind: "iframe" | "video"; src: string } => {
  const trimmed = url.trim();
  const yt = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  const st = trimmed.match(/streamable\.com\/(?:e\/)?([A-Za-z0-9]+)/);
  if (st) return { kind: "iframe", src: `https://streamable.com/e/${st[1]}` };
  const lm = trimmed.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/);
  if (lm) return { kind: "iframe", src: `https://www.loom.com/embed/${lm[1]}` };
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { kind: "video", src: trimmed };
  }
  return { kind: "iframe", src: trimmed };
};

const VideoEmbed = ({ url }: { url: string }) => {
  const embed = useMemo(() => toEmbedUrl(url), [url]);
  const [ratio, setRatio] = useState<number | null>(null);
  const aspectStyle = ratio ? { aspectRatio: `${ratio}` } : undefined;
  const aspectClass = ratio ? "" : "aspect-video";
  return (
    <div
      className={`relative w-full ${aspectClass} mb-5 overflow-hidden rounded-sm bg-black`}
      style={aspectStyle}
    >
      {embed.kind === "video" ? (
        <video
          src={embed.src}
          controls
          playsInline
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              setRatio(v.videoWidth / v.videoHeight);
            }
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <iframe
          src={embed.src}
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
};

const Avatar = ({ name, url }: { name: string; url: string | null }) => {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-10 w-10 rounded-full object-cover shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs shrink-0">
      {getInitials(name) || "•"}
    </div>
  );
};

const Testimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, name, title, headline, quote, rating, avatar_url, video_url")
        .order("sort_order", { ascending: true });
      if (active && data) setItems(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
      {items.map((t) => (
        <figure
          key={t.id}
          className="mb-5 break-inside-avoid bg-white text-black01 p-6 md:p-7 rounded-lg shadow-sm"
        >
          <Stars rating={t.rating} />
          {t.headline && (
            <h3 className="font-body font-semibold text-lg leading-tight text-black01 mt-4">
              {t.headline}
            </h3>
          )}
          {t.video_url && (
            <div className="mt-4">
              <VideoEmbed url={t.video_url} />
            </div>
          )}
          <blockquote className="font-body text-[15px] leading-relaxed text-black01/80 mt-3">
            {t.quote}
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <Avatar name={t.name} url={t.avatar_url} />
            <div className="min-w-0">
              <div className="font-body text-sm font-medium text-black01 truncate">{t.name}</div>
              {t.title && (
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-black01/60 mt-0.5 truncate">
                  {t.title}
                </div>
              )}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default Testimonials;