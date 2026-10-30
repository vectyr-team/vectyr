const modules = import.meta.glob<{ url: string }>("@/assets/logos/*.asset.json", {
  eager: true,
  import: "default",
});
const logos = Object.values(modules).map((m) => m.url);

const rows = [0, 1, 2].map((r) => logos.filter((_, i) => i % 3 === r));

const LogoMarquee = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-12 md:gap-20 opacity-10"
  >
    {rows.map((row, r) => (
      <div key={r} className="flex w-max overflow-visible">
        <div
          className="flex shrink-0 items-center gap-16 pr-16"
          style={{
            animation: `logo-marquee ${60 + r * 10}s linear infinite`,
            animationDirection: r % 2 ? "reverse" : "normal",
          }}
        >
          {[...row, ...row].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="eager"
              className="h-10 md:h-14 w-auto max-w-none brightness-0 invert"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default LogoMarquee;
