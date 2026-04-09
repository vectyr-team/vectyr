import { useEffect, useState } from "react";

const codeLines = [
  { label: "brand.name", value: '"Vectyr"', color: "text-primary" },
  { label: "brand.position", value: '"Built for humans and AI"', color: "text-primary" },
  { label: "voice.tone", value: '["direct", "confident", "founder-level"]', color: "text-primary" },
  { label: "voice.avoid", value: '["corporate jargon", "filler"]', color: "text-muted-foreground" },
  { label: "audience.primary", value: '"Founders who built something real"', color: "text-primary" },
  { label: "palette.accent", value: '"#FF5000"', color: "text-primary" },
  { label: "palette.bg", value: '"#090909"', color: "text-muted-foreground" },
  { label: "messaging.tagline", value: '"Brand or Die®"', color: "text-primary" },
  { label: "differentiator", value: '"Brand Infrastructure"', color: "text-primary" },
  { label: "codex.status", value: '"generating..."', color: "text-muted-foreground" },
];

const BrandCodexAnimation = ({ visible }: { visible: boolean }) => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= codeLines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(interval);
    }, 1800);
    return () => {};
  }, [visible]);

  return (
    <div
      className="hidden lg:block w-full max-w-[420px] rounded-lg border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        transitionDelay: "1.6s",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/30">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
          BRAND-CODEX.JSON
        </span>
      </div>

      {/* Code content */}
      <div className="p-4 font-mono text-xs leading-[1.8] overflow-hidden" style={{ minHeight: 280 }}>
        <span className="text-muted-foreground/40">{"{"}</span>
        {codeLines.map((line, i) => (
          <div
            key={i}
            className="pl-4"
            style={{
              opacity: i < visibleLines ? 1 : 0,
              transform: i < visibleLines ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.35s ease-out, transform 0.35s ease-out",
            }}
          >
            <span className="text-muted-foreground/60">{line.label}</span>
            <span className="text-muted-foreground/30">{": "}</span>
            <span className={line.color}>{line.value}</span>
            {i < codeLines.length - 1 && <span className="text-muted-foreground/30">,</span>}
          </div>
        ))}
        {visibleLines >= codeLines.length && (
          <span className="text-muted-foreground/40">{"}"}</span>
        )}
        {visibleLines < codeLines.length && (
          <div className="pl-4">
            <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandCodexAnimation;
